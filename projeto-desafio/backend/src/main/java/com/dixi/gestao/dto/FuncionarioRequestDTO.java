package com.dixi.gestao.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public record FuncionarioRequestDTO(

        @NotBlank(message = "O nome do funcionario e obrigatorio")
        @Size(max = 150, message = "O nome deve ter no maximo 150 caracteres")
        String nome,

        @NotBlank(message = "O CPF e obrigatorio")
        @Pattern(regexp = "\\d{11}", message = "O CPF deve conter exatamente 11 digitos numericos")
        String cpf,

        @NotEmpty(message = "O funcionario deve ter ao menos um vinculo")
        @Valid
        List<VinculoRequestDTO> vinculos

) {}
