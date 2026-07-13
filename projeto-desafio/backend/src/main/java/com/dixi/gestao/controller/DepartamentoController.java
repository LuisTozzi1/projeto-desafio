package com.dixi.gestao.controller;

import com.dixi.gestao.dto.DepartamentoRequestDTO;
import com.dixi.gestao.dto.DepartamentoResponseDTO;
import com.dixi.gestao.service.DepartamentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departamentos")
@RequiredArgsConstructor
@Tag(name = "Departamentos", description = "CRUD de departamentos")
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    @GetMapping
    @Operation(summary = "Lista departamentos com filtro por codigo/descricao e paginacao")
    public ResponseEntity<Page<DepartamentoResponseDTO>> listar(
            @RequestParam(required = false) String codigo,
            @RequestParam(required = false) String descricao,
            Pageable pageable) {
        return ResponseEntity.ok(departamentoService.listar(codigo, descricao, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulta um departamento por ID")
    public ResponseEntity<DepartamentoResponseDTO> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(departamentoService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Cria um novo departamento")
    public ResponseEntity<DepartamentoResponseDTO> criar(@Valid @RequestBody DepartamentoRequestDTO dto) {
        return ResponseEntity.ok(departamentoService.criar(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edita um departamento existente")
    public ResponseEntity<DepartamentoResponseDTO> editar(@PathVariable String id,
                                                            @Valid @RequestBody DepartamentoRequestDTO dto) {
        return ResponseEntity.ok(departamentoService.editar(id, dto));
    }

    @GetMapping("/relatorio")
    @Operation(summary = "Gera relatorio (CSV) de departamentos, respeitando os filtros aplicados")
    public ResponseEntity<byte[]> gerarRelatorio(
            @RequestParam(required = false) String codigo,
            @RequestParam(required = false) String descricao) {

        byte[] csv = departamentoService.gerarRelatorioCsv(codigo, descricao);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-departamentos.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
