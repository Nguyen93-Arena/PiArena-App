# Arena PvP - Pi Network Backend (Mainnet)

Đây là backend Node.js dùng để xử lý giao dịch Pi trên Mainnet.

## ✅ Tính năng
- `/approve-payment`: xác nhận giao dịch từ client
- `/complete-payment`: hoàn tất giao dịch khi Pi Network gửi callback
- Sử dụng Pi App Wallet (private seed) để ký và xác minh

---

## 🚀 Cách deploy trên Render (hoặc nền tảng bất kỳ)

### 1. Tạo `.env` từ `.env.example`
```env
PI_API_KEY=your_mainnet_api_key
WALLET_PRIVATE_SEED=your_private_seed
PORT=3001
