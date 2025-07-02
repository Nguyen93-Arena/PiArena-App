import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("🔄 Đang kiểm tra Pi SDK...");
  const [pi, setPi] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        window.Pi &&
        window.Pi.createPayment &&
        window.Pi.init
      ) {
        try {
          window.Pi.init({ version: "2.0", sandbox: false }); // ✅ Mainnet
          setPi(window.Pi);
          setStatus("✅ Pi SDK đã sẵn sàng.");
        } catch (err) {
          setStatus("❌ Không khởi tạo được Pi SDK.");
          console.error(err);
        } finally {
          clearInterval(interval);
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handlePayment = async () => {
    if (!pi) {
      setStatus("❌ Pi SDK chưa sẵn sàng. Hãy mở bằng Pi Browser.");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 1,
        memo: "Arena Pi Mainnet Payment",
        metadata: { arena: true },

        onReadyForServerApproval: async (paymentId) => {
          setStatus("⏳ Đang gửi phê duyệt đến server...");
          try {
            const res = await fetch(
              "https://arena-pi.onrender.com/api/payment/approve",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId }),
              }
            );
            const data = await res.json();
            if (data.success) {
              setStatus("✅ Server đã phê duyệt giao dịch.");
            } else {
              setStatus("❌ Server từ chối approve.");
            }
          } catch (err) {
            console.error("❌ Approve failed:", err);
            setStatus("❌ Lỗi khi gọi API approve.");
          }
        },

        onReadyForServerCompletion: async (paymentId, txid) => {
          setStatus("⏳ Đang xác nhận hoàn tất thanh toán...");
          try {
            const res = await fetch(
              "https://arena-pi.onrender.com/api/payment/complete",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ paymentId, txid }),
              }
            );
            const data = await res.json();
            if (data.success) {
              setStatus("🎉 Giao dịch đã hoàn tất thành công!");
            } else {
              setStatus("❌ Server từ chối complete.");
            }
          } catch (err) {
            console.error("❌ Completion failed:", err);
            setStatus("❌ Lỗi khi gọi API complete.");
          }
        },

        onCancel: (paymentId) => {
          setStatus("❌ Người dùng đã huỷ giao dịch.");
        },

        onError: (error, payment) => {
          console.error("❌ Payment Error:", error, payment);
          setStatus(`❌ Lỗi trong quá trình thanh toán: ${error?.message || "Không rõ lỗi"}`);
        },
      });

      console.log("💰 Payment created:", payment);
      setStatus("📤 Đã tạo giao dịch, chờ người dùng xác nhận...");
    } catch (err) {
      console.error("❌ Tạo payment lỗi:", err);
      setStatus("❌ Không thể tạo thanh toán. Kiểm tra Pi SDK hoặc mạng.");
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🏟 Arena Pi Payment Test (Mainnet)</h1>
      <p>{status}</p>
      <button onClick={handlePayment} disabled={!pi}>
        💰 Thanh toán Pi Thật
      </button>
    </main>
  );
}
