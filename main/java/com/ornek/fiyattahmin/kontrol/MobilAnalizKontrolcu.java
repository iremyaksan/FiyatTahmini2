package com.ornek.fiyattahmin.kontrol;

import com.ornek.fiyattahmin.dto.AnalizIstegi;
import com.ornek.fiyattahmin.servis.GeminiServisi;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController 
@RequestMapping("/api/analiz")
@CrossOrigin(origins = "*") 
public class MobilAnalizKontrolcu {

    private final GeminiServisi geminiServisi;

    public MobilAnalizKontrolcu(GeminiServisi geminiServisi) {
        this.geminiServisi = geminiServisi;
    }

    @PostMapping("/yap")
    public ResponseEntity<?> mobilAnalizYap(@RequestBody AnalizIstegi istek) {
        try {
            String sonuc = geminiServisi.fiyatTahminEt(
                istek.getKategori(), istek.getMarka(), istek.getModelUrun(),
                istek.getYil(), istek.getDurum(), istek.getHasarDurumu(), istek.getAciklama()
            );
            
            return ResponseEntity.ok(Map.of("sonuc", sonuc));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("hata", "Analiz sırasında hata oluştu: " + e.getMessage()));
        }
    }
}