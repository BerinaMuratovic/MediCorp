package com.berina.MedicalRecordsApp.service;

import com.berina.MedicalRecordsApp.model.User;
import com.berina.MedicalRecordsApp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User registerUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }

    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword())) {
                return user;
            }
        }
        return null;
    }


    public Optional<User> updateUser(Long id, User updates) {
        return userRepository.findById(id).map(existingUser -> {


            if (updates.getName() != null && !updates.getName().isBlank()) {
                existingUser.setName(updates.getName());
            }


            if (updates.getPassword() != null && !updates.getPassword().isBlank()) {
                existingUser.setPassword(passwordEncoder.encode(updates.getPassword()));
            }


            if (updates.getProfilePic() != null) {
                existingUser.setProfilePic(updates.getProfilePic());
            }

            return userRepository.save(existingUser);
        });
    }
}
