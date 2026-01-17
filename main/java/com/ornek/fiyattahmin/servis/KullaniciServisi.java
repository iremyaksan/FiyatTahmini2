package com.ornek.fiyattahmin.servis;

import com.ornek.fiyattahmin.varlik.Kullanici;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class KullaniciServisi {

    private final KullaniciDeposu kullaniciDeposu;
    private final PasswordEncoder passwordEncoder;

    public KullaniciServisi(KullaniciDeposu kullaniciDeposu, PasswordEncoder passwordEncoder) {
        this.kullaniciDeposu = kullaniciDeposu;
        this.passwordEncoder = passwordEncoder;
    }

    public void yeniKullaniciKaydet(Kullanici kullanici) {
        kullanici.setSifre(passwordEncoder.encode(kullanici.getSifre()));
        kullanici.setRol("USER");
        kullaniciDeposu.save(kullanici);
    }

    public Kullanici kullaniciBul(String kullaniciAdi) {
        return kullaniciDeposu.findByKullaniciAdi(kullaniciAdi).orElse(null);
    }
}