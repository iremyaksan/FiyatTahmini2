package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.servis.GeminiServisi;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class UrunAnalizKontrolcusu {

    private final GeminiServisi geminiServisi;

    public UrunAnalizKontrolcusu(GeminiServisi geminiServisi) {
        this.geminiServisi = geminiServisi;
    }

    @GetMapping("/fiyat-hesapla")
    public String formAc() {
        return "tahmin-form"; 
    }

    @PostMapping("/analiz-yap")
    public String analizYap(@RequestParam String kategori, @RequestParam String marka, 
                            @RequestParam String modelUrun, @RequestParam int yil, 
                            @RequestParam String durum, @RequestParam String hasarDurumu, 
                            @RequestParam(required = false) String aciklama, Model model) {
        
        String sonuc = geminiServisi.fiyatTahminEt(kategori, marka, modelUrun, yil, durum, hasarDurumu, aciklama);
        
        model.addAttribute("analizSonucu", sonuc);
        model.addAttribute("kategori", kategori);
        
        return "tahmin-sonuc"; 
    }
}