Backend - API REST (Spring Boot)

Stack: Java 17, Spring Boot 3.2 (Web, Data JPA, Validation, Security),
MySQL (mysql-connector-j), Lombok, Springdoc OpenAPI (Swagger), JUnit 5 +
Mockito.


COMO RODAR

1) Rode o script ../database/schema.sql no seu MySQL antes de tudo.
2) Confira usuario e senha do banco em
   src/main/resources/application.properties.
3) Suba a aplicacao:

    mvnw spring-boot:run

   ou pelo IntelliJ, rodando a classe GestaoFuncionariosApplication.

A API sobe em http://localhost:8080/api. Documentacao interativa em
http://localhost:8080/swagger-ui.html.


ENDPOINTS PRINCIPAIS

GET    /api/funcionarios            lista com filtros (nome, cpf, matricula,
                                     empresa, cargoId, departamentoId) e
                                     paginacao
GET    /api/funcionarios/{id}       consulta por id
POST   /api/funcionarios            cria funcionario com um ou mais vinculos
PUT    /api/funcionarios/{id}       edita funcionario e/ou vinculos
GET    /api/funcionarios/relatorio  relatorio em CSV

GET/POST/PUT  /api/cargos[/{id}]
GET           /api/cargos/relatorio

GET/POST/PUT  /api/departamentos[/{id}]
GET           /api/departamentos/relatorio

POST   /api/auth/login              autentica e retorna o token JWT

Todas as rotas acima (exceto /api/auth/login e o swagger) exigem o header
Authorization: Bearer <token>.


TESTES

    mvnw test

Cobrem CPF duplicado, codigo de cargo/departamento duplicado, matricula
duplicada por empresa, criacao/edicao de vinculos e filtros de pesquisa.

    mvnw verify

Roda os testes e gera o relatorio de cobertura em
target/site/jacoco/index.html.
