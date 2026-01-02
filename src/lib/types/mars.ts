export interface Camera {
	id: number;
	name: string;
	rover_id: number;
	full_name: string;
}

export interface Rover {
	id: number;
	name: string;
	landing_date: string;
	launch_date: string;
	status: string;
	max_sol: number;
	max_date: string;
	total_photos: number;
	cameras: Camera[];
}

export interface Photo {
	id: number;
	sol: number;
	camera: Camera;
	img_src: string;
	earth_date: string;
	rover: Rover;
}

// Unified image type for all sources (rovers, telescopes, APOD)
export interface SpaceImage {
	id: string;
	title: string;
	description?: string;
	img_src: string;
	thumbnail_src?: string;
	date: string;
	source: ImageSource;
	sourceDetails?: string;
	credits?: string;
	tags?: string[];
}

export type ImageSource = 'mars-rover' | 'hubble' | 'jwst' | 'apod';

// Hubble API types
export interface HubbleImage {
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

// NASA APOD types
export interface APODImage {
	date: string;
	explanation: string;
	hdurl?: string;
	media_type: string;
	service_version: string;
	title: string;
	url: string;
	copyright?: string;
}

// Source categories
export type SourceCategory = 'rovers' | 'telescopes';

export const IMAGE_SOURCES: {
	category: SourceCategory;
	sources: {
		id: string;
		name: string;
		description: string;
		active: boolean;
	}[];
}[] = [
	{
		category: 'rovers',
		sources: [
			{ id: 'perseverance', name: 'Perseverance', description: 'Mars 2020 Rover', active: true },
			{ id: 'curiosity', name: 'Curiosity', description: 'Mars Science Laboratory', active: true },
			{ id: 'opportunity', name: 'Opportunity', description: 'MER-B (2004-2018)', active: false },
			{ id: 'spirit', name: 'Spirit', description: 'MER-A (2004-2010)', active: false }
		]
	},
	{
		category: 'telescopes',
		sources: [
			{ id: 'jwst', name: 'James Webb', description: 'Space Telescope', active: true },
			{ id: 'hubble', name: 'Hubble', description: 'Space Telescope', active: true }
		]
	}
];

export interface PhotosResponse {
	photos: Photo[];
}

export interface LatestPhotosResponse {
	latest_photos: Photo[];
}

export interface RoversResponse {
	rovers: Rover[];
}

export interface RoverResponse {
	rover: Rover;
}

export type RoverName = 'perseverance' | 'curiosity' | 'opportunity' | 'spirit';

export const ROVER_CAMERAS: Record<RoverName, { abbrev: string; full_name: string }[]> = {
	perseverance: [
		{ abbrev: 'EDL_RUCAM', full_name: 'Rover Up-Look Camera' },
		{ abbrev: 'EDL_RDCAM', full_name: 'Rover Down-Look Camera' },
		{ abbrev: 'EDL_DDCAM', full_name: 'Descent Stage Down-Look Camera' },
		{ abbrev: 'EDL_PUCAM1', full_name: 'Parachute Up-Look Camera A' },
		{ abbrev: 'EDL_PUCAM2', full_name: 'Parachute Up-Look Camera B' },
		{ abbrev: 'NAVCAM_LEFT', full_name: 'Navigation Camera - Left' },
		{ abbrev: 'NAVCAM_RIGHT', full_name: 'Navigation Camera - Right' },
		{ abbrev: 'MCZ_LEFT', full_name: 'Mast Camera Zoom - Left' },
		{ abbrev: 'MCZ_RIGHT', full_name: 'Mast Camera Zoom - Right' },
		{ abbrev: 'FRONT_HAZCAM_LEFT_A', full_name: 'Front Hazard Avoidance Camera - Left' },
		{ abbrev: 'FRONT_HAZCAM_RIGHT_A', full_name: 'Front Hazard Avoidance Camera - Right' },
		{ abbrev: 'REAR_HAZCAM_LEFT', full_name: 'Rear Hazard Avoidance Camera - Left' },
		{ abbrev: 'REAR_HAZCAM_RIGHT', full_name: 'Rear Hazard Avoidance Camera - Right' },
		{ abbrev: 'SKYCAM', full_name: 'MEDA Skycam' },
		{ abbrev: 'SHERLOC_WATSON', full_name: 'SHERLOC WATSON Camera' }
	],
	curiosity: [
		{ abbrev: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' },
		{ abbrev: 'RHAZ', full_name: 'Rear Hazard Avoidance Camera' },
		{ abbrev: 'MAST', full_name: 'Mast Camera' },
		{ abbrev: 'CHEMCAM', full_name: 'Chemistry and Camera Complex' },
		{ abbrev: 'MAHLI', full_name: 'Mars Hand Lens Imager' },
		{ abbrev: 'MARDI', full_name: 'Mars Descent Imager' },
		{ abbrev: 'NAVCAM', full_name: 'Navigation Camera' }
	],
	opportunity: [
		{ abbrev: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' },
		{ abbrev: 'RHAZ', full_name: 'Rear Hazard Avoidance Camera' },
		{ abbrev: 'NAVCAM', full_name: 'Navigation Camera' },
		{ abbrev: 'PANCAM', full_name: 'Panoramic Camera' },
		{ abbrev: 'MINITES', full_name: 'Miniature Thermal Emission Spectrometer' }
	],
	spirit: [
		{ abbrev: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' },
		{ abbrev: 'RHAZ', full_name: 'Rear Hazard Avoidance Camera' },
		{ abbrev: 'NAVCAM', full_name: 'Navigation Camera' },
		{ abbrev: 'PANCAM', full_name: 'Panoramic Camera' },
		{ abbrev: 'MINITES', full_name: 'Miniature Thermal Emission Spectrometer' }
	]
};

export const ROVERS: {
	name: RoverName;
	displayName: string;
	active: boolean;
	available: boolean;
	dateRange: string;
}[] = [
	{ name: 'perseverance', displayName: 'Perseverance', active: true, available: true, dateRange: 'Feb 2021 - Present' },
	{ name: 'curiosity', displayName: 'Curiosity', active: true, available: true, dateRange: 'Aug 2012 - Present' },
	{ name: 'opportunity', displayName: 'Opportunity', active: false, available: true, dateRange: 'Jan 2004 - Jun 2018' },
	{ name: 'spirit', displayName: 'Spirit', active: false, available: true, dateRange: 'Jan 2004 - Mar 2010' }
];
