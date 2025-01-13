package intern.team3.obmr.security;

import intern.team3.obmr.domain.AppUsers;
import intern.team3.obmr.domain.User;
import intern.team3.obmr.repository.UserRepository;
import java.util.*;
import java.util.stream.Collectors;

import intern.team3.obmr.service.AppUsersService;
import intern.team3.obmr.service.dto.AppUsersDTO;
import org.hibernate.validator.internal.constraintvalidators.hv.EmailValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Authenticate a user from the database.
 */
@Component("userDetailsService")
public class DomainUserDetailsService implements UserDetailsService {

    private final Logger log = LoggerFactory.getLogger(DomainUserDetailsService.class);

    private final AppUsersService appUsersService;

    public DomainUserDetailsService(AppUsersService appUsersService) {
        this.appUsersService = appUsersService;
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(final String login) {
        log.debug("Authenticating {}", login);

        var user = appUsersService
            .getUserByLoginName(login);
        if(user == null){
            throw new UsernameNotFoundException("User with email " + login + " was not found in the database");
        }
        return createSpringSecurityUser(login, user);
    }

    private org.springframework.security.core.userdetails.User createSpringSecurityUser(String lowercaseLogin, AppUsersDTO user) {
        if (user.getStatus().equals("Inactive")) {
            throw new UserNotActivatedException("User " + lowercaseLogin + " was not activated");
        }
        List<GrantedAuthority> grantedAuthorities = Collections.singletonList(new SimpleGrantedAuthority("USER"));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), grantedAuthorities);
    }
}
