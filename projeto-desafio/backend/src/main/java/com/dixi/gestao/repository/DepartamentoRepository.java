package com.dixi.gestao.repository;

import com.dixi.gestao.model.Departamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DepartamentoRepository extends JpaRepository<Departamento, String> {

    boolean existsByCodigo(String codigo);

    boolean existsByCodigoAndIdNot(String codigo, String id);

    @Query("""
            SELECT d FROM Departamento d
            WHERE (:codigo IS NULL OR LOWER(d.codigo) LIKE LOWER(CONCAT('%', :codigo, '%')))
            AND (:descricao IS NULL OR LOWER(d.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')))
            """)
    Page<Departamento> buscarComFiltros(@Param("codigo") String codigo,
                                         @Param("descricao") String descricao,
                                         Pageable pageable);

    @Query("""
            SELECT d FROM Departamento d
            WHERE (:codigo IS NULL OR LOWER(d.codigo) LIKE LOWER(CONCAT('%', :codigo, '%')))
            AND (:descricao IS NULL OR LOWER(d.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')))
            ORDER BY d.descricao
            """)
    List<Departamento> buscarComFiltrosParaRelatorio(@Param("codigo") String codigo,
                                                       @Param("descricao") String descricao);
}
