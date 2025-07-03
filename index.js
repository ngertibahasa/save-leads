require("dotenv").config(); // Muat variabel lingkungan dari .env
const express = require("express");
const cors = require("cors"); // Untuk mengatasi CORS policy jika frontend dan backend berbeda domain
const app = express();
const port = process.env.PORT || 3000; // Port server, default 3000

// Middleware
app.use(cors()); // Izinkan semua permintaan CORS (sesuaikan di produksi)
app.use(express.json()); // Izinkan Express untuk mengurai JSON body

// Endpoint untuk Konsultasi
app.post("/api/konsultasi", async (req, res) => {
  const { Nama, Usia, Domisili, Program } = req.body;

  if (!Nama || !Usia || !Domisili || !Program) {
    return res.status(400).json({
      status: "error",
      message: "Nama, Usia, Domisili dan Program wajib diisi.",
    });
  }

  const appScriptUrl = process.env.APPSCRIPT_URL; // URL Web App App Script Anda
  if (!appScriptUrl) {
    console.error("APPSCRIPT_URL tidak ditemukan di .env");
    return res
      .status(500)
      .json({ status: "error", message: "Konfigurasi server bermasalah." });
  }

  try {
    const response = await fetch(appScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "konsultasi",
        Nama,
        Usia,
        Domisili,
        Program,
      }),
    });

    const data = await response.json();
    if (data.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Data Konsultasi berhasil dikirim.",
      });
    } else {
      res.status(500).json({
        status: "error",
        message:
          data.message || "Gagal menyimpan data Konsultasi ke Spreadsheet.",
      });
    }
  } catch (error) {
    console.error("Error mengirim data konsultasi ke App Script:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server saat menyimpan data konsultasi.",
    });
  }
});

// Endpoint untuk Registrasi
app.post("/api/registrasi", async (req, res) => {
  const { Nama, Usia, NoWA, Email, Program, Jam, Domisili, TauNBdariMana } =
    req.body;

  // Validasi sederhana (sesuaikan kebutuhan Anda)
  if (!Nama || !Usia || !NoWA || !Program || !Jam) {
    return res.status(400).json({
      status: "error",
      message: "Nama, Usia, No WA, Program, dan Jam wajib diisi.",
    });
  }

  const appScriptUrl = process.env.APPSCRIPT_URL; // URL Web App App Script Anda
  if (!appScriptUrl) {
    console.error("APPSCRIPT_URL tidak ditemukan di .env");
    return res
      .status(500)
      .json({ status: "error", message: "Konfigurasi server bermasalah." });
  }

  try {
    const response = await fetch(appScriptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "registrasi",
        Nama,
        Usia,
        NoWA,
        Email,
        Program,
        Jam,
        Domisili,
        TauNBdariMana,
      }),
    });

    const data = await response.json();
    if (data.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Data Registrasi berhasil dikirim.",
      });
    } else {
      res.status(500).json({
        status: "error",
        message:
          data.message || "Gagal menyimpan data Registrasi ke Spreadsheet.",
      });
    }
  } catch (error) {
    console.error("Error mengirim data registrasi ke App Script:", error);
    res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan server saat menyimpan data registrasi.",
    });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
