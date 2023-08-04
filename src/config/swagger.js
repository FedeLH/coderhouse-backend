import swaggerJSDoc from 'swagger-jsdoc';
import path from "path"
import __dirname from '../utils/utils.js';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Ecommerce documentation',
            version: '1.0.0',
            description: 'Ecommerce is an app developed in a didactic way for the Coderhouse-Backend course',
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
};

const swaggerSpecs = swaggerJSDoc(swaggerOptions);

export default swaggerSpecs;
