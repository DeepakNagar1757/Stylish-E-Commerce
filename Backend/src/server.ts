import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const PORT = 5000;

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });


console.log("🔑 Checking environment variables:");
console.log(
  "BREVO_API_KEY:",
  process.env.BREVO_API_KEY ? "✅ Loaded" : "❌ Missing",
);
console.log(
  "BREVO_SENDER_EMAIL:",
  process.env.BREVO_SENDER_EMAIL || "❌ Missing",
);
console.log(
  "BREVO_SENDER_NAME:",
  process.env.BREVO_SENDER_NAME || "❌ Missing",
);
