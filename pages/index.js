import { useEffect, useState } from 'react';

export default function Home() {
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      console.log('✅ Pi SDK is loaded');
      setSdkReady(true);
    } else {
      console.log('❌ Pi SDK NOT loaded');
    }
  }, []);

  const handlePayment = () => {
    if (!window.Pi) {
      alert('Pi SDK chưa sẵn sàng!');
      return;
    }

    window.Pi.createPayment({
      amount: 0.001,
      memo: "Test payment",
      metadata: { example: "demo" },
      onReadyForServerApproval: paymentId => {
        console.log('Payment Ready for Approval:', paymentId);
      },
      onReadyForServerCompletion: paymentId => {
        console.log('Payment Ready for Completion:', paymentId);
      },
      onCancel: () => {
        console.log('Payment Cancelled');
      },
      onError: error => {
        console.error('Payment Error', error);
      }
    });
  };

  return (
    <main style={{ textAlign: 'center', marginTop: '100px' }}>
      <h1>Arena Pi Payment Test</h1>
      <button onClick={handlePayment} disabled={!sdkReady} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Thanh toán thử
      </button>
      {!sdkReady && <p style={{ color: 'red' }}>⚠️ Pi SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser.</p>}
    </main>
  );
}
useEffect(() => {
  if (typeof window !== "undefined") {
    if (window.Pi) {
      alert("✅ Pi SDK đã sẵn sàng!");
    } else {
      alert("❌ SDK chưa sẵn sàng. Hãy chắc chắn bạn đang mở trong Pi Browser.");
    }
  }
}, []);
