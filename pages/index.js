import { useEffect, useState } from 'react';

export default function Home() {
  const [pi, setPi] = useState(null);
  const [status, setStatus] = useState("🔄 Đang kiểm tra Pi SDK...");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkPi = setInterval(() => {
        if (window.Pi && window.Pi.init && window.Pi.createPayment) {
          try {
            window.Pi.init({ version: "2.0", sandbox: false });
            setPi(window.Pi);
            setStatus("✅ Pi SDK đã sẵn sàng.");
            clearInterval(checkPi);
          } catch (err) {
            setStatus("❌ Lỗi khởi tạo Pi SDK.");
            console.error("Lỗi init SDK:", err);
            clearInterval(checkPi);
          }
        }
      }, 500);

      return () => clearInterval(checkPi);
    }
  }, []);

  const handlePayment = async () => {
    if (!pi) {
      setError("❌ Pi SDK chưa sẵn sàng.");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 0.001,
        memo: "Arena Mainnet Payment",
        metadata: { type: "mainnet" },
        onReadyForServerApproval: async (paymentId) => {
          console.log("🔄 Approving...", paymentId);
          try {
            const res = await fetch("https://piarena-app-1.onrender.com/api/payment/approve", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId }),
            });
            const data = await res.json();
            console.log("✅ Approve result:", data);
          } catch (err) {
            console.error("❌ Approve error:", err);
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          console.log("🔄 Completing...", paymentId, txid);
          try {
            const res = await fetch("https://piarena-app-1.onrender.com/api/payment/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ paymentId, txid }),
            });
            const data = await res.json();
            console.log("✅ Completion result:", data);
          } catch (err) {
            console.error("❌ Completion error:", err);
          }
        },
        onCancel: (paymentId) => {
          console.warn("❌ Người dùng đã huỷ:", paymentId);
        },
        onError: (err, paymentId) => {
          console.error("❌ Lỗi thanh toán:", err, paymentId);
          setError("❌ Lỗi tạo thanh toán.");
        },
      });

      console.log("🎉 Payment created:", payment);
    } catch (err) {
      console.error("❌ Exception:", err);
      setError("❌ Không thể tạo thanh toán.");
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🏟 Arena Pi Payment Test (Mainnet)</h1>
      <p>{status}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          backgroundColor: "#ff9900",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        💰 Thanh toán Pi Thật
      </button>
    </main>
  );
}
