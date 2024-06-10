import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Sales Dash API',
        description: 'API utilizada no projeto Sales Dash'
    },
    host: 'localhost:8000',
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    },
};

const outputFile = './swagger-output.json';
const routes = ['./index.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);