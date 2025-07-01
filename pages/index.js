import { useEffect, useState } from 'react';

export default function Home() {
  const [pi, setPi] = useState(null);
  const [status, setStatus] = useState("🔄 Đang kiểm tra Pi SDK...");
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

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
            console.error("Lỗi init Pi SDK:", err);
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
        memo: "Arena Mainnet Payment",
        metadata: { purpose: "test" },
        onReadyForServerApproval: (paymentId) => {
          console.log("🔐 Server Approval:", paymentId);
          setResult(`🔐 Server Approval: ${paymentId}`);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("✅ Completed:", paymentId, txid);
          setResult(`✅ Completed: ${paymentId}, TxID: ${txid}`);
        },
        onCancel: (paymentId) => {
          console.warn("❌ Huỷ:", paymentId);
          setResult(`❌ Huỷ: ${paymentId}`);
        },
        onError: (err, paymentId) => {
          console.error("❌ Lỗi:", err, paymentId);
          setResult(`❌ Lỗi: ${err?.message || "Không rõ"} (${paymentId})`);
        }
      });

      console.log("🎉 Payment data:", payment);
    } catch (err) {
      console.error("❌ Lỗi ngoài createPayment:", err);
      setError("❌ Đã xảy ra lỗi khi tạo thanh toán.");
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>🏟 Arena Pi Payment Test (Mainnet)</h1>
      <p>{status}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <p style={{ color: 'green' }}>{result}</p>}
      <button
        onClick={handlePayment}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '1rem',
          backgroundColor: '#28a745',
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
