package com.eval.lite.repository;

import com.eval.lite.model.Cout;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CoutRepository extends JpaRepository<Cout, Long> {
    @Query(value = "select * from cout where id_ticket_glip=:ticketId and groupe=(select MAX(groupe) from cout where id_ticket_glip=:ticketId)",nativeQuery = true)
    public List<Cout> lastCouts(@Param("ticketId") Long ticketId);
}
