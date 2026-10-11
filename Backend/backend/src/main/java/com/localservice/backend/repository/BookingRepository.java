package com.localservice.backend.repository;

import com.localservice.backend.entity.Booking;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @EntityGraph(attributePaths = {
            "customer",
            "service",
            "service.provider"
    })
    List<Booking> findAll();

    @EntityGraph(attributePaths = {
            "customer",
            "service",
            "service.provider"
    })
    List<Booking> findByCustomerUserId(Integer customerId);

    @EntityGraph(attributePaths = {
            "customer",
            "service",
            "service.provider"
    })
    List<Booking> findByServiceProviderUserId(Integer providerId);

    @EntityGraph(attributePaths = {
            "customer",
            "service",
            "service.provider"
    })
    List<Booking> findByStatus(String status);
}