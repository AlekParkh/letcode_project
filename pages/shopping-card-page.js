const BasePage = require('./base-page');
const logger = require("../tests/utils/logger");

class ShoppingCardPage extends BasePage {
    constructor(page) {
        super(page);
        this._EditBtn = page.locator('a[href*="updatecartitemid"]');
        //this._inputQty = page.locator('input[name*="itemquantity"]');
        this._inputQty = page.locator('.qty.nobr .qty-input');
        this._updateCartBtn = page.locator('input[type="submit"][name="updatecart"]');
        this._orderSummary = page.locator('.order-summary-content');
    }

        async clickEditBtn() {
            await this._EditBtn.click();
        }

        async checkInputQty() {
            await this.page.waitForLoadState('load');
            const maxAttempts = 3;
            for (let attempt = 1; attempt <= maxAttempts; attempt++) {
                try {
                    await this.page.waitForSelector('.qty.nobr .qty-input', { state: 'visible', timeout: 5000 });
                    const cartQtyValue = await this._inputQty.inputValue();
                    if (cartQtyValue.trim() !== '') {
                        return cartQtyValue.trim();
                    }
                } catch (error) {
                    await logError(`Attempt ${attempt}: Unable to fetch quantity. Retrying...`);
                }
                // Ждать небольшой промежуток времени перед следующей попыткой.
                if (attempt < maxAttempts) {
                    await this.page.waitForTimeout(1000);
                }
            }
            throw new Error('Input quantity did not update after several attempts');
        }

    async updateCardQtyToZero() {
            await this._inputQty.fill('0');
        }

        async clickUpdateCartBtn() {
            await this._updateCartBtn.click();
        }

        async getOrderSummary () {
            const orderText = await this._orderSummary.innerText();
            return orderText.trim();
        }
}

async function logError(message) {
    logger.error(message);
}

module.exports = ShoppingCardPage;
