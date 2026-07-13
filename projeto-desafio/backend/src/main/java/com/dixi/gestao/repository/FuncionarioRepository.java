package com.dixi.gestao.repository;

import com.dixi.gestao.model.Funcionario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FuncionarioRepository extends JpaRepository<Funcionario, String> {

    boolean existsByCpf(String cpf);

    boolean existsByCpfAndIdNot(String cpf, String id);

    // filtros opcionais: passe null para ignorar cada um
    @Query("""
            SELECT DISTINCT f FROM Funcionario f
            LEFT JOIN f.vinculos v
            WHERE (:nome IS NULL OR LOWER(f.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
            AND (:cpf IS NULL OR f.cpf = :cpf)
            AND (:matricula IS NULL OR LOWER(v.matricula) LIKE LOWER(CONCAT('%', :matricula, '%')))
            AND (:empresa IS NULL OR LOWER(v.empresa) LIKE LOWER(CONCAT('%', :empresa, '%')))
            AND (:cargoId IS NULL OR v.cargo.id = :cargoId)
            AND (:departamentoId IS NULL OR v.departamento.id = :departamentoId)
            """)
    Page<Funcionario> buscarComFiltros(@Param("nome") String nome,
                                        @Param("cpf") String cpf,
                                        @Param("matricula") String matricula,
                                        @Param("empresa") String empresa,
                                        @Param("cargoId") String cargoId,
                                        @Param("departamentoId") String departamentoId,
                                        Pageable pageable);

    @Query("""
            SELECT DISTINCT f FROM Funcionario f
            LEFT JOIN f.vinculos v
            WHERE (:nome IS NULL OR LOWER(f.nome) LIKE LOWER(CONCAT('%', :nome, '%')))
            AND (:cpf IS NULL OR f.cpf = :cpf)
            AND (:matricula IS NULL OR LOWER(v.matricula) LIKE LOWER(CONCAT('%', :matricula, '%')))
            AND (:empresa IS NULL OR LOWER(v.empresa) LIKE LOWER(CONCAT('%', :empresa, '%')))
            AND (:cargoId IS NULL OR v.cargo.id = :cargoId)
            AND (:departamentoId IS NULL OR v.departamento.id = :departamentoId)
            ORDER BY f.nome
            """)
    List<Funcionario> buscarComFiltrosParaRelatorio(@Param("nome") String nome,
                                                      @Param("cpf") String cpf,
                                                      @Param("matricula") String matricula,
                                                      @Param("empresa") String empresa,
                                                      @Param("cargoId") String cargoId,
                                                      @Param("departamentoId") String departamentoId);
}
