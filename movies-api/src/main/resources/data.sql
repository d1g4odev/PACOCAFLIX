-- Inserindo gêneros padrão
INSERT INTO genres (name) VALUES ('Ação');
INSERT INTO genres (name) VALUES ('Comédia');
INSERT INTO genres (name) VALUES ('Drama');
INSERT INTO genres (name) VALUES ('Terror');
INSERT INTO genres (name) VALUES ('Ficção Científica');
INSERT INTO genres (name) VALUES ('Romance');

-- Inserindo usuários de teste
INSERT INTO users (id, name, email, password) VALUES (1, 'teste', 'teste@teste.com', 'teste');
INSERT INTO users (id, name, email, password) VALUES (2, 'admin', 'admin@admin.com', 'admin');

-- Inserindo filmes de teste com estrutura correta
INSERT INTO movie (id, title, description, id_api, release_date, poster_url, genre) VALUES (1, 'Filme Teste 1', 'Descrição do filme 1', 550, '2024-01-01', '/poster1.jpg', 'Ação');
INSERT INTO movie (id, title, description, id_api, release_date, poster_url, genre) VALUES (2, 'Filme Teste 2', 'Descrição do filme 2', 551, '2024-01-02', '/poster2.jpg', 'Comédia');
INSERT INTO movie (id, title, description, id_api, release_date, poster_url, genre) VALUES (3, 'Filme Teste 3', 'Descrição do filme 3', 552, '2024-01-03', '/poster3.jpg', 'Drama');

-- Usuário de teste removido 