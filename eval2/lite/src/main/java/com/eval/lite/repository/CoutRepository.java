package com.eval.lite.repository;

import com.eval.lite.model.Cout;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CoutRepository extends JpaRepository<Cout, Long> {
    @Query(value = "select * from cout where id_ticket_glip=:ticketId and groupe=(select MAX(groupe) from cout where id_ticket_glip=:ticketId) and motif='cout'",nativeQuery = true)
    public List<Cout> lastCouts(@Param("ticketId") Long ticketId);

    @Query(value = "select * from cout where id_ticket_glip=:ticketId and groupe=(select MIN(groupe) from cout where id_ticket_glip=:ticketId) and motif='cout'",nativeQuery = true)
    public List<Cout> firstCouts(@Param("ticketId") Long ticketId);

    @Query(value = "select * from cout where item_type=?1",nativeQuery = true)
    public List<Cout> detail(@Param("item") String item);

    @Query(value = "select * from cout where id_ticket_glip=:ticketId and motif='cout'", nativeQuery = true)
    public List<Cout> allCoutsByTicket(@Param("ticketId") Long ticketId);


    @Query(value = "select * from cout where id_ticket_glip=:ticketId and groupe=(select MAX(groupe) from cout where id_ticket_glip=:ticketId and id <:id) and motif='cout'",nativeQuery = true)
    public List<Cout> lastCoutsModif(@Param("ticketId") Long ticketId,@Param("id") Long id);

    @Query(value = "select * from cout where id_ticket_glip=:ticketId and groupe=(select MIN(groupe) from cout where id_ticket_glip=:ticketId and id <:id) and motif='cout'",nativeQuery = true)
    public List<Cout> firstCoutsModif(@Param("ticketId") Long ticketId,@Param("id") Long id);

    @Query(value = "select * from cout where id_ticket_glip=:ticketId and motif='cout' and id <:id", nativeQuery = true)
    public List<Cout> allCoutsByTicketModif(@Param("ticketId") Long ticketId,@Param("id") Long id);
}