
package com.localservice.backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "services")
public class Service {

    @Id
    private Integer serviceId;

    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    @Column(name = "service_name", nullable = false, length = 100)
    private String serviceName;

    @Column(length = 500)
    private String description;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(length = 100)
    private String location;

    @Column(nullable = false)
    private Boolean active = true;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // =========================
    // Constructors
    // =========================

    public Service() {
    }

    // =========================
    // Getters and Setters
    // =========================

    public Integer getServiceId() {
        return serviceId;
    }

    public void setServiceId(Integer serviceId) {
        this.serviceId = serviceId;
    }

    public User getProvider() {
        return provider;
    }

    public void setProvider(User provider) {
        this.provider = provider;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

