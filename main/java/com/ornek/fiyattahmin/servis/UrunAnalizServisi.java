package com.ornek.fiyattahmin.servis;

import org.springframework.stereotype.Service;


@Service
public class UrunAnalizServisi {

    private final GeminiServisi geminiServisi;
    
    public UrunAnalizServisi(GeminiServisi geminiServisi) {
        this.geminiServisi = geminiServisi;
    }

    public String analizYap(String kategori, String marka, String model, int yil, String durum, String hasar, String aciklama) {
        
        String analizSonucu = geminiServisi.fiyatTahminEt(kategori, marka, model, yil, durum, hasar, aciklama);
  
        return analizSonucu;
    }
}