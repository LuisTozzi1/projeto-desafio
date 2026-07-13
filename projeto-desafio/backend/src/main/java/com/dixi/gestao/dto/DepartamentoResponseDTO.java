package com.dixi.gestao.dto;

import com.dixi.gestao.model.Departamento;

public record DepartamentoResponseDTO(
        String id,
        String codigo,
        String descricao
) {
    public static DepartamentoResponseDTO fromEntity(Departamento departamento) {
        return new DepartamentoResponseDTO(departamento.getId(), departamento.getCodigo(), departamento.getDescricao());
    }
}
