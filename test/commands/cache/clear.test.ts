import { expect, test } from '@salesforce/command/lib/test';
import { ensureJsonMap, ensureString } from '@salesforce/ts-types';

// describe('cache:clear', () => {
//   test
//     .withOrg({ username: 'test@org.com' }, true)
//     .withConnectionRequest((request) => {
      
//     .stdout()
//     .command(['hello:org', '--targetusername', 'test@org.com'])
//     .it('runs hello:org --targetusername test@org.com', (ctx) => {
//       expect(true);
//       // expect(ctx.stdout).to.contain(
//       //   'Hello world! This is org: Super Awesome Org and I will be around until Tue Mar 20 2018!'
//       // );
//     });
// });
