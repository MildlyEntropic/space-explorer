import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SpaceImage } from '$lib/types/mars';

const NASA_IMAGES_API = 'https://images-api.nasa.gov/search';

function getSourceDetails(telescope: string): string {
	const details: Record<string, string> = {
		jwst: 'James Webb Space Telescope',
		hubble: 'Hubble Space Telescope',
		spitzer: 'Spitzer Space Telescope',
		chandra: 'Chandra X-ray Observatory'
	};
	return details[telescope] || 'Space Telescope';
}

function getDefaultCredits(telescope: string): string {
	const credits: Record<string, string> = {
		jwst: 'NASA/ESA/CSA/STScI',
		hubble: 'NASA/ESA/STScI',
		spitzer: 'NASA/JPL-Caltech',
		chandra: 'NASA/CXC/SAO'
	};
	return credits[telescope] || 'NASA';
}

export const GET: RequestHandler = async ({ url }) => {
	const telescope = url.searchParams.get('telescope') || 'jwst';
	const query = url.searchParams.get('q') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || '20');

	// Build search query based on telescope
	const searchTermsMap: Record<string, string> = {
		jwst: 'james webb space telescope',
		hubble: 'hubble space telescope',
		spitzer: 'spitzer space telescope',
		chandra: 'chandra x-ray'
	};
	const searchTerms = searchTermsMap[telescope] || 'james webb space telescope';

	const fullQuery = query
		? `${searchTerms} ${query}`
		: searchTerms;

	try {
		const response = await fetch(
			`${NASA_IMAGES_API}?q=${encodeURIComponent(fullQuery)}&media_type=image&page=${page}&page_size=${limit}`
		);

		if (!response.ok) {
			return json({ images: [], hasMore: false }, { status: 200 });
		}

		const data = await response.json();
		const items = data.collection?.items || [];
		const totalHits = data.collection?.metadata?.total_hits || 0;

		const images: SpaceImage[] = items
			.filter((item: any) => item.links?.[0]?.href)
			.map((item: any) => {
				const metadata = item.data?.[0] || {};
				return {
					id: `${telescope}-${metadata.nasa_id || Math.random().toString(36)}`,
					title: metadata.title || `${telescope.toUpperCase()} Image`,
					description: metadata.description,
					img_src: item.links[0].href,
					thumbnail_src: item.links[0].href,
					date: metadata.date_created?.split('T')[0] || '',
					source: telescope as 'jwst' | 'hubble' | 'spitzer' | 'chandra',
					sourceDetails: getSourceDetails(telescope),
					credits: metadata.photographer || getDefaultCredits(telescope),
					tags: metadata.keywords
				};
			});

		const hasMore = page * limit < totalHits;

		return json({ images, hasMore, total: totalHits });
	} catch (error) {
		console.error('Failed to fetch telescope images:', error);
		return json({ images: [], hasMore: false }, { status: 200 });
	}
};
