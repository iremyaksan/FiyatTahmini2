package com.ornek.fiyattahmin.konfig;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcKonfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Uploads klasörünü dışarıya aç
        String uploadPath = "file:" + System.getProperty("user.dir") + "/uploads/images/";
        registry.addResourceHandler("/uploads/images/**")
                .addResourceLocations(uploadPath);
    }
}
