import { useEffect, useState } from 'react';

export default function Home() {
  const [pi, setPi] = useState(null);
  const [status, setStatus] = useState("🔄 Đang kiểm tra SDK...");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra khi Pi SDK đã được load
    if (typeof window !== 'undefined' && window.Pi) {
      setPi(window.Pi);
      setStatus("✅ Pi SDK đã sẵn sàng.");
    } else {
      setStatus("⚠️ Pi SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser.");
    }
  }, []);

  const handlePayment = async () => {
    if (!pi) {
      setError("❌ Pi Network SDK chưa sẵn sàng. Hãy mở trong Pi Browser.");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 0.001,
        memo: "Arena Test Payment",
        metadata: { type: "test" },
        onReadyForServerApproval: (paymentId) => {
          console.log("✅ Server Approval:", paymentId);
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
