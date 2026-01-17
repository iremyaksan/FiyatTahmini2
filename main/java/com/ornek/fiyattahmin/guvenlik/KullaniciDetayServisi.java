package com.ornek.fiyattahmin.guvenlik;

import com.ornek.fiyattahmin.varlik.Kullanici;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class KullaniciDetayServisi implements UserDetailsService {

    private final KullaniciDeposu kullaniciDeposu;

    public KullaniciDetayServisi(KullaniciDeposu kullaniciDeposu) {
        this.kullaniciDeposu = kullaniciDeposu;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // AJAN LOGLARI (Hata takibi için bıraktım)
        System.out.println("--------------------------------------------------");
        System.out.println("GİRİŞ DENEMESİ YAPILIYOR: " + username);
        
        Kullanici kullanici = kullaniciDeposu.findByKullaniciAdi(username)
                .orElseThrow(() -> {
                    System.out.println("HATA: Kullanıcı veritabanında bulunamadı!");
                    return new UsernameNotFoundException("Kullanıcı yok: " + username);
                });

        System.out.println("BAŞARILI: Kullanıcı bulundu -> " + kullanici.getKullaniciAdi());
        System.out.println("ROLÜ: " + kullanici.getRol()); 
        System.out.println("--------------------------------------------------");

        return User.builder()
                .username(kullanici.getKullaniciAdi())
                .password(kullanici.getSifre())
                .authorities(kullanici.getRol()) 
                .build();
    }
}