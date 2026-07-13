Sistema de Gestao de Funcionarios

Aplicacao web para gerenciamento de funcionarios, cargos e departamentos.

Sobre a logo: o sistema usa um simbolo "X" no lugar da logo oficial da DIXI Solucoes.
A logo original, quando aplicada nas telas do sistema, ficou com uma proporcao ruim
(cortada/espremida na sidebar), entao optei por um simbolo mais simples que se encaixa
melhor no layout.

Stack usada:
- Backend: Java 17 + Spring Boot 3 (Web, Data JPA, Validation, Security)
- Frontend: React 18 + Vite
- Banco: MySQL 8
- Autenticacao: JWT
- Testes: JUnit + Mockito (backend), Cypress (frontend)
- Docker + Docker Compose
- Documentacao de API: Swagger/OpenAPI

Estrutura de pastas:

backend/     -> API REST em Spring Boot
  src/main/java/com/dixi/gestao/
    model/       entidades JPA
    controller/  controllers REST
    service/     regras de negocio
    repository/  acesso a dados
    dto/         objetos de request/response
    security/    autenticacao JWT
    config/      CORS, filtro de correlacao de logs
    exception/   tratamento de erros

frontend/    -> aplicacao React + testes Cypress
database/    -> schema.sql (script de criacao do banco)
docker-compose.yml
docs/        -> diagrama do banco e da arquitetura


COMO RODAR

Existem duas formas: via Docker (sobe tudo de uma vez) ou manualmente (IntelliJ + terminal).


Opcao 1 - Docker

Pre-requisito: Docker e Docker Compose instalados.

Na raiz do projeto:

    docker compose up --build

Isso sobe o MySQL (ja com o schema.sql aplicado), o backend na porta 8080 e o
frontend na porta 3000.

Acesse http://localhost:3000 e faca login com admin / admin123.

Para parar: Ctrl+C e depois docker compose down (ou docker compose down -v
para apagar tambem os dados do banco).


Opcao 2 - Manual (IntelliJ + terminal)

1) Banco de dados

Rode o script database/schema.sql no MySQL (Workbench ou linha de comando):

    mysql -u root -p < database/schema.sql

Isso cria o banco gestao_funcionarios com as tabelas cargo, departamento,
funcionario, vinculo e usuario, alem de um usuario de teste (admin / admin123).

Se o banco ja existir de uma tentativa anterior e voce quiser recriar do zero:

    DROP DATABASE IF EXISTS gestao_funcionarios;

e depois rode o schema.sql de novo.

2) Backend

- Abra a pasta backend/ no IntelliJ (File > Open)
- Deixe o Maven baixar as dependencias
- Confirme o JDK do projeto: File > Project Structure > Project SDK deve ser
  Java 17 (nao uma versao mais nova). Confira tambem em File > Settings >
  Build Tools > Maven > Runner se o JRE usado la tambem esta em 17
- O projeto usa Lombok. Se aparecer erro de compilacao relacionado a isso,
  vai surgir um aviso "Enable annotation processing" no canto da tela -
  clique nele
- Confira backend/src/main/resources/application.properties: o usuario e
  senha do banco (spring.datasource.username / spring.datasource.password)
  precisam bater com o seu MySQL local
- Rode a classe GestaoFuncionariosApplication (botao verde de play)
- Se subir certo, o console mostra "Tomcat started on port 8080"
- Teste acessando http://localhost:8080/swagger-ui.html

3) Frontend

No terminal:

    cd frontend
    npm install
    npm run dev

Acesse http://localhost:3000.

4) Login

Usuario: admin
Senha: admin123

Esse usuario e criado automaticamente pelo schema.sql (a senha ja fica
armazenada como hash BCrypt, nunca em texto puro).


TESTES

Backend (unitarios, JUnit + Mockito):

    cd backend
    mvnw test

Cobre validacao de CPF duplicado, codigo de cargo/departamento duplicado,
matricula duplicada por empresa, criacao e edicao de vinculos, e filtros de
pesquisa. A cobertura e medida com JaCoCo (relatorio gerado em
target/site/jacoco/index.html apos mvnw verify).

Frontend (end-to-end, Cypress), com backend e frontend rodando:

    cd frontend
    npm run cypress:open   (modo interativo)
    npm run cypress:run    (modo headless)

Cobre, nas 3 telas principais: login, cadastro, edicao, validacao de
duplicidade, pesquisa com filtros, paginacao e geracao de relatorio.


MODELAGEM DO BANCO

- funcionario: nome e CPF (unico)
- vinculo: liga o funcionario a uma empresa (campo texto livre), com
  matricula (unica por empresa), cargo e departamento
- cargo: codigo (unico) e descricao
- departamento: codigo (unico) e descricao
- usuario: login da API (username/senha em BCrypt)

Detalhes completos em database/schema.sql. Diagramas em docs/.


FUNCIONALIDADES

- CRUD de Funcionarios (com multiplos vinculos por funcionario), Cargos e
  Departamentos
- Filtros e paginacao em todas as listagens
- Geracao de relatorio em CSV em todas as telas
- Login obrigatorio via JWT (toda rota da API exige token, exceto o login)


NOTA SOBRE SEGURANCA

O secret do JWT e a senha do banco que estao no application.properties sao
valores de desenvolvimento, usados so para rodar o projeto localmente. Em um
ambiente real de producao, esses valores deveriam vir de variaveis de
ambiente, nao ficar hardcoded no repositorio.
