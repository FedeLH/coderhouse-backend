import { faker } from '@faker-js/faker';

const categories =  [
    "accesorios",
    "auriculares",
    "teclados",
    "placas de video",
    "monitores",
    "parlantes",
    "mouses",
    "microfonos",
    "notebooks",
    "motherboards",
    "gabinetes",
]

faker.locale='es'

export const generateProduct = () => {
    const category = categories[Math.floor(Math.random() * categories.length)]
    return {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.random.numeric(4),
        stock: faker.random.numeric(3),
        code: faker.random.alphaNumeric(16),
        category
    }
}

export const generateProducts = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        stock: faker.random.numeric(),
        code: faker.random.alphaNumeric(),
        category: faker.random.arrayElement(categories),
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