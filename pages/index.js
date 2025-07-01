import { useEffect, useState } from 'react';

export default function Home() {
  const [pi, setPi] = useState(null);
  const [status, setStatus] = useState("🔄 Đang kiểm tra Pi SDK...");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkPi = setInterval(() => {
        if (window.Pi && window.Pi.init && window.Pi.createPayment) {
          try {
            // ✅ Khởi tạo SDK cho Mainnet
            window.Pi.init({ version: "2.0", sandbox: false });
            setPi(window.Pi);
            setStatus("✅ Pi SDK đã sẵn sàng.");
            clearInterval(checkPi);
          } catch (err) {
            console.error("❌ Lỗi init SDK:", err);
            setStatus("❌ Lỗi khởi tạo SDK.");
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
        metadata: { type: "mainnet_test" },
        onReadyForServerApproval: (paymentId) => {
          console.log("✅ Ready for server approval:", paymentId);
          // 👇 Ở Mainnet bạn phải gọi API backend của bạn để approve transaction
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("✅ Ready for server completion:", paymentId, txid);
          // 👇 Bạn cũng cần gọi backend để complete
        },
        onCancel: (paymentId) => {
          console.warn("❌ Hủy thanh toán:", paymentId);
        },
        onError: (error, paymentId) => {
          console.error("❌ Lỗi thanh toán:", error, paymentId);
          setError("❌ Lỗi tạo thanh toán.");
        }
      });

      console.log("✅ Payment created:", payment);
    } catch (err) {
      console.error("❌ Lỗi ngoài:", err);
      setError("❌ Không thể tạo thanh toán.");
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>🏟 Arena Pi Payment Test (Mainnet)</h1>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handlePayment}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff9900',
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
