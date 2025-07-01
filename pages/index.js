import { useEffect, useState } from 'react';

export default function Home() {
  const [piReady, setPiReady] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("🔄 Đang khởi tạo...");

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && window.Pi && window.Pi.init) {
        try {
          window.Pi.init({ version: "2.0" });
          setPiReady(true);
          setStatus("✅ Pi SDK đã sẵn sàng.");
          clearInterval(interval);
        } catch (e) {
          setError("❌ Không thể khởi tạo Pi SDK.");
          clearInterval(interval);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handlePayment = async () => {
    if (!window.Pi || !window.Pi.createPayment) {
      setError("❌ Pi Network SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser.");
      return;
    }

    try {
      const payment = await window.Pi.createPayment({
        amount: 0.001,
        memo: "Arena Test Payment",
        metadata: { type: "test" },
        onReadyForServerApproval: (paymentId) => {
          console.log("✅ Ready for server approval:", paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("✅ Ready for server completion:", paymentId, txid);
        },
        onCancel: (paymentId) => {
          console.log("❌ Cancelled:", paymentId);
        },
        onError: (err, paymentId) => {
          console.error("❌ Payment error:", err, paymentId);
        }
      });

      console.log("✅ Payment created:", payment);
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
