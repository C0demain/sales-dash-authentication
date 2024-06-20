import swaggerAutogen from 'swagger-autogen';
import { serve } from 'swagger-ui-express';

const frag = {
    id: {type: 'number', example: 1, readOnly: true},
    userName: {type: 'string', example: 'John Doe'},
    email: {type: 'string', example: 'johndoe@gmail.com'},
    password: {type: 'string', example: '12345', writeOnly: true},
    cpf: {type: 'string', example: '000123456789'}
}

const doc = {
    openapi: '3.0.0',
    info: {
        title: 'Sales Dash API',
        description: 'API utilizada no projeto Sales Dash'
    },
    servers: {
        url: process.env.API_BASE_URL || 'http://localhost:8000',
    },
    '@definitions': {
        AddSeller: {
            type: 'object',
            properties: {
                name: frag.userName,
                email: frag.email,
                cpf: frag.cpf,
                password: frag.password
            }
        },
        AddAdmin: {
            type: 'object',
            properties: {
                name: frag.userName,
                email: frag.email,
                cpf: frag.cpf,
            }
        },
        Login: {
            type: 'object',
            properties: {
                email: frag.email,
                password: frag.password,
            }
        },
        User: {
            type: 'object',
            properties:{
                id: frag.id,
                name: frag.userName,
                email: frag.email,
                cpf: frag.cpf,
                password: frag.password 
            }
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
const routes = ['./src/index.ts'];

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc);
