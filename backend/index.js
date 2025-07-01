onReadyForServerApproval: async (paymentId) => {
  try {
    const res = await fetch("https://your-backend.vercel.app/api/payment/approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId })
    });
    const data = await res.json();
    console.log("✅ Approve response:", data);
  } catch (err) {
    console.error("❌ Approve failed:", err);
  }
},

onReadyForServerCompletion: async (paymentId, txid) => {
  try {
    const res = await fetch("https://your-backend.vercel.app/api/payment/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentId, txid })
    });
    const data = await res.json();
    console.log("✅ Complete response:", data);
  } catch (err) {
    console.error("❌ Completion failed:", err);
  }
},
