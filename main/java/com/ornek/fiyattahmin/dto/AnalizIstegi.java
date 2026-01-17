package com.ornek.fiyattahmin.dto;

import lombok.Data;

@Data
public class AnalizIstegi {
    private String kategori;
    private String marka;
    private String modelUrun;
    private int yil;
    private String durum;
    private String hasarDurumu;
    private String aciklama;
}