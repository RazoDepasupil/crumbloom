import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

app.get("/health", (_req, res) =>
  res.json({ status: "ok", message: "Crumb & Bloom API running 🍪" }),
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // 1. Validate inputs before doing anything
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "All fields are required.",
    });
  }

  try {
    await transporter.sendMail({
      from: `${name} <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `Message from ${name}`,
      text: message,
    });

    res.json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error: any) {
    // 2. Log internally, return a safe generic message to the client
    console.error("Mail error:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to send email. Please try again later.",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
