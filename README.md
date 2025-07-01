# 🎬 PAÇOCAFLIX

Sistema de filmes feito com Angular e Spring Boot para o trabalho da faculdade.

## 📝 Sobre o Projeto

O PAÇOCAFLIX é uma aplicação web que permite navegar por filmes, favoritar e avaliar. Os dados dos filmes vêm da API do TMDB.

### Funcionalidades

- ✅ Login e cadastro de usuários
- ✅ Ver filmes populares e em cartaz
- ✅ Buscar filmes por nome
- ✅ Filtrar por gênero
- ✅ Adicionar aos favoritos
- ✅ Avaliar filmes com estrelas (1-5)
- ✅ Ver detalhes dos filmes com trailer

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- Java 11 ou superior
- Git

### Configuração

1. Clone o repositório:
```bash
git clone https://github.com/d1g4odev/PACOCAFLIX.git
cd PACOCAFLIX
```

2. Configure o backend:
```bash
cd movies-api
./mvnw clean install
./mvnw spring-boot:run
```

3. Configure o frontend (em outro terminal):
```bash
cd movies-front
npm install
ng serve
```

4. Acesse:
- Frontend: http://localhost:4200
- Backend: http://localhost:8080
- Banco H2: http://localhost:8080/h2-console

### Configuração do Banco H2

- JDBC URL: `jdbc:h2:file:./data/movies-api`
- Username: `sa`
- Password: `password`

## 🛠️ Tecnologias Usadas

### Frontend
- Angular 14+
- TypeScript
- Angular Material
- SCSS

### Backend
- Spring Boot
- Spring Data JPA
- H2 Database
- Maven

### API Externa
- TMDB API (The Movie Database)

## 📂 Estrutura do Projeto

```
PACOCAFLIX/
├── movies-api/          # Backend Spring Boot
│   ├── src/
│   └── pom.xml
├── movies-front/        # Frontend Angular
│   ├── src/
│   └── package.json
└── README.md
```

## 🎯 Como usar

1. Faça login ou cadastre-se
2. Navegue pelos filmes na página inicial
3. Use a busca para encontrar filmes específicos
4. Clique em um filme para ver detalhes
5. Adicione aos favoritos clicando no coração
6. Avalie o filme com estrelas e comentários
7. Veja seus favoritos na aba "Favoritos"

## 🔧 Scripts Úteis

### Backend
```bash
# Compilar
./mvnw compile

# Rodar testes
./mvnw test

# Rodar aplicação
./mvnw spring-boot:run
```

### Frontend
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
ng serve

# Build para produção
ng build --configuration=production
```

## 📋 API Endpoints

### Usuários
- POST `/user/register` - Cadastrar usuário
- POST `/user/login` - Login

### Filmes
- GET `/movie/list` - Listar filmes
- GET `/movie/findById?id={id}` - Buscar por ID

### Avaliações
- POST `/evaluation/save` - Salvar avaliação
- GET `/evaluation/findEvaluationsByMovie?idMovie={id}` - Buscar avaliações

### Favoritos
- POST `/api/favorites/toggle` - Adicionar/remover favorito
- GET `/api/favorites/user/{userId}` - Listar favoritos do usuário

## 👥 Autor

Feito com ❤️ para o trabalho da faculdade.

## 📄 Licença

Este projeto é apenas para fins educacionais. 