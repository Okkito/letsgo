import { chromium } from "playwright";

const URL = "https://waitwhile.com/locations/londoneuic2026";

async function sendTelegram(msg) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: msg,
      disable_web_page_preview: true,
    }),
  });
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "networkidle" });

  const isOpen = await page.evaluate(() => {
    return document.body.innerText.includes("Join waitlist");
  });

  if (isOpen) {
    await sendTelegram(
      "🚨 WAITLIST ABIERTA 🚨\nhttps://waitwhile.com/locations/londoneuic2026"
    );
    process.exit(1);
  }

  console.log("Still closed");
  await browser.close();
})();
