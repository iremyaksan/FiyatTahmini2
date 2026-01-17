package com.ornek.fiyattahmin.veritabani;

import com.ornek.fiyattahmin.varlik.Ilan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IlanDeposu extends JpaRepository<Ilan, Long> {
    
    List<Ilan> findAllByOrderByIdDesc();

  
    List<Ilan> findByBaslikContainingIgnoreCaseOrAciklamaContainingIgnoreCase(String baslik, String aciklama);
    List<Ilan> findByKategori(String kategori);
}