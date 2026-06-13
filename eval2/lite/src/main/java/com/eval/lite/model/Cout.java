package com.eval.lite.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cout")
public class Cout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_ticket_glip", nullable = false)
    private Long idTicket;

    @Column(name = "cout_super", nullable = false)
    private Long coutSuper;

    @Column(name = "item_type")
    private String itemType;

    
    @Column(name = "groupe")
    private Long groupe;

    public Cout() {
    }

    public Cout(Long idTicket, Long coutSuper, String itemType, Long groupe) {
        this.idTicket = idTicket;
        this.coutSuper = coutSuper;
        this.itemType = itemType;
        this.groupe = groupe;
    }

    public Long getId() {
        return id;
    }

    public Long getIdTicket() {
        return idTicket;
    }

    public void setIdTicket(Long idTicket) {
        this.idTicket = idTicket;
    }

    public Long getCoutSuper() {
        return coutSuper;
    }

    public void setCoutSuper(Long coutSuper) {
        this.coutSuper = coutSuper;
    }
    
    public Long getGroupe() {
        return groupe;
    }

    public void setGroupe(Long coutSuper) {
        this.groupe = coutSuper;
    }


    public String getItemType() {
        return itemType;
    }

    public void setItemType(String itemType) {
        this.itemType = itemType;
    }
}