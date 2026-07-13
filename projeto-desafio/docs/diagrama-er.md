Diagrama entidade-relacionamento

```mermaid
erDiagram
    FUNCIONARIO ||--o{ VINCULO : possui
    CARGO ||--o{ VINCULO : referenciado_por
    DEPARTAMENTO ||--o{ VINCULO : referenciado_por

    FUNCIONARIO {
        char36 id PK
        varchar150 nome
        char11 cpf UK
        datetime criado_em
        datetime atualizado_em
    }

    VINCULO {
        char36 id PK
        char36 funcionario_id FK
        varchar150 empresa
        varchar50 matricula
        char36 cargo_id FK
        char36 departamento_id FK
        datetime criado_em
        datetime atualizado_em
    }

    CARGO {
        char36 id PK
        varchar50 codigo UK
        varchar150 descricao
        datetime criado_em
        datetime atualizado_em
    }

    DEPARTAMENTO {
        char36 id PK
        varchar50 codigo UK
        varchar150 descricao
        datetime criado_em
        datetime atualizado_em
    }

    USUARIO {
        char36 id PK
        varchar60 username UK
        varchar100 senha_hash
        varchar20 papel
        datetime criado_em
    }
```

Cardinalidades

Um funcionario pode ter zero ou muitos vinculos (varias empresas). Um
vinculo pertence a exatamente um funcionario - se o funcionario for
excluido, os vinculos dele vao junto (ON DELETE CASCADE).

Um cargo pode estar em varios vinculos, mas um vinculo tem exatamente um
cargo. Nao da pra excluir um cargo que esteja em uso (ON DELETE RESTRICT).
O mesmo vale para departamento.

Usuario e independente das demais tabelas, usado so para login da API.

Regras de negocio e onde estao no banco:

CPF nao pode duplicar -> UNIQUE (cpf) em funcionario
Codigo de cargo nao pode duplicar -> UNIQUE (codigo) em cargo
Codigo de departamento nao pode duplicar -> UNIQUE (codigo) em departamento
Matricula nao pode duplicar na mesma empresa -> UNIQUE (empresa, matricula) em vinculo
Cargo/departamento devem vir dos cadastros existentes -> foreign keys em vinculo
Funcionario pode ter varios vinculos -> relacao 1:N entre funcionario e vinculo

Script completo em ../database/schema.sql.
