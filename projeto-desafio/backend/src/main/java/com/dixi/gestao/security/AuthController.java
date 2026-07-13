package com.dixi.gestao.security;

import com.dixi.gestao.security.dto.LoginRequestDTO;
import com.dixi.gestao.security.dto.LoginResponseDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticacao", description = "Login e emissao de token JWT")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${app.jwt.expiration-ms}")
    private long expiracaoMs;

    @PostMapping("/login")
    @Operation(summary = "Autentica o usuario e retorna um token JWT")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        MDC.put("username", dto.username());
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.username(), dto.senha()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.gerarToken(userDetails);

            log.info("Login realizado com sucesso");

            return ResponseEntity.ok(new LoginResponseDTO(token, userDetails.getUsername(), expiracaoMs));
        } catch (Exception ex) {
            log.warn("Tentativa de login invalida: {}", ex.getMessage());
            throw ex;
        } finally {
            MDC.remove("username");
        }
    }
}
