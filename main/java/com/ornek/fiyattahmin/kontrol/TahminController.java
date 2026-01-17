package com.ornek.fiyattahmin.kontrol;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TahminController {

    @GetMapping("/tahmin-et") 
    public String tahminSayfasi() {
        return "tahmin-form"; 
    }
}