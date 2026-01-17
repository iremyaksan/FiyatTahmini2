package com.ornek.fiyattahmin.guvenlik;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtAraclari {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expMinutes}")
    private int jwtExpirationInMs;

    // Mobil giriş yapan kullanıcı için Token (Bilet) üretir
    public String tokenUret(String kullaniciAdi) {
        Date simdi = new Date();
        Date gecerlilikSuresi = new Date(simdi.getTime() + (long) jwtExpirationInMs * 60 * 1000);

        Key key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .setSubject(kullaniciAdi)
                .setIssuedAt(simdi)
                .setExpiration(gecerlilikSuresi)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }
}