import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("🔄 Đang kiểm tra Pi SDK...");
  const [pi, setPi] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        window.Pi &&
        window.Pi.createPayment &&
        window.Pi.init
      ) {
        try {
          window.Pi.init({ version: "2.0", sandbox: true });
          setPi(window.Pi);
          setStatus("✅ Pi SDK đã sẵn sàng.");
        } catch (err) {
          console.error("❌ Lỗi khởi tạo SDK:", err);
          setStatus("❌ Không thể khởi tạo Pi SDK");
        }
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handlePayment = async () => {
    if (!pi) {
      alert("❌ Pi SDK chưa sẵn sàng.");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 1,
        memo: "Arena Pi Test Payment",
        metadata: { arena: true },
        onError: (err) => console.error("❌ Lỗi:", err),
      });
      console.log("💰 Tạo payment:", payment);
    } catch (err) {
      console.error("❌ Tạo payment lỗi:", err);
      setStatus("❌ Không thể tạo thanh toán");
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🏟 Arena Pi Payment Test (Testnet)</h1>
      <p>{status}</p>
      <button onClick={handlePayment} disabled={!pi}>
        💰 Thanh toán Test Pi
      </button>
    </main>
  );
}
