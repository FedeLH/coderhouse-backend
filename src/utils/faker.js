import { faker } from '@faker-js/faker';

faker.locale='es'

const generateProducts = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        departament: faker.commerce.department(),
        stock: faker.random.numeric(),
        id: faker.database.mongodbObjectId(),
        image: faker.image.image()
    }
}

export const generateUser = () => {
    let numOfProducts = parseInt(faker.random.numeric(1, {bannedDigits: ['0']}))
    let products = []
    for (let i = 0; i < numOfProducts; i++) {
        products.push(generateProducts())
    }
    return {
        name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        sex: faker.name.sex(),
        birthdate: faker.date.birthdate(),
        phone: faker.phone.number(),
        products,
        image: faker.internet.avatar(),
        id: faker.database.mongodbObjectId(),
        email: faker.internet.email()
    }
}