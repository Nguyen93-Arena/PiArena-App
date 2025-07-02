import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("🔄 Đang kiểm tra Pi SDK...");
  const [pi, setPi] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        window.Pi &&
        window.Pi.createPayment &&
        window.Pi.init
      ) {
        try {
          window.Pi.init({ version: "2.0", sandbox: false }); // Mainnet
          setPi(window.Pi);
          setStatus("✅ Pi SDK đã sẵn sàng.");
        } catch (err) {
          setStatus("❌ Không khởi tạo được Pi SDK.");
          console.error(err);
        } finally {
          clearInterval(interval);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handlePayment = async () => {
    if (!pi) {
      setStatus("❌ SDK chưa sẵn sàng. Mở bằng Pi Browser Mainnet.");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 1,
        memo: "Arena Pi Mainnet Payment",
        metadata: { arena: true },
        onReadyForServerApproval: async (paymentId) => {
          try {
            const res = await fetch(
              "https://arena-pi.onrender.com/api/payment/approve",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId }),
              }
            );
            const data = await res.json();
            console.log("✅ Approve response:", data);
          } catch (err) {
            console.error("❌ Approve failed:", err);
          }
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          try {
            const res = await fetch(
              "https://arena-pi.onrender.com/api/payment/complete",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid }),
              }
            );
            const data = await res.json();
            console.log("✅ Complete response:", data);
          } catch (err) {
            console.error("❌ Completion failed:", err);
          }
        },
        onCancel: (paymentId) => console.warn("❌ Cancelled:", paymentId),
        onError: (error, payment) => {
          console.error("❌ Payment Error:", error, payment);
          setStatus("❌ Không thể tạo thanh toán. Kiểm tra Pi SDK hoặc mạng.");
        },
      });

      console.log("💰 Payment created:", payment);
    } catch (err) {
      console.error("❌ Tạo payment lỗi:", err);
      setStatus("❌ Không thể tạo thanh toán. Kiểm tra Pi SDK hoặc mạng.");
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🏟 Arena Pi Payment Test (Mainnet)</h1>
      <p>{status}</p>
      <button onClick={handlePayment} disabled={!pi}>
        💰 Thanh toán Pi Thật
      </button>
    </main>
  );
}
