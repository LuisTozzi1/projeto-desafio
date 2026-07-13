package com.dixi.gestao.exception;

// registro nao encontrado pelo id -> 404
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
