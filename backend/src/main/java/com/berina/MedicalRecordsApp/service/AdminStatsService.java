package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.repository.AppointmentRepository;
import com.berina.MedicalRecordsApp.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminStatsService {

    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    public AdminStatsService(UserRepository userRepository,
                             AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public Map<String, Object> getDashboardStats() {

        Map<String, Object> stats = new HashMap<>();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime last30Days = now.minusDays(30);


        long newUsersLast30Days =
                userRepository.countByCreatedAtAfter(last30Days);

        long appointmentsLast30Days =
                appointmentRepository.countByDateAfter(last30Days);

        LocalDateTime startThisMonth = now.withDayOfMonth(1);
        LocalDateTime startLastMonth = startThisMonth.minusMonths(1);

        long usersThisMonth =
                userRepository.countByCreatedAtBetween(startThisMonth, now);

        long usersLastMonth =
                userRepository.countByCreatedAtBetween(startLastMonth, startThisMonth);

        double growth = 0;
        if (usersLastMonth > 0) {
            growth = ((double) (usersThisMonth - usersLastMonth) / usersLastMonth) * 100;
        }

        stats.put("newUsersLast30Days", newUsersLast30Days);
        stats.put("appointmentsLast30Days", appointmentsLast30Days);
        stats.put("userGrowth", Math.round(growth));

        return stats;
    }
}

