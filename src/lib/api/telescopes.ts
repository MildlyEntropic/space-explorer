import type { SpaceImage, APODImage } from '$lib/types/mars';

// HubbleSite API (community API)
const HUBBLE_API = 'https://hubble.stsci.edu/api/v3';

// NASA APOD API (free, no key required for limited use)
const APOD_API = 'https://api.nasa.gov/planetary/apod';
const DEMO_API_KEY = 'DEMO_KEY'; // Rate limited but works for demos

interface HubbleNewsRelease {
	id: string;
	name: string;
	url: string;
	publication: string;
	mission: string;
	release_images: number[];
}

interface HubbleImageDetail {
	id: number;
	name: string;
	description: string;
	credits: string;
	news_name: string;
	mission: string;
	collection: string;
	image_files: {
		file_url: string;
		file_size: number;
		width: number;
		height: number;
	}[];
}

// Fetch Hubble images from the official STScI API
export async function fetchHubbleImages(page: number = 1, limit: number = 25): Promise<SpaceImage[]> {
	try {
		// Fetch recent news releases which contain image IDs
		const response = await fetch(
			`${HUBBLE_API}/news_release/all?page=${page}&page_size=${limit}`
		);

		if (!response.ok) {
			throw new Error(`Hubble API error: ${response.status}`);
		}

		const releases: HubbleNewsRelease[] = await response.json();

		// Get unique image IDs from releases
		const imageIds = new Set<number>();
		releases.forEach(release => {
			release.release_images?.forEach(id => imageIds.add(id));
		});

		// Fetch image details (limit to first 25)
		const imagePromises = Array.from(imageIds).slice(0, limit).map(async (id) => {
			try {
				const imgResponse = await fetch(`${HUBBLE_API}/image/${id}`);
				if (imgResponse.ok) {
					return await imgResponse.json() as HubbleImageDetail;
				}
			} catch {
				return null;
			}
			return null;
		});

		const imageDetails = await Promise.all(imagePromises);

		return imageDetails
			.filter((img): img is HubbleImageDetail => img !== null && img.image_files?.length > 0)
			.map(img => hubbleToSpaceImage(img));
	} catch (error) {
		console.error('Failed to fetch Hubble images:', error);
		return [];
	}
}

function hubbleToSpaceImage(img: HubbleImageDetail): SpaceImage {
	// Find best image file (prefer medium resolution for thumbnails)
	const sortedFiles = [...img.image_files].sort((a, b) => a.width - b.width);
	const thumbnail = sortedFiles.find(f => f.width >= 400) || sortedFiles[0];
	const fullRes = sortedFiles[sortedFiles.length - 1];

	return {
		id: `hubble-${img.id}`,
		title: img.name || 'Hubble Image',
		description: img.description,
		img_src: fullRes?.file_url || thumbnail?.file_url || '',
		thumbnail_src: thumbnail?.file_url,
		date: '', // Hubble API doesn't provide consistent dates
		source: 'hubble',
		sourceDetails: img.mission || 'Hubble Space Telescope',
		credits: img.credits || 'NASA/ESA/STScI'
	};
}

// Fetch JWST images from NASA's image library
export async function fetchJWSTImages(page: number = 1, limit: number = 25): Promise<SpaceImage[]> {
	try {
		// Use NASA Image and Video Library API
		const response = await fetch(
			`https://images-api.nasa.gov/search?q=james+webb+space+telescope&media_type=image&page=${page}&page_size=${limit}`
		);

		if (!response.ok) {
			throw new Error(`NASA Images API error: ${response.status}`);
		}

		const data = await response.json();
		const items = data.collection?.items || [];

		return items
			.filter((item: any) => item.links?.[0]?.href)
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
	} catch (error) {
		console.error('Failed to fetch JWST images:', error);
		return [];
	}
}

// Fetch NASA Astronomy Picture of the Day
export async function fetchAPOD(count: number = 1): Promise<SpaceImage[]> {
	try {
		const params = new URLSearchParams({
			api_key: DEMO_API_KEY
		});

		if (count > 1) {
			params.set('count', count.toString());
		}

		const response = await fetch(`${APOD_API}?${params}`);

		if (!response.ok) {
			throw new Error(`APOD API error: ${response.status}`);
		}

		const data = await response.json();
		const items: APODImage[] = Array.isArray(data) ? data : [data];

		return items
			.filter(item => item.media_type === 'image')
			.map(item => ({
				id: `apod-${item.date}`,
				title: item.title,
				description: item.explanation,
				img_src: item.hdurl || item.url,
				thumbnail_src: item.url,
				date: item.date,
				source: 'apod' as const,
				sourceDetails: 'Astronomy Picture of the Day',
				credits: item.copyright || 'NASA'
			}));
	} catch (error) {
		console.error('Failed to fetch APOD:', error);
		return [];
	}
}

// Fetch today's APOD
export async function fetchTodaysAPOD(): Promise<SpaceImage | null> {
	const images = await fetchAPOD(1);
	return images[0] || null;
}

// Fetch random APOD images
export async function fetchRandomAPOD(count: number = 10): Promise<SpaceImage[]> {
	return fetchAPOD(count);
}

// Combined fetch for "featured" section
export async function fetchFeaturedImages(): Promise<{
	apod: SpaceImage | null;
	hubble: SpaceImage[];
	jwst: SpaceImage[];
}> {
	const [apod, hubble, jwst] = await Promise.all([
		fetchTodaysAPOD(),
		fetchHubbleImages(1, 6),
		fetchJWSTImages(1, 6)
	]);

	return { apod, hubble, jwst };
}
