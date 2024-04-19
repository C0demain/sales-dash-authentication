# Como rodar o projeto com banco de dados no docker

1. `npm install` para instalar as dependencias. 
2. Arquivo `.env.example` deve ser alterado para `.env` e de acordo com as variáveis de ambiente.
3. Baixar docker: https://docs.docker.com/get-docker/
4. `docker compose up -d` para inicializar os containers
5. `npm run dev` para rodar o projeto.
6. `http://localhost:5050` - abrir pgadmin e logar com as credencias default do .env

obs: desinstalar o postgre local para não dar conflito de porta

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
