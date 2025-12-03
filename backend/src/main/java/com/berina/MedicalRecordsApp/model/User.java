package com.berina.MedicalRecordsApp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;

    private String profilePic;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role; // DOCTOR, PATIENT, ADMIN

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Appointment> patientAppointments = new HashSet<>();

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Appointment> doctorAppointments = new HashSet<>();

    public User() {}

    public User(String name, String email, String password, Role role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public Set<Appointment> getPatientAppointments() { return patientAppointments; }
    public void setPatientAppointments(Set<Appointment> patientAppointments) { this.patientAppointments = patientAppointments; }

    public Set<Appointment> getDoctorAppointments() { return doctorAppointments; }
    public void setDoctorAppointments(Set<Appointment> doctorAppointments) { this.doctorAppointments = doctorAppointments; }


    public String getProfilePic() {
        return profilePic;
    }

    public void setProfilePic(String profilePic) {
        this.profilePic = profilePic;
    }
}
