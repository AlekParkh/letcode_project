const BasePage = require("./base-page");
const CheapComputerPage = require('../pages/buld-your-own-cheap-computer-page');

class DesktopsPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this._addToCardBtn = page.locator('.button-2.product-box-add-to-cart-button').first();
    }
    async addToCard(){
        await this._addToCardBtn.click();
        return new CheapComputerPage(this.page);
    }
}

module.exports = DesktopsPage;
