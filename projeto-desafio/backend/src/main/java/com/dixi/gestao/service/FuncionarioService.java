package com.dixi.gestao.service;

import com.dixi.gestao.dto.*;
import com.dixi.gestao.model.Cargo;
import com.dixi.gestao.model.Departamento;
import com.dixi.gestao.model.Funcionario;
import com.dixi.gestao.model.Vinculo;
import com.dixi.gestao.exception.BusinessException;
import com.dixi.gestao.exception.ResourceNotFoundException;
import com.dixi.gestao.repository.CargoRepository;
import com.dixi.gestao.repository.DepartamentoRepository;
import com.dixi.gestao.repository.FuncionarioRepository;
import com.dixi.gestao.repository.VinculoRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FuncionarioService {

    private static final Logger log = LoggerFactory.getLogger(FuncionarioService.class);

    private final FuncionarioRepository funcionarioRepository;
    private final VinculoRepository vinculoRepository;
    private final CargoRepository cargoRepository;
    private final DepartamentoRepository departamentoRepository;

    @Transactional(readOnly = true)
    public Page<FuncionarioListagemDTO> listar(String nome, String cpf, String matricula, String empresa,
                                                String cargoId, String departamentoId, Pageable pageable) {
        return funcionarioRepository
                .buscarComFiltros(vazioParaNull(nome), vazioParaNull(cpf), vazioParaNull(matricula),
                        vazioParaNull(empresa), vazioParaNull(cargoId), vazioParaNull(departamentoId), pageable)
                .map(FuncionarioListagemDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public FuncionarioResponseDTO buscarPorId(String id) {
        return FuncionarioResponseDTO.fromEntity(buscarEntidadePorId(id));
    }

    @Transactional
    public FuncionarioResponseDTO criar(FuncionarioRequestDTO dto) {
        if (funcionarioRepository.existsByCpf(dto.cpf())) {
            log.warn("Tentativa de criar funcionario com CPF duplicado");
            throw new BusinessException("Ja existe um funcionario cadastrado com o CPF informado");
        }

        Funcionario funcionario = new Funcionario();
        funcionario.setNome(dto.nome());
        funcionario.setCpf(dto.cpf());

        for (VinculoRequestDTO vinculoDto : dto.vinculos()) {
            validarMatriculaDuplicada(vinculoDto.empresa(), vinculoDto.matricula(), null);

            Vinculo vinculo = montarVinculo(new Vinculo(), vinculoDto);
            funcionario.adicionarVinculo(vinculo);
        }

        Funcionario salvo = funcionarioRepository.save(funcionario);
        log.info("Funcionario criado: id={} vinculos={}", salvo.getId(), salvo.getVinculos().size());

        return FuncionarioResponseDTO.fromEntity(salvo);
    }

    @Transactional
    public FuncionarioResponseDTO editar(String id, FuncionarioRequestDTO dto) {
        Funcionario funcionario = buscarEntidadePorId(id);

        if (funcionarioRepository.existsByCpfAndIdNot(dto.cpf(), id)) {
            throw new BusinessException("Ja existe outro funcionario cadastrado com o CPF informado");
        }

        funcionario.setNome(dto.nome());
        funcionario.setCpf(dto.cpf());

        Map<String, Vinculo> vinculosExistentesPorId = funcionario.getVinculos().stream()
                .collect(Collectors.toMap(Vinculo::getId, v -> v));

        for (VinculoRequestDTO vinculoDto : dto.vinculos()) {
            if (vinculoDto.id() != null) {
                // Edicao de vinculo existente
                Vinculo vinculoExistente = vinculosExistentesPorId.get(vinculoDto.id());
                if (vinculoExistente == null) {
                    throw new ResourceNotFoundException(
                            "Vinculo nao encontrado (id: " + vinculoDto.id() + ") para este funcionario");
                }

                validarMatriculaDuplicada(vinculoDto.empresa(), vinculoDto.matricula(), vinculoExistente.getId());
                montarVinculo(vinculoExistente, vinculoDto);
            } else {
                // Novo vinculo
                validarMatriculaDuplicada(vinculoDto.empresa(), vinculoDto.matricula(), null);
                Vinculo novoVinculo = montarVinculo(new Vinculo(), vinculoDto);
                funcionario.adicionarVinculo(novoVinculo);
            }
        }

        return FuncionarioResponseDTO.fromEntity(funcionarioRepository.save(funcionario));
    }

    @Transactional(readOnly = true)
    public byte[] gerarRelatorioCsv(String nome, String cpf, String matricula, String empresa,
                                     String cargoId, String departamentoId) {
        List<Funcionario> funcionarios = funcionarioRepository.buscarComFiltrosParaRelatorio(
                vazioParaNull(nome), vazioParaNull(cpf), vazioParaNull(matricula),
                vazioParaNull(empresa), vazioParaNull(cargoId), vazioParaNull(departamentoId));

        // uma linha por vinculo (nome, cpf, empresa, matricula, cargo, departamento)
        record LinhaRelatorio(String nome, String cpf, String empresa, String matricula,
                               String cargo, String departamento) {}

        List<LinhaRelatorio> linhas = funcionarios.stream()
                .flatMap(f -> {
                    if (f.getVinculos().isEmpty()) {
                        return java.util.stream.Stream.of(new LinhaRelatorio(f.getNome(), f.getCpf(), "", "", "", ""));
                    }
                    return f.getVinculos().stream().map(v -> new LinhaRelatorio(
                            f.getNome(), f.getCpf(), v.getEmpresa(), v.getMatricula(),
                            v.getCargo().getDescricao(), v.getDepartamento().getDescricao()));
                })
                .toList();

        String csv = CsvUtil.gerarCsv(
                List.of("Nome", "CPF", "Empresa", "Matricula", "Cargo", "Departamento"),
                linhas,
                l -> List.of(l.nome(), l.cpf(), l.empresa(), l.matricula(), l.cargo(), l.departamento())
        );

        return csv.getBytes(java.nio.charset.StandardCharsets.UTF_8);
    }

    private Vinculo montarVinculo(Vinculo vinculo, VinculoRequestDTO dto) {
        Cargo cargo = cargoRepository.findById(dto.cargoId())
                .orElseThrow(() -> new ResourceNotFoundException("Cargo nao encontrado com o id: " + dto.cargoId()));

        Departamento departamento = departamentoRepository.findById(dto.departamentoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Departamento nao encontrado com o id: " + dto.departamentoId()));

        vinculo.setEmpresa(dto.empresa());
        vinculo.setMatricula(dto.matricula());
        vinculo.setCargo(cargo);
        vinculo.setDepartamento(departamento);

        return vinculo;
    }

    private void validarMatriculaDuplicada(String empresa, String matricula, String idVinculoAtual) {
        boolean duplicada = (idVinculoAtual == null)
                ? vinculoRepository.existsByEmpresaAndMatricula(empresa, matricula)
                : vinculoRepository.existsByEmpresaAndMatriculaAndIdNot(empresa, matricula, idVinculoAtual);

        if (duplicada) {
            throw new BusinessException(
                    "Ja existe um vinculo com a matricula '" + matricula + "' para a empresa '" + empresa + "'");
        }
    }

    private Funcionario buscarEntidadePorId(String id) {
        return funcionarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Funcionario nao encontrado com o id: " + id));
    }

    private String vazioParaNull(String valor) {
        return (valor == null || valor.isBlank()) ? null : valor.trim();
    }
}
