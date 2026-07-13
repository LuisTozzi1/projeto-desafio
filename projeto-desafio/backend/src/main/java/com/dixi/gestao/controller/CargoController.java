package com.dixi.gestao.controller;

import com.dixi.gestao.dto.CargoRequestDTO;
import com.dixi.gestao.dto.CargoResponseDTO;
import com.dixi.gestao.service.CargoService;
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
@RequestMapping("/api/cargos")
@RequiredArgsConstructor
@Tag(name = "Cargos", description = "CRUD de cargos")
public class CargoController {

    private final CargoService cargoService;

    @GetMapping
    @Operation(summary = "Lista cargos com filtro por codigo/descricao e paginacao")
    public ResponseEntity<Page<CargoResponseDTO>> listar(
            @RequestParam(required = false) String codigo,
            @RequestParam(required = false) String descricao,
            Pageable pageable) {
        return ResponseEntity.ok(cargoService.listar(codigo, descricao, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulta um cargo por ID")
    public ResponseEntity<CargoResponseDTO> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(cargoService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Cria um novo cargo")
    public ResponseEntity<CargoResponseDTO> criar(@Valid @RequestBody CargoRequestDTO dto) {
        return ResponseEntity.ok(cargoService.criar(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edita um cargo existente")
    public ResponseEntity<CargoResponseDTO> editar(@PathVariable String id, @Valid @RequestBody CargoRequestDTO dto) {
        return ResponseEntity.ok(cargoService.editar(id, dto));
    }

    @GetMapping("/relatorio")
    @Operation(summary = "Gera relatorio (CSV) de cargos, respeitando os filtros aplicados")
    public ResponseEntity<byte[]> gerarRelatorio(
            @RequestParam(required = false) String codigo,
            @RequestParam(required = false) String descricao) {

        byte[] csv = cargoService.gerarRelatorioCsv(codigo, descricao);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-cargos.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
