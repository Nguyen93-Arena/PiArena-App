import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Pi) {
      console.log("✅ Pi SDK đã được tải.");
    } else {
      console.warn("⚠️ Pi SDK chưa có sẵn. Hãy chắc chắn bạn mở app này trong Pi Browser.");
    }
  }, []);

  const handlePayment = () => {
    if (typeof window !== 'undefined' && window.Pi) {
      window.Pi.createPayment({
        amount: 0.001,
        memo: "Test payment from PiArena",
        metadata: { type: "test" },

        onReadyForServerApproval: (paymentId) => {
          console.log("✔️ Sẵn sàng để xác nhận trên server:", paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("✔️ Sẵn sàng để hoàn tất trên server:", paymentId, txid);
        },
        onCancel: (paymentId) => {
          console.log("❌ Giao dịch bị hủy:", paymentId);
        },
        onError: (error, payment) => {
          console.error("❌ Lỗi khi thanh toán:", error);
        }
      });
    } else {
      alert("Pi SDK chưa sẵn sàng. Vui lòng mở app trong Pi Browser.");
    }
  };

  return (
    <main style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Chào mừng đến với PiArena</h1>
      <p>Nhấn nút bên dưới để thanh toán thử nghiệm</p>
      <button onClick={handlePayment} style={{
        padding: '1rem 2rem',
        backgroundColor: '#8247e5',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '1rem'
      }}>
        Thanh toán thử (0.001π)
      </button>
    </main>
  );
}
