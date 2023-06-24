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
    return {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        gender: faker.name.sex(),
        password: faker.datatype.string(8)
    }
}