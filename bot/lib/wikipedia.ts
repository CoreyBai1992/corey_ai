export type WikiLanguage = "zh" | "en";

export type WikiLookup = {
  found: boolean;
  query: string;
  language: WikiLanguage;
  title?: string;
  extract?: string;
  description?: string;
  url?: string;
  note?: string;
};

const USER_AGENT = "CoreyAI/0.1 (personal knowledge assistant)";
const EXTRACT_LIMIT = 1200;

function hostFor(language: WikiLanguage): string {
  return language === "zh" ? "zh.wikipedia.org" : "en.wikipedia.org";
}

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "user-agent": USER_AGENT,
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Wikipedia responded ${response.status} for ${url}`);
  }
  return response.json() as Promise<unknown>;
}

function asSearch(payload: unknown): { title?: string; description?: string; url?: string } {
  if (!Array.isArray(payload) || payload.length < 4) return {};
  const titles = payload[1];
  const descriptions = payload[2];
  const urls = payload[3];
  const title = Array.isArray(titles) && typeof titles[0] === "string" ? titles[0] : undefined;
  const description =
    Array.isArray(descriptions) && typeof descriptions[0] === "string" ? descriptions[0] : undefined;
  const url = Array.isArray(urls) && typeof urls[0] === "string" ? urls[0] : undefined;
  return { title, description, url };
}

function asSummary(payload: unknown): { title?: string; extract?: string; url?: string; description?: string } {
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) return {};
  const record = payload as Record<string, unknown>;
  const contentUrls = record.content_urls;
  let desktopUrl: string | undefined;
  if (contentUrls !== null && typeof contentUrls === "object" && !Array.isArray(contentUrls)) {
    const desktop = (contentUrls as Record<string, unknown>).desktop;
    if (desktop !== null && typeof desktop === "object" && !Array.isArray(desktop)) {
      const page = (desktop as Record<string, unknown>).page;
      if (typeof page === "string") desktopUrl = page;
    }
  }
  return {
    title: typeof record.title === "string" ? record.title : undefined,
    extract: typeof record.extract === "string" ? record.extract.slice(0, EXTRACT_LIMIT) : undefined,
    description: typeof record.description === "string" ? record.description : undefined,
    url: desktopUrl,
  };
}

export async function lookupWikipedia(query: string, language: WikiLanguage): Promise<WikiLookup> {
  const host = hostFor(language);
  const searchUrl =
    `https://${host}/w/api.php?action=opensearch&search=` +
    `${encodeURIComponent(query)}&limit=1&namespace=0&format=json`;
  const search = asSearch(await getJson(searchUrl));
  if (!search.title) {
    return {
      found: false,
      query,
      language,
      note: "No Wikipedia title matched this query.",
    };
  }

  const summaryUrl = `https://${host}/api/rest_v1/page/summary/${encodeURIComponent(search.title)}`;
  try {
    const summary = asSummary(await getJson(summaryUrl));
    return {
      found: true,
      query,
      language,
      title: summary.title ?? search.title,
      extract: summary.extract ?? search.description,
      description: summary.description ?? search.description,
      url: summary.url ?? search.url,
    };
  } catch {
    return {
      found: true,
      query,
      language,
      title: search.title,
      extract: search.description,
      description: search.description,
      url: search.url,
      note: "Page summary was unavailable; search snippet only.",
    };
  }
}
