```mermaid
sequenceDiagram
    participant User as ผู้ใช้ Telegram
    participant TG as เซิร์ฟเวอร์ Telegram
    participant Ngrok as เซิร์ฟเวอร์ Ngrok
    participant API as เซิร์ฟเวอร์ API Node TypeScript

    Note over User,API: การตั้งค่าเริ่มต้น
    API->>TG: ตั้งค่า Webhook URL (ngrok URL)

    Note over User,API: การไหลของข้อความ
    User->>TG: ส่งข้อความ
    TG->>Ngrok: ส่งข้อมูลอัพเดทไปยัง Webhook
    Ngrok->>API: ส่งคำขอไปยังเซิร์ฟเวอร์ API
    API->>API: ประมวลผลข้อความ
    API->>TG: ส่งการตอบกลับ
    TG->>User: ส่งข้อความไปยังผู้ใช้

    Note over User,API: การทำงานของ Webhook
    Note over API: เซิร์ฟเวอร์ API (Firebase Functions)<br/>- จัดการข้อมูลอัพเดทจาก Telegram<br/>- ประมวลผลคำสั่ง<br/>- ส่งการตอบกลับ
    Note over Ngrok: เซิร์ฟเวอร์ Ngrok<br/>- สร้าง URL สาธารณะ<br/>- ส่งคำขอไปยัง API ในเครื่อง
    Note over TG: เซิร์ฟเวอร์ Telegram<br/>- รับข้อความจากผู้ใช้<br/>- ส่งข้อมูลไปยัง Webhook<br/>- ส่งการตอบกลับจากบอท
```

## คำอธิบายสถาปัตยกรรม

1. **ผู้ใช้ Telegram**: ผู้ใช้ปลายทางที่โต้ตอบกับบอทผ่าน Telegram
2. **เซิร์ฟเวอร์ Telegram**: เซิร์ฟเวอร์ทางการของ Telegram ที่จัดการการส่งข้อความ
3. **เซิร์ฟเวอร์ Ngrok**: สร้างอุโมงค์ที่ปลอดภัยไปยังเซิร์ฟเวอร์ API ในเครื่อง
4. **เซิร์ฟเวอร์ API Node TypeScript**: เซิร์ฟเวอร์ Firebase Functions ที่ประมวลผลข้อความ

### คำอธิบายการทำงาน

1. **การตั้งค่าเริ่มต้น**:

   - เซิร์ฟเวอร์ API ตั้งค่า URL ของ webhook กับ Telegram โดยใช้ URL ของ Ngrok
   - นี่เป็นการบอก Telegram ว่าจะส่งข้อมูลอัพเดทไปที่ไหน

2. **การไหลของข้อความ**:

   - ผู้ใช้ส่งข้อความไปยังบอท
   - Telegram ส่งข้อมูลไปยัง URL ของ webhook (Ngrok)
   - Ngrok ส่งคำขอไปยังเซิร์ฟเวอร์ API ในเครื่อง
   - เซิร์ฟเวอร์ API ประมวลผลข้อความและส่งการตอบกลับ
   - Telegram ส่งการตอบกลับไปยังผู้ใช้

3. **บทบาทของเซิร์ฟเวอร์**:
   - **เซิร์ฟเวอร์ API**: จัดการตรรกะของบอททั้งหมด ประมวลผลคำสั่ง และสร้างการตอบกลับ
   - **เซิร์ฟเวอร์ Ngrok**: ให้ URL สาธารณะเพื่อให้ Telegram สามารถเข้าถึง API ในเครื่องได้
   - **เซิร์ฟเวอร์ Telegram**: จัดการการส่งและรับข้อความ
