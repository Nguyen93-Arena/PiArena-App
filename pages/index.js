import { useEffect, useState } from "react";

export default function Home() {
  const [isPiReady, setIsPiReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra nếu Pi SDK đã sẵn sàng
    if (typeof window !== "undefined" && window.Pi) {
      try {
        window.Pi.init({
          version: "2.0",
        });
        setIsPiReady(true);
      } catch (err) {
        setError("❌ Lỗi khi khởi tạo Pi SDK: " + err.message);
      }
    } else {
      setError("⚠️ Pi SDK chưa sẵn sàng. Vui lòng mở trong Pi Browser.");
    }
  }, []);

  const handlePayment = async () => {
    if (!window.Pi || !window.Pi.createPayment) {
      alert("Pi SDK chưa sẵn sàng!");
      return;
    }

    try {
      const paymentData = {
        amount: 0.001,
        memo: "Test Payment",
        metadata: { user: "test_user" },
      };

      const payment = await window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId) => {
          console.log("Ready for server approval:", paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("Ready for server completion:", paymentId, txid);
        },
        onCancel: (paymentId) => {
          console.log("Payment cancelled:", paymentId);
        },
        onError: (error, paymentId) => {
          console.error("Payment error:", error, paymentId);
        },
      });

      console.log("Payment result:", payment);
    } catch (err) {
      setError("❌ Lỗi khi thực hiện thanh toán: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Arena Pi Payment Test</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={handlePayment}
        disabled={!isPiReady}
        style={{
          padding: "1rem",
          fontSize: "16px",
          backgroundColor: isPiReady ? "#4CAF50" : "#ccc",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: isPiReady ? "pointer" : "not-allowed",
          marginTop: "1rem",
        }}
      >
        Thanh toán thử
      </button>
    </div>
  );
}
