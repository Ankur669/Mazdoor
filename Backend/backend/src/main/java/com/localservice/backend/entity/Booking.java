package com.localservice.backend.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bookingId;

    // Customer who made the booking
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    // Provider who will perform the service
    @ManyToOne
    @JoinColumn(name = "provider_id", nullable = false)
    private User provider;

    // Service being booked
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private Service service;

    // Booking date and time
    @Column(name = "booking_date", nullable = false)
    private LocalDateTime bookingDate;

    @Column(name = "booking_time", nullable = false)
    private LocalTime bookingTime;

    // Customer address
    @Column(length = 500)
    private String address;

    // Total price
    @Column(name = "total_price", precision = 10, scale = 2)
    private BigDecimal totalPrice;

    // Booking status
    @Column(nullable = false, length = 30)
    private String status = "PENDING";

    // Additional notes
    @Column(length = 500)
    private String notes;

    // Booking creation time
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;


    // =========================
    // Constructor
    // =========================

    public Booking() {
    }


    // =========================
    // Getters and Setters
    // =========================

    public Integer getBookingId() {
        return bookingId;
    }

    public void setBookingId(Integer bookingId) {
        this.bookingId = bookingId;
    }


    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }


    public User getProvider() {
        return provider;
    }

    public void setProvider(User provider) {
        this.provider = provider;
    }


    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }


    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }


    public LocalTime getBookingTime() {
        return bookingTime;
    }

    public void setBookingTime(LocalTime bookingTime) {
        this.bookingTime = bookingTime;
    }


    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }


    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }


    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }


    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}