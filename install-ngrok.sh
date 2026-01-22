#!/bin/bash

# EC2'de Ngrok Kurulum Script'i

echo "=== Ngrok Kurulumu Başlıyor ==="

# 1. Ngrok indir
echo "1. Ngrok indiriliyor..."
cd ~
wget -q https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar -xzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/
rm ngrok-v3-stable-linux-amd64.tgz

# 2. Version kontrol
echo "2. Ngrok version:"
ngrok version

# 3. Authtoken yapılandır (kullanıcı tarafından sağlanacak)
echo "3. Ngrok authtoken yapılandırılıyor..."
# Bu adım manuel olarak yapılacak: ngrok config add-authtoken <TOKEN>

# 4. Systemd servisi oluştur
echo "4. Systemd servisi oluşturuluyor..."
sudo tee /etc/systemd/system/ngrok.service > /dev/null <<EOF
[Unit]
Description=Ngrok Tunnel
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu
ExecStart=/usr/local/bin/ngrok http 8082 --log=stdout
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 5. Servisi etkinleştir (authtoken sonrası çalıştırılacak)
echo "5. Servis hazır (authtoken sonrası başlatılacak)"

echo "=== Kurulum Tamamlandı ==="
echo ""
echo "Sonraki adımlar:"
echo "1. Ngrok authtoken'ı yapılandırın: ngrok config add-authtoken <TOKEN>"
echo "2. Servisi başlatın: sudo systemctl start ngrok"
echo "3. Servisi etkinleştirin: sudo systemctl enable ngrok"
echo "4. HTTPS URL'sini alın: curl http://localhost:4040/api/tunnels | grep -o 'https://[^\"]*'"
