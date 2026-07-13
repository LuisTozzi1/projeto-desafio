package com.dixi.gestao.service;

import com.dixi.gestao.dto.DepartamentoRequestDTO;
import com.dixi.gestao.dto.DepartamentoResponseDTO;
import com.dixi.gestao.model.Departamento;
import com.dixi.gestao.exception.BusinessException;
import com.dixi.gestao.exception.ResourceNotFoundException;
import com.dixi.gestao.repository.DepartamentoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DepartamentoServiceTest {

    @Mock
    private DepartamentoRepository departamentoRepository;

    @InjectMocks
    private DepartamentoService departamentoService;

    private DepartamentoRequestDTO dtoValido;

    @BeforeEach
    void setUp() {
        dtoValido = new DepartamentoRequestDTO("DP001", "Desenvolvimento");
    }

    @Test
    void deveCriarDepartamentoQuandoCodigoNaoEstaDuplicado() {
        when(departamentoRepository.existsByCodigo("DP001")).thenReturn(false);
        when(departamentoRepository.save(any(Departamento.class))).thenAnswer(invocation -> {
            Departamento d = invocation.getArgument(0);
            d.setId("id-gerado");
            return d;
        });

        DepartamentoResponseDTO resultado = departamentoService.criar(dtoValido);

        assertNotNull(resultado);
        assertEquals("DP001", resultado.codigo());
        assertEquals("Desenvolvimento", resultado.descricao());
        verify(departamentoRepository).save(any(Departamento.class));
    }

    @Test
    void deveLancarExcecaoAoCriarDepartamentoComCodigoDuplicado() {
        when(departamentoRepository.existsByCodigo("DP001")).thenReturn(true);

        BusinessException excecao = assertThrows(BusinessException.class,
                () -> departamentoService.criar(dtoValido));

        assertTrue(excecao.getMessage().contains("DP001"));
        verify(departamentoRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoAoEditarDepartamentoParaCodigoJaUsadoPorOutro() {
        Departamento existente = new Departamento();
        existente.setId("id-1");
        existente.setCodigo("DP999");
        existente.setDescricao("Antigo");

        when(departamentoRepository.findById("id-1")).thenReturn(Optional.of(existente));
        when(departamentoRepository.existsByCodigoAndIdNot("DP001", "id-1")).thenReturn(true);

        assertThrows(BusinessException.class, () -> departamentoService.editar("id-1", dtoValido));
        verify(departamentoRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoAoBuscarDepartamentoInexistente() {
        when(departamentoRepository.findById("id-inexistente")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> departamentoService.buscarPorId("id-inexistente"));
    }

    @Test
    void deveEditarDepartamentoComSucessoQuandoCodigoNaoEstaDuplicado() {
        Departamento existente = new Departamento();
        existente.setId("id-1");
        existente.setCodigo("DP999");
        existente.setDescricao("Antigo");

        when(departamentoRepository.findById("id-1")).thenReturn(Optional.of(existente));
        when(departamentoRepository.existsByCodigoAndIdNot("DP001", "id-1")).thenReturn(false);
        when(departamentoRepository.save(any(Departamento.class))).thenReturn(existente);

        DepartamentoResponseDTO resultado = departamentoService.editar("id-1", dtoValido);

        assertEquals("DP001", resultado.codigo());
        assertEquals("Desenvolvimento", resultado.descricao());
    }

    @Test
    void deveGerarRelatorioCsvComOsDepartamentosFiltrados() {
        Departamento departamento = new Departamento();
        departamento.setCodigo("DP001");
        departamento.setDescricao("Desenvolvimento");

        when(departamentoRepository.buscarComFiltrosParaRelatorio(null, null))
                .thenReturn(java.util.List.of(departamento));

        byte[] csv = departamentoService.gerarRelatorioCsv(null, null);
        String conteudo = new String(csv, java.nio.charset.StandardCharsets.UTF_8);

        assertTrue(conteudo.contains("Codigo;Descricao"));
        assertTrue(conteudo.contains("DP001;Desenvolvimento"));
    }
}
