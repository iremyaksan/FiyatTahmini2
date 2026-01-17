package com.ornek.fiyattahmin.veritabani;

import com.ornek.fiyattahmin.varlik.Kullanici;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional; // BU IMPORT GERİ GELDİ

public interface KullaniciDeposu extends JpaRepository<Kullanici, Long> {
    
        Optional<Kullanici> findByKullaniciAdi(String kullaniciAdi);

    Optional<Kullanici> findByEmail(String email); 
}