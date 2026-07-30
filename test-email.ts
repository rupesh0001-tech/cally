import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;
const from = process.env.EMAIL_FROM || "otp@rupeshhh.in";

console.log(`🔍 Checking RESEND_API_KEY: ${key ? "FOUND (" + key.substring(0, 7) + "...)" : "❌ NOT SET (EMPTY)"}`);

if (!key) {
  console.error("❌ ERROR: RESEND_API_KEY is missing from environment variables!");
  process.exit(1);
}

const resend = new Resend(key);

async function run() {
  console.log(`Sending test email to rupeshjagtap157@gmail.com from ${from}...`);
  try {
    const res = await resend.emails.send({
      from: `Cally <${from}>`,
      to: ["rupeshjagtap157@gmail.com"],
      subject: "AWS EC2 Worker Test Email",
      html: "<div style='font-family: sans-serif; padding: 20px;'><h2>AWS Worker Verified!</h2><p>This email proves your AWS EC2 worker container is correctly sending real emails via Resend.</p></div>",
    });
    console.log("✅ SUCCESS! Resend API response:", JSON.stringify(res, null, 2));
  } catch (err) {
    console.error("❌ Resend API error:", err);
  }
}

run();
