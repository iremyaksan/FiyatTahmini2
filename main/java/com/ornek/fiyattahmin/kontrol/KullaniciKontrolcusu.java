package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.servis.KullaniciServisi;
import com.ornek.fiyattahmin.varlik.Kullanici;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class KullaniciKontrolcusu {

    private final KullaniciServisi kullaniciServisi;

    public KullaniciKontrolcusu(KullaniciServisi kullaniciServisi) {
        this.kullaniciServisi = kullaniciServisi;
    }

    @GetMapping("/kayit")
    public String kayitSayfasi() {
        return "kayit"; 
    }

    @PostMapping("/kayit")
    public String kayitOl(@ModelAttribute Kullanici kullanici) {
        kullaniciServisi.yeniKullaniciKaydet(kullanici);
        return "redirect:/giris?basarili"; 
    }
}