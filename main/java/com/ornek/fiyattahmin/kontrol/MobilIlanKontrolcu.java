package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.varlik.Ilan;
import com.ornek.fiyattahmin.varlik.Kullanici;
import com.ornek.fiyattahmin.veritabani.IlanDeposu;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/ilanlar")
@CrossOrigin(origins = "*")
public class MobilIlanKontrolcu {

    private final IlanDeposu ilanDeposu;
    private final KullaniciDeposu kullaniciDeposu;

    // Resimlerin kaydedileceği klasör
    public static String UPLOAD_DIRECTORY = System.getProperty("user.dir") + "/uploads/images";

    public MobilIlanKontrolcu(IlanDeposu ilanDeposu, KullaniciDeposu kullaniciDeposu) {
        this.ilanDeposu = ilanDeposu;
        this.kullaniciDeposu = kullaniciDeposu;
    }

    // Tüm İlanları Getir (İsteğe bağlı kategori filtresi)
    @GetMapping("/hepsi")
    public List<Ilan> tumIlanlariGetir(@RequestParam(required = false) String kategori) {
        if (kategori != null && !kategori.isEmpty() && !kategori.equals("Hepsi")) {
            return ilanDeposu.findByKategori(kategori);
        }
        return ilanDeposu.findAll();
    }

    // İlan Detayı
    @GetMapping("/{id}")
    public ResponseEntity<?> ilanDetay(@PathVariable Long id) {
        return ilanDeposu.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Kullanıcının Kendi İlanları
    @GetMapping("/benim/{userId}")
    public List<Ilan> benimIlanlarim(@PathVariable Long userId) {
        return ilanDeposu.findByKullaniciId(userId);
    }

    // İlan Silme
    @DeleteMapping("/sil/{id}")
    public ResponseEntity<?> ilanSil(@PathVariable Long id) {
        try {
            ilanDeposu.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "İlan başarıyla silindi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Silme hatası: " + e.getMessage()));
        }
    }

    // İlan Ekleme (Resimli)
    @PostMapping("/ekle")
    public ResponseEntity<?> ilanEkle(
            @RequestParam("baslik") String baslik,
            @RequestParam("fiyat") Double fiyat,
            @RequestParam("kategori") String kategori,
            @RequestParam("aciklama") String aciklama,
            @RequestParam("sehir") String sehir,
            @RequestParam("ilce") String ilce,
            @RequestParam("adres") String adres,
            @RequestParam("userId") Long userId,
            @RequestParam(value = "resim", required = false) MultipartFile resimDosyasi) {

        try {
            Kullanici satici = kullaniciDeposu.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

            String resimAdi = "default.jpg";
            if (resimDosyasi != null && !resimDosyasi.isEmpty()) {
                // Klasör yoksa oluştur
                Path uploadPath = Paths.get(UPLOAD_DIRECTORY);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }

                resimAdi = UUID.randomUUID() + "_" + resimDosyasi.getOriginalFilename();
                Path dosyaYolu = Paths.get(UPLOAD_DIRECTORY, resimAdi);
                Files.write(dosyaYolu, resimDosyasi.getBytes());
            }

            Ilan yeniIlan = new Ilan();
            yeniIlan.setBaslik(baslik);
            yeniIlan.setFiyat(fiyat);
            yeniIlan.setKategori(kategori);
            yeniIlan.setAciklama(aciklama);
            yeniIlan.setSehir(sehir);
            yeniIlan.setIlce(ilce);
            yeniIlan.setAdres(adres);
            yeniIlan.setResimYolu(resimAdi);
            yeniIlan.setKullanici(satici);

            ilanDeposu.save(yeniIlan);

            return ResponseEntity.ok(Map.of("success", true, "message", "İlan başarıyla eklendi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Hata: " + e.getMessage()));
        }
    }

    // İlan Güncelleme
    @PutMapping("/guncelle/{id}")
    public ResponseEntity<?> ilanGuncelle(
            @PathVariable Long id,
            @RequestParam("baslik") String baslik,
            @RequestParam("fiyat") Double fiyat,
            @RequestParam("kategori") String kategori,
            @RequestParam("aciklama") String aciklama,
            @RequestParam("sehir") String sehir,
            @RequestParam("ilce") String ilce,
            @RequestParam("adres") String adres,
            @RequestParam(value = "resim", required = false) MultipartFile yeniResim) {

        try {
            Ilan ilan = ilanDeposu.findById(id).orElseThrow(() -> new RuntimeException("İlan bulunamadı"));

            if (yeniResim != null && !yeniResim.isEmpty()) {
                String resimAdi = UUID.randomUUID() + "_" + yeniResim.getOriginalFilename();
                Path dosyaYolu = Paths.get(UPLOAD_DIRECTORY, resimAdi);
                Files.write(dosyaYolu, yeniResim.getBytes());
                ilan.setResimYolu(resimAdi);
            }

            ilan.setBaslik(baslik);
            ilan.setFiyat(fiyat);
            ilan.setKategori(kategori);
            ilan.setAciklama(aciklama);
            ilan.setSehir(sehir);
            ilan.setIlce(ilce);
            ilan.setAdres(adres);

            ilanDeposu.save(ilan);
            return ResponseEntity.ok(Map.of("success", true, "message", "İlan güncellendi"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Hata: " + e.getMessage()));
        }
    }
}