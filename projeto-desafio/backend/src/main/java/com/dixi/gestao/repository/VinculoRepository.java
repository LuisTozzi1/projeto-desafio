package com.dixi.gestao.repository;

import com.dixi.gestao.model.Vinculo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VinculoRepository extends JpaRepository<Vinculo, String> {

    boolean existsByEmpresaAndMatricula(String empresa, String matricula);

    boolean existsByEmpresaAndMatriculaAndIdNot(String empresa, String matricula, String id);
}
