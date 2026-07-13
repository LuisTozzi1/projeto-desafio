package com.dixi.gestao.dto;

import com.dixi.gestao.model.Vinculo;

public record VinculoResponseDTO(
        String id,
        String empresa,
        String matricula,
        String cargoId,
        String cargoDescricao,
        String departamentoId,
        String departamentoDescricao
) {
    public static VinculoResponseDTO fromEntity(Vinculo vinculo) {
        return new VinculoResponseDTO(
                vinculo.getId(),
                vinculo.getEmpresa(),
                vinculo.getMatricula(),
                vinculo.getCargo().getId(),
                vinculo.getCargo().getDescricao(),
                vinculo.getDepartamento().getId(),
                vinculo.getDepartamento().getDescricao()
        );
    }
}
