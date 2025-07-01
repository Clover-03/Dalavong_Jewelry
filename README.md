# 💎 Dalavong Jewelry Management System

ระบบจัดการร้านทองสมบูรณ์แบบสำหรับธุรกิจร้านทอง พัฒนาด้วย Vue.js 3, Nuxt 3, และ MySQL

## ✨ คุณสมบัติหลัก

### 🛍️ ระบบขาย (Selling)
- จัดการการขายสินค้าทอง
- คำนวณราคาอัตโนมัติตามน้ำหนักและราคาทองวันนั้น
- สร้างใบเสร็จและใบกำกับภาษี
- ระบบส่วนลดและวิธีการชำระเงิน

### 💰 ระบบรับซื้อคืน (Repurchase)
- รับซื้อสินค้าทองคืนจากลูกค้า
- คำนวณค่าเสียหายและค่าลดหัก
- ระบบอนุมัติและจัดการเหตุผล

### 🔄 ระบบแลกเปลี่ยน (Exchange)
- แลกเปลี่ยนสินค้าทองเก่าเป็นใหม่
- คำนวณค่าต่างราคาและค่าธรรมเนียม
- จัดการน้ำหนักที่สูญหายในการแลกเปลี่ยน

### 📦 ระบบจัดซื้อ (Purchase)
- จัดการใบสั่งซื้อจากผู้จำหน่าย
- ติดตามสถานะการสั่งซื้อ
- ระบบใบกำกับสินค้าและการจัดส่ง

### 👥 ระบบจัดการข้อมูล
- จัดการข้อมูลลูกค้า
- จัดการข้อมูลผู้จำหน่าย
- จัดการข้อมูลสินค้าทอง
- ระบบราคาทองรายวัน

### 📊 ระบบรายงาน
- รายงานยอดขาย
- รายงานสินค้าคงคลัง
- รายงานลูกค้าและผู้จำหน่าย
- รายงานการแลกเปลี่ยนและรับซื้อคืน
- รายงานรายได้และค่าใช้จ่าย

## 🎨 การออกแบบ

### Modern Design System
- **Primary Color**: #365a76 (Deep Blue)
- **Gradient Backgrounds**: #667eea → #764ba2
- **Modern Card Design** พร้อม shadows และ rounded corners
- **Responsive Layout** รองรับทุกขนาดหน้าจอ

### Dark Mode Support
- **Dark Theme Colors**: #1a1a2e, #16213e
- **Auto theme detection** ตามระบบปฏิบัติการ
- **Seamless switching** เปลี่ยนธีมได้ทันที

### สีหลักของระบบ
- 🔵 สีหลัก: #365a76 (น้ำเงินเข้ม)
- 🌈 Gradient: จาก #667eea ไป #764ba2
- 🌙 Dark Mode: #1a1a2e, #16213e

## 🛠️ เทคโนโลยีที่ใช้

### Frontend
- **Vue.js 3** - Progressive JavaScript Framework
- **Nuxt 3** - Vue.js Framework
- **Vuetify 3** - Material Design Component Framework
- **JavaScript** - Programming Language

### Backend
- **Node.js** - JavaScript Runtime
- **Express.js** - Web Application Framework
- **Prisma** - Database ORM
- **MySQL** - Relational Database

### อื่นๆ
- **JWT** - Authentication
- **bcrypt** - Password Hashing
- **CORS** - Cross-Origin Resource Sharing

## 📁 โครงสร้างโปรเจค

```
Dalavong/
├── 🎨 Frontend (Nuxt 3)
│   ├── pages/          # หน้าเว็บไซต์
│   ├── components/     # คอมโพเนนต์
│   ├── layouts/        # เลย์เอาต์
│   ├── composables/    # Composition API
│   ├── services/       # API Services
│   └── assets/         # ไฟล์สื่อ
│
├── 🖥️ Backend (Express.js)
│   ├── src/            # Source code
│   ├── api/            # API endpoints
│   ├── prisma/         # Database schema
│   └── middleware/     # Middleware
│
└── 🗃️ Database (MySQL)
    ├── schema.prisma   # Database schema
    └── migrations/     # Database migrations
```

## 🚀 การติดตั้งและรัน

### ข้อกำหนดระบบ
- Node.js (v16 หรือสูงกว่า)
- MySQL Server
- npm หรือ yarn

### Frontend (Port 3333)
```bash
# ติดตั้ง dependencies
npm install

# รันในโหมด development
npm run dev
```

### Backend (Port 4444)
```bash
# เข้าไปในโฟลเดอร์ backend
cd backend

# ติดตั้ง dependencies
npm install

# ตั้งค่า environment variables
cp .env.example .env

# รัน Prisma migrations
npx prisma db push

# รันเซิร์ฟเวอร์
npm run dev
```

### ตั้งค่าฐานข้อมูล
```env
DATABASE_URL="mysql://username:password@localhost:3306/gold_shop_db"
JWT_SECRET="your-jwt-secret-key"
PORT=4444
```

## 🌟 คุณสมบัติพิเศษ

### 🌐 ภาษาลาว
- ระบบใช้ภาษาลาวทั้งหมด (ยกเว้นสถานะที่เป็นภาษาอังกฤษ)
- Font: Noto Sans Lao
- การแสดงผลที่ถูกต้องในทุกบราวเซอร์

### 📱 Responsive Design
- รองรับมือถือ, แท็บเล็ต, และเดสก์ท็อป
- Navigation ที่เปลี่ยนแปลงตามขนาดหน้าจอ
- Touch-friendly interface

### 🔐 ระบบความปลอดภัย
- JWT Authentication
- Password hashing ด้วย bcrypt
- Middleware สำหรับการยืนยันตัวตน
- CORS protection

## 🎯 การใช้งาน

1. **เข้าสู่ระบบ** - ใช้บัญชีผู้ดูแลระบบ
2. **จัดการข้อมูลพื้นฐาน** - เพิ่มลูกค้า, ผู้จำหน่าย, สินค้า
3. **ตั้งราคาทอง** - อัปเดตราคาทองรายวัน
4. **ทำธุรกรรม** - ขาย, รับซื้อคืน, แลกเปลี่ยน
5. **ดูรายงาน** - ติดตามผลการดำเนินงาน

## 📄 License

MIT License - ดูไฟล์ LICENSE สำหรับรายละเอียด

## 👨‍💻 ผู้พัฒนา

พัฒนาโดย **Clover-03** สำหรับร้านทอง Dalavong

---

🌟 **สนับสนุนโปรเจคนี้โดยการให้ Star!** ⭐️
