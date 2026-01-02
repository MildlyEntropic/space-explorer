<script lang="ts">
	import { onMount } from 'svelte';
	import type { Photo, RoverName } from '$lib/types/mars';
	import { fetchPhotos, fetchRoverInfo } from '$lib/api/nasa';
	import PhotoGrid from '$lib/components/PhotoGrid.svelte';
	import Lightbox from '$lib/components/Lightbox.svelte';
	import RoverSelector from '$lib/components/RoverSelector.svelte';
	import FilterPanel from '$lib/components/FilterPanel.svelte';

	let { data } = $props();

	// State
	let selectedRover: RoverName = $state('perseverance');
	let sol: number | null = $state(null);
	let solMin: number | null = $state(null);
	let solMax: number | null = $state(null);
	let dateStart: string = $state('');
	let dateEnd: string = $state('');
	let camera: string = $state('');
	let search: string = $state('');
	let maxSol: number = $state(data.maxSol || 0);

	let photos: Photo[] = $state(data.initialPhotos || []);
	let selectedPhoto: Photo | null = $state(null);

	let loadingPhotos: boolean = $state(false);
	let error: string | null = $state(null);

	let page: number = $state(0);
	let hasMore: boolean = $state(true);

	onMount(async () => {
		if (maxSol === 0) {
			await loadRoverInfo();
		}
	});

	async function loadRoverInfo() {
		try {
			const rover = await fetchRoverInfo(selectedRover);
			maxSol = rover.max_sol;
		} catch (e) {
			console.error('Failed to load rover info:', e);
		}
	}

	function getSearchOptions() {
		return {
			rover: selectedRover,
			sol: sol ?? undefined,
			solMin: solMin ?? undefined,
			solMax: solMax ?? undefined,
			dateStart: dateStart || undefined,
			dateEnd: dateEnd || undefined,
			camera: camera || undefined,
			search: search || undefined
		};
	}

	async function searchPhotos() {
		loadingPhotos = true;
		error = null;
		page = 0;
		hasMore = true;

		try {
			photos = await fetchPhotos({
				...getSearchOptions(),
				page: 0
			});

			if (photos.length < 25) {
				hasMore = false;
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load photos';
			photos = [];
		} finally {
			loadingPhotos = false;
		}
	}

	async function loadMore() {
		if (loadingPhotos || !hasMore) return;

		loadingPhotos = true;
		page += 1;

		try {
			const morePhotos = await fetchPhotos({
				...getSearchOptions(),
				page
			});

			if (morePhotos.length < 25) {
				hasMore = false;
			}

			photos = [...photos, ...morePhotos];
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load more photos';
		} finally {
			loadingPhotos = false;
		}
	}

	function handleRoverChange(rover: RoverName) {
		selectedRover = rover;
		camera = '';
		photos = [];
		error = null;
		loadRoverInfo();
	}

	function handlePhotoClick(photo: Photo) {
		selectedPhoto = photo;
	}

	function closeLightbox() {
		selectedPhoto = null;
	}

	function clearFilters() {
		sol = null;
		solMin = null;
		solMax = null;
		dateStart = '';
		dateEnd = '';
		camera = '';
		search = '';
	}
</script>

<svelte:head>
	<title>Mars Rovers - Space Explorer</title>
	<meta name="description" content="Browse photos from NASA's Mars rovers: Perseverance, Curiosity, Opportunity, and Spirit. Filter by sol, date, and camera." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
	<!-- Header -->
	<header class="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
		<div class="max-w-7xl mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
						<div class="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
							<span class="text-white text-lg">🔴</span>
						</div>
						<div>
							<h1 class="text-xl font-bold text-white">Mars Rovers</h1>
							<p class="text-gray-400 text-sm">NASA rover imagery</p>
						</div>
					</a>
				</div>
				<nav class="flex items-center gap-4">
					<a href="/" class="text-gray-400 hover:text-white transition-colors text-sm">Home</a>
					<a href="/telescopes" class="text-gray-400 hover:text-white transition-colors text-sm">Telescopes</a>
				</nav>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 py-8 space-y-10">
		<!-- Browse Section -->
		<section class="space-y-6">
			<h2 class="text-2xl font-bold text-white">Browse Mars Photos</h2>

			<!-- Rover Selector -->
			<div>
				<p class="text-gray-400 text-sm mb-2">Select Rover</p>
				<RoverSelector selected={selectedRover} onSelect={handleRoverChange} />
			</div>

			<!-- Filters -->
			<FilterPanel
				rover={selectedRover}
				{sol}
				{solMin}
				{solMax}
				{dateStart}
				{dateEnd}
				{camera}
				{search}
				{maxSol}
				onSolChange={(s) => sol = s}
				onSolMinChange={(s) => solMin = s}
				onSolMaxChange={(s) => solMax = s}
				onDateStartChange={(d) => dateStart = d}
				onDateEndChange={(d) => dateEnd = d}
				onCameraChange={(c) => camera = c}
				onSearchChange={(s) => search = s}
				onClearFilters={clearFilters}
			/>

			<!-- Search Button -->
			<button
				type="button"
				class="px-6 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				onclick={searchPhotos}
				disabled={loadingPhotos}
			>
				{loadingPhotos ? 'Loading...' : 'Search Photos'}
			</button>

			<!-- Error Message -->
			{#if error}
				<div class="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg">
					{error}
				</div>
			{/if}

			<!-- Results -->
			<div class="space-y-6">
				<p class="text-gray-400">
					{#if photos.length > 0}
						Showing {photos.length} photos from {selectedRover.charAt(0).toUpperCase() + selectedRover.slice(1)}
					{:else}
						Recent photos from Perseverance rover
					{/if}
				</p>

				<PhotoGrid {photos} onPhotoClick={handlePhotoClick} />

				<!-- Load More -->
				{#if hasMore && photos.length > 0}
					<div class="flex justify-center pt-6">
						<button
							type="button"
							class="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
							onclick={loadMore}
							disabled={loadingPhotos}
						>
							{loadingPhotos ? 'Loading...' : 'Load More'}
						</button>
					</div>
				{/if}
			</div>
		</section>

		<!-- Educational Content -->
		<section class="border-t border-gray-800 pt-10 space-y-8">
			<h2 class="text-2xl font-bold text-white text-center">About NASA's Mars Rovers</h2>

			<div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
				<!-- Perseverance -->
				<article class="bg-gray-800/50 rounded-xl p-5 space-y-3">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold">P</div>
						<h3 class="text-white font-semibold">Perseverance</h3>
					</div>
					<p class="text-gray-400 text-sm leading-relaxed">
						NASA's most advanced rover, landed in Jezero Crater on February 18, 2021.
						Searching for signs of ancient microbial life and collecting samples for future return to Earth.
					</p>
					<ul class="text-gray-500 text-xs space-y-1">
						<li>Mass: 1,025 kg (2,260 lb)</li>
						<li>Dimensions: 3m × 2.7m × 2.2m</li>
						<li>Power: Multi-Mission RTG</li>
						<li>Cameras: 23 cameras</li>
						<li>Top Speed: 152 m/hour</li>
					</ul>
				</article>

				<!-- Curiosity -->
				<article class="bg-gray-800/50 rounded-xl p-5 space-y-3">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-bold">C</div>
						<h3 class="text-white font-semibold">Curiosity</h3>
					</div>
					<p class="text-gray-400 text-sm leading-relaxed">
						A car-sized rover exploring Gale Crater since August 2012.
						Confirmed Mars once had conditions favorable for microbial life.
					</p>
					<ul class="text-gray-500 text-xs space-y-1">
						<li>Mass: 899 kg (1,982 lb)</li>
						<li>Dimensions: 2.9m × 2.7m × 2.2m</li>
						<li>Power: Multi-Mission RTG</li>
						<li>Cameras: 17 cameras</li>
						<li>Top Speed: 90 m/hour</li>
					</ul>
				</article>

				<!-- Opportunity -->
				<article class="bg-gray-800/50 rounded-xl p-5 space-y-3">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">O</div>
						<h3 class="text-white font-semibold">Opportunity</h3>
					</div>
					<p class="text-gray-400 text-sm leading-relaxed">
						Operated for nearly 15 years, far exceeding its 90-day mission.
						Traveled over 45 km on Mars and found evidence of ancient water.
					</p>
					<ul class="text-gray-500 text-xs space-y-1">
						<li>Mass: 185 kg (408 lb)</li>
						<li>Dimensions: 1.6m × 2.3m × 1.5m</li>
						<li>Power: Solar panels</li>
						<li>Cameras: 9 cameras</li>
						<li>Distance: 45.16 km total</li>
					</ul>
				</article>

				<!-- Spirit -->
				<article class="bg-gray-800/50 rounded-xl p-5 space-y-3">
					<div class="flex items-center gap-3">
						<div class="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">S</div>
						<h3 class="text-white font-semibold">Spirit</h3>
					</div>
					<p class="text-gray-400 text-sm leading-relaxed">
						Opportunity's twin, explored Gusev Crater for over 6 years.
						Discovered evidence of past volcanic activity and ancient hot springs.
					</p>
					<ul class="text-gray-500 text-xs space-y-1">
						<li>Mass: 185 kg (408 lb)</li>
						<li>Dimensions: 1.6m × 2.3m × 1.5m</li>
						<li>Power: Solar panels</li>
						<li>Cameras: 9 cameras</li>
						<li>Distance: 7.73 km total</li>
					</ul>
				</article>
			</div>

			<!-- Technical Details -->
			<div class="grid md:grid-cols-2 gap-6">
				<div class="bg-gray-800/30 rounded-xl p-6 space-y-4">
					<h3 class="text-white font-semibold text-lg">Camera Systems</h3>
					<div class="space-y-3 text-sm">
						<div>
							<p class="text-orange-400 font-medium">Navigation Cameras (NavCam)</p>
							<p class="text-gray-400">Black-and-white stereo cameras for autonomous navigation and hazard avoidance.</p>
						</div>
						<div>
							<p class="text-orange-400 font-medium">Hazard Avoidance Cameras (HazCam)</p>
							<p class="text-gray-400">Fisheye cameras providing 120° views to detect obstacles.</p>
						</div>
						<div>
							<p class="text-orange-400 font-medium">Mast Camera (MastCam)</p>
							<p class="text-gray-400">Color cameras with zoom for geology, atmospheric, and mission support imaging.</p>
						</div>
						<div>
							<p class="text-orange-400 font-medium">MAHLI (Mars Hand Lens Imager)</p>
							<p class="text-gray-400">Microscopic imager for close-up photos of rocks and soil.</p>
						</div>
					</div>
				</div>

				<div class="bg-gray-800/30 rounded-xl p-6 space-y-4">
					<h3 class="text-white font-semibold text-lg">Mission Timeline</h3>
					<div class="space-y-3 text-sm">
						<div class="flex gap-4">
							<span class="text-gray-500 w-20">2004</span>
							<p class="text-gray-400">Spirit and Opportunity land on Mars (January)</p>
						</div>
						<div class="flex gap-4">
							<span class="text-gray-500 w-20">2010</span>
							<p class="text-gray-400">Spirit mission ends after getting stuck in sand</p>
						</div>
						<div class="flex gap-4">
							<span class="text-gray-500 w-20">2012</span>
							<p class="text-gray-400">Curiosity lands in Gale Crater (August)</p>
						</div>
						<div class="flex gap-4">
							<span class="text-gray-500 w-20">2019</span>
							<p class="text-gray-400">Opportunity mission ends after dust storm</p>
						</div>
						<div class="flex gap-4">
							<span class="text-gray-500 w-20">2021</span>
							<p class="text-gray-400">Perseverance lands in Jezero Crater (February)</p>
						</div>
					</div>
				</div>
			</div>

			<div class="bg-gray-800/30 rounded-xl p-6">
				<h3 class="text-white font-semibold mb-3">Understanding Mars Imagery</h3>
				<p class="text-gray-400 text-sm leading-relaxed">
					Mars rover images are transmitted from Mars to Earth via NASA's Deep Space Network.
					Raw images are unprocessed and show what the cameras actually captured.
					Sol refers to a Martian day (24 hours, 39 minutes) - the primary way mission scientists track time on Mars.
					Each rover carries multiple cameras optimized for different purposes, from navigation to scientific analysis.
					All imagery is publicly available through NASA's Planetary Data System.
				</p>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t border-gray-800 mt-10">
		<div class="max-w-7xl mx-auto px-4 py-8">
			<p class="text-gray-500 text-sm text-center">
				Data provided by <a href="https://mars.nasa.gov" target="_blank" rel="noopener noreferrer" class="text-orange-400 hover:text-orange-300">NASA Mars Exploration</a>.
				Images courtesy of NASA/JPL-Caltech.
			</p>
		</div>
	</footer>
</div>

<Lightbox photo={selectedPhoto} onClose={closeLightbox} />
