import type { PageServerLoad } from './$types';
import type { Photo, SpaceImage, APODImage } from '$lib/types/mars';

// NASA's official Mars image APIs (no API key needed!)
const MARS2020_API = 'https://mars.nasa.gov/rss/api/';
const MSL_API = 'https://mars.nasa.gov/api/v1/raw_image_items/';

// NASA APOD API
const APOD_API = 'https://api.nasa.gov/planetary/apod';
const DEMO_API_KEY = 'DEMO_KEY';

interface Mars2020Image {
	imageid: string;
	sol: number;
	camera: {
		filter_name: string;
		camera_type: string;
		instrument: string;
	};
	image_files: {
		small: string;
		medium: string;
		large: string;
		full_res: string;
	};
	date_taken_utc: string;
	sample_type: string;
}

interface Mars2020Response {
	images: Mars2020Image[];
	total_images: number;
	page: number;
	per_page: string;
}

interface MSLImage {
	id: number;
	imageid: string;
	sol: number;
	instrument: string;
	url: string;
	date_taken_mars: string;
	date_taken_utc: string;
	created_at: string;
}

interface MSLResponse {
	items: MSLImage[];
	total: number;
	page: number;
	per_page: number;
}

function mars2020ToPhoto(img: Mars2020Image): Photo {
	let hash = 0;
	for (let i = 0; i < img.imageid.length; i++) {
		const char = img.imageid.charCodeAt(i);
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash;
	}
	return {
		id: Math.abs(hash),
		sol: img.sol,
		camera: {
			id: 0,
			name: img.camera?.instrument || 'Unknown',
			rover_id: 5,
			full_name: img.camera?.instrument || 'Unknown Camera'
		},
		img_src: img.image_files?.large || img.image_files?.medium || img.image_files?.full_res,
		earth_date: img.date_taken_utc?.split('T')[0] || '',
		rover: {
			id: 5,
			name: 'Perseverance',
			landing_date: '2021-02-18',
			launch_date: '2020-07-30',
			status: 'active',
			max_sol: 0,
			max_date: '',
			total_photos: 0,
			cameras: []
		}
	};
}

function mslToPhoto(img: MSLImage): Photo {
	return {
		id: img.id,
		sol: img.sol,
		camera: {
			id: 0,
			name: img.instrument || 'Unknown',
			rover_id: 4,
			full_name: img.instrument || 'Unknown Camera'
		},
		img_src: img.url,
		earth_date: img.date_taken_utc?.split('T')[0] || img.created_at?.split('T')[0] || '',
		rover: {
			id: 4,
			name: 'Curiosity',
			landing_date: '2012-08-06',
			launch_date: '2011-11-26',
			status: 'active',
			max_sol: 0,
			max_date: '',
			total_photos: 0,
			cameras: []
		}
	};
}

async function fetchLatestPerseverance(): Promise<Photo[]> {
	const now = new Date();
	const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	const weekAgoStr = weekAgo.toISOString().split('T')[0];

	const params = new URLSearchParams({
		feed: 'raw_images',
		category: 'mars2020',
		feedtype: 'json',
		num: '50',
		condition_2: `${weekAgoStr}:date_taken:gte`
	});

	const response = await fetch(`${MARS2020_API}?${params}`);
	if (!response.ok) {
		return [];
	}

	const data: Mars2020Response = await response.json();
	return (data.images || []).map(mars2020ToPhoto);
}

async function fetchLatestCuriosity(): Promise<Photo[]> {
	const now = new Date();
	const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
	const weekAgoStr = weekAgo.toISOString().split('T')[0];

	const params = new URLSearchParams({
		order: 'sol desc,date_taken desc',
		per_page: '50',
		page: '0',
		condition_1: 'msl:mission',
		condition_2: `${weekAgoStr}:date_taken:gte`
	});

	const response = await fetch(`${MSL_API}?${params}`);
	if (!response.ok) {
		return [];
	}

	const data: MSLResponse = await response.json();
	return (data.items || []).map(mslToPhoto);
}

async function fetchInitialPhotos(): Promise<Photo[]> {
	// Fetch recent photos from Perseverance for the initial grid
	const params = new URLSearchParams({
		feed: 'raw_images',
		category: 'mars2020',
		feedtype: 'json',
		num: '25'
	});

	const response = await fetch(`${MARS2020_API}?${params}`);
	if (!response.ok) {
		return [];
	}

	const data: Mars2020Response = await response.json();
	return (data.images || []).map(mars2020ToPhoto);
}

// Fetch NASA Astronomy Picture of the Day
async function fetchAPOD(): Promise<SpaceImage | null> {
	try {
		const response = await fetch(`${APOD_API}?api_key=${DEMO_API_KEY}`);
		if (!response.ok) return null;

		const data: APODImage = await response.json();
		if (data.media_type !== 'image') return null;

		return {
			id: `apod-${data.date}`,
			title: data.title,
			description: data.explanation,
			img_src: data.hdurl || data.url,
			thumbnail_src: data.url,
			date: data.date,
			source: 'apod',
			sourceDetails: 'Astronomy Picture of the Day',
			credits: data.copyright || 'NASA'
		};
	} catch {
		return null;
	}
}

// Fetch JWST images from NASA Image Library
async function fetchJWSTImages(limit: number = 8): Promise<SpaceImage[]> {
	try {
		const response = await fetch(
			`https://images-api.nasa.gov/search?q=james+webb+space+telescope&media_type=image&page_size=${limit}`
		);
		if (!response.ok) return [];

		const data = await response.json();
		const items = data.collection?.items || [];

		return items
			.filter((item: any) => item.links?.[0]?.href)
			.slice(0, limit)
			.map((item: any) => {
				const metadata = item.data?.[0] || {};
				return {
					id: `jwst-${metadata.nasa_id || Math.random().toString(36)}`,
					title: metadata.title || 'JWST Image',
					description: metadata.description,
					img_src: item.links[0].href,
					thumbnail_src: item.links[0].href,
					date: metadata.date_created?.split('T')[0] || '',
					source: 'jwst' as const,
					sourceDetails: 'James Webb Space Telescope',
					credits: metadata.photographer || 'NASA/ESA/CSA/STScI',
					tags: metadata.keywords
				};
			});
	} catch {
		return [];
	}
}

// Fetch Hubble images from NASA Image Library
async function fetchHubbleImages(limit: number = 8): Promise<SpaceImage[]> {
	try {
		const response = await fetch(
			`https://images-api.nasa.gov/search?q=hubble+space+telescope&media_type=image&page_size=${limit}`
		);
		if (!response.ok) return [];

		const data = await response.json();
		const items = data.collection?.items || [];

		return items
			.filter((item: any) => item.links?.[0]?.href)
			.slice(0, limit)
			.map((item: any) => {
				const metadata = item.data?.[0] || {};
				return {
					id: `hubble-${metadata.nasa_id || Math.random().toString(36)}`,
					title: metadata.title || 'Hubble Image',
					description: metadata.description,
					img_src: item.links[0].href,
					thumbnail_src: item.links[0].href,
					date: metadata.date_created?.split('T')[0] || '',
					source: 'hubble' as const,
					sourceDetails: 'Hubble Space Telescope',
					credits: metadata.photographer || 'NASA/ESA/STScI',
					tags: metadata.keywords
				};
			});
	} catch {
		return [];
	}
}

export const load: PageServerLoad = async ({ setHeaders }) => {
	// Set cache headers for Vercel edge caching
	setHeaders({
		'cache-control': 'public, max-age=300, s-maxage=600'
	});

	// Fetch all data in parallel for SSR
	const [latestPhotos, initialPhotos, apod, jwstImages, hubbleImages] = await Promise.all([
		fetchLatestPerseverance().catch(() => []),
		fetchInitialPhotos().catch(() => []),
		fetchAPOD().catch(() => null),
		fetchJWSTImages(8).catch(() => []),
		fetchHubbleImages(8).catch(() => [])
	]);

	// Get max sol from latest photos
	let maxSol = 1400; // Fallback
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
