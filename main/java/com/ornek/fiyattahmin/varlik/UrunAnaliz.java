package com.ornek.fiyattahmin.varlik;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "urun_analizleri")
public class UrunAnaliz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String kategori; 
    private String marka;    
    private String model;    
    private String kondisyonDetayi;
    
    private int kondisyonPuani; 

    private Double tahminiMinFiyat;
    private Double tahminiMaksFiyat;
    
    @Column(length = 2000) 
    private String yapayZekaTavsiyesi;

    private LocalDateTime olusturulmaTarihi = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "kullanici_id", nullable = false)
    private Kullanici kullanici;
}