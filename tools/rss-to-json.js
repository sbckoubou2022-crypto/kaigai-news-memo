const ITEMS_PER_FEED = 5;
const OG_IMAGE_TIMEOUT_MS = 2500;

const fs = require("fs");
const Parser = require("rss-parser");

const parser = new Parser();

const RSS_FEEDS = [
  {
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    category: "WORLD"
  },
  {
    name: "BBC Technology",
    url: "https://feeds.bbci.co.uk/news/technology/rss.xml",
    category: "TECH"
  },
  {
    name: "BBC Business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    category: "BUSINESS"
  },
  {
    name: "The Guardian World",
    url: "https://www.theguardian.com/world/rss",
    category: "WORLD"
  },
  {
    name: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    category: "TECH"
  },
  {
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    category: "TECH"
  },
  {
    name: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    category: "TECH"
  },
  {
    name: "Wired",
    url: "https://www.wired.com/feed/rss",
    category: "TECH"
  },
  {
    name: "Space.com",
    url: "https://www.space.com/feeds/all",
    category: "SPACE"
  },
  {
    name: "The Debrief",
    url: "https://thedebrief.org/feed/",
    category: "MYSTERY"
  },
  {
    name: "NASA",
    url: "https://www.nasa.gov/news-release/feed/",
    category: "SPACE"
  },
  {
    name: "NASA Image of the Day",
    url: "https://www.nasa.gov/image-article/feed/",
    category: "SPACE"
  },
  {
    name: "ESA Top News",
    url: "https://www.esa.int/rssfeed/TopNews",
    category: "SPACE"
  },
  {
    name: "MIT News",
    url: "https://news.mit.edu/rss/feed",
    category: "TECH"
  },
  {
    name: "MIT News Engineering",
    url: "https://news.mit.edu/rss/school/engineering",
    category: "TECH"
  },
  {
    name: "MIT News Science",
    url: "https://news.mit.edu/rss/school/science",
    category: "SCIENCE"
  },
  {
    name: "Phys.org",
    url: "https://phys.org/rss-feed/",
    category: "SCIENCE"
  },
  {
    name: "Phys.org Space",
    url: "https://phys.org/rss-feed/space-news/",
    category: "SPACE"
  },
  {
    name: "NPR World",
    url: "https://feeds.npr.org/1004/rss.xml",
    category: "WORLD"
  },
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    category: "TECH"
  },
  {
    name: "IEEE Spectrum",
    url: "https://spectrum.ieee.org/feed",
    category: "TECH"
  },
  {
    name: "Singularity Hub",
    url: "https://singularityhub.com/feed/",
    category: "MYSTERY"
  },
  {
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    category: "AI"
  },
  {
    name: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
    category: "TECH"
  },
  {
    name: "ZDNet",
    url: "https://www.zdnet.com/news/rss.xml",
    category: "TECH"
  },
  {
    name: "IEEE Spectrum",
    url: "https://spectrum.ieee.org/feed",
    category: "TECH"
  }
];

/*const FALLBACK_IMAGES = {
  WORLD: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
  TECH: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  BUSINESS: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  DEFAULT: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  SPACE: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
  MYSTERY: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
};*/
const FALLBACK_IMAGES = {
  WORLD: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
  TECH: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
  AI: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
  BUSINESS: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  SPACE: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80",
  SCIENCE: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80",
  MYSTERY: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
  CULTURE: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=1200&q=80",
  DESIGN: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  DEFAULT: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
};

async function main() {
  const allNews = [];

  const start = Date.now();

  for (const feedInfo of RSS_FEEDS) {
    try {
      console.log(`取得中: ${feedInfo.name}`);

      const feed = await parser.parseURL(feedInfo.url);

      const newsItems = await Promise.all(
        feed.items.slice(0, ITEMS_PER_FEED).map(async (item) => {
          const image = await getImageFromItem(item, feedInfo.category);

          return {
            title: item.title || "No title",
            category: feedInfo.category,
            date: item.isoDate || item.pubDate || "",
            image: image,
            summary: item.contentSnippet || "",
            content: `<h2>概要</h2><p>${item.contentSnippet || ""}</p><p><a href="${item.link}" target="_blank">出典記事を読む</a></p>`,
            source: feedInfo.name,
            sourceUrl: item.link || ""
          };
        })
      );

      allNews.push(...newsItems);
  
      console.log(
        `${feedInfo.name}: ${
          ((Date.now() - start) / 1000).toFixed(1)
        }秒`
      );

    } catch (error) {
      console.log(`スキップ: ${feedInfo.name}`);
      console.log(`理由: ${error.message}`);
    }
  }

  const sortedNews = allNews
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map((item, index) => ({
      id: index + 1,
      ...item
    }));

  fs.mkdirSync("data", { recursive: true });
  fs.writeFileSync(
    "data/news.json",
    JSON.stringify(sortedNews, null, 2),
    "utf-8"
  );

  console.log(`${sortedNews.length}件の記事を data/news.json に保存しました`);
  process.exit(0);
}

/*
async function main() {
  const allNews = [];

  for (const feedInfo of RSS_FEEDS) {
    try {
      console.log(`取得中: ${feedInfo.name}`);

      const feed = await parser.parseURL(feedInfo.url);

      for (const item of feed.items.slice(0, 5)) {
        const image = await getImageFromItem(item, feedInfo.category);

        allNews.push({
          id: allNews.length + 1,
          title: item.title || "No title",
          category: feedInfo.category,
          date: item.pubDate || "",
          image: image,
          summary: item.contentSnippet || "",
          content: `<h2>概要</h2><p>${item.contentSnippet || ""}</p><p><a href="${item.link}" target="_blank">出典記事を読む</a></p>`,
          source: feedInfo.name,
          sourceUrl: item.link || ""
        });
      }
    } catch (error) {
      console.log(`スキップ: ${feedInfo.name}`);
      console.log(`理由: ${error.message}`);
    }
  }

  fs.writeFileSync(
    "data/news.json",
    JSON.stringify(allNews, null, 2),
    "utf-8"
  );

  console.log(`${allNews.length}件の記事を data/news.json に保存しました`);
}
*/

/*
async function main() {
  const allNews = [];

  for (const feedInfo of RSS_FEEDS) {
    const feed = await parser.parseURL(feedInfo.url);

    for (const item of feed.items.slice(0, 5)) {
      const image = await getImageFromItem(item, feedInfo.category);

      allNews.push({
        id: allNews.length + 1,
        title: item.title || "No title",
        category: feedInfo.category,
        date: item.pubDate || "",
        image: image,
        summary: item.contentSnippet || "",
        content: `<h2>概要</h2><p>${item.contentSnippet || ""}</p><p><a href="${item.link}" target="_blank">出典記事を読む</a></p>`,
        source: feedInfo.name,
        sourceUrl: item.link || ""
      });
    }
  }

  fs.writeFileSync(
    "data/news.json",
    JSON.stringify(allNews, null, 2),
    "utf-8"
  );

  console.log(`${allNews.length}件の記事を data/news.json に保存しました`);
}
*/

main().catch((error) => {
  console.error("RSS取得に失敗しました:", error);
});

async function getImageFromItem(item, category) {

  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  if (item["media:content"]?.url) {
    return item["media:content"].url;
  }

  if (item["media:thumbnail"]?.url) {
    return item["media:thumbnail"].url;
  }

  const html =
    item["content:encoded"] ||
    item.content ||
    item.summary ||
    item.description ||
    "";

  const match = html.match(
    /<img[^>]+src=["']([^"']+)["']/i
  );

  if (match?.[1]) {
    return match[1];
  }

  // const ogImage = await getOgImage(item.link);
  // return ogImage || FALLBACK_IMAGES[category];

  return (
    FALLBACK_IMAGES[category] ||
    FALLBACK_IMAGES.DEFAULT
  );
}

/*async function getImageFromItem(item, category) {
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }

  if (item["media:content"]?.url) {
    return item["media:content"].url;
  }

  if (item["media:thumbnail"]?.url) {
    return item["media:thumbnail"].url;
  }

  const html =
    item["content:encoded"] ||
    item.content ||
    item.summary ||
    item.description ||
    "";

  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);

  if (match?.[1]) {
    return match[1];
  }

  const ogImage = await getOgImage(item.link);
  return ogImage || FALLBACK_IMAGES[category];

  return ogImage || FALLBACK_IMAGES[category] || FALLBACK_IMAGES.DEFAULT;
}*/

async function getOgImage(url) {
  if (!url) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), OG_IMAGE_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const html = await res.text();

    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );

    return match?.[1] || null;
  } catch (error) {
    console.log("画像取得スキップ:", url);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/*
async function getOgImage(url) {
  if (!url) return null;

  try {
    const res = await fetch(url);
    const html = await res.text();

    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );

    if (match?.[1]) {
      return match[1];
    }

    return null;
  } catch (error) {
    console.log("画像取得失敗:", url);
    return null;
  }
}
*/
