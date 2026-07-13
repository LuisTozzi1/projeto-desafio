package com.dixi.gestao.service;

import com.dixi.gestao.dto.CargoRequestDTO;
import com.dixi.gestao.dto.CargoResponseDTO;
import com.dixi.gestao.model.Cargo;
import com.dixi.gestao.exception.BusinessException;
import com.dixi.gestao.exception.ResourceNotFoundException;
import com.dixi.gestao.repository.CargoRepository;
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
public class CargoService {

    private static final Logger log = LoggerFactory.getLogger(CargoService.class);

    private final CargoRepository cargoRepository;

    @Transactional(readOnly = true)
    public Page<CargoResponseDTO> listar(String codigo, String descricao, Pageable pageable) {
        return cargoRepository
                .buscarComFiltros(vazioParaNull(codigo), vazioParaNull(descricao), pageable)
                .map(CargoResponseDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public CargoResponseDTO buscarPorId(String id) {
        return CargoResponseDTO.fromEntity(buscarEntidadePorId(id));
    }

    @Transactional
    public CargoResponseDTO criar(CargoRequestDTO dto) {
        if (cargoRepository.existsByCodigo(dto.codigo())) {
            log.warn("Tentativa de criar cargo com codigo duplicado: {}", dto.codigo());
            throw new BusinessException("Ja existe um cargo cadastrado com o codigo '" + dto.codigo() + "'");
        }

        Cargo cargo = new Cargo();
        cargo.setCodigo(dto.codigo());
        cargo.setDescricao(dto.descricao());

        Cargo salvo = cargoRepository.save(cargo);
        log.info("Cargo criado: id={} codigo={}", salvo.getId(), salvo.getCodigo());

        return CargoResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public CargoResponseDTO editar(String id, CargoRequestDTO dto) {
        Cargo cargo = buscarEntidadePorId(id);

        if (cargoRepository.existsByCodigoAndIdNot(dto.codigo(), id)) {
            log.warn("Tentativa de editar cargo {} para codigo duplicado: {}", id, dto.codigo());
            throw new BusinessException("Ja existe um cargo cadastrado com o codigo '" + dto.codigo() + "'");
        }

        cargo.setCodigo(dto.codigo());
        cargo.setDescricao(dto.descricao());

        Cargo salvo = cargoRepository.save(cargo);
        log.info("Cargo editado: id={} codigo={}", salvo.getId(), salvo.getCodigo());

        return CargoResponseDTO.fromEntity(salvo);
    }

    @Transactional(readOnly = true)
    public byte[] gerarRelatorioCsv(String codigo, String descricao) {
        List<Cargo> cargos = cargoRepository.buscarComFiltrosParaRelatorio(vazioParaNull(codigo), vazioParaNull(descricao));

        String csv = CsvUtil.gerarCsv(
                List.of("Codigo", "Descricao"),
                cargos,
                c -> List.of(c.getCodigo(), c.getDescricao())
        );

        return csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private Cargo buscarEntidadePorId(String id) {
        return cargoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cargo nao encontrado com o id: " + id));
    }

    private String vazioParaNull(String valor) {
        return (valor == null || valor.isBlank()) ? null : valor.trim();
    }
}
