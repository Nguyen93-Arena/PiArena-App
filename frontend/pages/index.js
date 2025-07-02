import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("🔄 Đang kiểm tra Pi SDK...");
  const [pi, setPi] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        window.Pi &&
        window.Pi.createPayment &&
        window.Pi.init
      ) {
        try {
          window.Pi.init({ version: "2.0", sandbox: false });
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
      setError("❌ Pi SDK chưa sẵn sàng.");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 1,
        memo: "Arena Pi Mainnet Payment",
        metadata: { arena: true },
        onReadyForServerApproval: async (paymentId) => {
          await fetch("https://arena-pi.onrender.com/api/payment/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId }),
          });
        },
        onReadyForServerCompletion: async (paymentId, txid) => {
          await fetch("https://arena-pi.onrender.com/api/payment/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentId, txid }),
          });
        },
        onCancel: (paymentId) => console.warn("❌ Cancelled:", paymentId),
        onError: (error) => {
          console.error("❌ Payment Error:", error);
          setError("❌ Không thể tạo thanh toán. Kiểm tra Pi SDK hoặc mạng.");
        },
      });

      console.log("💰 Payment created:", payment);
      setError("");
    } catch (err) {
      console.error("❌ Tạo payment lỗi:", err);
      setError("❌ Không thể tạo thanh toán. Kiểm tra Pi SDK hoặc mạng.");
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🏟 Arena Pi Payment Test (Mainnet)</h1>
      <p>{status}</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={handlePayment}
        disabled={!pi}
        style={{
          marginTop: "1rem",
          padding: "1rem",
          fontSize: "1rem",
          backgroundColor: "#FFA500",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
        }}
      >
        💰 Thanh toán Pi Thật
      </button>
    </main>
  );
}
