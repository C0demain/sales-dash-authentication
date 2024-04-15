# Como rodar o projeto base

1. `npm install` ou `yarn install` para instalar as dependencias. 
2. `npm run dev` ou `yarn run dev` para rodar o projeto.
3. Arquivo `.env.example` deve ser alterado de acordo com as variáveis de ambiente.
4. Baixar PostgreSQL e criar banco

### Requisições HTTP
#### /auth
```
GET /users -> retorna todas os usuários
GET /users/:id -> retorna usuario de acordo com id
POST /login -> recebe senha e email e retorna um token de autenticação
POST /register -> insere novo usuário
PUT /user/:id -> altera usuario de acordo com id
DELETE /user/:id -> retorna usuario de acordo com id
```

#### /products
```
GET /products/getAll -> retorna todos os produtos
GET /products/:productId -> retorna produto de acordo com id
POST /products/register -> insere novo produto
PUT /products/:productId -> atualiza produto de acordo com id
DELETE /products/:productId -> exclui produto de acordo com id
```

#### /commissions
```
GET /commissions/getAll -> retorna todas as comissões
GET /commissions/:commissionId -> retorna commissão de acordo com id
POST /commissions/register -> insere nova commissão
PUT /commissions/:commissionId -> atualiza commissão de acordo com id
DELETE /commissions/:commissionId -> exclui commissão de acordo com id
```

#### /clients
```
GET /client/getclients -> retorna todos os clientes
POST /products/register -> insere novo cliente
```

#### /sells
```
GET /sells/getall -> retorna todas as vendas
POST /sells/register -> insere nova venda
```
