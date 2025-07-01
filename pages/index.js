// pages/index.js
import { useEffect, useState } from "react";

export default function Home() {
  const [piReady, setPiReady] = useState(false);
  const [status, setStatus] = useState("🔄 Đang kiểm tra Pi SDK...");

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.Pi) {
        try {
          window.Pi.init({ version: 2 });
          setPiReady(true);
          setStatus("✅ Pi SDK đã sẵn sàng!");
          clearInterval(interval);
        } catch (e) {
          console.error("Lỗi khi init SDK:", e);
          setStatus("❌ Lỗi khi init Pi SDK");
        }
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handlePayment = async () => {
    if (!piReady) {
      setStatus("⚠️ SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser.");
      return;
    }

    try {
      const payment = await window.Pi.createPayment({
        amount: 0.001,
        memo: "Test payment",
        metadata: { test: true },
      });

      console.log("Kết quả thanh toán:", payment);
      setStatus("✅ Thanh toán thành công!");
    } catch (err) {
      console.error("Lỗi thanh toán:", err);
      setStatus("❌ Thanh toán thất bại: " + err.message);
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h1>Arena Pi Payment Test</h1>
      <button onClick={handlePayment} style={{ padding: 12, fontSize: 16 }}>
        Thanh toán thử
      </button>
      <p style={{ marginTop: 20 }}>{status}</p>
    </div>
  );
}
