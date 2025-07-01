import { useEffect, useState } from "react";

export default function Home() {
  const [sdkReady, setSdkReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && window.Pi) {
      setSdkReady(true);
    }
  }, []);

  const handlePayment = async () => {
    if (!window.Pi) {
      alert("⚠️ Pi SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser.");
      return;
    }

    try {
      const paymentData = {
        amount: 0.001,
        memo: "Thanh toán thử Arena",
        metadata: { type: "test" },
      };

      const payment = await window.Pi.createPayment(paymentData);
      setPaymentStatus("✔️ Thanh toán thành công!");
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      setPaymentStatus("❌ Lỗi thanh toán hoặc bị hủy.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h1>Arena Pi Payment Test</h1>
      <p>
        {sdkReady
          ? "✅ SDK Pi đã sẵn sàng"
          : "⚠️ Pi SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser."}
      </p>
      <button
        onClick={handlePayment}
        disabled={!sdkReady}
        style={{
          marginTop: "1rem",
          padding: "1rem 2rem",
          fontSize: "16px",
          cursor: sdkReady ? "pointer" : "not-allowed",
        }}
      >
        Thanh toán thử
      </button>
      <p style={{ marginTop: "1rem" }}>{paymentStatus}</p>
    </div>
  );
}
