package com.dixi.gestao.service;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class CsvUtilTest {

    private record Pessoa(String nome, String cidade) {}

    @Test
    void deveGerarCsvComCabecalhoEDados() {
        List<Pessoa> pessoas = List.of(new Pessoa("Ana", "Curitiba"), new Pessoa("Bruno", "São Paulo"));

        String csv = CsvUtil.gerarCsv(
                List.of("Nome", "Cidade"),
                pessoas,
                p -> List.of(p.nome(), p.cidade())
        );

        assertTrue(csv.contains("Nome;Cidade"));
        assertTrue(csv.contains("Ana;Curitiba"));
        assertTrue(csv.contains("Bruno;São Paulo"));
    }

    @Test
    void deveEscaparValoresComPontoEVirgula() {
        List<Pessoa> pessoas = List.of(new Pessoa("Empresa; Filial", "Curitiba"));

        String csv = CsvUtil.gerarCsv(
                List.of("Nome", "Cidade"),
                pessoas,
                p -> List.of(p.nome(), p.cidade())
        );

        assertTrue(csv.contains("\"Empresa; Filial\""));
    }

    @Test
    void deveGerarCsvVazioApenasComCabecalhoQuandoNaoHaDados() {
        String csv = CsvUtil.gerarCsv(List.of("Nome", "Cidade"), List.of(), p -> List.of());

        String[] linhas = csv.strip().split("\n");
        assertEquals(1, linhas.length);
        assertTrue(linhas[0].contains("Nome;Cidade"));
    }

    @Test
    void deveTratarValorNuloComoVazio() {
        List<Pessoa> pessoas = List.of(new Pessoa(null, "Curitiba"));

        String csv = CsvUtil.gerarCsv(
                List.of("Nome", "Cidade"),
                pessoas,
                p -> java.util.Arrays.asList(p.nome(), p.cidade())
        );

        assertTrue(csv.contains(";Curitiba"));
    }
}
