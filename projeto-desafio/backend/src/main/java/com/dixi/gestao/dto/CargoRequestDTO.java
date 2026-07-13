package com.dixi.gestao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CargoRequestDTO(

        @NotBlank(message = "O codigo do cargo e obrigatorio")
        @Size(max = 50, message = "O codigo do cargo deve ter no maximo 50 caracteres")
        String codigo,

        @NotBlank(message = "A descricao do cargo e obrigatoria")
        @Size(max = 150, message = "A descricao do cargo deve ter no maximo 150 caracteres")
        String descricao

) {}
