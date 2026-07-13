package com.dixi.gestao.dto;

import com.dixi.gestao.model.Cargo;

public record CargoResponseDTO(
        String id,
        String codigo,
        String descricao
) {
    public static CargoResponseDTO fromEntity(Cargo cargo) {
        return new CargoResponseDTO(cargo.getId(), cargo.getCodigo(), cargo.getDescricao());
    }
}
