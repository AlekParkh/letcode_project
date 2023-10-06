const BasePage = require("./base-page");
const Header = require("./fragments/header");

class MainPage extends BasePage{
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
    }

    async open() {
        await this.page.goto('/');
    }

    async clickComputers() {
        await this._computersLnk.click();
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

}

module.exports = MainPage;
