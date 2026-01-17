package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.varlik.Ilan;
import com.ornek.fiyattahmin.veritabani.IlanDeposu;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.security.Principal;
import java.util.List;

@Controller
public class AnaSayfaKontrolcusu {

    private final IlanDeposu ilanDeposu;

    public AnaSayfaKontrolcusu(IlanDeposu ilanDeposu) {
        this.ilanDeposu = ilanDeposu;
    }

    @GetMapping("/") 
    public String anaSayfa(Model model, 
                           Principal principal, 
                           @RequestParam(required = false) String arama,
                           @RequestParam(required = false) String kategori) {

        List<Ilan> ilanlar;

        if (arama != null && !arama.isEmpty()) {
            ilanlar = ilanDeposu.findByBaslikContainingIgnoreCaseOrAciklamaContainingIgnoreCase(arama, arama);
        } else if (kategori != null && !kategori.isEmpty()) {
            ilanlar = ilanDeposu.findByKategori(kategori);
        } else {
            ilanlar = ilanDeposu.findAllByOrderByIdDesc();
        }

        model.addAttribute("ilanlar", ilanlar);
        model.addAttribute("aktifKullanici", (principal != null) ? principal.getName() : "Misafir");

        return "panel"; 
    }

    @GetMapping("/giris")
    public String girisSayfasi() { return "login"; }

    @GetMapping("/ilan-ver")
    public String ilanVerSayfasi() { return "ilan-ver"; }

    @GetMapping("/ilan-detay")
    public String ilanDetay(@RequestParam Long id, Model model, Principal principal) {
        Ilan ilan = ilanDeposu.findById(id).orElse(null);
        if (ilan == null) return "redirect:/";
        model.addAttribute("ilan", ilan);
        model.addAttribute("aktifKullanici", (principal != null) ? principal.getName() : "Misafir");
        return "ilan-detay";
    }
}