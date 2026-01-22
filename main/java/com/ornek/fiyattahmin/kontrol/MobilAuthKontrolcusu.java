package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.varlik.Kullanici;
import com.ornek.fiyattahmin.servis.KullaniciServisi;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class MobilAuthKontrolcusu {

    private final KullaniciServisi kullaniciServisi;
    private final PasswordEncoder passwordEncoder;

    public MobilAuthKontrolcusu(KullaniciServisi kullaniciServisi, PasswordEncoder passwordEncoder) {
        this.kullaniciServisi = kullaniciServisi;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String kullaniciAdi = request.get("kullaniciAdi");
            String email = request.get("email");
            String sifre = request.get("sifre");

            Kullanici kullanici = new Kullanici();
            kullanici.setKullaniciAdi(kullaniciAdi);
            kullanici.setEmail(email);
            kullanici.setSifre(sifre);
            kullanici.setAdSoyad(kullaniciAdi); // Ad soyad olarak kullanıcı adını kullan

            kullaniciServisi.yeniKullaniciKaydet(kullanici);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Kayıt başarılı");
            response.put("kullaniciAdi", kullaniciAdi);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Kayıt başarısız: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String kullaniciAdi = request.get("kullaniciAdi");
            String sifre = request.get("sifre");

            Kullanici kullanici = kullaniciServisi.kullaniciBul(kullaniciAdi);

            if (kullanici != null && passwordEncoder.matches(sifre, kullanici.getSifre())) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "Giriş başarılı");
                response.put("kullaniciAdi", kullanici.getKullaniciAdi());
                response.put("rol", kullanici.getRol());
                response.put("userId", kullanici.getId()); // ID eklendi

                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Kullanıcı adı veya şifre hatalı");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Giriş başarısız: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
