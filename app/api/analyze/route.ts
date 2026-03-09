export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== "string") {
      return Response.json({ error: "Valid URL is required" }, { status: 400 });
    }

    const normalizedUrl = /^https?:\/\//i.test(url.trim())
      ? url.trim()
      : `https://${url.trim()}`;

    const hostname = new URL(normalizedUrl).hostname.replace("www.", "");

    const pageRes = await fetch(normalizedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
    });

    if (!pageRes.ok) {
      return Response.json(
        { error: `Failed to fetch website: ${pageRes.status}` },
        { status: 400 }
      );
    }

    const html = await pageRes.text();
    const lowerHtml = html.toLowerCase();

    const blockedSignals = [
      "captcha",
      "robot check",
      "sorry, we just need to make sure you're not a robot",
      "enter the characters you see below",
    ];

    if (blockedSignals.some((signal) => lowerHtml.includes(signal))) {
      return Response.json(
        { error: "This website is blocking automated analysis." },
        { status: 400 }
      );
    }

    const cleanText = (value: string) =>
      value
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, " ")
        .trim();

    const isUsefulText = (text: string) => {
      if (!text) return false;
      if (text.length < 2) return false;
      if (text.length > 120) return false;

      const lower = text.toLowerCase();

      const junkPatterns = [
        "document.getelementbyid",
        "eval(",
        "decodeuricomponent",
        "javascript:",
        "protected email",
        "__cf_email__",
        "mailto:",
        "function(",
        "var ",
        "const ",
        "window.",
        "innerhtml",
        "onclick",
        "return false",
      ];

      if (junkPatterns.some((pattern) => lower.includes(pattern))) {
        return false;
      }

      return /[a-zA-Z]/.test(text);
    };

    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const metaDescriptionMatch = html.match(
      /<meta[^>]*name=["']description["'][^>]*content=["']([^"]*)["'][^>]*>/i
    );

    const h1Matches = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gi)]
      .map((m) => cleanText(m[1]))
      .filter(isUsefulText);

    const h2Matches = [...html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi)]
      .map((m) => cleanText(m[1]))
      .filter(isUsefulText);

    const buttonMatches = [...html.matchAll(/<button[^>]*>(.*?)<\/button>/gi)]
      .map((m) => cleanText(m[1]))
      .filter(isUsefulText);

    const anchorTextMatches = [...html.matchAll(/<a\b[^>]*>(.*?)<\/a>/gi)]
      .map((m) => cleanText(m[1]))
      .filter(isUsefulText);

    const linkMatches = [...html.matchAll(/<a\s+[^>]*href=["']([^"']+)["']/gi)].map(
      (m) => m[1]
    );

    const imageMatches = [...html.matchAll(/<img\b/gi)];
    const altMatches = [...html.matchAll(/<img[^>]*alt=["']([^"']*)["'][^>]*>/gi)];
    const missingAltEstimate = Math.max(imageMatches.length - altMatches.length, 0);

    const title = titleMatch?.[1]?.trim() || "No title found";
    const metaDescription =
      metaDescriptionMatch?.[1]?.trim() || "No meta description found";

    const internalLinks = linkMatches.filter(
      (href) => href.startsWith("/") || href.includes(hostname)
    ).length;

    const externalLinks = linkMatches.filter(
      (href) => href.startsWith("http") && !href.includes(hostname)
    ).length;

    const pageLabel =
      h1Matches[0] ||
      title.replace(/\s*\|\s*.*/, "").replace(/\s*-\s*.*/, "").trim() ||
      hostname;

    const ctaRegex =
      /^(start|get|try|book|sign|contact|learn|shop|download|join|buy|explore|discover|read|view|see)/i;

    const ctaCandidates = [...buttonMatches, ...anchorTextMatches].filter((text) =>
      ctaRegex.test(text)
    );

    const primaryButton =
      ctaCandidates[0] || buttonMatches[0] || anchorTextMatches[0] || "main action";

    const hasObviousCTA = [...buttonMatches, ...anchorTextMatches].some((text) =>
      ctaRegex.test(text)
    );

    const issues: string[] = [];
    const recommendations: string[] = [];

    let performance = 78;
    let accessibility = 78;
    let seo = 78;
    let design = 78;

    if (title === "No title found") {
      seo -= 20;
      issues.push("The page is missing a title tag, which weakens search visibility.");
      recommendations.push(
        `Add a descriptive title tag focused on "${pageLabel}" so search engines and users understand the page immediately.`
      );
    } else if (title.length < 25) {
      seo -= 8;
      issues.push(`The title "${title}" is quite short and may not communicate enough context.`);
      recommendations.push(
        `Expand the title "${title}" with clearer keywords so the page intent is stronger in search results.`
      );
    } else if (title.length > 65) {
      seo -= 6;
      issues.push(`The title "${title}" may be too long and could be truncated in search results.`);
      recommendations.push(
        `Shorten the title while keeping "${pageLabel}" prominent near the beginning.`
      );
    }

    if (metaDescription === "No meta description found") {
      seo -= 15;
      issues.push("The page has no meta description.");
      recommendations.push(
        `Write a meta description that explains the value of "${pageLabel}" in one compelling sentence.`
      );
    } else if (metaDescription.length < 70) {
      seo -= 6;
      issues.push("The meta description is too short to communicate enough value.");
      recommendations.push(
        `Expand the meta description with a clearer summary of what users get from "${pageLabel}".`
      );
    }

    if (h1Matches.length === 0) {
      seo -= 15;
      design -= 6;
      issues.push("No H1 heading was found, so the page lacks a clear top-level message.");
      recommendations.push(
        "Add one strong H1 heading above the fold so users instantly understand the main purpose of the page."
      );
    } else if (h1Matches.length > 1) {
      seo -= 8;
      design -= 5;
      issues.push(
        `Multiple H1 headings were found (${h1Matches.length}), which weakens content hierarchy.`
      );
      recommendations.push(
        `Keep one primary H1 focused on "${h1Matches[0]}" and move supporting sections into H2 headings.`
      );
    } else if (h2Matches.length === 0) {
      seo -= 8;
      design -= 6;
      issues.push(`The page has an H1 ("${h1Matches[0]}") but no H2 sections to support it.`);
      recommendations.push(
        `Break "${h1Matches[0]}" into clearer supporting sections with H2 headings so the page is easier to scan.`
      );
    }

    if (!hasObviousCTA) {
      design -= 14;
      issues.push("No obvious call-to-action was detected.");
      recommendations.push(
        `Add a visible primary CTA near the top of the page so users know what to do next after reading about "${pageLabel}".`
      );
    } else if (primaryButton !== "main action" && isUsefulText(primaryButton)) {
      recommendations.push(
        `Make the primary action "${primaryButton}" more visually prominent so it stands out from secondary links.`
      );
    }

    if (imageMatches.length > 15) {
      performance -= 12;
      issues.push(
        `The page appears image-heavy (${imageMatches.length} images), which may hurt loading speed.`
      );
      recommendations.push(
        `Compress and lazy-load non-critical images so "${pageLabel}" loads faster, especially on mobile.`
      );
    } else if (imageMatches.length === 0) {
      design -= 6;
      issues.push("No images were detected, which may make the page feel text-heavy.");
      recommendations.push(
        `Consider adding one strong visual that supports "${pageLabel}" and improves first impression.`
      );
    }

    if (missingAltEstimate > 0) {
      accessibility -= 12;
      issues.push(`Some images may be missing alt text (${missingAltEstimate} estimated).`);
      recommendations.push(
        "Add descriptive alt text to important images so screen reader users can understand the visual content."
      );
    }

    if (internalLinks < 3) {
      design -= 8;
      seo -= 4;
      issues.push("Internal navigation looks limited, which may reduce discoverability.");
      recommendations.push(
        `Add clearer internal links to key sections or related pages so users can explore more of ${hostname}.`
      );
    } else if (internalLinks > 20) {
      design -= 4;
      issues.push(`The page contains many internal links (${internalLinks}), which may feel crowded.`);
      recommendations.push(
        "Reduce competing navigation choices and guide users toward the most important next step."
      );
    }

    if (externalLinks > 20) {
      design -= 6;
      issues.push(
        `The page includes many external links (${externalLinks}), which may distract users from the main journey.`
      );
      recommendations.push(
        "Keep users focused on the primary conversion path before sending them to external destinations."
      );
    }

    const keywordSignals = [
      ...h1Matches,
      ...h2Matches.slice(0, 3),
      ...buttonMatches.slice(0, 3),
    ].filter(isUsefulText);

    if (keywordSignals.length > 0) {
      recommendations.push(
        `Align the visual hierarchy more tightly around "${keywordSignals[0]}" so the core message is clearer within the first few seconds.`
      );
    }

    let priorityFix = "";

    if (title === "No title found") {
      priorityFix = `Add a clear title tag for "${pageLabel}" because this is the fastest way to improve SEO clarity.`;
    } else if (h1Matches.length === 0) {
      priorityFix =
        "Add one strong H1 heading above the fold so visitors immediately understand the page purpose.";
    } else if (!hasObviousCTA) {
      priorityFix = `Introduce a strong primary CTA tied to "${pageLabel}" so users have an obvious next action.`;
    } else if (metaDescription === "No meta description found") {
      priorityFix = `Write a better meta description for "${pageLabel}" to improve click-through from search results.`;
    } else if (imageMatches.length > 15) {
      priorityFix = "Optimize image delivery on this page to improve speed and first-load experience.";
    } else if (missingAltEstimate > 0) {
      priorityFix =
        "Add alt text to meaningful images so the page is more accessible to screen reader users.";
    } else if (h2Matches.length === 0 && h1Matches.length > 0) {
      priorityFix = `Add supporting H2 sections under "${h1Matches[0]}" to improve scannability and structure.`;
    } else {
      priorityFix = `Strengthen the hierarchy and emphasis around "${primaryButton}" so the page drives a clearer user journey.`;
    }

    const uniqueIssues = [...new Set(issues)].slice(0, 6);
    const uniqueRecommendations = [...new Set(recommendations)].slice(0, 6);

    return Response.json({
      url: normalizedUrl,
      pageData: {
        title,
        metaDescription,
        h1s: h1Matches,
        h2s: h2Matches,
        buttons: buttonMatches,
        imageCount: imageMatches.length,
        internalLinks,
        externalLinks,
      },
      scores: {
        performance: Math.max(0, Math.min(100, performance)),
        accessibility: Math.max(0, Math.min(100, accessibility)),
        seo: Math.max(0, Math.min(100, seo)),
        design: Math.max(0, Math.min(100, design)),
      },
      issues:
        uniqueIssues.length > 0
          ? uniqueIssues
          : [`No major structural issues were detected on ${hostname} during the initial scan.`],
      recommendations:
        uniqueRecommendations.length > 0
          ? uniqueRecommendations
          : [`Refine the hierarchy, content clarity, and CTA emphasis on "${pageLabel}".`],
      priorityFix,
    });
  } catch (error) {
    console.error("Analyze API error:", error);
    return Response.json(
      { error: "Failed to analyze website" },
      { status: 500 }
    );
  }
}