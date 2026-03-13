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

export const maxDuration = 30;

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

  const screenshotUrl = `https://image.thum.io/get/${targetUrl}`;

  return Response.redirect(screenshotUrl, 302);
}