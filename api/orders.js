export default function handler(req, res) {
  if (req.method === "POST") {
    return res.status(200).json({
      success: true,
      message: "Order diterima"
    });
  }

  return res.status(200).json({
    success: true,
    message: "API orders aktif"
  });
}
