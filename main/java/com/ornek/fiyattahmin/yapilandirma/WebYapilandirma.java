package com.ornek.fiyattahmin.yapilandirma;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebYapilandirma implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // uploads/images klasöründeki resimleri /images/** URL'inden sunmak için
        String uploadPath = System.getProperty("user.dir") + "/uploads/images/";

        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:" + uploadPath);

        System.out.println("📁 Resim servisi aktif: " + uploadPath);
    }
}
