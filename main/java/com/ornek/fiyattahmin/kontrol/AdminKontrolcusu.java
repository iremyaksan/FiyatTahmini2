package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.veritabani.IlanDeposu;
import com.ornek.fiyattahmin.veritabani.KullaniciDeposu;
import com.ornek.fiyattahmin.veritabani.MesajDeposu;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class AdminKontrolcusu {

    private final KullaniciDeposu kullaniciDeposu;
    private final IlanDeposu ilanDeposu;
    private final MesajDeposu mesajDeposu;

    public AdminKontrolcusu(KullaniciDeposu kullaniciDeposu, IlanDeposu ilanDeposu, MesajDeposu mesajDeposu) {
        this.kullaniciDeposu = kullaniciDeposu;
        this.ilanDeposu = ilanDeposu;
        this.mesajDeposu = mesajDeposu;
    }

    @GetMapping("/admin")
    public String adminPaneliniAc(Model model) {
        model.addAttribute("kullaniciSayisi", kullaniciDeposu.count());
        model.addAttribute("ilanSayisi", ilanDeposu.count());
        model.addAttribute("mesajSayisi", mesajDeposu.count());
        return "admin-panel";
    }

    @GetMapping("/admin/kullanicilar")
    public String kullanicilariListele(Model model) {
        model.addAttribute("kullanicilar", kullaniciDeposu.findAll());
        return "admin-kullanicilar";
    }

    @GetMapping("/admin/kullanici-sil/{id}")
    public String kullaniciSil(@PathVariable Long id) {
        kullaniciDeposu.deleteById(id);
        return "redirect:/admin/kullanicilar";
    }


    @GetMapping("/admin/ilanlar")
    public String ilanlariListele(Model model) {
        model.addAttribute("ilanlar", ilanDeposu.findAll());
        return "admin-ilanlar"; 
    }

    @GetMapping("/admin/ilan-sil/{id}")
    public String ilanSil(@PathVariable Long id) {
        ilanDeposu.deleteById(id);
        return "redirect:/admin/ilanlar";
    }
}