import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      window.Pi.init({ version: "2.0" });
    }
  }, []);

  const handlePayment = async () => {
    if (!window.Pi) {
      alert('Pi Network SDK chưa được tải đúng. Hãy kiểm tra tích hợp SDK.');
      return;
    }

    try {
      const paymentData = {
        amount: 0.001,
        memo: "Test Payment for Domain Verification",
        metadata: { type: "test" }
      };

      const callbacks = {
        onReadyForServerApproval: (paymentId) => {
          console.log("Ready for server approval:", paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("Ready for server completion:", paymentId, txid);
        },
        onCancel: (paymentId) => {
          console.log("Payment cancelled:", paymentId);
        },
        onError: (error, payment) => {
          console.error("Payment error:", error, payment);
        }
      };

      window.Pi.createPayment(paymentData, callbacks);
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>Pi Arena App</h1>
      <p>Nhấn nút bên dưới để test thanh toán trên Pi Testnet.</p>
      <button 
        onClick={handlePayment}
        style={{ padding: '1rem 2rem', fontSize: '1.2rem', cursor: 'pointer' }}
      >
        Thanh toán thử
      </button>
    </div>
  );
}

