from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
import aiosmtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

# Ayarları yükle
load_dotenv()

MAIL_HOST = os.getenv("MAIL_HOST", "smtp.gmail.com")
MAIL_PORT = int(os.getenv("MAIL_PORT", "587"))
MAIL_USER = os.getenv("MAIL_USER")
MAIL_PASS = os.getenv("MAIL_PASS")

app = FastAPI(title="Fiyat Tahmin Mail Servisi")

# Gelen isteğin formatı
class MailRequest(BaseModel):
    email: EmailStr
    baslik: str
    mesaj: str

@app.get("/")
async def root():
    return {"status": "ok", "message": "Mail servisi çalışıyor"}

@app.post("/send-mail")
async def send_mail(req: MailRequest):
    try:
        # Maili hazırla
        msg = EmailMessage()
        msg["From"] = MAIL_USER
        msg["To"] = req.email
        msg["Subject"] = req.baslik
        msg.set_content(req.mesaj)

        # Gönder
        await aiosmtplib.send(
            msg,
            hostname=MAIL_HOST,
            port=MAIL_PORT,
            username=MAIL_USER,
            password=MAIL_PASS,
            use_tls=False,
            start_tls=True,
        )
        print(f"✅ Mail gönderildi: {req.email}")
        return {"status": "ok", "message": "Mail gönderildi"}
    except Exception as e:
        print(f"❌ Mail hatası: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
