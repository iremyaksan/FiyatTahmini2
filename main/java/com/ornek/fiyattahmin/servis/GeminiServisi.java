package com.ornek.fiyattahmin.servis;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vladsch.flexmark.html.HtmlRenderer;
import com.vladsch.flexmark.parser.Parser;
import com.vladsch.flexmark.util.ast.Node;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import java.util.List;
import java.util.Map;

@Service
public class GeminiServisi {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper nesneyeDonustur = new ObjectMapper();
    
    private final Parser parser = Parser.builder().build();
    private final HtmlRenderer renderer = HtmlRenderer.builder().build();

    public GeminiServisi(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String fiyatTahminEt(String kategori, String marka, String modelUrun, int yil, 
                                String durum, String hasarDurumu, String aciklama) {
        
    	String istekMetni = String.format(
    		    "Sen uzman bir ekspertizsin. Kategori: %s, Marka: %s, Model: %s, Yıl: %d, Durum: %s, Hasar: %s, Not: %s " +
    		    "bilgileri verilen ürün için tahmini bir piyasa fiyat aralığı ver ve kısa bir yorum yap. " +
    		    "ÖNEMLI: Yanıtını düz metin olarak ver, Markdown formatı kullanma, yıldız (*) veya tire (-) işareti kullanma.",
    		    kategori, marka, modelUrun, yil, durum, hasarDurumu, aciklama
    		);
        String urlWithKey = apiUrl + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of(
                    "parts", List.of(
                        Map.of("text", istekMetni)
                    )
                )
            )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                urlWithKey,
                HttpMethod.POST,
                request,
                String.class
            );
            
            JsonNode root = nesneyeDonustur.readTree(response.getBody());
            String markdownSonuc = root
                    .path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
            
            Node document = parser.parse(markdownSonuc);
            String htmlSonuc = renderer.render(document);
            
            return htmlSonuc;

        } catch (Exception e) {
            return "AI HATASI: " + e.getMessage();
        }
    }
}