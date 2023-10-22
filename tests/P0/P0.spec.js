const {test, expect} = require('@playwright/test');
const BasePage = require('../../pages/base-page');
const MainPage = require("../../pages/main-page");
const {generateRandomUserData, generateRandomBillingAddress} = require('../utils/randomDataGenerator');
const ProductsPage = require("../../pages/products-page");


test.describe('Checks w/o login', () => {
    test.beforeEach(async ({page}) => {
        const basePage = new BasePage(page);
        await basePage.open();
    });

    test.afterEach(async ({ page }) => {
        await page.close();
    });

    test('WEB-1: Success registration to SW', async ({page}) => {
        await log('Step 1. Register to SW with valid credentials.');
        const randomUserData = generateRandomUserData();
        const mainPage = new MainPage(page);
        const registerPage = await mainPage.header.clickRegister();
        await registerPage.fillRegisterForm(
            randomUserData.gender,
            randomUserData.firstName,
            randomUserData.lastName,
            randomUserData.email,
            randomUserData.password
        );
        await registerPage.clickRegisterBtn();

        const resultText = await page.locator('.page.registration-result-page .result').innerText();
        await expect(resultText).toContain('Your registration completed');
        await expect(page.locator('.page.registration-result-page .register-continue-button')).toBeEnabled();
        await expect(page.locator('.account').first()).toHaveText(randomUserData.email);
        await expect(page.locator('.ico-logout')).toBeVisible();
        await expect(await mainPage.checkCartQty()).toBe('(0)');
        await expect(await mainPage.checkWishlistQty()).toBe('(0)');
    })

    test('WEB-2: Success login to SW', async ({page}) => {
        await log('Step 1. Login to SW with valid credentials.');
        const mainPage = new MainPage(page);
        const loginPage = await mainPage.header.clickLogin();
        await loginPage.fillLoginForm('alek.parkhomenko@gmail.com', 'Test!123');
        await loginPage.clickLoginBtn();

        await expect(page.locator('.account').first()).toHaveText('alek.parkhomenko@gmail.com');
        await expect(page.locator('.ico-logout')).toBeVisible();
        await expect(await mainPage.checkCartQty()).toBe('(0)');
        await expect(await mainPage.checkWishlistQty()).toBe('(0)');
    })

    test('WEB-3: Сheck adding item to cart', async({page}) => {
        await log ('Step 1. Login to SW and select "Desktops" category.');
        const mainPage = new MainPage(page);
        const computersPage = await mainPage.clickComputers();
        const desktopsPage = await computersPage.openDesktops();

        await expect(page).toHaveURL(/desktops/)

        await log('Step 2. Select one position and add to card');
        const cheapComputerPage = await desktopsPage.addToCard();
        await cheapComputerPage.addToCard();

        await expect(page.locator('#bar-notification')).toBeVisible();
        await expect(await mainPage.checkCartQty()).toBe('(1)');
        await expect(await mainPage.checkWishlistQty()).toBe('(0)');

        // remove item from card
        const shoppingCardPage = await mainPage.clickToCart();
        await shoppingCardPage.updateCardQtyToZero();
        await shoppingCardPage.clickUpdateCartBtn();

    })
})

test.describe('Checks with login', () => {
    test.beforeEach(async ({page}) => {
        const basePage = new BasePage(page);
        await basePage.open();
        const mainPage = new MainPage(page);
        const loginPage = await mainPage.header.clickLogin();
        await loginPage.fillLoginForm('alek.parkhomenko@gmail.com', 'Test!123');
        await loginPage.clickLoginBtn();
    });

    test.afterEach(async ({page}) => {
        const mainPage = new MainPage(page);
        await mainPage.clickLogout();
    });

    test('WEB-4: Placement and confirmation of order', async ({page}) => {
        await log('Step 1. Login to SW and add item to cart.');
        const mainPage = new MainPage(page);
        const computersPage = await mainPage.clickComputers();
        const desktopsPage = await computersPage.openDesktops();
        const cheapComputerPage = await desktopsPage.addToCard();
        await cheapComputerPage.addToCard();
        await mainPage.clickToCart();

        await page.waitForLoadState('domcontentloaded');
        await expect(page).toHaveURL(/cart/);
        await expect(page.locator('a.product-name:has-text("Build your own cheap computer")')).toBeVisible();
        await expect(page.locator('.cart-item-row')).toBeVisible();

        await log('Step 2. Mark "I agree..." and click "Checkout".');
        const productsPage = new ProductsPage(page);
        await productsPage.goToCheckout();

        await expect(page).toHaveURL(/onepagecheckout/);
        await expect(page.locator('.checkout-page')).toBeVisible();

        await log('Step 3. For input "Billing Address" select option "New Address" -> fill out and click "Continue".');
        const randomData = generateRandomBillingAddress();
        await productsPage.fillBillingAddress(
            '80',
            randomData.city,
            randomData.streetAddress,
            randomData.zipCode,
            randomData.number,
        );

        await expect(page.locator('#checkout-step-shipping')).toBeVisible();
        await expect(page.locator('#shipping-address-select')).toBeEnabled();

        await log('Step 4. Proceed the flow till the end.');
        await productsPage.fillCheckoutForm();

        await expect(page.locator('.page-title h1')).toHaveText('Thank you');
        await expect(page.locator('.order-completed .title strong'))
            .toHaveText('Your order has been successfully processed!');
        await expect(page.locator('.order-completed-continue-button')).not.toBeNull();
        const orderNumber = await page.textContent('.order-completed .details li:first-child');
        const orderNumberText = orderNumber.match(/Order number: (\d+)/)[1];
        await expect(parseInt(orderNumberText)).not.toBeNaN();
        const orderDetailsLink = await page.getAttribute('.order-completed .details li:last-child a', 'href');
        await expect(orderDetailsLink).toMatch(/\/orderdetails\/\d+/);
    })

    test('WEB-9: Check product information', async ({page}) => {
        const mainPage = new MainPage(page);
        const computersPage = await mainPage.clickComputers();
        const desktopsPage = await computersPage.openDesktops();
        await desktopsPage.addToCard();

        await expect(page.locator('#main-product-img-72')).toBeVisible();
        await expect(page.locator('.free-shipping')).toBeVisible();
        await expect(page.locator('.attributes')).toBeVisible();
        await expect(page.locator('.option-list')).toBeTruthy();
        const expectedLabels = ['Processor', 'RAM', 'HDD', 'Software'];
        for (const label of expectedLabels) {
            const labelLocator = page.locator(`.text-prompt:has-text('${label}')`);
            await expect(labelLocator).toBeVisible();
        }
        await expect(page.locator('.product-price')).toBeVisible();
        await expect(page.locator('label:has-text("Qty:")')).toBeEditable();
        await expect(page.locator('#add-to-cart-button-72')).toBeEnabled();
        await expect(page.locator('.button-2.email-a-friend-button')).toBeEnabled();
        await expect(page.locator('.button-2.add-to-compare-list-button')).toBeEnabled();
    })
})

async function log(message) {
    console.log(`[${new Date().toLocaleTimeString()}] ${message}`);
}
