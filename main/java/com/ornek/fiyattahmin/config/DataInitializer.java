package com.ornek.fiyattahmin.config;

import com.ornek.fiyattahmin.varlik.Kullanici;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(KullaniciDeposu kullaniciDeposu, PasswordEncoder passwordEncoder) {
        return args -> {
            // Admin kullanıcı yoksa oluştur
            if (kullaniciDeposu.findByKullaniciAdi("admin").isEmpty()) {
                Kullanici admin = new Kullanici();
                admin.setAdSoyad("Admin User");
                admin.setKullaniciAdi("admin");
                admin.setEmail("admin@fiyattahmin.com");
                admin.setSifre(passwordEncoder.encode("admin123"));
                admin.setRol("ADMIN");
                kullaniciDeposu.save(admin);
                System.out.println("✅ Admin kullanıcı oluşturuldu: admin / admin123");
            } else {
                System.out.println("ℹ️ Admin kullanıcı zaten mevcut");
            }
        };
    }
}
