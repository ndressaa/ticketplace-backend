# TicketPlace Backend

**Table of Contents**:

- [Execução](#execução)
  - [Apenas a aplicação](#apenas-a-aplicação)
  - [Utilizando Docker](#utilizando-docker)
    - [Usando o Docker compose](#usando-o-docker-compose)
    - [Usando o Dockerfile (não recomendado)](#usando-o-dockerfile-não-recomendado)
- [Desenvolvimento](#desenvolvimento)
- [Usando a API](#usando-a-api)
  - [v1/newUser](#v1newuser)
  - [v1/login](#v1login)
  - [v1/usuarios/:id](#v1usuariosid)
    - [Recuperando usuários](#recuperando-usuários)
    - [Atualizando os dados de um usuário](#atualizando-os-dados-de-um-usuário)
  - [v1/eventos/:id](#v1eventosid)
    - [Recuperando eventos](#recuperando-eventos)
      - [Pesquisa por parte do campo](#pesquisa-por-parte-do-campo)
      - [Pesuisando por uma data específica ou dentro de um intervalo](#pesuisando-por-uma-data-específica-ou-dentro-de-um-intervalo)
    - [Atualizando os dados de um show](#atualizando-os-dados-de-um-show)

## Execução

### Apenas a aplicação

Nesse exemplo é preciso ter o `node` e `npm` instalados na máquina.

```bash
npm run build
npm start
```

### Utilizando Docker

Nesse exemplo é preciso ter o `docker` e `docker-compose` instalados na máquina.

#### Usando o Docker compose

```bash
docker compose up
```

#### Usando o Dockerfile (não recomendado)

```bash
docker build -t ticketplace-backend .
docker run -p 8080:8080 ticketplace-backend
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

`[METHOD] http://127.0.0.1:8080/v1/{{path}}/{{:id}}/`  

Onde:

- `path` Indica basicamente a função ou método a ser executado
- `id` Quando fornecido indica um ID para qual aquela ação deverá ser tomada

**NOTA**. O conteúdo esperado de um requisição (`input`/`output`) de cada enpoint pode variar, conforme a implementação do banco de dados, dessa forma seguir documentação dele para maiores detalhes.

A seguir são listados os endpoints possíveis.

### v1/newUser

Cria um novo usuário no sistema.  
Nota. Como essa API é uma demonstração e a fim de possibilitar a utilização de uma maneira mais prática, não foi exigido o `login` ao contatar esse endpoint.  

**Métodos aceitos**: `POST`  

*Exemplo*:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"João da Silva", "email":"joao@gmail.com", "password":"Joao@10"}' \
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

### v1/usuarios/:id

Esse endpoint manipula os dados dos usuários.  

**Métodos aceitos**: `GET`, `POST`  

**NOTA**. Para esse endpoint é necessário o envio do token recebido em um dos processos anteriores pelo header `Authorization` to tipo `Bearer` conforme exemplos a seguir.

#### Recuperando usuários

```bash
# Retorna todos os usuários
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/usuarios
```

**Resposta esperada**:  

`HTTP 200`

```json
[
  { 
    "id": 1234,
    "name": "João da Silva",
    "email":"joao@gmail.com",
    "createdAt": "DATA DE CRIAÇÃO",
    "updatedAt": "DATA DE ATUALIZAÇÃO",
  },
  ...
]
```

Para retornar um usuário específico, basta informar o ID no endpoint ou utilizar as queries conforme exemplos:

```bash
# Retorna o usuário com ID 1234
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/usuarios/1234
```

```bash
# Retorna o usuário com email informado
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/usuarios/?email=joao@gmail.com
```

**NOTA**. Para essa requisição de busca apenas 1 item será retoranado no array caso o usuário seja encontrado.

#### Atualizando os dados de um usuário

```bash
# Atualiza o nome do usuário com ID 1234
curl -X POST \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  -H "Content-Type: application/json" \
  -d '{"name":"João da Silva Melo"}' \
  http://localhost:8080/v1/usuarios/1234
```

Nesse exemplo o nome do usuário teve o sobrenome atualizado.

**Resposta esperada**:  

`HTTP 200`

```json
{ "status": "OK" }
```

### v1/eventos/:id

*Métodos aceitos*: `GET`, `POST`  

**NOTA**. Para esse endpoint é necessário o envio do token recebido em um dos processos anteriores pelo header `Authorization` to tipo `Bearer` conforme exemplos a seguir.

#### Recuperando eventos

```bash
# Retorna todos os eventos
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/eventos
```

**Resposta esperada**:

`HTTP 200`

```json
[
  { 
    "id": 1234,
    "title": "Orquesta Sinfônica de São Paulo",
    "description": "Orquestra sinfônica de São Paulo",
    "value": 100.00,
  },
  ...
]
```

Para retornar um show específico, basta informar o ID no endpoint ou utilizar as queries conforme exemplos:

```bash
# Retorna o show com ID 1234
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/eventos/1234
```

```bash
# Retorna o show com título informado
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \ 
  http://localhost:8080/v1/eventos/?title=Orquesta%20Sinf%C3%B4nica%20de%20S%C3%A3o%20Paulo
```

**NOTA**. Para essa requisição de busca apenas 1 item será retoranado no array caso o show seja encontrado.

##### Pesquisa por parte do campo

Nesse endpoint ainda é possível realizar a pesquisa por parte do descrição ou título utilizando a query `description-like` ou `title-like`, conforme exemplo:

```bash
# Retorna os eventos com descrição que contenha "Orquestra"
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  http://localhost:8080/v1/eventos/?description-like=Orquestra
```

##### Pesuisando por uma data específica ou dentro de um intervalo

É possível pesquisar por eventos que ocorreram em uma data específica ou dentro de um intervalo de datas utilizando as queries `date` ou `date-gt` e `date-lt`, conforme exemplo:

```bash
# Retorna os eventos que ocorrerão na data 2030-12-25
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \ 
  http://localhost:8080/v1/eventos/?date=2030-12-25

  
# Retorna os eventos que ocorrerão entre as datas 2030-12-25 e 2030-12-31
curl -X GET \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \ 
  http://localhost:8080/v1/eventos/?date-gt=2030-12-25&date-lt=2030-12-31
```

#### Atualizando os dados de um show

```bash
# Atualiza o valor do show com ID 1234
curl -X POST \
  -H "Authorization: Bearer askdbnkasbcn232bdls==..." \
  -H "Content-Type: application/json" \
  -d '{"value": 150.00}' \
  http://localhost:8080/v1/eventos/1234
```

Nesse exemplo o valor do show foi atualizado.
