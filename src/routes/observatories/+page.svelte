<script lang="ts">
	import type { SpaceImage } from '$lib/types/mars';
	import Lightbox from '$lib/components/Lightbox.svelte';

	let { data } = $props();

	let jwstImages: SpaceImage[] = $state(data.jwstImages || []);
	let hubbleImages: SpaceImage[] = $state(data.hubbleImages || []);
	let spitzerImages: SpaceImage[] = $state(data.spitzerImages || []);
	let chandraImages: SpaceImage[] = $state(data.chandraImages || []);
	let selectedImage: SpaceImage | null = $state(null);

	// Tab state
	type TelescopeName = 'jwst' | 'hubble' | 'spitzer' | 'chandra';
	let activeTab: TelescopeName = $state('jwst');

	// Search and pagination state
	let searchQuery: string = $state('');
	let isSearching: boolean = $state(false);
	let isLoadingMore: boolean = $state(false);
	let jwstPage: number = $state(1);
	let hubblePage: number = $state(1);
	let spitzerPage: number = $state(1);
	let chandraPage: number = $state(1);
	let jwstHasMore: boolean = $state(true);
	let hubbleHasMore: boolean = $state(true);
	let spitzerHasMore: boolean = $state(true);
	let chandraHasMore: boolean = $state(true);

	// Get current pagination state based on active tab
	let currentPage = $derived(
		activeTab === 'jwst' ? jwstPage :
		activeTab === 'hubble' ? hubblePage :
		activeTab === 'spitzer' ? spitzerPage : chandraPage
	);
	let currentHasMore = $derived(
		activeTab === 'jwst' ? jwstHasMore :
		activeTab === 'hubble' ? hubbleHasMore :
		activeTab === 'spitzer' ? spitzerHasMore : chandraHasMore
	);

	interface TelescopeInfo {
		name: TelescopeName;
		displayName: string;
		fullName: string;
		active: boolean;
		launchDate: string;
		location: string;
		status: string;
		mission: string;
		mirrorSize: string;
		wavelengths: string;
		orbit: string;
		mass: string;
		highlights: string[];
	}

	const TELESCOPES: TelescopeInfo[] = [
		{
			name: 'jwst',
			displayName: 'James Webb',
			fullName: 'James Webb Space Telescope',
			active: true,
			launchDate: 'Dec 25, 2021',
			location: 'L2 Lagrange Point',
			status: 'ACTIVE',
			mission: 'Infrared Astronomy',
			mirrorSize: '6.5m primary',
			wavelengths: 'Infrared (0.6-28.5 µm)',
			orbit: '1.5M km from Earth',
			mass: '6,500 kg',
			highlights: [
				'Largest space telescope ever built',
				'First deep field images 2022',
				'Detecting atmospheres of exoplanets'
			]
		},
		{
			name: 'hubble',
			displayName: 'Hubble',
			fullName: 'Hubble Space Telescope',
			active: true,
			launchDate: 'Apr 24, 1990',
			location: 'Low Earth Orbit',
			status: 'ACTIVE',
			mission: 'Optical/UV Astronomy',
			mirrorSize: '2.4m primary',
			wavelengths: 'UV/Visible/Near-IR',
			orbit: '547 km altitude',
			mass: '11,110 kg',
			highlights: [
				'Operating for 34+ years',
				'Helped determine universe age',
				'Over 1.5 million observations'
			]
		},
		{
			name: 'spitzer',
			displayName: 'Spitzer',
			fullName: 'Spitzer Space Telescope',
			active: false,
			launchDate: 'Aug 25, 2003',
			location: 'Heliocentric Orbit',
			status: 'RETIRED',
			mission: 'Infrared Astronomy',
			mirrorSize: '0.85m primary',
			wavelengths: 'Infrared (3-180 µm)',
			orbit: 'Earth-trailing',
			mass: '950 kg',
			highlights: [
				'Operated 2003-2020',
				'First exoplanet weather map',
				'Revealed hidden universe in infrared'
			]
		},
		{
			name: 'chandra',
			displayName: 'Chandra',
			fullName: 'Chandra X-ray Observatory',
			active: true,
			launchDate: 'Jul 23, 1999',
			location: 'Highly Elliptical Orbit',
			status: 'ACTIVE',
			mission: 'X-ray Astronomy',
			mirrorSize: '1.2m (4 nested)',
			wavelengths: 'X-ray (0.1-10 keV)',
			orbit: '16,000-133,000 km',
			mass: '4,790 kg',
			highlights: [
				'Sharpest X-ray images ever',
				'Black hole observations',
				'Dark matter mapping'
			]
		}
	];

	const selectedTelescope = $derived(TELESCOPES.find(t => t.name === activeTab) as TelescopeInfo);

	// Color schemes for each telescope - all purples/violets
	const telescopeColors: Record<TelescopeName, {
		active: string;
		inactive: string;
		accent: string;
		border: string;
		text: string;
		statusBg: string;
	}> = {
		jwst: {
			active: 'bg-violet-500/20 border-violet-500/50 text-violet-400',
			inactive: 'hover:border-violet-500/30',
			accent: 'text-violet-400',
			border: 'border-violet-500/30',
			text: 'text-violet-400/70',
			statusBg: 'bg-violet-500/20'
		},
		hubble: {
			active: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
			inactive: 'hover:border-purple-500/30',
			accent: 'text-purple-400',
			border: 'border-purple-500/30',
			text: 'text-purple-400/70',
			statusBg: 'bg-purple-500/20'
		},
		spitzer: {
			active: 'bg-fuchsia-500/20 border-fuchsia-500/50 text-fuchsia-400',
			inactive: 'hover:border-fuchsia-500/30',
			accent: 'text-fuchsia-400',
			border: 'border-fuchsia-500/30',
			text: 'text-fuchsia-400/70',
			statusBg: 'bg-fuchsia-500/20'
		},
		chandra: {
			active: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400',
			inactive: 'hover:border-indigo-500/30',
			accent: 'text-indigo-400',
			border: 'border-indigo-500/30',
			text: 'text-indigo-400/70',
			statusBg: 'bg-indigo-500/20'
		}
	};

	const currentColors = $derived(telescopeColors[activeTab]);

	function handleImageClick(image: SpaceImage) {
		selectedImage = image;
	}

	function closeLightbox() {
		selectedImage = null;
	}

	let currentImages = $derived(
		activeTab === 'jwst' ? jwstImages :
		activeTab === 'hubble' ? hubbleImages :
		activeTab === 'spitzer' ? spitzerImages : chandraImages
	);

	async function searchImages() {
		isSearching = true;
		try {
			const response = await fetch(`/api/observatories?telescope=${activeTab}&q=${encodeURIComponent(searchQuery)}&page=1`);
			if (response.ok) {
				const result = await response.json();
				if (activeTab === 'jwst') {
					jwstImages = result.images;
					jwstHasMore = result.hasMore;
					jwstPage = 1;
				} else if (activeTab === 'hubble') {
					hubbleImages = result.images;
					hubbleHasMore = result.hasMore;
					hubblePage = 1;
				} else if (activeTab === 'spitzer') {
					spitzerImages = result.images;
					spitzerHasMore = result.hasMore;
					spitzerPage = 1;
				} else {
					chandraImages = result.images;
					chandraHasMore = result.hasMore;
					chandraPage = 1;
				}
			}
		} catch (error) {
			console.error('Failed to search images:', error);
		} finally {
			isSearching = false;
		}
	}

	async function loadMore() {
		if (isLoadingMore || !currentHasMore) return;

		isLoadingMore = true;
		const nextPage = currentPage + 1;

		try {
			const response = await fetch(`/api/observatories?telescope=${activeTab}&q=${encodeURIComponent(searchQuery)}&page=${nextPage}`);
			if (response.ok) {
				const result = await response.json();
				if (activeTab === 'jwst') {
					jwstImages = [...jwstImages, ...result.images];
					jwstHasMore = result.hasMore;
					jwstPage = nextPage;
				} else if (activeTab === 'hubble') {
					hubbleImages = [...hubbleImages, ...result.images];
					hubbleHasMore = result.hasMore;
					hubblePage = nextPage;
				} else if (activeTab === 'spitzer') {
					spitzerImages = [...spitzerImages, ...result.images];
					spitzerHasMore = result.hasMore;
					spitzerPage = nextPage;
				} else {
					chandraImages = [...chandraImages, ...result.images];
					chandraHasMore = result.hasMore;
					chandraPage = nextPage;
				}
			}
		} catch (error) {
			console.error('Failed to load more images:', error);
		} finally {
			isLoadingMore = false;
		}
	}

	function clearSearch() {
		searchQuery = '';
		// Reset to initial data
		jwstImages = data.jwstImages || [];
		hubbleImages = data.hubbleImages || [];
		spitzerImages = data.spitzerImages || [];
		chandraImages = data.chandraImages || [];
		jwstPage = 1;
		hubblePage = 1;
		spitzerPage = 1;
		chandraPage = 1;
		jwstHasMore = true;
		hubbleHasMore = true;
		spitzerHasMore = true;
		chandraHasMore = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			searchImages();
		}
	}

	// Debounced real-time search
	let debounceTimer: ReturnType<typeof setTimeout>;

	function handleSearchInput(value: string) {
		searchQuery = value;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			if (searchQuery) {
				searchImages();
			}
		}, 300);
	}

	// Display name helper
	const telescopeDisplayNames: Record<TelescopeName, string> = {
		jwst: 'JWST',
		hubble: 'Hubble',
		spitzer: 'Spitzer',
		chandra: 'Chandra'
	};

	let currentDisplayName = $derived(telescopeDisplayNames[activeTab]);
</script>

<svelte:head>
	<title>Observatories - Cosmic Mirror</title>
	<meta name="description" content="Browse stunning images from NASA's space observatories: James Webb, Hubble, Spitzer, Chandra, and EPIC. Explore the universe from infrared to X-ray, plus Earth observation." />
</svelte:head>

<div class="min-h-screen bg-black relative">
	<!-- Background grid -->
	<div class="fixed inset-0 opacity-[0.02]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>

	<!-- Header -->
	<header class="relative z-10 border-b border-white/5">
		<div class="max-w-7xl mx-auto px-8 py-4">
			<div class="flex items-center justify-between">
				<a href="/" class="flex items-center gap-3 text-white/50 hover:text-white/80 transition-colors group">
					<svg class="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7" />
					</svg>
					<span class="text-xs tracking-wider uppercase">Back</span>
				</a>
				<div class="flex items-center gap-4">
					<span class="text-xs tracking-[0.2em] {currentColors.accent} uppercase">Observatories</span>
					<div class="h-4 w-px bg-white/10"></div>
					<span class="text-xs tracking-wider text-white/50 uppercase">Space Telescopes & Satellites</span>
				</div>
				<div class="w-20"></div>
			</div>
		</div>
	</header>

	<main class="relative z-10 max-w-7xl mx-auto px-8 py-8 space-y-8">
		<!-- Observatory Selector -->
		<section class="space-y-4">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] {currentColors.accent} uppercase">Select Observatory</span>
				<div class="h-px flex-1 bg-white/5"></div>
			</div>

			<div class="space-y-6">
				<!-- Telescope Selection Buttons -->
				<div class="flex flex-wrap gap-2">
					{#each TELESCOPES as telescope}
						{@const colors = telescopeColors[telescope.name]}
						<button
							type="button"
							class="px-4 py-2.5 text-left transition-all duration-200 border
								{activeTab === telescope.name
									? colors.active
									: `bg-white/[0.02] border-white/10 text-white/50 hover:text-white/70 ${colors.inactive}`}"
							onclick={() => activeTab = telescope.name}
						>
							<div class="flex items-center gap-2">
								<span class="text-sm tracking-wider uppercase">{telescope.displayName}</span>
								{#if telescope.active}
									<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
								{/if}
							</div>
							<div class="text-[10px] tracking-wider {activeTab === telescope.name ? colors.text : 'text-white/30'}">
								{telescope.wavelengths}
							</div>
						</button>
					{/each}
				</div>

				<!-- Selected Telescope Details Panel -->
				{#if selectedTelescope}
					<div class="bg-white/[0.02] border {currentColors.border} p-6">
						<!-- Header -->
						<div class="flex items-start justify-between mb-6">
							<div>
								<div class="flex items-center gap-3">
									<h3 class="text-lg font-medium tracking-wider {currentColors.accent} uppercase">{selectedTelescope.displayName}</h3>
									<span class="px-2 py-0.5 text-[10px] tracking-wider uppercase {currentColors.statusBg} {currentColors.accent}">
										{selectedTelescope.status}
									</span>
								</div>
								<p class="text-xs tracking-wider text-white/40 mt-1">{selectedTelescope.fullName}</p>
							</div>
							<div class="text-right">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Location</p>
								<p class="text-sm tracking-wider {currentColors.text}">{selectedTelescope.location}</p>
							</div>
						</div>

						<!-- Stats Grid -->
						<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							<div class="space-y-1">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Launch</p>
								<p class="text-sm tracking-wider text-white/70">{selectedTelescope.launchDate}</p>
							</div>
							<div class="space-y-1">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Mission</p>
								<p class="text-sm tracking-wider text-white/70">{selectedTelescope.mission}</p>
							</div>
							<div class="space-y-1">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Mass</p>
								<p class="text-sm tracking-wider text-white/70">{selectedTelescope.mass}</p>
							</div>
							<div class="space-y-1">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Orbit</p>
								<p class="text-sm tracking-wider text-white/70">{selectedTelescope.orbit}</p>
							</div>
						</div>

						<!-- Tech Specs Row -->
						<div class="flex flex-wrap gap-6 mb-6 pt-4 border-t border-white/5">
							<div class="space-y-1">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Mirror Size</p>
								<p class="text-sm tracking-wider {currentColors.text}">{selectedTelescope.mirrorSize}</p>
							</div>
							<div class="space-y-1">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Wavelengths</p>
								<p class="text-sm tracking-wider {currentColors.text}">{selectedTelescope.wavelengths}</p>
							</div>
						</div>

						<!-- Highlights -->
						<div class="pt-4 border-t border-white/5">
							<p class="text-[10px] tracking-wider text-white/30 uppercase mb-3">Mission Highlights</p>
							<ul class="space-y-2">
								{#each selectedTelescope.highlights as highlight}
									<li class="flex items-start gap-2 text-sm text-white/50">
										<span class="{currentColors.accent} text-xs">▸</span>
										{highlight}
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/if}
			</div>
		</section>

		<!-- Search Section -->
		<section class="space-y-4">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] {currentColors.accent} uppercase">Search</span>
				<div class="h-px flex-1 bg-white/5"></div>
			</div>

			<div class="flex flex-wrap items-center gap-3">
				<div class="flex items-center gap-2 flex-1 max-w-md">
					<input
						type="text"
						value={searchQuery}
						oninput={(e) => handleSearchInput(e.currentTarget.value)}
						onkeydown={handleKeydown}
						placeholder="Search {currentDisplayName} images..."
						class="flex-1 bg-white/[0.02] border border-white/10 px-3 py-2 text-sm text-white/70 placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-colors"
					/>
					<button
						type="button"
						onclick={searchImages}
						disabled={isSearching}
						class="px-4 py-2 text-xs tracking-wider uppercase transition-all {currentColors.statusBg} border {currentColors.border} {currentColors.accent} disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isSearching ? 'Searching...' : 'Search'}
					</button>
					{#if searchQuery}
						<button
							type="button"
							onclick={clearSearch}
							class="px-3 py-2 text-xs tracking-wider uppercase text-white/40 hover:text-white/70 transition-colors"
						>
							Clear
						</button>
					{/if}
				</div>
				<p class="text-[10px] tracking-wider text-white/30">
					Search NASA's image library for {currentDisplayName} imagery
				</p>
			</div>
		</section>

		<!-- Image Grid -->
		<section class="space-y-6">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] text-white/50 uppercase">Images</span>
				<div class="h-px flex-1 bg-white/5"></div>
				<span class="text-[10px] tracking-wider text-white/50">
					{currentImages.length} from {currentDisplayName}
				</span>
			</div>

			{#if currentImages.length === 0}
				<div class="flex flex-col items-center justify-center py-20 text-white/30">
					<svg class="w-10 h-10 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					<p class="text-xs tracking-wider uppercase">No images available</p>
				</div>
			{:else}
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
					{#each currentImages as image (image.id)}
						{@const hoverBorder = currentColors.inactive}
						{@const cornerColor = currentColors.border}
						<button
							type="button"
							class="group relative aspect-square overflow-hidden bg-white/[0.02] border border-white/5 {hoverBorder} cursor-pointer text-left transition-all duration-300"
							onclick={() => handleImageClick(image)}
						>
							<img
								src={image.thumbnail_src || image.img_src}
								alt={image.title}
								class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								loading="lazy"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<div class="absolute bottom-0 left-0 right-0 p-3 space-y-1">
									<p class="text-white/90 text-xs font-medium line-clamp-2">{image.title}</p>
									{#if image.date}
										<p class="text-white/50 text-[10px] tracking-wider">{image.date}</p>
									{/if}
								</div>
							</div>

							<!-- Corner accent on hover -->
							<div class="absolute top-0 left-0 w-3 h-3 border-t border-l {cornerColor} opacity-0 group-hover:opacity-100 transition-opacity"></div>
							<div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r {cornerColor} opacity-0 group-hover:opacity-100 transition-opacity"></div>
						</button>
					{/each}
				</div>

				<!-- Load More Button -->
				{#if currentHasMore && currentImages.length > 0}
					<div class="flex justify-center pt-6">
						<button
							type="button"
							onclick={loadMore}
							disabled={isLoadingMore}
							class="px-6 py-2.5 bg-white/[0.02] border border-white/10 hover:border-white/20 text-white/50 hover:text-white/70 text-xs tracking-wider uppercase transition-all disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoadingMore ? 'Loading...' : 'Load More'}
						</button>
					</div>
				{/if}
			{/if}
		</section>
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5 mt-12">
		<div class="max-w-7xl mx-auto px-8 py-6">
			<p class="text-xs tracking-wider text-white/50 text-center">
				Images: <a href="https://webbtelescope.org" target="_blank" rel="noopener noreferrer" class="{currentColors.text} hover:opacity-100 transition-colors">NASA/ESA/CSA/STScI</a>
			</p>
		</div>
	</footer>
</div>

<Lightbox spaceImage={selectedImage} onClose={closeLightbox} />
