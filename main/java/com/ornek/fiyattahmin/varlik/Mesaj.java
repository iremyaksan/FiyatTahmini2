package com.ornek.fiyattahmin.varlik;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "mesajlar")
public class Mesaj {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String icerik;
    
    private LocalDateTime tarih = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "gonderen_id")
    private Kullanici gonderen;

    @ManyToOne
    @JoinColumn(name = "alici_id")
    private Kullanici alici;

    @ManyToOne
    @JoinColumn(name = "ilan_id")
    private Ilan ilan;
}