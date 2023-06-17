import { generateProducts } from "../utils/faker.js";

class MockingController {
    getProducts = async (req, res) => {
        try {
            let products = []
            for (let i = 0; i < 100; i++) {
                products.push(generateProducts())
            }
            res.send(products)
        } catch (error) {
            console.log(error)
        }
    }
}

const mockingController = new MockingController();
export {mockingController, MockingController};