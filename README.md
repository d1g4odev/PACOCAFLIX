# PAÇOCAFLIX - Sistema de Catálogo de Filmes

[![Angular](https://img.shields.io/badge/Angular-16-red)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1-green)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://openjdk.org/)
[![H2 Database](https://img.shields.io/badge/H2-Database-blue)](https://www.h2database.com/)

Sistema web completo de catálogo de filmes desenvolvido com Angular no frontend e Spring Boot no backend. Permite aos usuários explorar filmes, visualizar detalhes, aplicar filtros, avaliar filmes e gerenciar favoritos.

## Funcionalidades

### Frontend (Angular)
- Listagem de filmes em cards com imagem, título e nota média
- Página de detalhes com sinopse, gêneros, ano e avaliações
- Busca por título com campo de pesquisa
- Filtro por gênero (ação, comédia, drama, etc.)
- Sistema de favoritos para marcar/desmarcar filmes
- Página de favoritos separada
- Avaliação de filmes com sistema de 1-5 estrelas
- Cadastro de avaliações com nome do autor e comentário
- Interface responsiva com design moderno
- Componentes reutilizáveis e código modular

### Backend (Spring Boot)
- API de filmes com listagem, detalhes e filtro por gênero
- API de avaliações para consultar e registrar avaliações por filme
- API de favoritos para marcar/desmarcar favoritos por usuário
- Banco H2 em memória com dados de teste
- Integração com TMDb API para dados reais de filmes
- CORS configurado para comunicação frontend-backend

## Tecnologias Utilizadas

### Frontend
- Angular 16
- TypeScript
- SCSS
- Angular Router
- HttpClient
- Swiper.js

### Backend
- Java 17
- Spring Boot 3.1
- Spring Data JPA
- H2 Database
- Maven
- TMDb API

## Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm
- Java 17+
- Maven 3.6+
- Git

### 1. Clonar o Repositório
```bash
git clone https://github.com/d1g4odev/PACOCAFLIX.git
cd PACOCAFLIX
```

### 2. Configurar e Executar o Backend
```bash
cd movies-api
mvn clean compile
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

#### Endpoints principais:
- `GET /api/movies` - Lista todos os filmes
- `GET /api/movies/{id}` - Detalhes de um filme
- `GET /api/movies/genre/{genreId}` - Filmes por gênero
- `GET /api/evaluations/movie/{movieId}` - Avaliações de um filme
- `POST /api/evaluations` - Criar nova avaliação
- `GET /api/favorites/user/{userId}` - Favoritos do usuário
- `POST /api/favorites/add` - Adicionar favorito
- `POST /api/favorites/remove` - Remover favorito

### 3. Configurar e Executar o Frontend
```bash
cd movies-front
npm install
npm start
```

O frontend estará disponível em: `http://localhost:4200`

### 4. Acesso ao Sistema
1. Navegue para `http://localhost:4200`
2. Faça login com as credenciais:
   - Usuário: `admin`
   - Senha: `admin`

## Banco de Dados

O projeto utiliza H2 Database em memória:

- Console H2: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Usuário: `sa`
- Senha: (vazio)

### Dados de Teste
- 3 usuários de teste (admin, user1, user2)
- Filmes com dados do TMDb
- Gêneros: Ação, Drama, Comédia, Ficção Científica
- Avaliações de exemplo
- Favoritos pré-configurados

## Configuração

### API TMDb
O projeto inclui uma chave de API do TMDb. Para usar sua própria chave:

1. Obtenha uma chave em: https://www.themoviedb.org/settings/api
2. Atualize em `movies-front/src/environments/environment.ts`:
```typescript
export const environment = {
  apiKey: '?api_key=SUA_CHAVE_AQUI'
};
```

### CORS
O backend está configurado para aceitar requisições do frontend em `http://localhost:4200`.

## Estrutura do Projeto

```
PACOCAFLIX/
├── movies-api/          # Backend Spring Boot
│   ├── src/main/java/   # Código fonte Java
│   ├── src/main/resources/ # Configurações e dados
│   └── pom.xml          # Dependências Maven
├── movies-front/        # Frontend Angular
│   ├── src/app/         # Código fonte Angular
│   ├── src/assets/      # Recursos estáticos
│   └── package.json     # Dependências npm
└── README.md           # Este arquivo
```

## Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## Licença

Este projeto é licenciado sob a MIT License.

---

PAÇOCAFLIX - Desenvolvido com Angular + Spring Boot 