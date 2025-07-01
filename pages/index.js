// pages/index.js
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      console.log('Pi SDK loaded');
    } else {
      console.log('Pi SDK not found');
    }
  }, []);

  const handlePayment = () => {
    if (!window.Pi) {
      alert('Pi SDK chưa được tải. Hãy mở app này trong Pi Browser.');
      return;
    }

    window.Pi.createPayment({
      amount: 0.01,
      memo: "Test payment",
      metadata: { type: "test" },
      onReadyForServerApproval: (paymentId) => {
        console.log("Ready for server approval", paymentId);
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        console.log("Ready for server completion", paymentId, txid);
      },
      onCancel: (paymentId) => {
        console.log("Payment cancelled", paymentId);
      },
      onError: (error, payment) => {
        console.error("Payment error", error, payment);
      }
    });
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Test Pi Payment</h1>
      <p>Hãy nhấn vào nút dưới để thực hiện thanh toán thử.</p>
      <button
        onClick={handlePayment}
        style={{ padding: "12px 24px", fontSize: "16px", cursor: "pointer" }}
      >
        Thanh toán thử
      </button>
    </div>
  );
}
