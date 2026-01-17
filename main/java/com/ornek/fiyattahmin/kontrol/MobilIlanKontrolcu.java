package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.varlik.Ilan;
import com.ornek.fiyattahmin.varlik.Kullanici;
import com.ornek.fiyattahmin.veritabani.IlanDeposu;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu; // Eklendi
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ilanlar")
@CrossOrigin(origins = "*")
public class MobilIlanKontrolcu {

    private final IlanDeposu ilanDeposu;
    private final KullaniciDeposu kullaniciDeposu;

    public MobilIlanKontrolcu(IlanDeposu ilanDeposu, KullaniciDeposu kullaniciDeposu) {
        this.ilanDeposu = ilanDeposu;
        this.kullaniciDeposu = kullaniciDeposu;
    }

    @GetMapping("/hepsi")
    public List<Ilan> tumIlanlariGetir() {
        return ilanDeposu.findAll();
    }

    @GetMapping("/sil-mobil")
    public Map<String, String> ilanSilMobil(@RequestParam Long id) {
        try {
            ilanDeposu.deleteById(id);
            return Map.of("mesaj", "İlan başarıyla silindi");
        } catch (Exception e) {
            return Map.of("hata", "Hata: " + e.getMessage());
        }
    }

    @PostMapping("/ekle")
    public Map<String, String> ilanEkleMobil(@RequestBody Ilan yeniIlan) {
        try {
            String kadi = yeniIlan.getKullanici().getKullaniciAdi();
            
            Kullanici sahibi = kullaniciDeposu.findByKullaniciAdi(kadi)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı: " + kadi));
            
            yeniIlan.setKullanici(sahibi);
            
            ilanDeposu.save(yeniIlan);
            return Map.of("mesaj", "İlan başarıyla yayınlandı!");
        } catch (Exception e) {
            return Map.of("hata", "Kayıt hatası: " + e.getMessage());
        }
    }
}