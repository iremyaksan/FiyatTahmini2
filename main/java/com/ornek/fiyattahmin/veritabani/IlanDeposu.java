package com.ornek.fiyattahmin.veritabani;

import com.ornek.fiyattahmin.varlik.Ilan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface IlanDeposu extends JpaRepository<Ilan, Long> {
    List<Ilan> findByKategori(String kategori);

    List<Ilan> findByKullaniciId(Long kullaniciId); // Bu metod eksikti, ekledim
}