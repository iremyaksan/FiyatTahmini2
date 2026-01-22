package com.ornek.fiyattahmin.konfig;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class NgrokBypassFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Ngrok'un bot engellemesini bypass etmek için header ekle
        httpResponse.setHeader("ngrok-skip-browser-warning", "true");

        chain.doFilter(request, response);
    }
}
