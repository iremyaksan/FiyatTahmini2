package com.ornek.fiyattahmin.veritabani;

import com.ornek.fiyattahmin.varlik.Ilan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IlanDeposu extends JpaRepository<Ilan, Long> {

    // Tüm ilanları ters sırada (en yeni en üstte) getir
    List<Ilan> findAllByOrderByIdDesc();

    // Arama fonksiyonu
    List<Ilan> findByBaslikContainingIgnoreCaseOrAciklamaContainingIgnoreCase(String baslik, String aciklama);

    // Kategoriye göre filtreleme
    List<Ilan> findByKategori(String kategori);

    // Kullanıcıya ait ilanları getir
    List<Ilan> findByKullaniciId(Long kullaniciId);
}