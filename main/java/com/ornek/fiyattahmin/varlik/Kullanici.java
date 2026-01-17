package com.ornek.fiyattahmin.varlik;

import jakarta.persistence.*;
import lombok.Data; // Lombok varsa, yoksa Getter/Setter ekle

@Entity
@Data 
@Table(name = "kullanicilar")
public class Kullanici {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String adSoyad;
    
    @Column(unique = true) 
    private String kullaniciAdi;
    
    private String email;
    private String sifre;
    private String rol; 
}