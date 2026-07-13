-- Sistema de Gestao de Funcionarios
-- Script de criacao do banco (MySQL 8)

CREATE DATABASE IF NOT EXISTS gestao_funcionarios
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gestao_funcionarios;

-- cargo
CREATE TABLE cargo (
    id              CHAR(36)     NOT NULL DEFAULT (UUID()),
    codigo          VARCHAR(50)  NOT NULL,
    descricao       VARCHAR(150) NOT NULL,
    criado_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uq_cargo_codigo UNIQUE (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_cargo_descricao ON cargo (descricao);

-- departamento
CREATE TABLE departamento (
    id              CHAR(36)     NOT NULL DEFAULT (UUID()),
    codigo          VARCHAR(50)  NOT NULL,
    descricao       VARCHAR(150) NOT NULL,
    criado_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uq_departamento_codigo UNIQUE (codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_departamento_descricao ON departamento (descricao);

-- funcionario
CREATE TABLE funcionario (
    id              CHAR(36)     NOT NULL DEFAULT (UUID()),
    nome            VARCHAR(150) NOT NULL,
    cpf             CHAR(11)     NOT NULL,
    criado_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uq_funcionario_cpf UNIQUE (cpf),
    CONSTRAINT ck_funcionario_cpf_formato CHECK (cpf REGEXP '^[0-9]{11}$')
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_funcionario_nome ON funcionario (nome);

-- vinculo (empresa e texto livre, nao tem tela de cadastro propria)
CREATE TABLE vinculo (
    id              CHAR(36)     NOT NULL DEFAULT (UUID()),
    funcionario_id  CHAR(36)     NOT NULL,
    empresa         VARCHAR(150) NOT NULL,
    matricula       VARCHAR(50)  NOT NULL,
    cargo_id        CHAR(36)     NOT NULL,
    departamento_id CHAR(36)     NOT NULL,
    criado_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    atualizado_em   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                 ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_vinculo_funcionario
        FOREIGN KEY (funcionario_id) REFERENCES funcionario (id)
        ON DELETE CASCADE,

    CONSTRAINT fk_vinculo_cargo
        FOREIGN KEY (cargo_id) REFERENCES cargo (id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_vinculo_departamento
        FOREIGN KEY (departamento_id) REFERENCES departamento (id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_vinculo_empresa_matricula UNIQUE (empresa, matricula)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX idx_vinculo_funcionario ON vinculo (funcionario_id);
CREATE INDEX idx_vinculo_empresa ON vinculo (empresa);
CREATE INDEX idx_vinculo_cargo ON vinculo (cargo_id);
CREATE INDEX idx_vinculo_departamento ON vinculo (departamento_id);

-- usuario (login da API)
CREATE TABLE usuario (
    id              CHAR(36)     NOT NULL DEFAULT (UUID()),
    username        VARCHAR(60)  NOT NULL,
    senha_hash      VARCHAR(100) NOT NULL,
    papel           VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
    criado_em       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),
    CONSTRAINT uq_usuario_username UNIQUE (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- usuario/senha de teste: admin / admin123
INSERT INTO usuario (username, senha_hash, papel)
VALUES ('admin', '$2b$10$6tTBwgv0YWofaz90Bz8SAubi54xvzHSP/kQkzUw/jkXWyP/9E1pxC', 'ADMIN');

-- view usada na listagem de funcionarios
CREATE VIEW vw_funcionario_listagem AS
SELECT
    f.id,
    f.nome,
    f.cpf,
    GROUP_CONCAT(DISTINCT c.descricao SEPARATOR ', ') AS cargos,
    GROUP_CONCAT(DISTINCT d.descricao SEPARATOR ', ') AS departamentos,
    GROUP_CONCAT(DISTINCT v.empresa SEPARATOR ', ')   AS empresas
FROM funcionario f
LEFT JOIN vinculo v       ON v.funcionario_id = f.id
LEFT JOIN cargo c         ON c.id = v.cargo_id
LEFT JOIN departamento d  ON d.id = v.departamento_id
GROUP BY f.id, f.nome, f.cpf;

-- dados de exemplo, opcional
-- INSERT INTO cargo (codigo, descricao) VALUES ('CG001', 'Programador');
-- INSERT INTO departamento (codigo, descricao) VALUES ('DP001', 'Desenvolvimento');
-- INSERT INTO funcionario (nome, cpf) VALUES ('João da Silva', '12345678900');
