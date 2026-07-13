package com.dixi.gestao.service;

import com.dixi.gestao.dto.CargoRequestDTO;
import com.dixi.gestao.dto.CargoResponseDTO;
import com.dixi.gestao.model.Cargo;
import com.dixi.gestao.exception.BusinessException;
import com.dixi.gestao.exception.ResourceNotFoundException;
import com.dixi.gestao.repository.CargoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CargoServiceTest {

    @Mock
    private CargoRepository cargoRepository;

    @InjectMocks
    private CargoService cargoService;

    private CargoRequestDTO dtoValido;

    @BeforeEach
    void setUp() {
        dtoValido = new CargoRequestDTO("CG001", "Programador");
    }

    @Test
    void deveCriarCargoQuandoCodigoNaoEstaDuplicado() {
        when(cargoRepository.existsByCodigo("CG001")).thenReturn(false);
        when(cargoRepository.save(any(Cargo.class))).thenAnswer(invocation -> {
            Cargo c = invocation.getArgument(0);
            c.setId("id-gerado");
            c.setCriadoEm(LocalDateTime.now());
            c.setAtualizadoEm(LocalDateTime.now());
            return c;
        });

        CargoResponseDTO resultado = cargoService.criar(dtoValido);

        assertNotNull(resultado);
        assertEquals("CG001", resultado.codigo());
        assertEquals("Programador", resultado.descricao());
        verify(cargoRepository).save(any(Cargo.class));
    }

    @Test
    void deveLancarExcecaoAoCriarCargoComCodigoDuplicado() {
        when(cargoRepository.existsByCodigo("CG001")).thenReturn(true);

        BusinessException excecao = assertThrows(BusinessException.class,
                () -> cargoService.criar(dtoValido));

        assertTrue(excecao.getMessage().contains("CG001"));
        verify(cargoRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoAoEditarCargoParaCodigoJaUsadoPorOutroCargo() {
        Cargo existente = new Cargo();
        existente.setId("id-1");
        existente.setCodigo("CG999");
        existente.setDescricao("Antigo");

        when(cargoRepository.findById("id-1")).thenReturn(Optional.of(existente));
        when(cargoRepository.existsByCodigoAndIdNot("CG001", "id-1")).thenReturn(true);

        assertThrows(BusinessException.class, () -> cargoService.editar("id-1", dtoValido));
        verify(cargoRepository, never()).save(any());
    }

    @Test
    void deveLancarExcecaoAoBuscarCargoInexistente() {
        when(cargoRepository.findById("id-inexistente")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> cargoService.buscarPorId("id-inexistente"));
    }

    @Test
    void deveEditarCargoComSucessoQuandoCodigoNaoEstaDuplicado() {
        Cargo existente = new Cargo();
        existente.setId("id-1");
        existente.setCodigo("CG999");
        existente.setDescricao("Antigo");

        when(cargoRepository.findById("id-1")).thenReturn(Optional.of(existente));
        when(cargoRepository.existsByCodigoAndIdNot("CG001", "id-1")).thenReturn(false);
        when(cargoRepository.save(any(Cargo.class))).thenReturn(existente);

        CargoResponseDTO resultado = cargoService.editar("id-1", dtoValido);

        assertEquals("CG001", resultado.codigo());
        assertEquals("Programador", resultado.descricao());
    }

    @Test
    void deveGerarRelatorioCsvComOsCargosFiltrados() {
        Cargo cargo = new Cargo();
        cargo.setCodigo("CG001");
        cargo.setDescricao("Programador");

        when(cargoRepository.buscarComFiltrosParaRelatorio(null, null)).thenReturn(java.util.List.of(cargo));

        byte[] csv = cargoService.gerarRelatorioCsv(null, null);
        String conteudo = new String(csv, java.nio.charset.StandardCharsets.UTF_8);

        assertTrue(conteudo.contains("Codigo;Descricao"));
        assertTrue(conteudo.contains("CG001;Programador"));
    }
}
