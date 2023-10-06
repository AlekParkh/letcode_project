const BasePage = require("./base-page");
const DesktopsPage = require('../pages/desktops-page');

class ComputersPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this._desktopsGroup = page.locator('img[alt="Picture for category Desktops"]');
    }

    async openDesktops() {
        await this._desktopsGroup.click();
        return new DesktopsPage(this.page);
    }
}

module.exports = ComputersPage;
