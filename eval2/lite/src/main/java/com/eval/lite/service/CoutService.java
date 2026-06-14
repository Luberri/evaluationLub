package com.eval.lite.service;

import com.eval.lite.model.Cout;
import com.eval.lite.repository.CoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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
    public List<Cout> lastCouts(Long id) {
        return coutRepository.lastCouts(id);
    }
}