package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.veritabani.IlanDeposu;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu;
import com.ornek.fiyattahmin.veritabani.MesajDeposu;
import com.ornek.fiyattahmin.varlik.Kullanici;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class MobilAdminKontrolcusu {

    private final KullaniciDeposu kullaniciDeposu;
    private final IlanDeposu ilanDeposu;
    private final MesajDeposu mesajDeposu;

    public MobilAdminKontrolcusu(KullaniciDeposu kullaniciDeposu, IlanDeposu ilanDeposu, MesajDeposu mesajDeposu) {
        this.kullaniciDeposu = kullaniciDeposu;
        this.ilanDeposu = ilanDeposu;
        this.mesajDeposu = mesajDeposu;
    }

    // Panel Özeti (İstatistikler)
    @GetMapping("/istatistikler")
    public ResponseEntity<?> getIstatistikler() {
        try {
            Map<String, Long> stats = new HashMap<>();
            stats.put("kullaniciSayisi", kullaniciDeposu.count());
            stats.put("ilanSayisi", ilanDeposu.count());
            stats.put("mesajSayisi", mesajDeposu.count());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Kullanıcı Listesi
    @GetMapping("/kullanicilar")
    public ResponseEntity<?> getKullanicilar() {
        return ResponseEntity.ok(kullaniciDeposu.findAll());
    }

    // Kullanıcı Silme
    @DeleteMapping("/kullanici-sil/{id}")
    public ResponseEntity<?> kullaniciSil(@PathVariable Long id) {
        try {
            kullaniciDeposu.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Kullanıcı başarıyla silindi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Silme hatası: " + e.getMessage()));
        }
    }

    // İlan Listesi
    @GetMapping("/ilanlar")
    public ResponseEntity<?> getIlanlar() {
        return ResponseEntity.ok(ilanDeposu.findAll());
    }

    // İlan Silme
    @DeleteMapping("/ilan-sil/{id}")
    public ResponseEntity<?> ilanSil(@PathVariable Long id) {
        try {
            ilanDeposu.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "İlan başarıyla silindi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Silme hatası: " + e.getMessage()));
        }
    }
}
