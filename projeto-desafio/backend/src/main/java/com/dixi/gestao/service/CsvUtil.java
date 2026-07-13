package com.dixi.gestao.service;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

// gera CSV sem depender de lib externa
public final class CsvUtil {

    private CsvUtil() {}

    public static <T> String gerarCsv(List<String> cabecalho, List<T> dados, Function<T, List<String>> extrator) {
        StringBuilder sb = new StringBuilder();

        // BOM para o Excel abrir acentuacao corretamente
        sb.append('\uFEFF');
        sb.append(String.join(";", cabecalho)).append("\n");

        for (T item : dados) {
            List<String> linha = extrator.apply(item).stream()
                    .map(CsvUtil::escapar)
                    .collect(Collectors.toList());
            sb.append(String.join(";", linha)).append("\n");
        }

        return sb.toString();
    }

    private static String escapar(String valor) {
        if (valor == null) {
            return "";
        }
        String v = valor.replace("\"", "\"\"");
        if (v.contains(";") || v.contains("\"") || v.contains("\n")) {
            return "\"" + v + "\"";
        }
        return v;
    }
}
