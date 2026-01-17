package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.varlik.*;
import com.ornek.fiyattahmin.veritabani.*;
import com.ornek.fiyattahmin.servis.KullaniciServisi;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Controller
public class MesajKontrolcusu {

    private final MesajDeposu mesajDeposu;
    private final IlanDeposu ilanDeposu;
    private final KullaniciServisi kullaniciServisi;
    private final KullaniciDeposu kullaniciDeposu;

    public MesajKontrolcusu(MesajDeposu mesajDeposu, IlanDeposu ilanDeposu, KullaniciServisi kullaniciServisi, KullaniciDeposu kullaniciDeposu) {
        this.mesajDeposu = mesajDeposu;
        this.ilanDeposu = ilanDeposu;
        this.kullaniciServisi = kullaniciServisi;
        this.kullaniciDeposu = kullaniciDeposu;
    }

    // WEB ÜZERİNDEN MESAJ GÖNDERME
    @PostMapping("/mesaj-gonder")
    public String mesajGonder(@RequestParam Long ilanId, @RequestParam String icerik, @RequestParam(required = false) Long aliciId, Principal principal) {
        if (principal == null) return "redirect:/giris";
        Kullanici gonderen = kullaniciServisi.kullaniciBul(principal.getName());
        Ilan ilan = ilanDeposu.findById(ilanId).orElse(null);

        if (ilan != null && gonderen != null) {
            Mesaj mesaj = new Mesaj();
            mesaj.setIcerik(icerik);
            mesaj.setTarih(LocalDateTime.now());
            mesaj.setGonderen(gonderen);
            mesaj.setIlan(ilan);
            mesaj.setAlici(aliciId != null ? kullaniciDeposu.findById(aliciId).orElse(null) : ilan.getKullanici());
            mesajDeposu.save(mesaj);
        }
        return aliciId != null ? "redirect:/mesajlarim" : "redirect:/ilan-detay?id=" + ilanId + "&mesajBasarili=true";
    }

    @GetMapping("/mesajlarim")
    public String mesajlarim(Model model, Principal principal) {
        if (principal == null) return "redirect:/giris";
        List<Mesaj> mesajlar = mesajDeposu.findByAliciKullaniciAdiOrderByTarihDesc(principal.getName());
        model.addAttribute("mesajlar", mesajlar);
        return "mesajlarim";
    }

    // MOBİL: GELEN KUTUSU LİSTELEME
    @GetMapping("/api/mesajlar/gelen-kutusu/{id}")
    @ResponseBody
    public List<Mesaj> gelenKutusuMobil(@PathVariable Long id) {
        return mesajDeposu.findByAliciIdOrderByTarihDesc(id);
    }

    // MOBİL: MESAJ GÖNDERME (API)
    @PostMapping("/api/mesajlar/gonder-mobil")
    @ResponseBody
    public ResponseEntity<?> mesajGonderMobil(@RequestBody Map<String, Object> payload) {
        try {
            Long gonderenId = Long.valueOf(payload.get("gonderenId").toString());
            Long aliciId = Long.valueOf(payload.get("aliciId").toString());
            Long ilanId = Long.valueOf(payload.get("ilanId").toString());
            String icerik = payload.get("icerik").toString();

            Mesaj mesaj = new Mesaj();
            mesaj.setIcerik(icerik);
            mesaj.setTarih(LocalDateTime.now());
            mesaj.setGonderen(kullaniciDeposu.findById(gonderenId).orElse(null));
            mesaj.setAlici(kullaniciDeposu.findById(aliciId).orElse(null));
            mesaj.setIlan(ilanDeposu.findById(ilanId).orElse(null));

            mesajDeposu.save(mesaj);
            return ResponseEntity.ok().body(Map.of("durum", "Basarili"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Hata: " + e.getMessage());
        }
    }

    @DeleteMapping("/api/mesajlar/sil/{id}")
    @ResponseBody
    public ResponseEntity<?> mesajSil(@PathVariable Long id) {
        mesajDeposu.deleteById(id);
        return ResponseEntity.ok().body(Map.of("durum", "Silindi"));
    }
}