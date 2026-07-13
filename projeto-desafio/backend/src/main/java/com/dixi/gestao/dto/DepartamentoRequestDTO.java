package com.dixi.gestao.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartamentoRequestDTO(

        @NotBlank(message = "O codigo do departamento e obrigatorio")
        @Size(max = 50, message = "O codigo do departamento deve ter no maximo 50 caracteres")
        String codigo,

        @NotBlank(message = "A descricao do departamento e obrigatoria")
        @Size(max = 150, message = "A descricao do departamento deve ter no maximo 150 caracteres")
        String descricao

) {}
