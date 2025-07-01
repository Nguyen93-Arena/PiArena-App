import { useEffect, useState } from 'react';

export default function Home() {
  const [pi, setPi] = useState(null);
  const [status, setStatus] = useState("🔄 Đang kiểm tra SDK...");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkPi = setInterval(() => {
        if (window.Pi && window.Pi.init && window.Pi.createPayment) {
          try {
            // ✅ Khởi tạo Pi SDK với Mainnet
            window.Pi.init({ version: "2.0", sandbox: false });
            setPi(window.Pi);
            setStatus("✅ Pi SDK đã sẵn sàng.");
            clearInterval(checkPi);
          } catch (err) {
            console.error("❌ Lỗi khởi tạo Pi SDK:", err);
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
      setError("❌ Pi SDK chưa sẵn sàng. Hãy mở bằng Pi Browser.");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 0.001, // Pi thật
        memo: "Arena Mainnet Payment",
        metadata: { type: "mainnet-test" },
        onReadyForServerApproval: (paymentId) => {
          console.log("🟡 Chờ phê duyệt:", paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("✅ Hoàn tất giao dịch:", paymentId, txid);
        },
        onCancel: (paymentId) => {
          console.warn("❌ Giao dịch bị huỷ:", paymentId);
        },
        onError: (error, paymentId) => {
          console.error("❌ Lỗi giao dịch:", error, paymentId);
          setError("❌ Lỗi xảy ra khi xử lý thanh toán.");
        }
      });

      console.log("🎉 Giao dịch đã tạo:", payment);
    } catch (err) {
      console.error("❌ Lỗi trong createPayment:", err);
      setError("❌ Đã xảy ra lỗi khi tạo thanh toán.");
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏟 Arena Pi Payment Test (Mainnet)</h1>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handlePayment}
        style={{
          padding: '12px 24px',
          fontSize: '16px',
          marginTop: '1rem',
          backgroundColor: '#ff6600',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        💰 Thanh toán Pi Thật
      </button>
    </main>
  );
}
