package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.varlik.Ilan;
import com.ornek.fiyattahmin.varlik.Kullanici;
import com.ornek.fiyattahmin.veritabani.IlanDeposu;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Controller
public class IlanKontrolcusu {

    private final IlanDeposu ilanDeposu;
    private final KullaniciDeposu kullaniciDeposu;
    
    // Resimlerin kaydedileceği klasör
    public static String UPLOAD_DIRECTORY = System.getProperty("user.dir") + "/src/main/resources/static/images";

    public IlanKontrolcusu(IlanDeposu ilanDeposu, KullaniciDeposu kullaniciDeposu) {
        this.ilanDeposu = ilanDeposu;
        this.kullaniciDeposu = kullaniciDeposu;
    }

    // --- İLAN KAYDETME (YENİ İLAN) ---
    @PostMapping("/ilan-kaydet")
    public String ilanKaydet(
            @RequestParam("baslik") String baslik,
            @RequestParam("fiyat") Double fiyat,
            @RequestParam("kategori") String kategori,
            @RequestParam("aciklama") String aciklama,
            
            // YENİ EKLENEN KONUM PARAMETRELERİ
            @RequestParam("sehir") String sehir,
            @RequestParam("ilce") String ilce,
            @RequestParam("adres") String adres,

            @RequestParam("resim") MultipartFile resimDosyasi,
            Authentication authentication
    ) throws IOException {

        String kullaniciAdi = authentication.getName();
        Kullanici satici = kullaniciDeposu.findByKullaniciAdi(kullaniciAdi).orElseThrow();

        // Resim Kaydetme İşlemleri
        String resimAdi = "default.jpg"; 
        if (resimDosyasi != null && !resimDosyasi.isEmpty()) {
            resimAdi = UUID.randomUUID() + "_" + resimDosyasi.getOriginalFilename();
            Path dosyaYolu = Paths.get(UPLOAD_DIRECTORY, resimAdi);
            Files.write(dosyaYolu, resimDosyasi.getBytes());
        }

        // Yeni İlan Nesnesi Oluşturma
        Ilan yeniIlan = new Ilan();
        yeniIlan.setBaslik(baslik);
        yeniIlan.setFiyat(fiyat);
        yeniIlan.setKategori(kategori);
        yeniIlan.setAciklama(aciklama);
        
        // KONUM BİLGİLERİNİ SET ETME (Burayı unutmuştuk, şimdi ekledik!)
        yeniIlan.setSehir(sehir);
        yeniIlan.setIlce(ilce);
        yeniIlan.setAdres(adres);
        
        yeniIlan.setResimYolu(resimAdi);
        yeniIlan.setKullanici(satici);

        ilanDeposu.save(yeniIlan);
        return "redirect:/?ilanBasarili";
    }

    // --- İLAN SİLME ---
    @GetMapping("/ilan-sil")
    public String ilanSil(@RequestParam Long id, Authentication authentication) {
        Ilan ilan = ilanDeposu.findById(id).orElseThrow();
        if (ilan.getKullanici().getKullaniciAdi().equals(authentication.getName())) {
            ilanDeposu.delete(ilan);
        }
        return "redirect:/?silindi";
    }

    // --- İLAN DÜZENLEME SAYFASI ---
    @GetMapping("/ilan-duzenle")
    public String ilanDuzenleSayfasi(@RequestParam Long id, Model model, Authentication authentication) {
        Ilan ilan = ilanDeposu.findById(id).orElseThrow();
        // Başkasının ilanını düzenlemeye çalışırsa engelle
        if (!ilan.getKullanici().getKullaniciAdi().equals(authentication.getName())) {
            return "redirect:/?hata";
        }
        model.addAttribute("ilan", ilan);
        return "ilan-duzenle"; 
    }

    // --- İLAN GÜNCELLEME (MEVCUT İLANI DEĞİŞTİRME) ---
    @PostMapping("/ilan-guncelle")
    public String ilanGuncelle(
            @RequestParam Long id,
            @RequestParam String baslik,
            @RequestParam Double fiyat,
            @RequestParam String aciklama,
            @RequestParam String kategori,
            
            // GÜNCELLEME İÇİN DE BU PARAMETRELERİ EKLEDİK
            @RequestParam String sehir,
            @RequestParam String ilce,
            @RequestParam String adres,

            @RequestParam(value = "resim", required = false) MultipartFile yeniResim
    ) throws IOException {
        
        Ilan ilan = ilanDeposu.findById(id).orElseThrow();
        
        // Eğer yeni resim yüklendiyse onu kaydet
        if (yeniResim != null && !yeniResim.isEmpty()) {
            String resimAdi = UUID.randomUUID() + "_" + yeniResim.getOriginalFilename();
            Path dosyaYolu = Paths.get(UPLOAD_DIRECTORY, resimAdi);
            Files.write(dosyaYolu, yeniResim.getBytes());
            ilan.setResimYolu(resimAdi); 
        }

        // Bilgileri Güncelle
        ilan.setBaslik(baslik);
        ilan.setFiyat(fiyat);
        ilan.setAciklama(aciklama);
        ilan.setKategori(kategori);
        
        // KONUM BİLGİLERİNİ GÜNCELLE
        ilan.setSehir(sehir);
        ilan.setIlce(ilce);
        ilan.setAdres(adres);
        
        ilanDeposu.save(ilan);
        return "redirect:/?guncellendi";
    }
}