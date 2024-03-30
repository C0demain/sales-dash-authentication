# Como rodar o projeto base

1. `npm install` ou `yarn install` para instalar as dependencias. 
2. `npm run dev` ou `yarn run dev` para rodar o projeto.
3. Arquivo `.env.example` deve ser alterado de acordo com as variáveis de ambiente.
4. Baixar PostgreSQL e criar banco

### Requisições HTTP
- POST -> http://localhost:8000/api/v1/auth/register - Cadastro
- POST -> http://localhost:8000/api/v1/auth/login - Login 
- GET -> http://localhost:8000/api/v1/auth/users - Registro cadastros