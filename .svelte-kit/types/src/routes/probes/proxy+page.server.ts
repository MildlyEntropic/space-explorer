// @ts-nocheck
import type { PageServerLoad } from './$types';
import type { SpaceImage } from '$lib/types/mars';

type ProbeName = 'voyager1' | 'voyager2' | 'cassini' | 'newhorizons' | 'galileo';

const PROBE_QUERIES: Record<ProbeName, string> = {
	voyager1: 'voyager 1',
	voyager2: 'voyager 2',
	cassini: 'cassini saturn',
	newhorizons: 'new horizons pluto',
	galileo: 'galileo jupiter'
};

const PROBE_CREDITS: Record<ProbeName, string> = {
	voyager1: 'NASA/JPL',
	voyager2: 'NASA/JPL',
	cassini: 'NASA/JPL-Caltech/SSI',
	newhorizons: 'NASA/JHUAPL/SwRI',
	galileo: 'NASA/JPL'
};

async function fetchProbeImages(probe: ProbeName, limit: number = 40): Promise<SpaceImage[]> {
	try {
		const query = PROBE_QUERIES[probe];
		const response = await fetch(
			`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page_size=${limit}`
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
					id: `${probe}-${metadata.nasa_id || Math.random().toString(36)}`,
					title: metadata.title || `${probe.toUpperCase()} Image`,
					description: metadata.description,
					img_src: item.links[0].href,
					thumbnail_src: item.links[0].href,
					date: metadata.date_created?.split('T')[0] || '',
					source: probe as const,
					sourceDetails: getProbeFullName(probe),
					credits: metadata.photographer || PROBE_CREDITS[probe],
					tags: metadata.keywords
				};
			});
	} catch {
		return [];
	}
}

function getProbeFullName(probe: ProbeName): string {
	const names: Record<ProbeName, string> = {
		voyager1: 'Voyager 1',
		voyager2: 'Voyager 2',
		cassini: 'Cassini-Huygens',
		newhorizons: 'New Horizons',
		galileo: 'Galileo'
	};
	return names[probe];
}

export const load = async ({ setHeaders }: Parameters<PageServerLoad>[0]) => {
	setHeaders({
		'cache-control': 'public, max-age=300, s-maxage=600'
	});

	const [voyager1Images, voyager2Images, cassiniImages, newhorizonsImages, galileoImages] = await Promise.all([
		fetchProbeImages('voyager1', 40).catch(() => []),
		fetchProbeImages('voyager2', 40).catch(() => []),
		fetchProbeImages('cassini', 40).catch(() => []),
		fetchProbeImages('newhorizons', 40).catch(() => []),
		fetchProbeImages('galileo', 40).catch(() => [])
	]);

	return {
		voyager1Images,
		voyager2Images,
		cassiniImages,
		newhorizonsImages,
		galileoImages
	};
};
