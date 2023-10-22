const LoginPage = require("../login-page");
const RegisterPage = require("../register-page");
class Header {
    constructor(page) {
        this.page = page;
        this._login = page.locator('[class=ico-login]');
        this._register = page.locator('[class=ico-register]');
    }

    async clickLogin () {
        await this._login.click();
        return new LoginPage(this.page);
    }
    async clickRegister () {
        await this._register.click();
        return new RegisterPage(this.page);
    }
}

module.exports = Header;
