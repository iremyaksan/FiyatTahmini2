package com.ornek.fiyattahmin.servis;

import com.ornek.fiyattahmin.varlik.Kullanici;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class KullaniciServisi {

    private final KullaniciDeposu kullaniciDeposu;
    private final PasswordEncoder passwordEncoder;
    private final MailServisi mailServisi;

    public KullaniciServisi(KullaniciDeposu kullaniciDeposu, PasswordEncoder passwordEncoder, MailServisi mailServisi) {
        this.kullaniciDeposu = kullaniciDeposu;
        this.passwordEncoder = passwordEncoder;
        this.mailServisi = mailServisi;
    }

    public void yeniKullaniciKaydet(Kullanici kullanici) {
        kullanici.setSifre(passwordEncoder.encode(kullanici.getSifre()));
        kullanici.setRol("USER");
        kullaniciDeposu.save(kullanici);

        // Kayıt onay maili gönder
        try {
            mailServisi.kayitOnayMailiGonder(kullanici.getEmail(), kullanici.getAdSoyad());
            System.out.println("✅ Hoş geldin maili gönderildi: " + kullanici.getEmail());
        } catch (Exception e) {
            System.out.println("⚠️ Mail gönderilemedi ama kayıt başarılı: " + e.getMessage());
        }
    }

    public Kullanici kullaniciBul(String kullaniciAdi) {
        return kullaniciDeposu.findByKullaniciAdi(kullaniciAdi).orElse(null);
    }
}