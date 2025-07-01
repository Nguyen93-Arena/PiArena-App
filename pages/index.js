import { useEffect, useState } from 'react';

export default function Home() {
  const [pi, setPi] = useState(null);
  const [status, setStatus] = useState("⚠️ Pi SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser.");
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.Pi && window.Pi.createPayment) {
        setPi(window.Pi);
        setStatus("✅ Pi SDK đã sẵn sàng.");
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handlePayment = async () => {
    if (!pi) {
      setError("❌ Pi Network SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser.");
      return;
    }

    try {
      const paymentData = await pi.createPayment({
        amount: 0.001,
        memo: "Arena Test Payment",
        metadata: { type: "test" },
        onReadyForServerApproval: (paymentId) => {
          console.log("READY FOR SERVER APPROVAL:", paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("READY FOR SERVER COMPLETION:", paymentId, txid);
        },
        onCancel: (paymentId) => {
          console.log("CANCELLED:", paymentId);
        },
        onError: (error, paymentId) => {
          console.error("ERROR:", error);
        }
      });

      console.log("Payment created:", paymentData);
    } catch (err) {
      console.error(err);
      setError("❌ Đã xảy ra lỗi khi tạo thanh toán.");
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1># Arena Pi Payment Test</h1>
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
        Thanh toán thử
      </button>
    </main>
  );
}
