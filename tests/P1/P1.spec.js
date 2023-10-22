const {test, expect} = require('@playwright/test');
const MainPage = require("../../pages/main-page");
const BasePage = require("../../pages/base-page");
const logger = require("../utils/logger");

test.beforeEach(async ({page}) => {
    const basePage = new BasePage(page);
    await basePage.open();
});
test.afterEach(async ({ page }) => {
    await page.close();
});

test('WEB-5: Check that "Search" returns correct data', async ({page}) => {
    await logStep('Step 1. Login to SW and select "Desktops" category.');
    const mainPage = new MainPage(page);
    await mainPage.fillSearchInput('diamond');

    const expectedResults =
        ['Black & White Diamond Heart', 'Diamond Pave Earrings', 'Diamond Tennis Bracelet', 'Vintage Style Three Stone Diamond Engagement Ring'];
    const searchResults = await mainPage.fillSearchInput('diamond');
    await expect(searchResults).toEqual(expectedResults);
})

test('WEB-8: Check all available product categories', async ({page}) => {
    await logStep('Step 1. Login to SW and check all categories.');
    const mainPage = new MainPage(page);
    const expectedCategories =
        ['BOOKS', 'COMPUTERS', 'ELECTRONICS', 'APPAREL & SHOES', 'DIGITAL DOWNLOADS', 'JEWELRY', 'GIFT CARDS'];
    await expect(await mainPage.getMainCategoriesText()).toEqual(expectedCategories);
})

test('WEB-10: Check updating product information', async ({page}) => {
    await logStep('Step 1. Login to SW -> add product to card');
    const mainPage = new MainPage(page);
    const computersPage = await mainPage.clickComputers();
    const desktopsPage = await computersPage.openDesktops();
    const cheapComputerPage = await desktopsPage.addToCard();
    await cheapComputerPage.addToCard();
    const shoppingCardPage = await mainPage.clickToCart();

    await expect(await shoppingCardPage.checkInputQty()).toBe('1');

    await logStep('Step 2. Click "Edit" -> update "Qty" and "Processor" -> check shopping cart');
    await shoppingCardPage.clickEditBtn();
    await cheapComputerPage.updateInfo();
    await mainPage.clickToCart();

    await expect(await shoppingCardPage.checkInputQty()).toBe('3');
    const processorText = await page.locator('.attributes').first().innerText();
    const isProcessorSlowVisible = processorText.includes('Processor: Slow');
    await expect(isProcessorSlowVisible).toBeTruthy();

    await logStep('Step 3. Input "0" to Qty -> click "update shopping card" -> check card info');
    await shoppingCardPage.updateCardQtyToZero();
    await shoppingCardPage.clickUpdateCartBtn();

    await expect(await shoppingCardPage.getOrderSummary()).toEqual('Your Shopping Cart is empty!');
    await expect(page.locator('input[name*="itemquantity"]')).toBeHidden();
})

async function logStep(message) {
    logger.step(message);
}
