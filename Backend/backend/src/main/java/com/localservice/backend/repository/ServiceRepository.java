package com.localservice.backend.repository;

import com.localservice.backend.entity.Service;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Service, Integer> {

    // Find all services offered by a particular provider
    @EntityGraph(attributePaths = {"provider"})
    List<Service> findByProviderUserId(Integer providerId);

    // Find active services with provider details
    @EntityGraph(attributePaths = {"provider"})
    List<Service> findByActiveTrue();

    // Find services by category
    @EntityGraph(attributePaths = {"provider"})
    List<Service> findByCategoryIgnoreCase(String category);

    // Find active services by category with provider details
    @EntityGraph(attributePaths = {"provider"})
    List<Service> findByCategoryIgnoreCaseAndActiveTrue(String category);

    // Search services by name with provider details
    @EntityGraph(attributePaths = {"provider"})
    List<Service> findByServiceNameContainingIgnoreCase(String serviceName);
}