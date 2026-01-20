import { chromium } from "playwright";

const URL = "https://waitwhile.com/locations/londoneuic2026";

async function sendTelegram(msg) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
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

  await page.goto(URL, { waitUntil: "load", timeout: 60000 });


  const isOpen = await page.evaluate(() =>
    document.body.innerText.includes("Join waitlist")
  );

  if (isOpen) {
    await sendTelegram(
      "WAITLIST ABIERTA \nhttps://waitwhile.com/locations/londoneuic2026"
    );
  } else {
    await sendTelegram(" Aún cerrada la waitlist. Test OK ");
  }

  console.log(isOpen ? "ABIERTA" : "CERRADA");
  await browser.close();
})();
