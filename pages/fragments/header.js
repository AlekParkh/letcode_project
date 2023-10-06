const LoginPage = require("../login-page");
class Header {
    constructor(page) {
        this.page = page;
        this._login = page.locator('[class=ico-login]');
    }

    async clickLogin () {
        await this._login.click();
        return new LoginPage(this.page);
    }
}

module.exports = Header;
