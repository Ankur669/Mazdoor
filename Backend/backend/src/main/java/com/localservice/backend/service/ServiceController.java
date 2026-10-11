
package com.localservice.backend.service;

import com.localservice.backend.entity.Service;
import com.localservice.backend.service.dto.ServiceRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    private final ServiceService serviceService;

    public ServiceController(ServiceService serviceService) {
        this.serviceService = serviceService;
    }

    // =========================
    // CREATE SERVICE
    // =========================
    @PostMapping("/provider/{providerId}")
    public ResponseEntity<Service> createService(
            @PathVariable Integer providerId,
            @Valid @RequestBody ServiceRequest request) {

        Service service = serviceService.createService(
                providerId,
                request
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service);
    }

    // =========================
    // GET ALL ACTIVE SERVICES
    // =========================
    @GetMapping
    public ResponseEntity<List<Service>> getAllServices() {

        return ResponseEntity.ok(
                serviceService.getAllActiveServices()
        );
    }

    // =========================
    // GET SERVICES BY PROVIDER
    // =========================
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Service>> getByProvider(
            @PathVariable Integer providerId) {

        return ResponseEntity.ok(
                serviceService.getServicesByProvider(providerId)
        );
    }

    // =========================
    // GET SERVICES BY CATEGORY
    // =========================
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Service>> getByCategory(
            @PathVariable String category) {

        return ResponseEntity.ok(
                serviceService.getServicesByCategory(category)
        );
    }

    // =========================
    // SEARCH SERVICES
    // =========================
    @GetMapping("/search")
    public ResponseEntity<List<Service>> search(
            @RequestParam String name) {

        return ResponseEntity.ok(
                serviceService.searchServices(name)
        );
    }
}

