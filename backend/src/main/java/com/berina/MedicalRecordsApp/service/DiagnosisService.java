package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.Diagnosis;
import com.berina.MedicalRecordsApp.model.Notification;
import com.berina.MedicalRecordsApp.repository.DiagnosisRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DiagnosisService {

    private final DiagnosisRepository diagnosisRepository;
    private final NotificationService notificationService;

    public DiagnosisService(DiagnosisRepository diagnosisRepository, NotificationService notificationService) {
        this.diagnosisRepository = diagnosisRepository;
        this.notificationService = notificationService;
    }

    public List<Diagnosis> getAllDiagnoses() {
        return diagnosisRepository.findAll();
    }

    public Optional<Diagnosis> getDiagnosisById(Long id) {
        return diagnosisRepository.findById(id);
    }

    public List<Diagnosis> getDiagnosesByPatientId(Long patientId) {
        return diagnosisRepository.findByPatient_Id(patientId);
    }

    public List<Diagnosis> getDiagnosesByDoctorId(Long doctorId) {
        return diagnosisRepository.findByDoctor_Id(doctorId);
    }


    public Diagnosis saveDiagnosis(Diagnosis diagnosis) {
        boolean isUpdate = (diagnosis.getId() != null && diagnosisRepository.existsById(diagnosis.getId()));
        Diagnosis saved = diagnosisRepository.save(diagnosis);

        if (saved.getPatient() != null) {
            String message = isUpdate
                    ? "Diagnosis updated: " + saved.getDescription()
                    : "A new diagnosis was added: " + saved.getDescription();

            Notification notification = new Notification(
                    message,
                    LocalDateTime.now(),
                    false,
                    saved.getPatient()
            );
            notificationService.saveNotification(notification);
        }

        return saved;
    }


    public void deleteDiagnosis(Long id) {
        Optional<Diagnosis> existing = diagnosisRepository.findById(id);
        if (existing.isPresent()) {
            Diagnosis diagnosis = existing.get();

            if (diagnosis.getPatient() != null) {
                Notification notification = new Notification(
                        "Diagnosis removed: " + diagnosis.getDescription(),
                        LocalDateTime.now(),
                        false,
                        diagnosis.getPatient()
                );
                notificationService.saveNotification(notification);
            }

            diagnosisRepository.deleteById(id);
        }
    }
}
