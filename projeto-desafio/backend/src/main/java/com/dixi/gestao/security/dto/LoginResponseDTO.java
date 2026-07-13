package com.dixi.gestao.security.dto;

public record LoginResponseDTO(
        String token,
        String username,
        long expiraEmMs
) {}
