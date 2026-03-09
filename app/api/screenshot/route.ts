import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";

function normalizeUrl(input: string) {
  const trimmed = input.trim();

  if (!trimmed) {
    throw new Error("Empty URL");
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rawUrl = searchParams.get("url");

  if (!rawUrl) {
    return new Response("Missing url", { status: 400 });
  }

  let targetUrl: string;

  try {
    targetUrl = normalizeUrl(rawUrl);
  } catch {
    return new Response("Invalid url", { status: 400 });
  }

  let browser;

  try {
    const isVercel = !!process.env.VERCEL;

    if (isVercel) {
      browser = await puppeteerCore.launch({
        args: chromium.args,
        defaultViewport: {
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
        },
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    } else {
      const puppeteer = (await import("puppeteer")).default;
      browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        defaultViewport: {
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
        },
      });
    }

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "Accept-Language": "en-US,en;q=0.9",
    });

    await page.goto(targetUrl, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    await new Promise((resolve) => setTimeout(resolve, 2500));

    const screenshot = await page.screenshot({
      type: "png",
      fullPage: false,
    });

    return new Response(Buffer.from(screenshot), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Screenshot error:", error);
    return new Response("Failed to capture screenshot", { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}