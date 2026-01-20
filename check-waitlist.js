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

async function checkWaitlist() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(URL, { waitUntil: "load", timeout: 60000 });

  const isClosed = await page.evaluate(() => {
    return document.body.innerText.includes("Registration is closed at the moment");
  });

  const isOpen = !isClosed || !!document.querySelector('button:contains("Join waitlist")') || document.body.innerText.includes("Join waitlist");

  if (isOpen) {
    await sendTelegram(
      "WAITLIST ABIERTA \nhttps://waitwhile.com/locations/londoneuic2026"
    );
  } else {
    console.log("Aún cerrada la waitlist. Test OK");
  }

  console.log(isOpen ? "ABIERTA" : "CERRADA");
  await browser.close();
}

// LOOP infinito
(async () => {
  while (true) {
    try {
      await checkWaitlist();
    } catch (e) {
      console.error("Error en el check:", e);
    }
    // Espera 2 minutos
    await new Promise(r => setTimeout(r, 2 * 60 * 1000));
  }
})();
