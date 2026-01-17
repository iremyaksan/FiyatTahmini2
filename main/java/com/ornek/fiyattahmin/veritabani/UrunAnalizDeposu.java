package com.ornek.fiyattahmin.veritabani;

import org.springframework.data.jpa.repository.JpaRepository;
import com.ornek.fiyattahmin.varlik.UrunAnaliz;
import java.util.List;

public interface UrunAnalizDeposu extends JpaRepository<UrunAnaliz, Long> {

    List<UrunAnaliz> findByKullaniciId(Long kullaniciId);
    
}