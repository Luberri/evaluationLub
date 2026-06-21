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
    @GetMapping("/lasts/{id}")
    public List<Cout> getLasts(@PathVariable Long id) {
        return coutService.lastCouts(id);
    }
    @GetMapping("/firsts/{id}")
    public List<Cout> getFirst(@PathVariable Long id) {
        return coutService.firstCouts(id);
    }
    @GetMapping("/detail/{item}")
    public List<Cout> getDetail(@PathVariable String item) {
        return coutService.detail(item);
    }
    @GetMapping("/{id}")
    public Cout getCoutById(@PathVariable Long id) {
        return coutService.getCoutById(id)
                .orElseThrow();
    }
// Controller
@GetMapping("/all/{id}")
public List<Cout> getAllByTicket(@PathVariable Long id) {
    return coutService.allCoutsByTicket(id);
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
    @DeleteMapping
    public ResponseEntity<Void> deleteAllCout() {
        coutService.deleteAllCout();
        return ResponseEntity.noContent().build();
    }
}