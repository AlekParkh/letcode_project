const BasePage = require("./base-page");

class CheapComputerPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this._addToCardBtn = page.locator('#add-to-cart-button-72');
    }
    async addToCard(){
        await this._addToCardBtn.click();
    }
}

module.exports = CheapComputerPage;
