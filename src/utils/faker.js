import { faker } from '@faker-js/faker';

faker.locale='es'

export const generateProducts = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.random.numeric(),
        code: faker.random.alphaNumeric(),
        category: faker.commerce.department(),
        status: faker.datatype.boolean(),
        thumbnails: [faker.image.food()]
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