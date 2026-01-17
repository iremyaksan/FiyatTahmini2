package com.ornek.fiyattahmin.dto;

import lombok.Data; // Lombok varsa bunu kullanın, yoksa manuel getter/setter ekleyin.

@Data
public class GirisIstegi {
    private String kullaniciAdi;
    private String sifre;
}