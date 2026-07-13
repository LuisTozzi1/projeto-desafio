package com.dixi.gestao.security.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequestDTO(
        @NotBlank(message = "O usuario e obrigatorio") String username,
        @NotBlank(message = "A senha e obrigatoria") String senha
) {}
