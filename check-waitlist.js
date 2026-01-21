import { chromium } from "playwright";

const URL = "https://waitwhile.com/locations/londoneuic2026";

async function sendTelegram(msg) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  console.log("Intentando enviar Telegram:");
  console.log("TOKEN:", token ? "✅ presente" : "❌ ausente");
  console.log("CHAT_ID:", chatId ? chatId : "❌ ausente");
  console.log("Mensaje:", msg);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: msg, disable_web_page_preview: true }),
    });

    if (!res.ok) {
      console.error("Error enviando Telegram:", await res.text());
    } else {
      console.log("Mensaje enviado correctamente ✅");
    }
  } catch (e) {
    console.error("Excepción en sendTelegram:", e);
  }
}

async function checkWaitlist() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto(URL, { waitUntil: "load", timeout: 60000 });
    await page.waitForSelector("body", { timeout: 10000 });

    const isClosed = await page.evaluate(() =>
      document.body.innerText.includes("Registration is closed at the moment")
    );

    const isOpen = !isClosed;

    if (isOpen) {
      await sendTelegram(
        "WAITLIST ABIERTA \nhttps://waitwhile.com/locations/londoneuic2026"
      );
    } else {
      //await sendTelegram("Aún cerrada la waitlist. Test OK");
      console.log("Aún cerrada la waitlist. Test OK");
    }

    console.log(isOpen ? "ABIERTA" : "CERRADA");
  } catch (e) {
    console.error("Error en checkWaitlist:", e);
  } finally {
    await browser.close();
  }
}

(async () => {
  try {
    await checkWaitlist();
  } catch (e) {
    console.error("Error general:", e);
  }
})();
