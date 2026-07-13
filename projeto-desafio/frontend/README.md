Frontend - React (Gestao de Funcionarios)

Stack: React 18 + Vite, React Router, Axios (com interceptor de JWT), CSS
puro, Cypress para os testes end-to-end.

A logo usada na sidebar e na tela de login e um simbolo "X" no lugar da logo
oficial da DIXI Solucoes - a logo original ficou com proporcao ruim ao ser
aplicada nas telas, entao foi trocada por um simbolo mais simples.


COMO RODAR

    npm install
    npm run dev

Acesse http://localhost:3000. Por padrao a aplicacao aponta para a API em
http://localhost:8080/api (configuravel em .env, veja .env.example).


ESTRUTURA

src/
  api/          chamadas HTTP (axios) para cada recurso da API
  components/   sidebar, modal, paginacao, rota protegida, logo
  context/      autenticacao (JWT) e notificacoes (toast)
  pages/
    login/
    funcionarios/   listagem + formulario com vinculos
    cargos/
    departamentos/
  utils.js      helpers (formatacao de CPF, download de relatorio, etc)


TESTES END-TO-END (CYPRESS)

Com o backend e o frontend rodando:

    npm run cypress:open   (interativo)
    npm run cypress:run    (headless)

Usuario de teste: admin / admin123 (criado pelo database/schema.sql).


BUILD DE PRODUCAO

    npm run build

Gera os arquivos estaticos em dist/. E esse diretorio que a imagem Docker do
frontend serve via Nginx.
