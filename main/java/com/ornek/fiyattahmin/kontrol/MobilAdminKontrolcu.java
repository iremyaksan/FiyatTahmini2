package com.ornek.fiyattahmin.kontrol;

import org.springframework.http.ResponseEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.ornek.fiyattahmin.varlik.Kullanici;
import com.ornek.fiyattahmin.varlik.Ilan;
import com.ornek.fiyattahmin.veritabani.IlanDeposu;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class MobilAdminKontrolcu {

    @Autowired
    private KullaniciDeposu kullaniciDeposu;

    @Autowired
    private IlanDeposu ilanDeposu;

    // --- İSTATİSTİK ---
    @GetMapping("/ozet")
    public ResponseEntity<?> getPanelOzet() {
        Map<String, Object> ozet = new HashMap<>();
        ozet.put("toplamUye", kullaniciDeposu.count());
        ozet.put("aktifIlanlar", ilanDeposu.count());
        return ResponseEntity.ok(ozet);
    }

    // --- KULLANICI YÖNETİMİ ---
    @GetMapping("/kullanicilar")
    public ResponseEntity<?> getKullanicilar() {
        return ResponseEntity.ok(kullaniciDeposu.findAll());
    }

    @DeleteMapping("/kullanici-sil/{id}")
    public ResponseEntity<?> kullaniciSil(@PathVariable Long id) {
        try {
            kullaniciDeposu.deleteById(id);
            return ResponseEntity.ok(Map.of("mesaj", "Kullanıcı ve ilanları silindi"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Hata: " + e.getMessage());
        }
    }

    // --- İLAN YÖNETİMİ (YENİ EKLENENLER) ---
    @GetMapping("/ilanlar")
    public ResponseEntity<?> getTumIlanlar() {
        return ResponseEntity.ok(ilanDeposu.findAll());
    }

    @DeleteMapping("/ilan-sil/{id}")
    public ResponseEntity<?> ilanSil(@PathVariable Long id) {
        try {
            ilanDeposu.deleteById(id);
            return ResponseEntity.ok(Map.of("mesaj", "İlan başarıyla kaldırıldı"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Hata: " + e.getMessage());
        }
    }
}