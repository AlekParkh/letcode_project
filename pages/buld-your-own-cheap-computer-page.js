const BasePage = require("./base-page");

class CheapComputerPage extends BasePage {
    constructor(page) {
        super(page);
        this._addToCardBtn = page.locator('#add-to-cart-button-72');
        this._fillQty = page.locator('label:has-text("Qty:")');
        this._processorSlow = page.locator('#product_attribute_72_5_18_52');
        this._updateBtn = page.locator(`#add-to-cart-button-72`);
    }
    async addToCard(){
        await this._addToCardBtn.click();
    }

    async updateInfo () {
        await this._fillQty.fill('3');
        await this._processorSlow.click();
        await this._updateBtn.click();
    }
}

module.exports = CheapComputerPage;
