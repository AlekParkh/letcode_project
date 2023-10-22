const {test, expect} = require('@playwright/test');
const BasePage = require('../../pages/base-page');
const MainPage = require("../../pages/main-page");
const logger = require("../utils/logger");
const {generateRandomLogIn} = require("../utils/randomDataGenerator");

test.beforeEach(async ({page}) => {
    const basePage = new BasePage(page);
    await basePage.open();
});
test.afterEach(async ({ page }) => {
    await page.close();
});

test('WEB-6: Login to SW with wrong credentials', async ({page}) => {
    await logStep('Step 1. Login to SW with invalid credentials.');
    const mainPage = new MainPage(page);
    const loginPage = await mainPage.header.clickLogin();
    const randomLogin = generateRandomLogIn();
    await loginPage.fillLoginForm(
        randomLogin.login,
        randomLogin.password
    );
    await loginPage.clickLoginBtn();

    await expect(await mainPage.notSuccessLoginError()).toBe('Login was unsuccessful. Please correct the errors and try again.');
    await expect(page.locator('.ico-login')).toBeVisible();

})

test('WEB-7: Check that groups in "Computers" category are visible', async ({page}) => {
    await logStep('Step 1. Login to SW -> click "Computers" and check that all groups are visible.');
    const mainPage = new MainPage(page);
    await mainPage.clickComputers();

    await expect(page.locator('img[alt="Picture for category Desktops"]')).toBeVisible();
    await expect(page.locator('img[alt="Picture for category Notebooks"]')).toBeVisible();
    await expect(page.locator('img[alt="Picture for category Accessories"]')).toBeVisible();
})

async function logStep(message) {
    logger.step(message);
}
