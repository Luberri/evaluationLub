package com.eval.lite.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cout")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Cout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_ticket_glip", nullable = false)
    private Long idTicket;

    @Column(name = "cout_super", nullable = false)
    private Double coutSuper;

    @Column(name = "item_type")
    private String itemType;

    @Column(name = "groupe")
    private Long groupe;
    
    @Column(name = "motif")
    private String motif;

    @Column(name = "id_cout")
    private Long idCout;
    
    @Column(name = "mode")
    private Long mode;
    
    @Column(name = "pourc")
    private Double pourc;
}