package com.dixi.gestao.exception;

// erro de regra de negocio (CPF duplicado, codigo duplicado, etc) -> 409
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}
