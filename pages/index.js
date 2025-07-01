// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [piReady, setPiReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('');

  useEffect(() => {
    const checkPiSDK = setInterval(() => {
      if (window.Pi) {
        try {
          window.Pi.init({ version: 2 });
          setPiReady(true);
          console.log("✅ Pi SDK đã sẵn sàng");
          clearInterval(checkPiSDK);
        } catch (error) {
          console.error("❌ Pi SDK init lỗi:", error);
        }
      }
    }, 1000);

    return () => clearInterval(checkPiSDK);
  }, []);

  const handlePayment = async () => {
    if (!window.Pi || !piReady) {
      setPaymentStatus("⚠️ Pi SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser.");
      return;
    }

    try {
      const paymentData = await window.Pi.createPayment({
        amount: 0.001,
        memo: "Test Payment for Arena App",
        metadata: { type: "test" },
      });

      setPaymentStatus("✅ Giao dịch thành công!");
      console.log("🔔 Payment data:", paymentData);
    } catch (error) {
      setPaymentStatus(`❌ Lỗi: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1># Arena Pi Payment Test</h1>
      <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Thanh toán thử
      </button>
      <p>{paymentStatus}</p>
    </div>
  );
}
