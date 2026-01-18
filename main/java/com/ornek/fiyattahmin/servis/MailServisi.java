package com.ornek.fiyattahmin.servis;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Service
public class MailServisi {

    private final WebClient webClient;

    @Value("${mail.api.url:http://localhost:8000}")
    private String mailApiUrl;

    public MailServisi(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    /**
     * Python FastAPI mail servisine istek gönderir
     */
    public void kayitOnayMailiGonder(String aliciEmail, String adSoyad) {
        try {
            Map<String, String> mailRequest = new HashMap<>();
            mailRequest.put("email", aliciEmail);
            mailRequest.put("baslik", "Fiyat Tahmin - Hoş Geldiniz! 🎉");
            mailRequest.put("mesaj", hosgeldinMesajiOlustur(adSoyad));

            String response = webClient.post()
                    .uri(mailApiUrl + "/send-mail")
                    .header("Content-Type", "application/json")
                    .bodyValue(mailRequest)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            System.out.println("✅ MAIL GÖNDERILDI: " + aliciEmail);
            System.out.println("API Yanıt: " + response);

        } catch (Exception e) {
            System.out.println("❌ MAIL GÖNDERILEMEDI: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String hosgeldinMesajiOlustur(String adSoyad) {
        return String.format("""
                Merhaba %s,

                Fiyat Tahmin sistemine hoş geldiniz! 🎉

                Hesabınız başarıyla oluşturuldu. Artık yapay zeka destekli fiyat tahmin sistemimizi kullanabilirsiniz.

                Sistemimizle:
                ✅ Ürün fiyatlarını tahmin edebilir
                ✅ Piyasa analizleri görüntüleyebilir
                ✅ Akıllı öneriler alabilirsiniz

                Hemen giriş yapın ve keşfetmeye başlayın!

                İyi alışverişler,
                Fiyat Tahmin Ekibi
                """, adSoyad);
    }
}
