const BasePage = require('./base-page');
class LoginPage extends BasePage {
    constructor(page) {
        super(page);
        this._inputEmail = page.locator('#Email');
        this._inputPassword = page.locator('[type=Password]');
        this._loginBtn = page.locator('[class*=login-button]');
    }

async fillLoginForm(login, password) {
    await this._inputEmail.fill(login);
    await this._inputPassword.fill(password);
};
async clickLoginBtn() {
    await this._loginBtn.click();
}
}

module.exports = LoginPage;
