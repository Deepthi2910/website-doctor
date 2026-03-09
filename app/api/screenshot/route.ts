import puppeteer from "puppeteer";

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
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });

    await page.goto(targetUrl, {
      waitUntil: "networkidle2",
      timeout: 30000,
    });

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
    return new Response(`Failed to capture screenshot for ${targetUrl}`, {
      status: 500,
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}