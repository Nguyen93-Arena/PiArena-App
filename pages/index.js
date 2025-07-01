import { useEffect, useState } from "react";

export default function Home() {
  const [pi, setPi] = useState(null);
  const [status, setStatus] = useState("🔄 Đang khởi tạo Pi SDK...");
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkPi = setInterval(() => {
        if (window.Pi && window.Pi.init && window.Pi.authenticate && window.Pi.createPayment) {
          try {
            // 🔒 Khởi tạo SDK ở chế độ MAINNET
            window.Pi.init({ version: "2.0", sandbox: false });

            // ✅ Xác thực người dùng
            window.Pi.authenticate(["username"], (user) => {
              if (user && user.username) {
                setUsername(user.username);
                console.log("👤 Đăng nhập với Pi:", user.username);
              }
            });

            setPi(window.Pi);
            setStatus("✅ Pi SDK đã sẵn sàng.");
            clearInterval(checkPi);
          } catch (err) {
            console.error("❌ Lỗi khởi tạo SDK:", err);
            setStatus("❌ Lỗi khi khởi tạo Pi SDK.");
            clearInterval(checkPi);
          }
        }
      }, 500);

      return () => clearInterval(checkPi);
    }
  }, []);

  const handlePayment = async () => {
    setError(null);
    if (!pi) {
      setError("❌ Pi SDK chưa sẵn sàng.");
      return;
    }

    try {
      const payment = await pi.createPayment({
        amount: 0.001,
        memo: "Arena Mainnet Test Payment",
        metadata: { type: "mainnet-test" },
        onReadyForServerApproval: (paymentId) => {
          console.log("🔄 Ready for server approval:", paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log("✅ Ready for server completion:", paymentId, txid);
        },
        onCancel: (paymentId) => {
          console.warn("❌ Bị huỷ:", paymentId);
        },
        onError: (err, paymentId) => {
          console.error("❌ Lỗi:", err, paymentId);
          setError("❌ Lỗi trong quá trình thanh toán.");
        },
      });

      console.log("🎉 Payment created:", payment);
    } catch (err) {
      console.error("❌ Lỗi khi tạo payment:", err);
      setError("❌ Không thể tạo thanh toán.");
    }
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>🏟 Arena Pi Payment Test (Mainnet)</h1>
      <p>{status}</p>
      {username && <p>👤 Đăng nhập với: <strong>{username}</strong></p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={handlePayment}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          marginTop: "1rem",
          backgroundColor: "#ff9900",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        💰 Thanh toán Pi Thật
      </button>
    </main>
  );
}
