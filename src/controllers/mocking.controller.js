import { generateProducts, generateUser } from "../utils/faker.js";

class MockingController {
    getProducts = async (req, res) => {
        try {
            let products = []
            for (let i = 0; i < 100; i++) {
                products.push(generateProducts())
            }
            res.send(products)
        } catch (error) {
            req.logger.error(error)
        }
    }
    getUser = async (req, res) => {
        try {
            res.send(generateUser())
        } catch (error) {
            req.logger.error(error)
        }
    }
}

const mockingController = new MockingController();
export {mockingController, MockingController};