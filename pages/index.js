import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.Pi) {
        alert("✅ Pi SDK đã sẵn sàng!");
      } else {
        alert("❌ SDK chưa sẵn sàng. Hãy chắc chắn bạn đang mở trong Pi Browser.");
      }
    }
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Arena Pi Payment Test</h1>
      <p>Nhấn nút bên dưới để thanh toán thử:</p>
      <button onClick={() => {
        if (window?.Pi) {
          window.Pi.createPayment({
            amount: 0.001,
            memo: "Test payment",
            metadata: { example: "test" }
          }, {
            onReadyForServerApproval: (paymentId) => console.log("Ready for approval", paymentId),
            onReadyForServerCompletion: (paymentId, txid) => console.log("Complete payment", paymentId, txid),
            onCancel: (paymentId) => console.log("Cancelled", paymentId),
            onError: (err, paymentId) => console.error("Error", err)
          });
        } else {
          alert("⚠️ Pi SDK chưa sẵn sàng. Vui lòng mở bằng Pi Browser.");
        }
      }}>Thanh toán thử</button>
    </div>
  );
}
