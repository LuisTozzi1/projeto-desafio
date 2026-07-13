package com.dixi.gestao.service;

import com.dixi.gestao.dto.DepartamentoRequestDTO;
import com.dixi.gestao.dto.DepartamentoResponseDTO;
import com.dixi.gestao.model.Departamento;
import com.dixi.gestao.exception.BusinessException;
import com.dixi.gestao.exception.ResourceNotFoundException;
import com.dixi.gestao.repository.DepartamentoRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartamentoService {

    private static final Logger log = LoggerFactory.getLogger(DepartamentoService.class);

    private final DepartamentoRepository departamentoRepository;

    @Transactional(readOnly = true)
    public Page<DepartamentoResponseDTO> listar(String codigo, String descricao, Pageable pageable) {
        return departamentoRepository
                .buscarComFiltros(vazioParaNull(codigo), vazioParaNull(descricao), pageable)
                .map(DepartamentoResponseDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public DepartamentoResponseDTO buscarPorId(String id) {
        return DepartamentoResponseDTO.fromEntity(buscarEntidadePorId(id));
    }

    @Transactional
    public DepartamentoResponseDTO criar(DepartamentoRequestDTO dto) {
        if (departamentoRepository.existsByCodigo(dto.codigo())) {
            log.warn("Tentativa de criar departamento com codigo duplicado: {}", dto.codigo());
            throw new BusinessException("Ja existe um departamento cadastrado com o codigo '" + dto.codigo() + "'");
        }

        Departamento departamento = new Departamento();
        departamento.setCodigo(dto.codigo());
        departamento.setDescricao(dto.descricao());

        Departamento salvo = departamentoRepository.save(departamento);
        log.info("Departamento criado: id={} codigo={}", salvo.getId(), salvo.getCodigo());

        return DepartamentoResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public DepartamentoResponseDTO editar(String id, DepartamentoRequestDTO dto) {
        Departamento departamento = buscarEntidadePorId(id);

        if (departamentoRepository.existsByCodigoAndIdNot(dto.codigo(), id)) {
            throw new BusinessException("Ja existe um departamento cadastrado com o codigo '" + dto.codigo() + "'");
        }

        departamento.setCodigo(dto.codigo());
        departamento.setDescricao(dto.descricao());

        return DepartamentoResponseDTO.fromEntity(departamentoRepository.save(departamento));
    }

    @Transactional(readOnly = true)
    public byte[] gerarRelatorioCsv(String codigo, String descricao) {
        List<Departamento> departamentos = departamentoRepository
                .buscarComFiltrosParaRelatorio(vazioParaNull(codigo), vazioParaNull(descricao));

        String csv = CsvUtil.gerarCsv(
                List.of("Codigo", "Descricao"),
                departamentos,
                d -> List.of(d.getCodigo(), d.getDescricao())
        );

        return csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private Departamento buscarEntidadePorId(String id) {
        return departamentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Departamento nao encontrado com o id: " + id));
    }

    private String vazioParaNull(String valor) {
        return (valor == null || valor.isBlank()) ? null : valor.trim();
    }
}
