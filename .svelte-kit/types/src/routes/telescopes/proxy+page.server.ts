// @ts-nocheck
import type { PageServerLoad } from './$types';
import type { SpaceImage } from '$lib/types/mars';

async function fetchJWSTImages(limit: number = 24): Promise<SpaceImage[]> {
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

async function fetchHubbleImages(limit: number = 24): Promise<SpaceImage[]> {
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

export const load = async ({ setHeaders }: Parameters<PageServerLoad>[0]) => {
	setHeaders({
		'cache-control': 'public, max-age=300, s-maxage=600'
	});

	const [jwstImages, hubbleImages] = await Promise.all([
		fetchJWSTImages(24).catch(() => []),
		fetchHubbleImages(24).catch(() => [])
	]);

	return {
		jwstImages,
		hubbleImages
	};
};
