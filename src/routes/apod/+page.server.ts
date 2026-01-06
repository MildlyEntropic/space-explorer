import type { PageServerLoad } from './$types';
import type { SpaceImage, APODImage } from '$lib/types/mars';
import { NASA_API_KEY } from '$env/static/private';

const APOD_API = 'https://api.nasa.gov/planetary/apod';
const API_KEY = NASA_API_KEY || 'DEMO_KEY';

async function fetchAPOD(): Promise<SpaceImage | null> {
	try {
		const response = await fetch(`${APOD_API}?api_key=${API_KEY}`);

		if (!response.ok) {
			console.error('APOD API error:', response.status, response.statusText);
			return null;
		}

		const data: APODImage = await response.json();

		// Skip videos for now - just show images
		if (data.media_type === 'video') return null;

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
	} catch (err) {
		console.error('APOD fetch error:', err);
		return null;
	}
}

async function fetchRecentAPOD(count: number = 12): Promise<SpaceImage[]> {
	try {
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - count);

		const response = await fetch(
			`${APOD_API}?api_key=${API_KEY}&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}`
		);

		if (!response.ok) {
			console.error('APOD Archive API error:', response.status, response.statusText);
			return [];
		}

		const data: APODImage[] = await response.json();

		return data
			.filter((item) => item.media_type === 'image')
			.reverse()
			.map((item) => ({
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
	} catch (err) {
		console.error('APOD Archive fetch error:', err);
		return [];
	}
}

export const load: PageServerLoad = async ({ setHeaders }) => {
	// Aggressive caching: 1 hour client, 6 hours server (Vercel edge)
	setHeaders({
		'cache-control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400'
	});

	// Fetch sequentially to avoid overwhelming NASA API
	const todayApod = await fetchAPOD().catch(() => null);
	const recentApod = await fetchRecentAPOD(12).catch(() => []);

	return {
		todayApod,
		recentApod
	};
};
