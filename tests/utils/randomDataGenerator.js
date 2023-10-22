const { faker } = require('@faker-js/faker');

function generateRandomUserData() {
    const gender = faker.helpers.arrayElement(['M', 'F']);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email();
    const password = faker.internet.password();

    return {
        gender,
        firstName,
        lastName,
        email,
        password
    };
}

function generateRandomLogIn() {
    const login = faker.internet.email();
    const password = faker.internet.password();

    return {
        login,
        password
    };

}

function generateRandomBillingAddress() {
    const city = faker.location.city();
    const streetAddress = faker.location.streetAddress();
    const zipCode = faker.location.zipCode();
    const number = faker.phone.number();

    return {
        city,
        streetAddress,
        zipCode,
        number,
    };
}

module.exports = {
    generateRandomUserData,
    generateRandomBillingAddress,
    generateRandomLogIn
}
