package com.eval.lite.service;

import com.eval.lite.model.Status;
import com.eval.lite.repository.StatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StatusService {

    @Autowired
    private StatusRepository statusRepository;

    /**
     * Récupérer tous les statuts
     */
    public List<Status> getAllStatus() {
        return statusRepository.findAll();
    }

    /**
     * Récupérer un statut par ID
     */
    public Optional<Status> getStatusById(Long id) {
        return statusRepository.findById(id);
    }

    /**
     * Créer un nouveau statut
     */
    public Status createStatus(Status status) {
        return statusRepository.save(status);
    }

    /**
     * Mettre à jour un statut existant
     */
    public Optional<Status> updateStatus(Long id, Status statusDetails) {
        return statusRepository.findById(id).map(status -> {
            status.setIdGlpi(statusDetails.getIdGlpi());
            status.setNomMalgache(statusDetails.getNomMalgache());
            status.setCouleur(statusDetails.getCouleur());
            return statusRepository.save(status);
        });
    }

    /**
     * Supprimer un statut
     */
    public boolean deleteStatus(Long id) {
        if (statusRepository.existsById(id)) {
            statusRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
