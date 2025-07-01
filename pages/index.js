// pages/index.js
import { useEffect, useState } from 'react';

export default function Home() {
  const [piReady, setPiReady] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkPi = setInterval(() => {
      if (typeof window !== 'undefined' && window.Pi) {
        try {
          // Khởi tạo SDK
          window.Pi.init({
            version: "2.0",
            sandbox: true // Bỏ dòng này nếu bạn đang chạy trên mainnet
          });
          setPiReady(true);
          clearInterval(checkPi);
        } catch (e) {
          setMessage('⚠️ Không thể khởi tạo Pi SDK');
        }
      }
    }, 500);
  }, []);

  const handleTestPayment = async () => {
    if (!piReady || !window.Pi) {
      setMessage('⚠️ Pi SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser.');
      return;
    }

    try {
      const payment = await window.Pi.createPayment({
        amount: 0.001,
        memo: "Test Payment",
        metadata: { type: "test" },
      });

      setMessage(`✅ Thanh toán thành công! Payment ID: ${payment.identifier}`);
    } catch (error) {
      setMessage(`❌ Lỗi: ${error.message || error}`);
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1># Arena Pi Payment Test</h1>
      <button onClick={handleTestPayment} style={{ padding: '10px 20px' }}>
        Thanh toán thử
      </button>
      <p style={{ marginTop: '20px', color: 'red' }}>{message}</p>
    </main>
  );
}
