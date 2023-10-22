const BasePage = require("./base-page");
const Header = require("./fragments/header");
const ShoppingCardPage = require("./shopping-card-page");
const ComputersPage = require("./computers-page");

class MainPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.header = new Header(page);
        this._computersLnk = page.locator('a[href="/computers"]').first();
        this._cartQty = page.locator('.cart-qty');
        this._wishlistQty = page.locator('.wishlist-qty');
        this._notSuccessLog = page.locator('.message-error .validation-summary-errors span');
        this._searchInput = page.locator('#small-searchterms');
        this._searchBtn = page.locator('.button-1.search-box-button');
        this._searchResults = page.locator('.search-results');
        this._logoutBtn = page.locator('.ico-logout');
        this._categories = {
            books: page.locator('.top-menu li:nth-child(1) > a[href="/books"]'),
            computers: page.locator('.top-menu li:nth-child(2) > a[href="/computers"]'),
            electronics: page.locator('.top-menu li:nth-child(3) > a[href="/electronics"]'),
            apparelAndShoes: page.locator('.top-menu li:nth-child(4) > a[href="/apparel-shoes"]'),
            digitalDownloads: page.locator('.top-menu li:nth-child(5) > a[href="/digital-downloads"]'),
            jewelry: page.locator('.top-menu li:nth-child(6) > a[href="/jewelry"]'),
            giftCards: page.locator('.top-menu li:nth-child(7) > a[href="/gift-cards"]')
        }
    }

    async clickComputers() {
        await this._computersLnk.click();
        return new ComputersPage(this.page);
    }

    async checkCartQty() {
        const cartQtyText = await this._cartQty.innerText();
        return cartQtyText.trim();
    }

    async checkWishlistQty() {
        const wishlistQtyText = await this._wishlistQty.innerText();
        return wishlistQtyText.trim();
    }

    async notSuccessLoginError() {
        const notSuccessLoginText = await this._notSuccessLog.innerText();
        return notSuccessLoginText.trim();
    }

    async fillSearchInput(value) {
        await this._searchInput.fill(value);
        await this._searchBtn.click();
        const resultItems = await this._searchResults.locator('.product-title').elementHandles();
        const actualResults = await Promise.all(resultItems.map(async (item) => {
            const text = await item.textContent();
            return text.trim();
        }));
        return actualResults;
    }

    async clickToCart () {
        await this._cartQty.click();
        return new ShoppingCardPage(this.page);
    }

    async clickLogout () {
        await this._logoutBtn.click();
    }

    async getMainCategoriesText () {
        const categories = Object.values(this._categories);
        const texts = await Promise.all(categories.map(async (category) => {
            return category.innerText();
        }));
        return texts;
    }
}

module.exports = MainPage;
