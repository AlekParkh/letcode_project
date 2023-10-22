const BasePage = require('./base-page');
class ProductsPage extends BasePage {
    constructor(page) {
        super(page);
        this._markAgreements = page.locator('#termsofservice');
        this._clickCheckoutBtn = page.locator('#checkout');
        this._selectNewAddress = page.locator('#billing-address-select');
        this._selectCountry = page.locator('#BillingNewAddress_CountryId');
        this._inputCity = page.locator('#BillingNewAddress_City');
        this._inputAddress = page.locator('#BillingNewAddress_Address1');
        this._inputZip = page.locator('#BillingNewAddress_ZipPostalCode');
        this._inputPhoneNumber = page.locator('#BillingNewAddress_PhoneNumber');
        this._clickContinueBilBtn = page.locator('[onclick="Billing.save()"]');
        this._clickContinueShipBtn = page.locator('[onclick="Shipping.save()"]');
        this._clickContinueShipMethodBtn = page.locator('[onclick="ShippingMethod.save()"]');
        this._clickContinuePayMethodBth = page.locator('[onclick="PaymentMethod.save()"]');
        this._clickContinuePayInfoBth = page.locator('[onclick="PaymentInfo.save()"]');
        this._clickConfirmOrderBth = page.locator('[onclick="ConfirmOrder.save()"]');
    }
    async goToCheckout() {
        await this._markAgreements.click();
        await this._clickCheckoutBtn.click();
    }

    async fillBillingAddress(countryId, city, streetAddress, zipCode, number){
        await this._selectNewAddress.selectOption('');
        await this._selectCountry.selectOption({ value: countryId });
        await this._inputCity.fill(city);
        await this._inputAddress.fill(streetAddress);
        await this._inputZip.fill(zipCode);
        await this._inputPhoneNumber.fill(number);
        await this._clickContinueBilBtn.click();
    }

    async fillCheckoutForm () {
        await this._clickContinueShipBtn.click();
        await this._clickContinueShipMethodBtn.click();
        await this._clickContinuePayMethodBth.click();
        await this._clickContinuePayInfoBth.click();
        await this._clickConfirmOrderBth.click();
    }
}

module.exports = ProductsPage;
