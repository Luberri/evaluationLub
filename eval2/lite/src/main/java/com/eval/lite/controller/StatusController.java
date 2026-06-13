package com.eval.lite.controller;

import com.eval.lite.model.Status;
import com.eval.lite.service.StatusService;
import com.eval.lite.exception.StatusNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/status")
public class StatusController {

    @Autowired
    private StatusService statusService;

    @GetMapping
    public List<Status> getAllStatus() {
        return statusService.getAllStatus();
    }

    @GetMapping("/{id}")
    public Status getStatusById(@PathVariable Long id) {
        return statusService.getStatusById(id)
                .orElseThrow(() -> new StatusNotFoundException(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Status createStatus(@RequestBody Status status) {
        return statusService.createStatus(status);
    }

    @PutMapping("/{id}")
    public Status updateStatus(
            @PathVariable Long id,
            @RequestBody Status status
    ) {
        return statusService.updateStatus(id, status)
                .orElseThrow(() -> new StatusNotFoundException(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStatus(@PathVariable Long id) {

        boolean deleted = statusService.deleteStatus(id);

        if (!deleted) {
            throw new StatusNotFoundException(id);
        }

        return ResponseEntity.noContent().build();
    }
}