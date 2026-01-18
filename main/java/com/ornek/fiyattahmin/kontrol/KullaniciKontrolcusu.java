package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.servis.KullaniciServisi;
import com.ornek.fiyattahmin.varlik.Kullanici;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class KullaniciKontrolcusu {

    private final KullaniciServisi kullaniciServisi;

    public KullaniciKontrolcusu(KullaniciServisi kullaniciServisi) {
        this.kullaniciServisi = kullaniciServisi;
    }

    @GetMapping("/kayit")
    public String kayitSayfasi(Model model) {
        model.addAttribute("kullanici", new Kullanici());
        return "kayit";
    }

    @PostMapping("/kayit")
    public String kayitOl(@ModelAttribute Kullanici kullanici, RedirectAttributes redirectAttributes) {
        // Debug loglama
        System.out.println("==========================================");
        System.out.println("KAYIT DENEMESI:");
        System.out.println("Kullanıcı Adı: " + kullanici.getKullaniciAdi());
        System.out.println("Ad Soyad: " + kullanici.getAdSoyad());
        System.out.println("Email: " + kullanici.getEmail());
        System.out.println("Şifre boş mu: " + (kullanici.getSifre() == null || kullanici.getSifre().isEmpty()));
        System.out.println("==========================================");

        try {
            if (kullanici.getSifre() == null || kullanici.getSifre().isEmpty()) {
                redirectAttributes.addFlashAttribute("hata", "Şifre boş olamaz!");
                return "redirect:/kayit?hata";
            }
            kullaniciServisi.yeniKullaniciKaydet(kullanici);
            System.out.println("✅ KAYIT BAŞARILI: " + kullanici.getKullaniciAdi());
            return "redirect:/giris?basarili";
        } catch (Exception e) {
            System.out.println("❌ KAYIT HATASI: " + e.getMessage());
            e.printStackTrace();
            redirectAttributes.addFlashAttribute("hata", "Kayıt sırasında hata: " + e.getMessage());
            return "redirect:/kayit?hata";
        }
    }
}