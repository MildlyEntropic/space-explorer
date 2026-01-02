import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import type { SpaceImage } from '$lib/types/mars';

const NASA_IMAGES_API = 'https://images-api.nasa.gov/search';

type ProbeName = 'voyager1' | 'voyager2' | 'cassini' | 'newhorizons' | 'galileo';

function getSearchTerms(probe: string): string {
	const terms: Record<string, string> = {
		voyager1: 'voyager 1',
		voyager2: 'voyager 2',
		cassini: 'cassini saturn',
		newhorizons: 'new horizons pluto',
		galileo: 'galileo jupiter'
	};
	return terms[probe] || 'voyager 1';
}

function getSourceDetails(probe: string): string {
	const details: Record<string, string> = {
		voyager1: 'Voyager 1',
		voyager2: 'Voyager 2',
		cassini: 'Cassini-Huygens',
		newhorizons: 'New Horizons',
		galileo: 'Galileo'
	};
	return details[probe] || 'Deep Space Probe';
}

function getDefaultCredits(probe: string): string {
	const credits: Record<string, string> = {
		voyager1: 'NASA/JPL',
		voyager2: 'NASA/JPL',
		cassini: 'NASA/JPL-Caltech/SSI',
		newhorizons: 'NASA/JHUAPL/SwRI',
		galileo: 'NASA/JPL'
	};
	return credits[probe] || 'NASA';
}

export const GET: RequestHandler = async ({ url }) => {
	const probe = url.searchParams.get('probe') || 'voyager1';
	const query = url.searchParams.get('q') || '';
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = parseInt(url.searchParams.get('limit') || '20');

	const searchTerms = getSearchTerms(probe);
	const fullQuery = query ? `${searchTerms} ${query}` : searchTerms;

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
					id: `${probe}-${metadata.nasa_id || Math.random().toString(36)}`,
					title: metadata.title || `${probe.toUpperCase()} Image`,
					description: metadata.description,
					img_src: item.links[0].href,
					thumbnail_src: item.links[0].href,
					date: metadata.date_created?.split('T')[0] || '',
					source: probe as ProbeName,
					sourceDetails: getSourceDetails(probe),
					credits: metadata.photographer || getDefaultCredits(probe),
					tags: metadata.keywords
				};
			});

		const hasMore = page * limit < totalHits;

		return json({ images, hasMore, total: totalHits });
	} catch (error) {
		console.error('Failed to fetch probe images:', error);
		return json({ images: [], hasMore: false }, { status: 200 });
	}
};
