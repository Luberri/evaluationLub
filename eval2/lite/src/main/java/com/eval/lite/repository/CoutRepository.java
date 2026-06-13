package com.eval.lite.repository;

import com.eval.lite.model.Cout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CoutRepository extends JpaRepository<Cout, Long> {
}
