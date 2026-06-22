package com.eval.lite.service;

import com.eval.lite.model.Cout;
import com.eval.lite.repository.CoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CoutService {

    @Autowired
    private CoutRepository coutRepository;

    public List<Cout> getAllCout() {
        return coutRepository.findAll();
    }

    public Optional<Cout> getCoutById(Long id) {
        return coutRepository.findById(id);
    }

    public Cout createCout(Cout cout) {
        return coutRepository.save(cout);
    }

    public Optional<Cout> updateCout(Long id, Cout coutDetails) {
        return coutRepository.findById(id).map(cout -> {
            cout.setIdTicket(coutDetails.getIdTicket());
            cout.setCoutSuper(coutDetails.getCoutSuper());
            cout.setItemType(coutDetails.getItemType());
            cout.setGroupe(coutDetails.getGroupe());
            cout.setMotif(coutDetails.getMotif());
            cout.setIdCout(coutDetails.getIdCout());
            cout.setMode(coutDetails.getMode());
            cout.setPourc(coutDetails.getPourc());
            return coutRepository.save(cout);
        });
    }

    public boolean deleteCout(Long id) {
        if (coutRepository.existsById(id)) {
            coutRepository.deleteById(id);
            return true;
        }
        return false;
    }
    public void deleteAllCout() {
        coutRepository.deleteAll();
    }
    public List<Cout> lastCouts(Long id) {
        return coutRepository.lastCouts(id);
    }
    public List<Cout> firstCouts(Long id) {
        return coutRepository.firstCouts(id);
    }
    public List<Cout> detail(String item) {
        return coutRepository.detail(item);
    }
    // Service
public List<Cout> allCoutsByTicket(Long id) {
    return coutRepository.allCoutsByTicket(id);
}

    public List<Cout> lastCoutsModif(Long id,Long idCout) {
        return coutRepository.lastCoutsModif(id,idCout);
    }
    public List<Cout> firstCoutsModif(Long id,Long idCout) {
        return coutRepository.firstCoutsModif(id,idCout);
    }

    // Service
public List<Cout> allCoutsByTicketModif(Long id,Long idCout) {
    return coutRepository.allCoutsByTicketModif(id,idCout);
}
}