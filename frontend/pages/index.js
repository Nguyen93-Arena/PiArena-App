export default function Home() { const [status, setStatus] = useState("\uD83D\uDD04 \u0110ang kiểm tra Pi SDK..."); const [pi, setPi] = useState(null);

useEffect(() => { // Kiểm tra Pi SDK const interval = setInterval(() => { if ( typeof window !== "undefined" && window.Pi && window.Pi.createPayment && window.Pi.init ) { try { window.Pi.init({ version: "2.0", sandbox: false }); // Mainnet setPi(window.Pi); setStatus("\u2705 Pi SDK đ\u00e3 sẵn sàng (Mainnet)."); } catch (err) { setStatus("\u274C Không khởi tạo được Pi SDK."); console.error(err); } finally { clearInterval(interval); } } }, 500);

// Gửi authCode về backend để xác minh
const urlParams = new URLSearchParams(window.location.search);
const authCode = urlParams.get("authCode");
if (authCode) {
  fetch("https://arena-pi.onrender.com/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ authCode }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("\u2705 Xác minh authCode thành công:", data);
    })
    .catch((err) => {
      console.error("\u274C Xác minh authCode thất bại:", err);
    });
}

return () => clearInterval(interval);

}, []);

const handlePayment = async () => { if (!pi) { alert("\u274C Pi SDK chưa sẵn sàng. Hãy mở trong Pi Browser (Mainnet)."); return; }

try {
  const payment = await pi.createPayment({
    amount: 1,
    memo: "Arena Pi Mainnet Payment",
    metadata: { arena: true },
    onReadyForServerApproval: async (paymentId) => {
      const res = await fetch("https://arena-pi.onrender.com/api/payment/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId }),
      });
      console.log("✅ Approve:", await res.json());
    },
    onReadyForServerCompletion: async (paymentId, txid) => {
      const res = await fetch("https://arena-pi.onrender.com/api/payment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId, txid }),
      });
      console.log("✅ Complete:", await res.json());
    },
    onCancel: (paymentId) => console.warn("❌ Cancelled:", paymentId),
    onError: (error, payment) => console.error("❌ Error:", error, payment),
  });

  console.log("💰 Payment created:", payment);
} catch (err) {
  console.error("❌ Không thể tạo thanh toán. Kiểm tra Pi SDK hoặc mạng.", err);
  setStatus("❌ Không thể tạo thanh toán. Kiểm tra Pi SDK hoặc mạng.");
}

};

return ( <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}> <h1>🏟 Arena Pi Payment Test (Mainnet)</h1> <p>{status}</p> <button onClick={handlePayment} disabled={!pi}> 💰 Thanh toán Pi Thật </button> </main> ); }

