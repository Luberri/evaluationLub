package com.eval.lite.model;
import jakarta.persistence.*;

@Entity
@Table(name = "status")
public class Status {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "id_glip", nullable = false)
    private Long idGlpi;

    @Column(name = "nom_malgache", nullable = false)
    private String nomMalgache;

    @Column(nullable = true)
    private String couleur;

    public Status() {
    }

    public Status(Long idGlpi, String nomMalgache, String couleur) {
        this.idGlpi = idGlpi;
        this.nomMalgache = nomMalgache;
        this.couleur = couleur;
    }

    public Long getId() {
        return id;
    }

    public Long getIdGlpi() {
        return idGlpi;
    }

    public void setIdGlpi(Long idGlpi) {
        this.idGlpi = idGlpi;
    }

    public String getNomMalgache() {
        return nomMalgache;
    }
    public void setNomMalgache(String nomMalgache) {
        this.nomMalgache = nomMalgache;
    }

    public String getCouleur() {
        return couleur;
    }

    public void setCouleur(String couleur) {
        this.couleur = couleur;
    }
}