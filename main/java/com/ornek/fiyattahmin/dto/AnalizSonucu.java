package com.ornek.fiyattahmin.dto;

import lombok.Data;

@Data
public class AnalizSonucu {
    private Double tahminiMinFiyat;
    private Double tahminiMaksFiyat;
    private String yapayZekaTavsiyesi;
}