package com.dixi.gestao.dto;

import com.dixi.gestao.model.Funcionario;

import java.util.List;

public record FuncionarioResponseDTO(
        String id,
        String nome,
        String cpf,
        List<VinculoResponseDTO> vinculos
) {
    public static FuncionarioResponseDTO fromEntity(Funcionario funcionario) {
        List<VinculoResponseDTO> vinculos = funcionario.getVinculos().stream()
                .map(VinculoResponseDTO::fromEntity)
                .toList();

        return new FuncionarioResponseDTO(
                funcionario.getId(),
                funcionario.getNome(),
                funcionario.getCpf(),
                vinculos
        );
    }
}
