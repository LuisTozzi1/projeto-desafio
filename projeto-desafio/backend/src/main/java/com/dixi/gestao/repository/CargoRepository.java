package com.dixi.gestao.repository;

import com.dixi.gestao.model.Cargo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CargoRepository extends JpaRepository<Cargo, String> {

    boolean existsByCodigo(String codigo);

    boolean existsByCodigoAndIdNot(String codigo, String id);

    @Query("""
            SELECT c FROM Cargo c
            WHERE (:codigo IS NULL OR LOWER(c.codigo) LIKE LOWER(CONCAT('%', :codigo, '%')))
            AND (:descricao IS NULL OR LOWER(c.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')))
            """)
    Page<Cargo> buscarComFiltros(@Param("codigo") String codigo,
                                  @Param("descricao") String descricao,
                                  Pageable pageable);

    @Query("""
            SELECT c FROM Cargo c
            WHERE (:codigo IS NULL OR LOWER(c.codigo) LIKE LOWER(CONCAT('%', :codigo, '%')))
            AND (:descricao IS NULL OR LOWER(c.descricao) LIKE LOWER(CONCAT('%', :descricao, '%')))
            ORDER BY c.descricao
            """)
    List<Cargo> buscarComFiltrosParaRelatorio(@Param("codigo") String codigo,
                                               @Param("descricao") String descricao);
}
