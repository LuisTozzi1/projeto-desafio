package com.dixi.gestao.dto;

import com.dixi.gestao.model.Funcionario;

import java.util.stream.Collectors;

// usado na tabela de listagem: Nome, CPF, Cargo(s), Departamento(s)
public record FuncionarioListagemDTO(
        String id,
        String nome,
        String cpf,
        String cargos,
        String departamentos,
        String empresas
) {
    public static FuncionarioListagemDTO fromEntity(Funcionario funcionario) {
        String cargos = funcionario.getVinculos().stream()
                .map(v -> v.getCargo().getDescricao())
                .distinct()
                .collect(Collectors.joining(", "));

        String departamentos = funcionario.getVinculos().stream()
                .map(v -> v.getDepartamento().getDescricao())
                .distinct()
                .collect(Collectors.joining(", "));

        String empresas = funcionario.getVinculos().stream()
                .map(v -> v.getEmpresa())
                .distinct()
                .collect(Collectors.joining(", "));

        return new FuncionarioListagemDTO(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getCpf(),
                cargos,
                departamentos,
                empresas
        );
    }
}
