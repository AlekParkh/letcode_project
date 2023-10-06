const {test, expect} = require('@playwright/test');
const MainPage = require('../pages/main-page');
const ComputersPage = require('../pages/computers-page');

test('Success login to SW', async ({page}) => {
  await log ('Step 1. Login to SW with valid credentials.');
  const mainPage = new MainPage(page);
  await mainPage.open();
  const loginPage = await mainPage.header.clickLogin();
  await loginPage.fillLoginForm('alek.parkhomenko@gmail.com','Test!123');
  await loginPage.clickLoginBtn();

   // const emailLocator = page.locator('.account').first();
   // const expectedEmail = 'alek.parkhomenko@gmail.com';
   // const actualEmail = await emailLocator.innerText();
   // expect(actualEmail).toContain(expectedEmail);
  await expect(page.locator('.account').first()).toHaveText('alek.parkhomenko@gmail.com');
  await expect(page.locator('.ico-logout')).toBeVisible();
  await expect(await mainPage.checkCartQty()).toBe('(0)');
  await expect(await mainPage.checkWishlistQty()).toBe('(0)');
})

test('Login to SW with wrong credentials', async ({page}) => {
  await log ('Step 1. Login to SW with invalid credentials.');
  const mainPage = new MainPage(page);
  await mainPage.open();
  const loginPage = await mainPage.header.clickLogin();
  await loginPage.fillLoginForm('test@gmail.com','Test!123');
  await loginPage.clickLoginBtn();

  await expect(await mainPage.notSuccessLoginError()).toBe('Login was unsuccessful. Please correct the errors and try again.');
  await expect(page.locator('.ico-login')).toBeVisible();

})

test('Check that groups in "Computers" category are visible', async ({page}) => {
  await log ('Step 1. Login to SW -> click "Computers" and check that all groups are visible.');
  const mainPage = new MainPage(page);
  await mainPage.open();
  await mainPage.clickComputers();

  await expect(page.locator('img[alt="Picture for category Desktops"]')).toBeVisible();
  await expect(page.locator('img[alt="Picture for category Notebooks"]')).toBeVisible();
  await expect(page.locator('img[alt="Picture for category Accessories"]')).toBeVisible();
})

test('Сheck adding item to cart', async({page}) => {
  await log ('Step 1. Login to SW and select "Desktops" category.');
  const mainPage = new MainPage(page);
  await mainPage.open();
  await mainPage.clickComputers();
  const computersPage = new ComputersPage(page);
  const desktopsPage = await computersPage.openDesktops();

  await expect(page).toHaveURL(/desktops/)

  await log('Step 2. Select one position and add to card');
  const cheapComputerPage = await desktopsPage.addToCard();
  await cheapComputerPage.addToCard();

  await expect(page.locator('#bar-notification')).toBeVisible();
  await expect(await mainPage.checkCartQty()).toBe('(1)');
  await expect(await mainPage.checkWishlistQty()).toBe('(0)');
})

test('Check that "Search" returns correct data', async ({page}) => {
  await log ('Step 1. Login to SW and select "Desktops" category.');
  const mainPage = new MainPage(page);
  await mainPage.open();
  await mainPage.fillSearchInput('diamond');

   const expectedResults =
      ['Black & White Diamond Heart', 'Diamond Pave Earrings', 'Diamond Tennis Bracelet', 'Vintage Style Three Stone Diamond Engagement Ring'];
  await expect(await mainPage.fillSearchInput('diamond')).toEqual(expectedResults);

})










async function log(message) {
  console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}
