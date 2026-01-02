const MARS2020_API = "https://mars.nasa.gov/rss/api/";
const APOD_API = "https://api.nasa.gov/planetary/apod";
const DEMO_API_KEY = "DEMO_KEY";
function mars2020ToPhoto(img) {
  let hash = 0;
  for (let i = 0; i < img.imageid.length; i++) {
    const char = img.imageid.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return {
    id: Math.abs(hash),
    sol: img.sol,
    camera: {
      id: 0,
      name: img.camera?.instrument || "Unknown",
      rover_id: 5,
      full_name: img.camera?.instrument || "Unknown Camera"
    },
    img_src: img.image_files?.large || img.image_files?.medium || img.image_files?.full_res,
    earth_date: img.date_taken_utc?.split("T")[0] || "",
    rover: {
      id: 5,
      name: "Perseverance",
      landing_date: "2021-02-18",
      launch_date: "2020-07-30",
      status: "active",
      max_sol: 0,
      max_date: "",
      total_photos: 0,
      cameras: []
    }
  };
}
async function fetchLatestPerseverance() {
  const now = /* @__PURE__ */ new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];
  const params = new URLSearchParams({
    feed: "raw_images",
    category: "mars2020",
    feedtype: "json",
    num: "50",
    condition_2: `${weekAgoStr}:date_taken:gte`
  });
  const response = await fetch(`${MARS2020_API}?${params}`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return (data.images || []).map(mars2020ToPhoto);
}
async function fetchInitialPhotos() {
  const params = new URLSearchParams({
    feed: "raw_images",
    category: "mars2020",
    feedtype: "json",
    num: "25"
  });
  const response = await fetch(`${MARS2020_API}?${params}`);
  if (!response.ok) {
    return [];
  }
  const data = await response.json();
  return (data.images || []).map(mars2020ToPhoto);
}
async function fetchAPOD() {
  try {
    const response = await fetch(`${APOD_API}?api_key=${DEMO_API_KEY}`);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.media_type !== "image") return null;
    return {
      id: `apod-${data.date}`,
      title: data.title,
      description: data.explanation,
      img_src: data.hdurl || data.url,
      thumbnail_src: data.url,
      date: data.date,
      source: "apod",
      sourceDetails: "Astronomy Picture of the Day",
      credits: data.copyright || "NASA"
    };
  } catch {
    return null;
  }
}
async function fetchJWSTImages(limit = 8) {
  try {
    const response = await fetch(
      `https://images-api.nasa.gov/search?q=james+webb+space+telescope&media_type=image&page_size=${limit}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    const items = data.collection?.items || [];
    return items.filter((item) => item.links?.[0]?.href).slice(0, limit).map((item) => {
      const metadata = item.data?.[0] || {};
      return {
        id: `jwst-${metadata.nasa_id || Math.random().toString(36)}`,
        title: metadata.title || "JWST Image",
        description: metadata.description,
        img_src: item.links[0].href,
        thumbnail_src: item.links[0].href,
        date: metadata.date_created?.split("T")[0] || "",
        source: "jwst",
        sourceDetails: "James Webb Space Telescope",
        credits: metadata.photographer || "NASA/ESA/CSA/STScI",
        tags: metadata.keywords
      };
    });
  } catch {
    return [];
  }
}
async function fetchHubbleImages(limit = 8) {
  try {
    const response = await fetch(
      `https://images-api.nasa.gov/search?q=hubble+space+telescope&media_type=image&page_size=${limit}`
    );
    if (!response.ok) return [];
    const data = await response.json();
    const items = data.collection?.items || [];
    return items.filter((item) => item.links?.[0]?.href).slice(0, limit).map((item) => {
      const metadata = item.data?.[0] || {};
      return {
        id: `hubble-${metadata.nasa_id || Math.random().toString(36)}`,
        title: metadata.title || "Hubble Image",
        description: metadata.description,
        img_src: item.links[0].href,
        thumbnail_src: item.links[0].href,
        date: metadata.date_created?.split("T")[0] || "",
        source: "hubble",
        sourceDetails: "Hubble Space Telescope",
        credits: metadata.photographer || "NASA/ESA/STScI",
        tags: metadata.keywords
      };
    });
  } catch {
    return [];
  }
}
const load = async ({ setHeaders }) => {
  setHeaders({
    "cache-control": "public, max-age=300, s-maxage=600"
  });
  const [latestPhotos, initialPhotos, apod, jwstImages, hubbleImages] = await Promise.all([
    fetchLatestPerseverance().catch(() => []),
    fetchInitialPhotos().catch(() => []),
    fetchAPOD().catch(() => null),
    fetchJWSTImages(8).catch(() => []),
    fetchHubbleImages(8).catch(() => [])
  ]);
  let maxSol = 1400;
  if (latestPhotos.length > 0) {
    maxSol = latestPhotos[0].sol;
  }
  return {
    latestPhotos,
    initialPhotos,
    maxSol,
    apod,
    jwstImages,
    hubbleImages
  };
};
export {
  load
};
