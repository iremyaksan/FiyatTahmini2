package com.ornek.fiyattahmin.yapilandirma;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestYapilandirma {

    @Bean 
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}