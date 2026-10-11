
package com.localservice.backend.repository;

import com.localservice.backend.entity.Service;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository1 extends JpaRepository<Service, Integer> {

    // Find all services offered by a particular provider
    List<Service> findByProviderUserId(Integer providerId);

    // Find active services
    List<Service> findByActiveTrue();

    // Find services by category
    List<Service> findByCategoryIgnoreCase(String category);

    // Find active services by category
    List<Service> findByCategoryIgnoreCaseAndActiveTrue(String category);

    // Search services by name
    List<Service> findByServiceNameContainingIgnoreCase(String serviceName);
}

