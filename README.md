# TicketPlace Backend

Prtojeto de _BACKEND_ para o sistema de compra de ingressos para eventos, `TicketPlace` da disciplina `PROJETO INTEGRADO: DESENVOLVIMENTO DE SISTEMAS ORIENTADO A DISPOSITIVOS MÓVEIS E BASEADOS NA WEB` do SENAC.

## Integrantes do grupo

ANDRESSA DOS SANTOS JUCOSKI  
BRUNO NATALI  
ISMAEL M. VASCONCELOS JUNIOR  
LUIZ FERNANDO VIDAL  
MATEUS VIEIRA DA SILVA  

## Table of Contents

- [Execução](#execução)
  - [Apenas a aplicação](#apenas-a-aplicação)
  - [Utilizando Docker](#utilizando-docker)
- [Desenvolvimento](#desenvolvimento)
- [Usando a API](#usando-a-api)
  - [v1/newUser](#v1newuser)
  - [v1/login](#v1login)
  - [Exemplos e casos de uso](#exemplos-e-casos-de-uso)
    - [Recuperando todos os registros de uma tabela](#recuperando-todos-os-registros-de-uma-tabela)
    - [Recuperando um registro específico](#recuperando-um-registro-específico)
    - [Recuperando registros que contenham uma palavra ou frase](#recuperando-registros-que-contenham-uma-palavra-ou-frase)
    - [Pesuisando por um valor específica ou dentro de um intervalo](#pesuisando-por-um-valor-específica-ou-dentro-de-um-intervalo)
    - [Inserindo e Atualizando as informações de um registro](#inserindo-e-atualizando-as-informações-de-um-registro)
  
## Execução

### Apenas a aplicação

Nesse exemplo é preciso ter o `node` e `npm` instalados na máquina.

```bash
npm run build
npm start
```

### Utilizando Docker

Nesse exemplo é preciso ter o `docker` e `docker-compose` instalados na máquina.

```bash
docker build . -t ticketplace-backend
docker compose up
```

## Desenvolvimento

Para desenvolver é necessário ter o `node` e `npm` instalados na máquina.

```bash
# Sempre execute esses comandos antes de começar a desenvolver
git checkout dev
git fetch
npm install
```

## Usando a API

A utilização da api consiste no interação com endpoints.  
Todos os endpoints precisam ser chamados utilizando o seguinte padrão:  

`[METHOD] http://127.0.0.1:8080/v1/{{endpoint}}/{{:id}}/?{{query}}-{{operador}}={{valor}}`  

Onde:

- `endpoint` Indica a função ou tabela a ser acessada
- `id` Quando fornecido indica um ID para qual aquela ação deverá ser tomada
- `query` Indica um filtro para a busca
- `operador` Indica o operador a ser utilizado na busca
  - `like` Indica que a busca será por parte do campo
  - `gt` Indica que a busca será por valores maiores que o informado
  - `lt` Indica que a busca será por valores menores que o informado
  - `eq` Indica que a busca será por valores iguais ao informado  
  **NOTA**. O operador `eq` é o padrão, ou seja, caso não seja informado será utilizado esse operador
- `valor` Indica o valor a ser buscado

**NOTA**. Os campos `id` e `query` são opcionais, ou seja, não é necessário informar um `id` ou `query` para que a requisição seja feita.

**NOTA**. As queries podem se repetir, ou seja, é possível informar a mesma query mais de uma vez, por exemplo `?query=valor1&query=valor2`. Nesse caso a busca será feita por todos os valores informados somente para uma coluna do tipo `ARRAY`, caso contrário será considerado apenas o primeiro valor informado.

**NOTA**. O conteúdo esperado de um requisição (`input`/`output`) de cada enpoint pode variar, conforme a implementação do banco de dados, dessa forma seguir [documentação dele](https://github.com/ndressaa/ticketplace-database/blob/main/schema.dbml) para maiores detalhes.

A seguir são listados os endpoints possíveis.

- [`newUser`](#v1newuser)
- [`login`](#v1login)
- `usuarios`
- `eventos`
- `empresas`
- `carrinho`
- `cartoes`
- `ingressos`

**NOTA**. Com exceção dos endpoints `newUser` e `login`, é necessário o envio do token recebido no processo de `login` ou `criação de usuário` pelo header `Authorization` to tipo `Bearer` conforme exemplos a seguir.

```bash
# Retorna todos os usuários
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/usuarios
```

### v1/newUser

Cria um novo usuário no sistema.  
Nota. Como essa API é uma demonstração e a fim de possibilitar a utilização de uma maneira mais prática, não foi exigido o `login` ao contatar esse endpoint.  

**Métodos aceitos**: `POST`  

*Exemplo*:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '[{"name":"João da Silva", "cpf": 123, "email":"joao@gmail.com", "password":"Joao@10"}]' \
  http://localhost:8080/v1/newUser
```

**Resposta esperada**:  

`HTTP 201`

```json
{ 
  "token": "askdbnkasbcn232bdls==...",
  "user": {
    "id": 1234,
    "name": "João da Silva",
    "email":"joao@gmail.com",
  }
}
```

### v1/login

Faz o login de um usuário usando o método `Basic`.  
Nota. Esse endpoint precisa ser chamado ao menos uma vez duarante a sessão (TTL de 24 horas) para receber o token a ser passados nas outras requisições.  

**Métodos aceitos**: `GET`  

*Exemplo*:

```bash
curl -X GET \
  -u "joao@gmail.com:Joao@10" \
  http://localhost:8080/v1/login
```

**Resposta esperada**:  

`HTTP 200`

```json
{ 
  "token": "askdbnkasbcn232bdls==...",
  "user": {
    "id": 1234,
    "name": "João da Silva",
    "email":"joao@gmail.com",
  }
}
```

### Exemplos e casos de uso

#### Recuperando todos os registros de uma tabela

Para recuperar todos os registros de uma tabela basta fazer uma requisição `GET` para o endpoint desejado sem informar um `id` ou `query`, conforme exemplo:

```bash
# Retorna todos os usuários
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/usuarios
```

#### Recuperando um registro específico

Para recuperar um registro específico de uma tabela basta fazer uma requisição `GET` para o endpoint desejado informando o `id` do registro desejado, conforme exemplo:

```bash
# Retorna o usuário com ID 1234
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/usuarios/1234
```

Ainda é possível realizar a pesquisa informando um valor desejado para a coluna, conforme exemplo:

```bash
# Retorna todos os itens do carrinho para um usuário com ID 1234
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/carrinho/?id_usuario=1234
```

#### Recuperando registros que contenham uma palavra ou frase

É possível realizar a pesquisa por parte do campo utilizando a query com o operador `like`, conforme exemplo:

```bash
# Retorna os eventos com título que contenha "rock"
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/usuarios/?titulo-like=rock
```

#### Pesuisando por um valor específica ou dentro de um intervalo

É possível pesquisar por datas, e valores numéricos específicos ou dentro de um intervalo utilizando os operadores `eq`, `gt` e `lt`, conforme exemplo:

```bash
# Retorna os eventos que ocorrerão na data 2030-12-25
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \ 
  http://localhost:8080/v1/eventos/?data-eq=2030-12-25

  
# Retorna os eventos que ocorrerão entre as datas 2030-12-25 e 2030-12-31
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \ 
  http://localhost:8080/v1/eventos/?data-gt=2030-12-25&data-lt=2030-12-31

# Retorna os ingressos com valor igual a 150.00
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \ 
  http://localhost:8080/v1/eventos/?valor-eq=150.00

# Retorna os ingressos com valor menor que 150.00
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/eventos/?valor-lt=150.00
```

#### Inserindo e Atualizando as informações de um registro

Para inserir ou atualizar as informações de um registro basta fazer uma requisição `POST` para o endpoint desejado informando o `id` do registro desejado ou a query da coluna que deseja atualizar, conforme exemplo:

**IMPORTANTE**. Para utilizar o método `POST` é necessário *SEMPRE* passar todos os itens como um `array`, mesmo que seja apenas um item.

```bash
# Atualiza o valor do evento com ID 1234
curl -X POST \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  -H "Content-Type: application/json" \
  -d '[{"value": 150.00}]' \
  http://localhost:8080/v1/eventos/1234

# Insere um par de ingressos no carrinho do usuário com ID 1234
curl -X POST
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  -H "Content-Type: application/json" \
  -d '[{"id_usuario": 1234, "id_ingresso": 5678}, {"id_usuario": 1234, "id_ingresso": 5678}]' \
  http://localhost:8080/v1/carrinho


# Atualiza o nome de um cartão com numero 1234567890
curl -X POST
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  -H "Content-Type: application/json" \
  -d '[{"nome_cartao": "Cartão do João"}]' \
  http://localhost:8080/v1/cartoes/?numero_cartao-eq=1234567890
```

Nesse exemplo o valor do show foi atualizado.

#### Deletando um registro

Esse método ainda está em desenvolvimento e não está disponível para uso.
