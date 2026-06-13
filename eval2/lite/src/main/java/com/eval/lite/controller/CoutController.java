package com.eval.lite.controller;

import com.eval.lite.model.Cout;
import com.eval.lite.service.CoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/cout")
public class CoutController {
    @Autowired
    private CoutService coutService;

    @GetMapping
    public List<Cout> getAllCout() {
        return coutService.getAllCout();
    }

    @GetMapping("/{id}")
    public Cout getCoutById(@PathVariable Long id) {
        return coutService.getCoutById(id)
                .orElseThrow();
    }

    @PostMapping
    // @ResponseCout(HttpCout.CREATED)
    public Cout createCout(@RequestBody Cout Cout) {
        return coutService.createCout(Cout);
    }

    @PutMapping("/{id}")
    public Cout updateCout(
            @PathVariable Long id,
            @RequestBody Cout Cout
    ) {
        return coutService.updateCout(id, Cout)
                .orElseThrow();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCout(@PathVariable Long id) {

        boolean deleted = coutService.deleteCout(id);

        if (!deleted) {
            // throw new CoutNotFoundException(id);
        }

        return ResponseEntity.noContent().build();
    }
}