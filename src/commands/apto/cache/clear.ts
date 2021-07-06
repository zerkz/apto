import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError, Org, fs } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';


// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('apto', 'cache');

export default class Clear extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = [
    `$ sfdx cache:clear --targetusername myOrg@example.com 
    Default Partition:
  `,
    `$ sfdx hello:org --targetusername myOrg@example.com
This is org: MyOrg and I will be around until Tue Mar 20 2018!
  `,
  ];

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      char: 'n',
      description: messages.getMessage('nameFlagDescription'),
    })
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  private static CLEAR_CACHE_BTN_SELECTOR = 'input[value="Clear Cache"]';

  public async run(): Promise<AnyJson> {
    let name = (this.flags.name) as string;
    const partitionListURLPath = 'udd/PlatformCachePartition/listPlatformCachePartition.apexp';
    const frontDoorUrl = (await this.buildFrontdoorUrl()) + `&retURL=${partitionListURLPath}`;

    const browser = await puppeteer.launch({
      args: ['--disable-web-security', '--disable-features=IsolateOrigins', ' --disable-site-isolation-trials'],
    });
    const context = browser.defaultBrowserContext();
    await context.overridePermissions(frontDoorUrl, ['notifications']);
    const page = await browser.newPage();

    const headlessUserAgent = await page.evaluate(() => navigator.userAgent);
    const chromeUserAgent = headlessUserAgent.replace('HeadlessChrome', 'Chrome');
    await page.setUserAgent(chromeUserAgent);
    const pageResult = await page.goto(frontDoorUrl, { waitUntil: 'networkidle2' });
    
    const pageText = await pageResult.text();
    const $partitionList = cheerio.load(pageText);
    const $partitions = $partitionList('tr .dataRow');
    const partitions = [];
    $partitions.each((index, ele) => {
      const $partitionRow = $partitionList(ele);
      const $partitionLink = $partitionList(($partitionRow.children().get(3)));
      const $defaultCheckbox = $partitionRow.find('img.checkImg');
      const isDefault = $defaultCheckbox.attr('alt') == 'Checked' ? true : false;
      partitions.push({ name: $partitionLink.text(), href: $partitionLink.children('a').attr('href'), default : isDefault });
    });

    
    const partition = name ? partitions.find(x => x.name == name) : partitions.find(x => x.default);
    name = partition ? partition.name : name;
    if (partition) {
      const orgURL = new URL(frontDoorUrl);
      const orgHost = orgURL.host;
      
      const partitionDetailPageResult = await page.goto(`https://${orgHost + partition.href}`, { waitUntil: 'networkidle2' });
      page.on('dialog', async dialog => {
        await dialog.accept();
      });
      try {
        await partitionDetailPageResult.frame().click(Clear.CLEAR_CACHE_BTN_SELECTOR, {});
      } catch (e) {
        await browser.close();
        const cacheEmptyMessage = messages.getMessage('cacheEmpty', [name]);
        this.ux.warn(cacheEmptyMessage);
        return { success: true, partitionName: name};

      }

      await page.waitForNavigation();
    } else {
      await browser.close();
      throw new SfdxError(messages.getMessage('noPartitionFound', [name]));
    }

    await browser.close();
    this.ux.log(
      messages.getMessage('cacheClearSuccessful', [name])
    );
    // Return an object to be displayed with --json
    return { success : true, partitionName: name };
  }

  private async buildFrontdoorUrl(): Promise<string> {
    await this.org.refreshAuth(); // we need a live accessToken for the frontdoor url
    const conn = this.org.getConnection();
    const accessToken = conn.accessToken;
    const instanceUrl = this.org.getField(Org.Fields.INSTANCE_URL) as string;
    const instanceUrlClean = instanceUrl.replace(/\/$/, '');
    return `${instanceUrlClean}/secur/frontdoor.jsp?sid=${accessToken}`;
  }
}
