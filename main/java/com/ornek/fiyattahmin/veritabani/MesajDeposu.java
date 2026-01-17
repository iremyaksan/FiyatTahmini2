package com.ornek.fiyattahmin.veritabani;

import com.ornek.fiyattahmin.varlik.Mesaj;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MesajDeposu extends JpaRepository<Mesaj, Long> {
    List<Mesaj> findByAliciKullaniciAdiOrderByTarihDesc(String aliciKullaniciAdi);
    
    List<Mesaj> findByGonderenKullaniciAdiOrderByTarihDesc(String gonderenKullaniciAdi);
    List<Mesaj> findByAliciIdOrderByTarihDesc(Long aliciId);
}
