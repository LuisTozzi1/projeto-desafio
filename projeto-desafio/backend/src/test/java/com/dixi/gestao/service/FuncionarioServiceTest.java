package com.dixi.gestao.service;

import com.dixi.gestao.dto.FuncionarioRequestDTO;
import com.dixi.gestao.dto.FuncionarioResponseDTO;
import com.dixi.gestao.dto.VinculoRequestDTO;
import com.dixi.gestao.model.Cargo;
import com.dixi.gestao.model.Departamento;
import com.dixi.gestao.model.Funcionario;
import com.dixi.gestao.model.Vinculo;
import com.dixi.gestao.exception.BusinessException;
import com.dixi.gestao.repository.CargoRepository;
import com.dixi.gestao.repository.DepartamentoRepository;
import com.dixi.gestao.repository.FuncionarioRepository;
import com.dixi.gestao.repository.VinculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FuncionarioServiceTest {

    @Mock private FuncionarioRepository funcionarioRepository;
    @Mock private VinculoRepository vinculoRepository;
    @Mock private CargoRepository cargoRepository;
    @Mock private DepartamentoRepository departamentoRepository;

    @InjectMocks
    private FuncionarioService funcionarioService;

    private Cargo cargo;
    private Departamento departamento;
    private VinculoRequestDTO vinculoDto;
    private FuncionarioRequestDTO funcionarioDto;

    @BeforeEach
    void setUp() {
        cargo = new Cargo();
        cargo.setId("cargo-1");
        cargo.setCodigo("CG001");
        cargo.setDescricao("Programador");

        departamento = new Departamento();
        departamento.setId("dep-1");
        departamento.setCodigo("DP001");
        departamento.setDescricao("Desenvolvimento");

        vinculoDto = new VinculoRequestDTO(null, "Dixi Ponto", "MAT001", "cargo-1", "dep-1");
        funcionarioDto = new FuncionarioRequestDTO("João da Silva", "12345678900", List.of(vinculoDto));
    }

    @Test
    void deveCriarFuncionarioComVinculoValido() {
        when(funcionarioRepository.existsByCpf("12345678900")).thenReturn(false);
        when(vinculoRepository.existsByEmpresaAndMatricula("Dixi Ponto", "MAT001")).thenReturn(false);
        when(cargoRepository.findById("cargo-1")).thenReturn(Optional.of(cargo));
        when(departamentoRepository.findById("dep-1")).thenReturn(Optional.of(departamento));
        when(funcionarioRepository.save(any(Funcionario.class))).thenAnswer(inv -> {
            Funcionario f = inv.getArgument(0);
            f.setId("func-1");
            return f;
        });

        FuncionarioResponseDTO resultado = funcionarioService.criar(funcionarioDto);

        assertNotNull(resultado);
        assertEquals("João da Silva", resultado.nome());
        assertEquals(1, resultado.vinculos().size());
        assertEquals("Dixi Ponto", resultado.vinculos().get(0).empresa());
        verify(funcionarioRepository).save(any(Funcionario.class));
    }

    @Test
    void deveLancarExcecaoAoCriarFuncionarioComCpfDuplicado() {
        when(funcionarioRepository.existsByCpf("12345678900")).thenReturn(true);

        BusinessException excecao = assertThrows(BusinessException.class,
                () -> funcionarioService.criar(funcionarioDto));

        assertTrue(excecao.getMessage().toLowerCase().contains("cpf"));
        verify(funcionarioRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoAoCriarFuncionarioComMatriculaDuplicadaNaMesmaEmpresa() {
        when(funcionarioRepository.existsByCpf("12345678900")).thenReturn(false);
        when(vinculoRepository.existsByEmpresaAndMatricula("Dixi Ponto", "MAT001")).thenReturn(true);

        BusinessException excecao = assertThrows(BusinessException.class,
                () -> funcionarioService.criar(funcionarioDto));

        assertTrue(excecao.getMessage().toLowerCase().contains("matricula"));
        verify(funcionarioRepository, never()).save(any());
    }

    @Test
    void deveEditarVinculoExistenteComSucesso() {
        Funcionario funcionarioExistente = new Funcionario();
        funcionarioExistente.setId("func-1");
        funcionarioExistente.setNome("João da Silva");
        funcionarioExistente.setCpf("12345678900");

        Vinculo vinculoExistente = new Vinculo();
        vinculoExistente.setId("vinculo-1");
        vinculoExistente.setEmpresa("Dixi Ponto");
        vinculoExistente.setMatricula("MAT001");
        vinculoExistente.setCargo(cargo);
        vinculoExistente.setDepartamento(departamento);
        funcionarioExistente.adicionarVinculo(vinculoExistente);

        VinculoRequestDTO vinculoEditadoDto = new VinculoRequestDTO(
                "vinculo-1", "Dixi Ponto", "MAT002", "cargo-1", "dep-1");
        FuncionarioRequestDTO dtoEdicao = new FuncionarioRequestDTO(
                "João da Silva Editado", "12345678900", List.of(vinculoEditadoDto));

        when(funcionarioRepository.findById("func-1")).thenReturn(Optional.of(funcionarioExistente));
        when(funcionarioRepository.existsByCpfAndIdNot("12345678900", "func-1")).thenReturn(false);
        when(vinculoRepository.existsByEmpresaAndMatriculaAndIdNot("Dixi Ponto", "MAT002", "vinculo-1"))
                .thenReturn(false);
        when(cargoRepository.findById("cargo-1")).thenReturn(Optional.of(cargo));
        when(departamentoRepository.findById("dep-1")).thenReturn(Optional.of(departamento));
        when(funcionarioRepository.save(any(Funcionario.class))).thenReturn(funcionarioExistente);

        FuncionarioResponseDTO resultado = funcionarioService.editar("func-1", dtoEdicao);

        assertEquals("João da Silva Editado", resultado.nome());
        assertEquals("MAT002", resultado.vinculos().get(0).matricula());
    }

    @Test
    void deveAplicarFiltrosAoListarFuncionarios() {
        Pageable pageable = org.springframework.data.domain.PageRequest.of(0, 10);
        when(funcionarioRepository.buscarComFiltros(
                eq("João"), eq(null), eq(null), eq(null), eq("cargo-1"), eq(null), eq(pageable)))
                .thenReturn(new PageImpl<>(List.of()));

        Page<?> resultado = funcionarioService.listar("João", null, null, null, "cargo-1", null, pageable);

        assertNotNull(resultado);
        verify(funcionarioRepository).buscarComFiltros(
                eq("João"), eq(null), eq(null), eq(null), eq("cargo-1"), eq(null), eq(pageable));
    }

    @Test
    void deveGerarRelatorioCsvComUmaLinhaPorVinculo() {
        Funcionario funcionario = new Funcionario();
        funcionario.setId("func-1");
        funcionario.setNome("João da Silva");
        funcionario.setCpf("12345678900");

        Vinculo vinculo = new Vinculo();
        vinculo.setId("vinculo-1");
        vinculo.setEmpresa("Dixi Ponto");
        vinculo.setMatricula("MAT001");
        vinculo.setCargo(cargo);
        vinculo.setDepartamento(departamento);
        funcionario.adicionarVinculo(vinculo);

        when(funcionarioRepository.buscarComFiltrosParaRelatorio(null, null, null, null, null, null))
                .thenReturn(List.of(funcionario));

        byte[] csv = funcionarioService.gerarRelatorioCsv(null, null, null, null, null, null);
        String conteudo = new String(csv, java.nio.charset.StandardCharsets.UTF_8);

        assertTrue(conteudo.contains("Nome;CPF;Empresa;Matricula;Cargo;Departamento"));
        assertTrue(conteudo.contains("João da Silva;12345678900;Dixi Ponto;MAT001;Programador;Desenvolvimento"));
    }
}
