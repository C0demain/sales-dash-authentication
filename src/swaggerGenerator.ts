import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Sales Dash API',
        description: 'API utilizada no projeto Sales Dash'
    },
    host: 'localhost:8000',
    '@definitions': {
        id: {type: 'number', example: 1},
        userName: {type: 'string', example: 'John Doe'},
        email: {type: 'string', example: 'johndoe@gmail.com'},
        password: {type: 'string', example: '123'},
        cpf: {type: 'string', example: '000123456789'},
    },

    definitions:{
        AddSeller:{
            $ref: '#/definitions/userName',
        }
    },

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

const outputFile = './swagger.json';
const routes = ['./index.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);