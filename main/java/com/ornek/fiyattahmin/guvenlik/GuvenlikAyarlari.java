package com.ornek.fiyattahmin.guvenlik;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import java.util.List;
import java.util.Set;

@Configuration
@EnableWebSecurity
public class GuvenlikAyarlari {

    private final KullaniciDetayServisi kullaniciDetayServisi;

    public GuvenlikAyarlari(KullaniciDetayServisi kullaniciDetayServisi) {
        this.kullaniciDetayServisi = kullaniciDetayServisi;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(request -> {
                CorsConfiguration cfg = new CorsConfiguration();
                cfg.setAllowedOrigins(List.of("*")); 
                cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
                cfg.setAllowedHeaders(List.of("*"));
                return cfg;
            }))
            .authorizeHttpRequests(auth -> auth
            	    .requestMatchers("/css/**", "/js/**", "/images/**", "/lib/**").permitAll()
            	    .requestMatchers("/giris", "/kayit", "/api/auth/**", "/api/analiz/**", "/api/ilanlar/**").permitAll()   
            	    .requestMatchers("/api/admin/**").permitAll()      
            	    .requestMatchers("/api/mesajlar/**").permitAll()
            	    .anyRequest().authenticated()
            	)
            .userDetailsService(kullaniciDetayServisi)
            .formLogin(form -> form
                .loginPage("/giris")
                .successHandler((request, response, authentication) -> {
                    Set<String> roller = AuthorityUtils.authorityListToSet(authentication.getAuthorities());
                    if (roller.contains("ADMIN")) {
                        response.sendRedirect("/admin");
                    } else {
                        response.sendRedirect("/");
                    }
                })
                .permitAll()
            )
            .logout(logout -> logout.logoutSuccessUrl("/giris?cikis").permitAll());
        
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}