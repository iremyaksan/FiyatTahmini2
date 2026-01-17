package com.ornek.fiyattahmin.varlik;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "ilanlar")
public class Ilan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String baslik;
    private String aciklama;
    private String kategori;
    private Double fiyat;
    private String resimYolu;

    // --- YENİ EKLENEN KONUM BİLGİLERİ ---
    private String sehir;
    private String ilce;
    private String adres;

    @ManyToOne 
    @JoinColumn(name = "kullanici_id")
    private Kullanici kullanici;

    @OneToMany(mappedBy = "ilan", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Mesaj> mesajlar;

    // --- GETTER VE SETTER METOTLARI ---

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getBaslik() { return baslik; }
    public void setBaslik(String baslik) { this.baslik = baslik; }

    public String getAciklama() { return aciklama; }
    public void setAciklama(String aciklama) { this.aciklama = aciklama; }

    public String getKategori() { return kategori; }
    public void setKategori(String kategori) { this.kategori = kategori; }

    public Double getFiyat() { return fiyat; }
    public void setFiyat(Double fiyat) { this.fiyat = fiyat; }

    public String getResimYolu() { return resimYolu; }
    public void setResimYolu(String resimYolu) { this.resimYolu = resimYolu; }

    public Kullanici getKullanici() { return kullanici; }
    public void setKullanici(Kullanici kullanici) { this.kullanici = kullanici; }

    public List<Mesaj> getMesajlar() { return mesajlar; }
    public void setMesajlar(List<Mesaj> mesajlar) { this.mesajlar = mesajlar; }

    // --- YENİ ALANLARIN GETTER/SETTER'LARI ---
    public String getSehir() { return sehir; }
    public void setSehir(String sehir) { this.sehir = sehir; }

    public String getIlce() { return ilce; }
    public void setIlce(String ilce) { this.ilce = ilce; }

    public String getAdres() { return adres; }
    public void setAdres(String adres) { this.adres = adres; }
}