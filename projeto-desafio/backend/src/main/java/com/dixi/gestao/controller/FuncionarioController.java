package com.dixi.gestao.controller;

import com.dixi.gestao.dto.FuncionarioListagemDTO;
import com.dixi.gestao.dto.FuncionarioRequestDTO;
import com.dixi.gestao.dto.FuncionarioResponseDTO;
import com.dixi.gestao.service.FuncionarioService;
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
@RequestMapping("/api/funcionarios")
@RequiredArgsConstructor
@Tag(name = "Funcionarios", description = "CRUD de funcionarios e seus vinculos")
public class FuncionarioController {

    private final FuncionarioService funcionarioService;

    @GetMapping
    @Operation(summary = "Lista funcionarios com filtros (nome, cpf, matricula, empresa, cargo, departamento) e paginacao")
    public ResponseEntity<Page<FuncionarioListagemDTO>> listar(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) String matricula,
            @RequestParam(required = false) String empresa,
            @RequestParam(required = false) String cargoId,
            @RequestParam(required = false) String departamentoId,
            Pageable pageable) {
        return ResponseEntity.ok(
                funcionarioService.listar(nome, cpf, matricula, empresa, cargoId, departamentoId, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consulta um funcionario por ID, incluindo seus vinculos")
    public ResponseEntity<FuncionarioResponseDTO> buscarPorId(@PathVariable String id) {
        return ResponseEntity.ok(funcionarioService.buscarPorId(id));
    }

    @PostMapping
    @Operation(summary = "Cria um novo funcionario com um ou mais vinculos")
    public ResponseEntity<FuncionarioResponseDTO> criar(@Valid @RequestBody FuncionarioRequestDTO dto) {
        return ResponseEntity.ok(funcionarioService.criar(dto));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Edita um funcionario (dados gerais e/ou vinculos)")
    public ResponseEntity<FuncionarioResponseDTO> editar(@PathVariable String id,
                                                           @Valid @RequestBody FuncionarioRequestDTO dto) {
        return ResponseEntity.ok(funcionarioService.editar(id, dto));
    }

    @GetMapping("/relatorio")
    @Operation(summary = "Gera relatorio (CSV) de funcionarios e vinculos, respeitando os filtros aplicados")
    public ResponseEntity<byte[]> gerarRelatorio(
            @RequestParam(required = false) String nome,
            @RequestParam(required = false) String cpf,
            @RequestParam(required = false) String matricula,
            @RequestParam(required = false) String empresa,
            @RequestParam(required = false) String cargoId,
            @RequestParam(required = false) String departamentoId) {

        byte[] csv = funcionarioService.gerarRelatorioCsv(nome, cpf, matricula, empresa, cargoId, departamentoId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=relatorio-funcionarios.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
