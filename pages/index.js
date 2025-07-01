// pages/index.js import { useEffect, useState } from 'react';

export default function Home() { const [pi, setPi] = useState(null); const [status, setStatus] = useState('🔄 Đang kiểm tra SDK...'); const [error, setError] = useState(null);

useEffect(() => { if (typeof window !== 'undefined') { const checkPi = setInterval(() => { if (window.Pi && window.Pi.init && window.Pi.createPayment) { try { // Khởi tạo Pi SDK với Mainnet window.Pi.init({ version: '2.0', sandbox: false }); setPi(window.Pi); setStatus('✅ Pi SDK đã sẵn sàng (Mainnet).'); clearInterval(checkPi); } catch (err) { console.error('❌ Lỗi khi init SDK:', err); setStatus('❌ Lỗi khi khởi tạo Pi SDK.'); clearInterval(checkPi); } } }, 500);

return () => clearInterval(checkPi);
}

}, []);

const handlePayment = async () => { if (!pi) { setError('❌ Pi SDK chưa sẵn sàng.'); return; }

try {
  const payment = await pi.createPayment({
    amount: 0.001,
    memo: 'Arena Mainnet Payment',
    metadata: { purpose: 'mainnet-test' },
    onReadyForServerApproval: (paymentId) => {
      console.log('✅ Sẵn sàng cho duyệt:', paymentId);
    },
    onReadyForServerCompletion: (paymentId, txid) => {
      console.log('✅ Sẵn sàng để hoàn tất:', paymentId, txid);
    },
    onCancel: (paymentId) => {
      console.warn('❌ Bị huỷ:', paymentId);
    },
    onError: (err, paymentId) => {
      console.error('❌ Lỗi:', err, paymentId);
    }
  });

  console.log('🎉 Payment created:', payment);
} catch (err) {
  console.error('❌ Lỗi khi tạo payment:', err);
  setError('❌ Đã xảy ra lỗi khi tạo thanh toán.');
}

};

return ( <main style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}> <h1>🏟 Arena Pi Payment Test (Mainnet)</h1> <p>{status}</p>

