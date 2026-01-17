package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.dto.GirisIstegi;
import com.ornek.fiyattahmin.guvenlik.JwtAraclari;
import com.ornek.fiyattahmin.varlik.Kullanici;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthKontrolcu {

    private final KullaniciDeposu kullaniciDeposu;
    private final PasswordEncoder passwordEncoder;
    private final JwtAraclari jwtAraclari;

    public AuthKontrolcu(KullaniciDeposu kullaniciDeposu, PasswordEncoder passwordEncoder, JwtAraclari jwtAraclari) {
        this.kullaniciDeposu = kullaniciDeposu;
        this.passwordEncoder = passwordEncoder;
        this.jwtAraclari = jwtAraclari;
    }

    // WEB VE MOBİL LOGİN (Ortak Kullanılabilir)
    @PostMapping("/mobil-login")
    public ResponseEntity<?> mobilLogin(@RequestBody GirisIstegi istek) {
        Kullanici kullanici = kullaniciDeposu.findByKullaniciAdi(istek.getKullaniciAdi())
                .orElse(null);

        if (kullanici != null && passwordEncoder.matches(istek.getSifre(), kullanici.getSifre())) {
            return ResponseEntity.ok(Map.of(
                "id", kullanici.getId(),
                "kullaniciAdi", kullanici.getKullaniciAdi(),
                "rol", kullanici.getRol()
            ));
        } else {
            return ResponseEntity.status(401).body(Map.of("hata", "Geçersiz kullanıcı adı veya şifre!"));
        }
    }

    // MOBİL KAYIT - DÜZELTİLDİ!
    @PostMapping("/mobil-kayit") // Sadece /mobil-kayit yazıyoruz çünkü /api/auth üstte var
    public ResponseEntity<?> mobilKayit(@RequestBody Kullanici yeniKullanici) {
        try {
            // KRİTİK: Şifreyi şifreleyerek kaydetmelisin!
            String sifrelenmişSifre = passwordEncoder.encode(yeniKullanici.getSifre());
            yeniKullanici.setSifre(sifrelenmişSifre);
            
            yeniKullanici.setRol("USER"); 
            kullaniciDeposu.save(yeniKullanici);
            
            System.out.println("MOBİL KAYIT BAŞARILI: " + yeniKullanici.getKullaniciAdi());
            return ResponseEntity.ok(Map.of("mesaj", "Kayıt başarılı"));
        } catch (Exception e) {
            System.out.println("KAYIT HATASI: " + e.getMessage());
            return ResponseEntity.status(500).body("Hata: " + e.getMessage());
        }
    }
}