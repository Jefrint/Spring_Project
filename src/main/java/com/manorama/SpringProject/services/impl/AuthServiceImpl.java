package com.manorama.SpringProject.services.impl;

import java.sql.SQLIntegrityConstraintViolationException;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.manorama.SpringProject.entities.Role;
import com.manorama.SpringProject.entities.User;
import com.manorama.SpringProject.models.UserReturn;
import com.manorama.SpringProject.payload.JWTAuthResponse;
import com.manorama.SpringProject.payload.LoginDto;
import com.manorama.SpringProject.payload.RegisterDto;
import com.manorama.SpringProject.repositories.RoleRepository;
import com.manorama.SpringProject.repositories.UserRepository;
import com.manorama.SpringProject.security.JwtTokenProvider;
import com.manorama.SpringProject.services.AuthService;
import com.manorama.SpringProject.services.OrderService;
import com.manorama.SpringProject.services.UserService;

@Service
public class AuthServiceImpl implements AuthService {

	Logger logger = LoggerFactory.getLogger(AuthService.class);
	private AuthenticationManager authenticationManager;
	private UserRepository userRepository;
	private RoleRepository roleRepository;
	private PasswordEncoder passwordEncoder;
	private JwtTokenProvider jwtTokenProvider;
	private UserService userService;

	public AuthServiceImpl(AuthenticationManager authenticationManager, UserRepository userRepository,
			RoleRepository roleRepository,

			PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, UserService userService) {
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtTokenProvider = jwtTokenProvider;
		this.userService = userService;
	}

	@Override
	public JWTAuthResponse login(LoginDto loginDto) {
		UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
				loginDto.getUsernameOrEmail(), loginDto.getPassword());

		Optional<User> user = userRepository.findByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail());
		if (user.isPresent()) {
			Authentication authentication = authenticationManager.authenticate(auth);
			String token = jwtTokenProvider.generateToken(authentication);
			SecurityContextHolder.getContext().setAuthentication(authentication);
			Long userId = user.get().getId();
			Set<Role> role = user.get().getRoles();
			return new JWTAuthResponse(token, userId, role);
		} else {
			return null;
		}
  }


	@Override
	public ResponseEntity register(RegisterDto registerDto) {
		// validate inputs
		if (registerDto.getUsername() == null || registerDto.getUsername().isEmpty()) {
			return ResponseEntity.unprocessableEntity().body("username is required");
		}
		if (registerDto.getName() == null || registerDto.getName().isEmpty()) {
			return ResponseEntity.unprocessableEntity().body("name is required");
		}
		if (registerDto.getEmail() == null || registerDto.getEmail().isEmpty()) {
			return ResponseEntity.unprocessableEntity().body("email is required");
		}

		// check duplicates
		if (userRepository.findByUsername(registerDto.getUsername()).isPresent()) {
			return ResponseEntity.status(409).body("username already exists");
		}
		if (userRepository.findByEmail(registerDto.getEmail()).isPresent()) {
			return ResponseEntity.status(409).body("email already exists");
		}

		try {
			User user = new User();
			user.setName(registerDto.getName());
			user.setUsername(registerDto.getUsername());
			user.setEmail(registerDto.getEmail());
			user.setPersonalNo(registerDto.getPersonalNo());
			user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

			Set<Role> roles = new HashSet<>();
			// Ensure default role exists; create if missing to avoid NoSuchElementException
			Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> {
				Role newRole = new Role();
				newRole.setName("ROLE_USER");
				return roleRepository.save(newRole);
			});
			roles.add(userRole);
			user.setRoles(roles);

			userRepository.save(user);
			
			return ResponseEntity.ok("User registered successfully!.");
//			return "User registered successfully!.";
		} catch(Exception se) {
			logger.error("Failed to create new user: " + se.getMessage());
			return ResponseEntity.internalServerError().body("duplicate user exists");
		}
		
	}

	@Override
	public String resetPassword(int personalNo, String newPassword) {
		User user = userRepository.findByPersonalNo(personalNo);
		String result;
		if (user != null) {
			user.setPassword(passwordEncoder.encode(newPassword));
			userRepository.save(user);
			result = "Password has been reset!";
		} else {
			result = "No such user!";
		}
		return result;

	}
}
