// pages/index.js
import { useEffect, useState } from "react";

export default function Home() {
  const [piReady, setPiReady] = useState(false);
  const [status, setStatus] = useState("");

  // Kiểm tra và khởi tạo Pi SDK
  useEffect(() => {
    const checkPi = setInterval(() => {
      if (window.Pi) {
        try {
          window.Pi.init({ version: 2 });
          setPiReady(true);
          console.log("✅ Pi SDK đã sẵn sàng.");
          clearInterval(checkPi);
        } catch (e) {
          console.error("❌ Lỗi khi init Pi SDK:", e);
        }
      }
    }, 500);

    return () => clearInterval(checkPi);
  }, []);

  // Hàm xử lý thanh toán
  const handlePayment = async () => {
    if (!window.Pi || !piReady) {
      setStatus("⚠️ Pi SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser.");
      return;
    }

    try {
      const payment = await window.Pi.createPayment({
        amount: 0.001,
        memo: "Test Payment",
        metadata: { type: "test" },
      });

      console.log("✅ Thanh toán thành công:", payment);
      setStatus("✅ Thanh toán thành công!");
    } catch (err) {
      console.error("❌ Lỗi khi thanh toán:", err);
      setStatus("❌ Lỗi khi thanh toán: " + err.message);
    }
  };

  return (
    <main style={{ padding: 30, fontFamily: "Arial
