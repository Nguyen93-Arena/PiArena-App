import { useEffect, useState } from 'react';

export default function Home() {
  const [pi, setPi] = useState(null);
  const [status, setStatus] = useState("🔄 Đang kiểm tra SDK...");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkPi = setInterval(() => {
        if (window.Pi && window.Pi.init && window.Pi.createPayment) {
          // ✅ Khởi tạo SDK ở chế độ sandbox
          try {
            window.Pi.init({ version: "2.0" });
            setStatus("✅ Pi SDK đã sẵn sàng.");
            clearInterval(checkPi);
          } catch (err) {
            console.error("❌ Lỗi khi init Pi SDK:", err);
            setStatus("❌ Lỗi khi khởi tạo Pi SDK.");
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
        memo: "Arena Test Payment",
        metadata: { type: "test" },
        onReadyForServerApproval: (paymentId) => {
          console.log("🔄 Server Approval:", paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("✅ Server Completion:", paymentId, txid);
        },
        onCancel: (paymentId) => {
          console.warn("❌ Bị huỷ:", paymentId);
        },
        onError: (err, paymentId) => {
          console.error("❌ Lỗi thanh toán:", err, paymentId);
        }
      });

      console.log("🎉 Payment created:", payment);
    } catch (err) {
      console.error("❌ Lỗi khi tạo payment:", err);
      setError("❌ Đã xảy ra lỗi khi tạo thanh toán.");
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏟 Arena Pi Payment Test</h1>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handlePayment}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '1rem',
          backgroundColor: '#ff9900',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        💰 Thanh toán thử
      </button>
    </main>
  );
}
