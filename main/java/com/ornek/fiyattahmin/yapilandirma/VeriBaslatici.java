package com.ornek.fiyattahmin.yapilandirma;

import com.ornek.fiyattahmin.varlik.Kullanici;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class VeriBaslatici {

    @Bean
    public CommandLineRunner adminOlustur(KullaniciDeposu kullaniciDeposu, PasswordEncoder passwordEncoder) {
        return args -> {
            if (kullaniciDeposu.findByKullaniciAdi("admin").isEmpty()) {
                Kullanici admin = new Kullanici();
                admin.setKullaniciAdi("admin");
                admin.setSifre(passwordEncoder.encode("123"));
                admin.setRol("ADMIN");
                admin.setAdSoyad("Sistem Yoneticisi");
                admin.setEmail("admin@example.com");

                kullaniciDeposu.save(admin);
                System.out.println("----------------------------------------------------------");
                System.out.println("ADMIN KULLANICISI OLUSTURULDU");
                System.out.println("Kullanıcı Adı: admin");
                System.out.println("Şifre        : admin123");
                System.out.println("----------------------------------------------------------");
            }
        };
    }
}
