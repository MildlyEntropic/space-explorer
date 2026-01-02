import type { PageServerLoad } from './$types';
import type { Photo } from '$lib/types/mars';

const MARS2020_API = 'https://mars.nasa.gov/rss/api/';

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

async function fetchInitialPhotos(): Promise<Photo[]> {
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

async function fetchMaxSol(): Promise<number> {
	const params = new URLSearchParams({
		feed: 'raw_images',
		category: 'mars2020',
		feedtype: 'json',
		num: '1'
	});

	const response = await fetch(`${MARS2020_API}?${params}`);
	if (!response.ok) {
		return 1400;
	}

	const data: Mars2020Response = await response.json();
	return data.images?.[0]?.sol || 1400;
}

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=300, s-maxage=600'
	});

	const [initialPhotos, maxSol] = await Promise.all([
		fetchInitialPhotos().catch(() => []),
		fetchMaxSol().catch(() => 1400)
	]);

	return {
		initialPhotos,
		maxSol
	};
};
