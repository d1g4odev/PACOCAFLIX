# 🎬 PAÇOCAFLIX - Sistema de Catálogo de Filmes

[![Angular](https://img.shields.io/badge/Angular-16-red)](https://angular.io/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1-green)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://openjdk.org/)
[![H2 Database](https://img.shields.io/badge/H2-Database-blue)](https://www.h2database.com/)

Um sistema web completo de catálogo de filmes inspirado no Netflix, desenvolvido com Angular no frontend e Spring Boot no backend. Os usuários podem explorar filmes, visualizar detalhes, aplicar filtros, avaliar filmes e gerenciar favoritos.

## 🌟 Funcionalidades

### ✅ Frontend (Angular)
- [x] **Listagem de filmes** em cards com imagem, título e nota média
- [x] **Página de detalhes** com sinopse, gêneros, ano e avaliações
- [x] **Busca por título** com campo de pesquisa no topo
- [x] **Filtro por gênero** (ação, comédia, drama, etc.)
- [x] **Sistema de favoritos** - marcar/desmarcar filmes favoritos
- [x] **Página de favoritos** separada com todos os filmes favoritados
- [x] **Avaliação de filmes** com sistema de 1-5 estrelas
- [x] **Cadastro de avaliações** com nome do autor e comentário
- [x] **Interface responsiva** com design moderno inspirado no Netflix
- [x] **Componentes reutilizáveis** e código modular

### ✅ Backend (Spring Boot)
- [x] **API de filmes** - listagem, detalhes e filtro por gênero
- [x] **API de avaliações** - consultar e registrar avaliações por filme
- [x] **API de favoritos** - marcar/desmarcar favoritos por usuário
- [x] **Banco H2** - banco relacional em memória com dados de teste
- [x] **Integração TMDb** - busca dados reais de filmes da API do TMDb
- [x] **CORS configurado** para comunicação frontend-backend

## 🛠️ Tecnologias Utilizadas

### Frontend
- **Angular 16** - Framework principal
- **TypeScript** - Linguagem de programação
- **SCSS** - Estilização com paleta Netflix
- **Angular Router** - Navegação entre páginas
- **HttpClient** - Consumo de APIs
- **Swiper.js** - Carrossel de filmes

### Backend
- **Java 17** - Linguagem de programação
- **Spring Boot 3.1** - Framework backend
- **Spring Data JPA** - Acesso a dados
- **H2 Database** - Banco de dados em memória
- **Maven** - Gerenciamento de dependências
- **TMDb API** - Fonte de dados de filmes

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js** 18+ e **npm**
- **Java 17+**
- **Maven 3.6+**
- **Git**

### 1. Clonar o Repositório
```bash
git clone https://github.com/seu-usuario/CINEAPP.git
cd CINEAPP
```

### 2. Configurar e Executar o Backend

```bash
# Navegar para a pasta do backend
cd movies-api

# Compilar o projeto
mvn clean compile

# Executar o backend (porta 8080)
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

**Endpoints principais:**
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
# Abrir novo terminal e navegar para o frontend
cd movies-front

# Instalar dependências
npm install

# Executar em modo desenvolvimento (porta 4200)
npm start
```

O frontend estará disponível em: `http://localhost:4200`

### 4. Acessar a Aplicação

1. Abra o navegador em `http://localhost:4200`
2. Faça login com as credenciais padrão:
   - **Usuário:** `admin`
   - **Senha:** `admin`
3. Explore os filmes, adicione favoritos e avalie!

## 🗃️ Banco de Dados

O projeto utiliza **H2 Database** em memória com dados pré-configurados:

- **Console H2:** `http://localhost:8080/h2-console`
- **JDBC URL:** `jdbc:h2:mem:testdb`
- **Usuário:** `sa`
- **Senha:** *(vazio)*

### Dados de Teste Inclusos
- **Usuários:** 3 usuários de teste (admin, user1, user2)
- **Filmes:** Vários filmes com dados do TMDb
- **Gêneros:** Ação, Drama, Comédia, Ficção Científica, etc.
- **Avaliações:** Avaliações de exemplo
- **Favoritos:** Alguns favoritos pré-configurados

## 📱 Screenshots

### Página Inicial
Interface moderna inspirada no Netflix com carrossel de filmes em destaque.

### Página de Favoritos
Visualização dos filmes favoritos com múltiplas opções de remoção.

### Detalhes do Filme
Informações completas incluindo sinopse, avaliações e sistema de favoritos.

## 🎨 Design

O projeto utiliza uma **paleta de cores inspirada no Netflix**:
- **Vermelho Netflix:** `#e50914` (cor principal)
- **Preto:** `#000000` (fundo)
- **Cinza Escuro:** `#141414` (cards)
- **Cinza:** `#333333` (elementos secundários)
- **Branco:** `#ffffff` (texto)

## 🧪 Testes

### Testar APIs (Backend)
```bash
# Listar filmes
curl -X GET "http://localhost:8080/api/movies"

# Adicionar favorito
curl -X POST "http://localhost:8080/api/favorites/add" \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "movieId": 550}'
```

### Scripts de Teste Inclusos
- `test-api-obrigatoria.ps1` - Testa endpoints obrigatórios
- `test-avaliacoes.ps1` - Testa sistema de avaliações
- `test-favoritos-routing.ps1` - Testa roteamento de favoritos
- `test-system.ps1` - Teste completo do sistema

## 📦 Scripts Disponíveis

### Controle do Sistema
```bash
# Iniciar todo o sistema (backend + frontend)
./start-system.ps1

# Iniciar apenas o frontend
./start-frontend-only.ps1

# Parar o sistema
./stop-system.ps1

# Testar o sistema completo
./test-system.ps1
```

## 🔧 Configuração Adicional

### Chave da API TMDb
O projeto já inclui uma chave de API do TMDb configurada. Para usar sua própria chave:

1. Obtenha uma chave em: https://www.themoviedb.org/settings/api
2. Atualize em `movies-front/src/environments/environment.ts`:
```typescript
export const environment = {
  apiKey: '?api_key=SUA_CHAVE_AQUI'
};
```

### Configuração de CORS
O backend está configurado para aceitar requisições do frontend em `http://localhost:4200`.

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎯 Estrutura do Projeto

```
CINEAPP/
├── movies-api/          # Backend Spring Boot
│   ├── src/main/java/   # Código fonte Java
│   ├── src/main/resources/ # Configurações e dados
│   └── pom.xml          # Dependências Maven
├── movies-front/        # Frontend Angular
│   ├── src/app/         # Código fonte Angular
│   ├── src/assets/      # Recursos estáticos
│   └── package.json     # Dependências npm
├── *.ps1               # Scripts PowerShell
└── README.md           # Este arquivo
```

## 📧 Contato

Para dúvidas ou sugestões, entre em contato:
- **GitHub:** [seu-usuario](https://github.com/seu-usuario)
- **Email:** seu-email@exemplo.com

---

**PAÇOCAFLIX** - Desenvolvido com ❤️ usando Angular + Spring Boot 