Sistema de Gestao de Funcionarios

Aplicacao web para cadastro e gerenciamento de funcionarios, cargos e
departamentos.


SOBRE A LOGO

A tela usa um simbolo "X" no lugar da logo oficial da DIXI Solucoes. A logo
original, quando aplicada no layout do sistema (sidebar, tela de login),
ficou com proporcao ruim - cortada e espremida. Por isso foi substituida por
um simbolo mais simples, que se encaixa melhor no espaco disponivel.


STACK USADA

Backend: Java 17 + Spring Boot 3 (Web, Data JPA, Validation, Security)
Frontend: React 18 + Vite
Banco de dados: MySQL 8
Autenticacao: JWT
Testes: JUnit + Mockito (backend), Cypress (frontend)
Docker + Docker Compose
Documentacao de API: Swagger/OpenAPI


O QUE VOCE PRECISA TER INSTALADO ANTES DE COMECAR

- Git
- Java Development Kit (JDK) versao 17. Precisa ser exatamente essa versao
  ou uma versao 17.x - versoes mais novas (como 21 ou 26) nao funcionam com
  esse projeto por causa de uma biblioteca chamada Lombok, que ainda nao
  tem suporte a versoes muito recentes do Java
- IntelliJ IDEA (Community ja resolve, nao precisa da versao paga)
- MySQL Server + MySQL Workbench (ou qualquer outro cliente MySQL de sua
  preferencia)
- Node.js (versao 18 ou mais recente) - necessario para rodar o frontend

Se voce nao tiver o Java 17 instalado, o proprio IntelliJ consegue baixar
para voce durante a configuracao do projeto (isso e explicado mais abaixo).


PASSO 1 - CLONAR O REPOSITORIO

Abra um terminal (pode ser o Prompt de Comando, PowerShell, Git Bash, ou o
terminal do proprio IntelliJ) e rode:

    git clone <URL_DO_REPOSITORIO>

Substitua <URL_DO_REPOSITORIO> pelo link do repositorio no GitHub. Isso vai
criar uma pasta com o projeto completo no seu computador.

Entre na pasta que foi criada:

    cd nome-da-pasta-clonada

Se voce recebeu o projeto como um arquivo .zip em vez de um link do GitHub,
so precisa extrair o .zip em qualquer lugar do computador e seguir os
proximos passos a partir da pasta extraida.


PASSO 2 - CONFIGURAR O BANCO DE DADOS

O banco de dados precisa ser criado antes de rodar o backend, porque o
backend nao cria as tabelas sozinho - ele espera que elas ja existam.

1. Abra o MySQL Workbench e conecte na sua instalacao local do MySQL
   (geralmente aparece como algo do tipo "Local instance MySQL80").

2. Abra uma aba de query nova (icone do raio, ou o menu File > New Query
   Tab).

3. Abra o arquivo database/schema.sql (que esta dentro da pasta do
   projeto que voce clonou/extraiu) em um editor de texto, copie todo o
   conteudo dele, e cole nessa aba de query do Workbench.
   Alternativa: no Workbench, use File > Open SQL Script... e selecione
   o arquivo diretamente, sem precisar copiar e colar.

4. Execute o script inteiro. O botao para isso e o icone de raio com um
   tracinho embaixo (executa tudo), ou o atalho Ctrl+Shift+Enter. Nao use
   o raio simples, que executa so a linha onde o cursor esta.

5. Confirme que funcionou rodando estas duas linhas:

    USE gestao_funcionarios;
    SHOW TABLES;

   Devem aparecer as tabelas: cargo, departamento, funcionario, usuario,
   vinculo, e a view vw_funcionario_listagem.

6. Confirme tambem que o usuario de teste foi criado:

    SELECT username, papel FROM usuario;

   Deve aparecer uma linha com "admin" e "ADMIN". Esse e o login que voce
   vai usar depois para entrar no sistema (usuario: admin, senha: admin123).

Se em algum momento voce precisar recomecar do zero (por exemplo, se algo
deu errado no meio do processo), rode isto antes de executar o script de
novo:

    DROP DATABASE IF EXISTS gestao_funcionarios;


PASSO 3 - RODAR O BACKEND (API)

1. Abra o IntelliJ IDEA.

2. Va em File > Open e selecione a pasta backend (a pasta backend que
   fica dentro da pasta do projeto - nao abra a pasta raiz do projeto,
   abra especificamente a pasta backend).

3. O IntelliJ vai reconhecer que e um projeto Maven e vai comecar a baixar
   as dependencias automaticamente. Isso pode demorar alguns minutos na
   primeira vez. Aguarde a barra de progresso, no canto inferior direito da
   tela, terminar.

4. Confirme que o projeto esta configurado para usar o Java 17:
   - Va em File > Project Structure (ou aperte Ctrl+Alt+Shift+S)
   - Na aba Project, no campo SDK, confirme que esta selecionado
     "17" (algo como "17 Java 17.0.x")
   - Se nao tiver nenhum JDK 17 instalado, clique em Add SDK >
     Download JDK, escolha a versao 17 e qualquer fornecedor (Eclipse
     Temurin, por exemplo), e deixe baixar
   - Clique em OK para fechar essa janela

5. Confirme tambem que o Maven vai usar esse mesmo Java 17 para compilar:
   - Va em File > Settings (ou Ctrl+Alt+S)
   - Va em Build, Execution, Deployment > Build Tools > Maven > Runner
   - No campo JRE, selecione 17 (ou a opcao "Use Project JDK", ja que
     configuramos ela para 17 no passo anterior)
   - Clique em Apply e depois em OK

6. O projeto usa uma biblioteca chamada Lombok, que precisa de uma opcao
   especifica habilitada no IntelliJ para funcionar. Normalmente, ao abrir
   qualquer arquivo Java do projeto, aparece um aviso no canto da tela
   dizendo "Lombok requires enabled annotation processing" com um botao
   escrito "Enable annotation processing". Clique nesse botao. Se esse
   aviso nao aparecer sozinho, va em File > Settings > Build, Execution,
   Deployment > Compiler > Annotation Processors e marque a caixa "Enable
   annotation processing".

7. Agora ajuste a senha do banco de dados. Abra o arquivo:

    backend/src/main/resources/application.properties

   E procure estas duas linhas:

    spring.datasource.username=root
    spring.datasource.password=root

   O valor "root" que esta ai e apenas um exemplo generico. Troque pelo
   usuario e senha reais do MySQL que voce usa na sua maquina (o mesmo que
   voce usa para entrar no MySQL Workbench). Se voce nao trocar isso e a
   sua senha do MySQL for diferente de "root", o backend vai falhar ao
   iniciar com um erro de "Access denied".

8. Agora rode a aplicacao. No painel de arquivos a esquerda, navegue ate:

    src/main/java/com/dixi/gestao/GestaoFuncionariosApplication.java

   Abra esse arquivo e clique no icone verde de play (triangulo) que
   aparece ao lado da linha "public class GestaoFuncionariosApplication"
   ou da linha do metodo "main". Escolha a opcao de rodar (Run).

9. Aguarde. Se tudo estiver certo, depois de alguns segundos vai aparecer
   no console, na parte de baixo da tela, uma linha parecida com:

    Tomcat started on port 8080 (http) with context path ''
    Started GestaoFuncionariosApplication in X seconds

   Isso significa que o backend esta rodando. Nao feche essa janela nem
   pare a execucao - ele precisa continuar rodando para o frontend
   conseguir se conectar.

10. Para confirmar que esta tudo certo, abra um navegador e acesse:

    http://localhost:8080/swagger-ui.html

    Deve aparecer uma pagina com a documentacao interativa da API, listando
    os endpoints de Funcionarios, Cargos, Departamentos e Auth.


PASSO 4 - RODAR O FRONTEND

Com o backend rodando (deixe ele aberto, nao feche o IntelliJ), abra um
terminal novo. Pode ser o terminal do proprio IntelliJ (menu View > Tool
Windows > Terminal, ou o atalho Alt+F12), ou um terminal separado do
sistema operacional.

1. Entre na pasta frontend, que fica dentro da pasta raiz do projeto:

    cd frontend

   (Se voce ja estiver dentro da pasta backend em outro terminal, abra um
   terminal novo e va ate a pasta raiz do projeto antes de entrar em
   frontend.)

2. Instale as dependencias do projeto:

    npm install

   Isso vai demorar um pouco na primeira vez, baixando tudo que o React
   precisa para funcionar.

3. Depois que terminar, rode:

    npm run dev

4. Vai aparecer uma mensagem no terminal parecida com:

    Local: http://localhost:3000/

   Abra essa URL no navegador.


PASSO 5 - ACESSAR O SISTEMA

Na tela de login que vai aparecer, entre com:

    Usuario: admin
    Senha: admin123

Esse usuario ja vem criado automaticamente pelo script do banco de dados
(passo 2). Depois de logar, voce cai na tela de Funcionarios, com acesso
tambem as telas de Cargos e Departamentos pelo menu lateral.


RESUMO RAPIDO (depois que tudo ja estiver configurado uma vez)

Nas proximas vezes que for rodar o projeto, nao precisa repetir a
configuracao toda - so:

1. Deixe o MySQL rodando (geralmente ele inicia sozinho com o computador,
   ou via MySQL Workbench / servicos do Windows)
2. Abra o backend no IntelliJ e rode GestaoFuncionariosApplication
3. Em um terminal, dentro da pasta frontend, rode npm run dev
4. Acesse http://localhost:3000


COMO RODAR OS TESTES

Testes do backend (unitarios):

    cd backend
    mvn test

Se voce nao tiver o Maven instalado separadamente no terminal, rode pelo
proprio IntelliJ: aba Maven na lateral direita da tela > backend >
Lifecycle > test (clique duas vezes).

Testes do frontend (ponta a ponta, simulam um usuario clicando na tela).
Precisa do backend e do frontend rodando ao mesmo tempo:

    cd frontend
    npm run cypress:open

Isso abre uma janela onde voce escolhe qual teste rodar e acompanha o
navegador executando cada passo.


ALTERNATIVA - RODAR TUDO VIA DOCKER

Se voce tiver Docker e Docker Compose instalados, existe um jeito mais
rapido de subir o projeto inteiro (banco, backend e frontend) de uma vez
so, sem precisar instalar Java, MySQL ou Node separadamente.

Na pasta raiz do projeto (onde fica o arquivo docker-compose.yml):

    docker compose up --build

Isso sobe o MySQL ja com as tabelas criadas, o backend na porta 8080 e o
frontend na porta 3000. Acesse http://localhost:3000 normalmente, com o
mesmo login (admin / admin123).

Para parar tudo: Ctrl+C e depois docker compose down.


ESTRUTURA DO PROJETO

backend/     API REST em Spring Boot
  src/main/java/com/dixi/gestao/
    model/       entidades JPA (tabelas do banco)
    controller/  controllers REST (recebem as requisicoes)
    service/     regras de negocio
    repository/  acesso a dados
    dto/         objetos de request/response
    security/    autenticacao JWT
    config/      CORS, filtro de correlacao de logs
    exception/   tratamento de erros

frontend/    aplicacao React + testes Cypress
database/    schema.sql (script de criacao do banco)
docker-compose.yml
docs/        diagrama do banco e da arquitetura


PROBLEMAS COMUNS

Erro de compilacao mencionando Lombok ou "TypeTag":
Geralmente e o JDK errado (diferente de 17) ou o annotation processing do
Lombok desabilitado. Revise os passos 4, 5 e 6 do PASSO 3 acima.

Erro "Access denied for user root" ao rodar o backend:
A senha no application.properties nao bate com a senha do seu MySQL.
Revise o passo 7 do PASSO 3.

Erro de "Schema-validation" mencionando tipos de coluna (CHAR vs VARCHAR):
Confirme que o schema.sql foi executado por completo, sem erros, e que
a tabela usuario existe (SHOW TABLES no MySQL Workbench).

Tela de login nao aceita admin/admin123:
Normalmente significa que a tabela usuario nao foi criada ou o registro
do admin nao foi inserido. Rode de novo o SELECT username, papel FROM
usuario; do passo 2 para confirmar, e se precisar, rode o schema.sql
completo de novo (apos um DROP DATABASE IF EXISTS gestao_funcionarios).


MODELAGEM DO BANCO DE DADOS

funcionario: nome e CPF (unico)
vinculo: liga o funcionario a uma empresa (campo de texto livre), com
  matricula (unica por empresa), cargo e departamento
cargo: codigo (unico) e descricao
departamento: codigo (unico) e descricao
usuario: login da API (senha armazenada como hash, nunca em texto puro)

Detalhes completos em database/schema.sql. Diagramas visuais (entidade-
relacionamento e arquitetura) estao na pasta docs/.


FUNCIONALIDADES

- Cadastro, edicao, consulta e listagem de Funcionarios (com multiplos
  vinculos empregaticios por funcionario), Cargos e Departamentos
- Filtros e paginacao em todas as listagens
- Geracao de relatorio em CSV em todas as telas
- Login obrigatorio via JWT (toda rota da API exige token, exceto a rota
  de login)


NOTA SOBRE SEGURANCA

O secret usado para assinar o token JWT e a senha do banco que aparecem no
application.properties sao valores de exemplo, pensados apenas para rodar
o projeto localmente durante o desenvolvimento. Em um ambiente real de
producao, esses valores deveriam vir de variaveis de ambiente, nunca
ficar gravados diretamente no codigo-fonte.
