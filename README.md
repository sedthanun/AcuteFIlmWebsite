# AcuteFilm Website 

ยินดีต้อนรับสู่โปรเจกต์เว็บไซต์อย่างเป็นทางการของ **AcuteFilm** 

## 🎬 About
เว็บไซต์นี้สร้างขึ้นเพื่อนำเสนอผลงานภาพยนตร์ ข่าวสาร และบริการต่างๆ ของ AcuteFilm โดยเน้นดีไซน์ที่มินิมอล 

## 🛠 Technology
- **Frontend:** Next.js 15 (App Router), React 19, JavaScript (ES6+), Vanilla CSS3
- **AI Chatbot:** Mock AI Engine (Keyword Matching) พร้อม Firestore REST API สำหรับข้อมูลภาพยนตร์แบบ Real-time
- **Backend/Hosting:** [Firebase](https://firebase.google.com/)
  - **Firebase Hosting:** สำหรับการจัดวางไฟล์เว็บ (Multi-site: main, v3, redesign)
  - **Cloud Firestore:** สำหรับจัดเก็บข้อมูลข่าวสารและภาพยนตร์

## 📜 Changelog

### [v3.2] - 2026-05-15 (AI Chatbot & Cache Optimization)
- **AI Chatbot (`/ai-chat`):** เพิ่มหน้าแชทบอท AI สำหรับตอบคำถามเกี่ยวกับ AcuteFilm ภาพยนตร์ บริการ และข้อมูลติดต่อ
- **Smart Movie Listing:** แยกการแสดงผลงาน — ถาม "หนัง" จะแสดงเฉพาะ AcuteFilm Originals, ถาม "ผลงาน" จะแสดงทั้งหมด
- **Video Link Integration:** AI ส่งลิงก์ YouTube ให้ดูหนังได้ตรงในแชท โดยแปลง Embed URL → Watch URL อัตโนมัติ
- **Client-side Movie Fetch:** แก้ปัญหาข้อมูลหนังว่างเปล่าจาก Static Export ด้วยการดึงข้อมูลฝั่ง Client เป็น Fallback
- **Cache Busting Strategy:** เพิ่ม `no-cache` Meta Tags, อัปเดต `firebase.json` headers สำหรับ HTML (no-cache) และ Static Assets (immutable, 1 year)
- **Error Boundary:** เพิ่ม `error.jsx` สำหรับดักจับ ChunkLoadError หลัง Deploy ใหม่ พร้อม Auto-Reload
- **Routing Fix:** แก้ไข `cleanUrls: true` และลบ rewrites ที่ไม่ครบ/ผิดพลาดสำหรับ target `redesign`

### [v3.1] - 2026 (Next.js Migration)
- **Framework Upgrade:** ย้ายโปรเจกต์สู่ Next.js 15 (App Router) เพื่อความเร็วและประสิทธิภาพสูงสุด
- **SEO & Metadata:** ระบบ Dynamic Metadata สมบูรณ์แบบ รองรับ Social Share (Facebook/Twitter) และ Site Name บน Google Search
- **Firestore REST API:** เพิ่มความเสถียรในการดึงข้อมูลจาก Cloud Firestore
- **Deployment:** อัปเดต Firebase Hosting ให้รองรับ Next.js Static Export

### [v3.0] - 2026 (Modern Redesign)
- **Cinematic Redesign:** ปรับโฉมหน้าเว็บใหม่ทั้งหมด 
- **Hero Dynamic Slideshow:** ระบบสไลด์ภาพหน้าแรกพร้อม Progress Bar และตัวควบคุม
- **Firestore Integration:** เปลี่ยนระบบข่าวสารจากไฟล์ JSON เป็นการดึงข้อมูลจาก Cloud Firestore แบบ Real-time
- **Enhanced Responsiveness:** ปรับปรุงการแสดงผลบนมือถือให้สมบูรณ์แบบ 100%
- **Security:** อัปเดต Security Rules สำหรับ Firestore

### [v2.5] - 2025
- **Dynamic Linking:** ปรับปรุงระบบการดึงข้อมูลแบบ dynamic ผ่าน movie-detail และ news-detail

### [v2.0] - 2024
- **Share System:** เพิ่มปุ่มแชร์ไปยัง Social Media
- **Template Update:** อัปเดต Movie Template เวอร์ชัน 2.0 เพื่อการแสดงผลที่ดีขึ้น

### [v1.0] - 2021
- **Initial Launch:** เริ่มต้นโปรเจกต์และเปิดตัวเว็บไซต์ AcuteFilm ครั้งแรก

---
© 2026 AcuteFilm Team. All rights reserved.
