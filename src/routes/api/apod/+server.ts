import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SpaceImage, APODImage } from '$lib/types/mars';
import { NASA_API_KEY } from '$env/static/private';

const APOD_API = 'https://api.nasa.gov/planetary/apod';
const API_KEY = NASA_API_KEY || 'DEMO_KEY';

export const GET: RequestHandler = async ({ url, setHeaders }) => {
	// Cache for 6 hours on Vercel edge, 1 hour on client
	setHeaders({
		'cache-control': 'public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400'
	});

	const endDateParam = url.searchParams.get('end_date');
	const countParam = url.searchParams.get('count') || '6';
	const searchParam = url.searchParams.get('search') || '';

	const count = parseInt(countParam, 10);
	const endDate = endDateParam ? new Date(endDateParam) : new Date();
	const startDate = new Date(endDate);
	startDate.setDate(startDate.getDate() - count);

	const startStr = startDate.toISOString().split('T')[0];
	const endStr = endDate.toISOString().split('T')[0];

	try {
		const response = await fetch(
			`${APOD_API}?api_key=${API_KEY}&start_date=${startStr}&end_date=${endStr}`
		);

		if (!response.ok) {
			console.error('APOD API error:', response.status, response.statusText);
			return json({ images: [], hasMore: false });
		}

		const data: APODImage[] = await response.json();

		let images: SpaceImage[] = data
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

		// Filter by search term if provided
		if (searchParam) {
			const searchLower = searchParam.toLowerCase();
			images = images.filter(
				(img) =>
					img.title.toLowerCase().includes(searchLower) ||
					(img.description && img.description.toLowerCase().includes(searchLower))
			);
		}

		// Check if there's more data available (APOD started June 16, 1995)
		const apodStartDate = new Date('1995-06-16');
		const hasMore = startDate > apodStartDate;

		return json({ images, hasMore });
	} catch (err) {
		console.error('APOD API fetch error:', err);
		return json({ images: [], hasMore: false });
	}
};
