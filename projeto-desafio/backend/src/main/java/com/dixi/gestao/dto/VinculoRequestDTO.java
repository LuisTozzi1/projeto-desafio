package com.dixi.gestao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record VinculoRequestDTO(

        // Preenchido apenas ao EDITAR um vinculo existente. Nulo = vinculo novo.
        String id,

        @NotBlank(message = "O nome da empresa e obrigatorio")
        @Size(max = 150, message = "O nome da empresa deve ter no maximo 150 caracteres")
        String empresa,

        @NotBlank(message = "A matricula e obrigatoria")
        @Size(max = 50, message = "A matricula deve ter no maximo 50 caracteres")
        String matricula,

        @NotNull(message = "O cargo e obrigatorio")
        String cargoId,

        @NotNull(message = "O departamento e obrigatorio")
        String departamentoId

) {}
