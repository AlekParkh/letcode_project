const BasePage = require('./base-page');
class RegisterPage extends BasePage {
    constructor(page) {
        super(page);
        this._inputFirstName = page.locator('#FirstName');
        this._inputLastName = page.locator('#LastName');
        this._inputEmail = page.locator('#Email');
        this._inputPassword = page.locator('#Password');
        this._inputConfirmPassword = page.locator('#ConfirmPassword');
        this._registerBtn = page.locator('#register-button');
    }

    async fillRegisterForm(gender, firstName, lastName, email, password) {
        if (gender === 'M') {
            await this.page.check('#gender-male');
        } else if (gender === 'F') {
            await this.page.check('#gender-female');
        }
        await this._inputFirstName.fill(firstName);
        await this._inputLastName.fill(lastName);
        await this._inputEmail.fill(email);
        await this._inputPassword.fill(password);
        await this._inputConfirmPassword.fill(password);
    };

    async clickRegisterBtn() {
        await this._registerBtn.click();
    }
}

module.exports = RegisterPage;

