<script lang="ts">
	import type { SpaceImage } from '$lib/types/mars';
	import Lightbox from '$lib/components/Lightbox.svelte';

	let { data } = $props();

	let voyager1Images: SpaceImage[] = $state(data.voyager1Images || []);
	let voyager2Images: SpaceImage[] = $state(data.voyager2Images || []);
	let cassiniImages: SpaceImage[] = $state(data.cassiniImages || []);
	let newhorizonsImages: SpaceImage[] = $state(data.newhorizonsImages || []);
	let galileoImages: SpaceImage[] = $state(data.galileoImages || []);
	let selectedImage: SpaceImage | null = $state(null);

	// Tab state
	type ProbeName = 'voyager1' | 'voyager2' | 'cassini' | 'newhorizons' | 'galileo';
	let activeTab: ProbeName = $state('cassini');

	// Search and pagination state
	let searchQuery: string = $state('');
	let isSearching: boolean = $state(false);
	let isLoadingMore: boolean = $state(false);
	let voyager1Page: number = $state(1);
	let voyager2Page: number = $state(1);
	let cassiniPage: number = $state(1);
	let newhorizonsPage: number = $state(1);
	let galileoPage: number = $state(1);
	let voyager1HasMore: boolean = $state(true);
	let voyager2HasMore: boolean = $state(true);
	let cassiniHasMore: boolean = $state(true);
	let newhorizonsHasMore: boolean = $state(true);
	let galileoHasMore: boolean = $state(true);

	// Get current pagination state based on active tab
	let currentPage = $derived(
		activeTab === 'voyager1' ? voyager1Page :
		activeTab === 'voyager2' ? voyager2Page :
		activeTab === 'cassini' ? cassiniPage :
		activeTab === 'newhorizons' ? newhorizonsPage : galileoPage
	);
	let currentHasMore = $derived(
		activeTab === 'voyager1' ? voyager1HasMore :
		activeTab === 'voyager2' ? voyager2HasMore :
		activeTab === 'cassini' ? cassiniHasMore :
		activeTab === 'newhorizons' ? newhorizonsHasMore : galileoHasMore
	);

	interface ProbeInfo {
		name: ProbeName;
		displayName: string;
		fullName: string;
		active: boolean;
		launchDate: string;
		target: string;
		status: string;
		mission: string;
		distance: string;
		speed: string;
		agency: string;
		highlights: string[];
	}

	const PROBES: ProbeInfo[] = [
		{
			name: 'voyager1',
			displayName: 'Voyager 1',
			fullName: 'Voyager 1 Interstellar Mission',
			active: true,
			launchDate: 'Sep 5, 1977',
			target: 'Jupiter, Saturn, Interstellar',
			status: 'ACTIVE',
			mission: 'Planetary Flyby / Interstellar',
			distance: '~24 billion km from Earth',
			speed: '~17 km/s',
			agency: 'NASA/JPL',
			highlights: [
				'Farthest human-made object',
				'Entered interstellar space 2012',
				'Carries the Golden Record'
			]
		},
		{
			name: 'voyager2',
			displayName: 'Voyager 2',
			fullName: 'Voyager 2 Interstellar Mission',
			active: true,
			launchDate: 'Aug 20, 1977',
			target: 'Jupiter, Saturn, Uranus, Neptune',
			status: 'ACTIVE',
			mission: 'Grand Tour / Interstellar',
			distance: '~20 billion km from Earth',
			speed: '~15 km/s',
			agency: 'NASA/JPL',
			highlights: [
				'Only spacecraft to visit Uranus & Neptune',
				'Entered interstellar space 2018',
				'Still transmitting data'
			]
		},
		{
			name: 'cassini',
			displayName: 'Cassini',
			fullName: 'Cassini-Huygens Mission',
			active: false,
			launchDate: 'Oct 15, 1997',
			target: 'Saturn System',
			status: 'COMPLETED',
			mission: 'Saturn Orbiter',
			distance: 'Ended Sep 15, 2017',
			speed: 'Orbital insertion 2004',
			agency: 'NASA/ESA/ASI',
			highlights: [
				'13 years orbiting Saturn',
				'Huygens landed on Titan',
				'Discovered ocean on Enceladus'
			]
		},
		{
			name: 'newhorizons',
			displayName: 'New Horizons',
			fullName: 'New Horizons Pluto Mission',
			active: true,
			launchDate: 'Jan 19, 2006',
			target: 'Pluto, Kuiper Belt',
			status: 'ACTIVE',
			mission: 'Flyby / Kuiper Belt',
			distance: '~8 billion km from Earth',
			speed: '~14 km/s',
			agency: 'NASA/JHUAPL',
			highlights: [
				'First Pluto flyby (2015)',
				'Visited Arrokoth (2019)',
				'Exploring Kuiper Belt'
			]
		},
		{
			name: 'galileo',
			displayName: 'Galileo',
			fullName: 'Galileo Jupiter Mission',
			active: false,
			launchDate: 'Oct 18, 1989',
			target: 'Jupiter System',
			status: 'COMPLETED',
			mission: 'Jupiter Orbiter',
			distance: 'Ended Sep 21, 2003',
			speed: 'Orbital insertion 1995',
			agency: 'NASA/JPL',
			highlights: [
				'First Jupiter orbiter',
				'Dropped probe into Jupiter',
				'Discovered Europa subsurface ocean'
			]
		}
	];

	const selectedProbe = $derived(PROBES.find(p => p.name === activeTab) as ProbeInfo);

	// Color schemes for each probe - all teals/cyans
	const probeColors: Record<ProbeName, {
		active: string;
		inactive: string;
		accent: string;
		border: string;
		text: string;
		statusBg: string;
	}> = {
		voyager1: {
			active: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400',
			inactive: 'hover:border-cyan-500/30',
			accent: 'text-cyan-400',
			border: 'border-cyan-500/30',
			text: 'text-cyan-400/70',
			statusBg: 'bg-cyan-500/20'
		},
		voyager2: {
			active: 'bg-teal-500/20 border-teal-500/50 text-teal-400',
			inactive: 'hover:border-teal-500/30',
			accent: 'text-teal-400',
			border: 'border-teal-500/30',
			text: 'text-teal-400/70',
			statusBg: 'bg-teal-500/20'
		},
		cassini: {
			active: 'bg-sky-500/20 border-sky-500/50 text-sky-400',
			inactive: 'hover:border-sky-500/30',
			accent: 'text-sky-400',
			border: 'border-sky-500/30',
			text: 'text-sky-400/70',
			statusBg: 'bg-sky-500/20'
		},
		newhorizons: {
			active: 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400',
			inactive: 'hover:border-indigo-500/30',
			accent: 'text-indigo-400',
			border: 'border-indigo-500/30',
			text: 'text-indigo-400/70',
			statusBg: 'bg-indigo-500/20'
		},
		galileo: {
			active: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
			inactive: 'hover:border-blue-500/30',
			accent: 'text-blue-400',
			border: 'border-blue-500/30',
			text: 'text-blue-400/70',
			statusBg: 'bg-blue-500/20'
		}
	};

	const currentColors = $derived(probeColors[activeTab]);

	function handleImageClick(image: SpaceImage) {
		selectedImage = image;
	}

	function closeLightbox() {
		selectedImage = null;
	}

	let currentImages = $derived(
		activeTab === 'voyager1' ? voyager1Images :
		activeTab === 'voyager2' ? voyager2Images :
		activeTab === 'cassini' ? cassiniImages :
		activeTab === 'newhorizons' ? newhorizonsImages : galileoImages
	);

	async function searchImages() {
		isSearching = true;
		try {
			const response = await fetch(`/api/probes?probe=${activeTab}&q=${encodeURIComponent(searchQuery)}&page=1`);
			if (response.ok) {
				const result = await response.json();
				if (activeTab === 'voyager1') {
					voyager1Images = result.images;
					voyager1HasMore = result.hasMore;
					voyager1Page = 1;
				} else if (activeTab === 'voyager2') {
					voyager2Images = result.images;
					voyager2HasMore = result.hasMore;
					voyager2Page = 1;
				} else if (activeTab === 'cassini') {
					cassiniImages = result.images;
					cassiniHasMore = result.hasMore;
					cassiniPage = 1;
				} else if (activeTab === 'newhorizons') {
					newhorizonsImages = result.images;
					newhorizonsHasMore = result.hasMore;
					newhorizonsPage = 1;
				} else {
					galileoImages = result.images;
					galileoHasMore = result.hasMore;
					galileoPage = 1;
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
			const response = await fetch(`/api/probes?probe=${activeTab}&q=${encodeURIComponent(searchQuery)}&page=${nextPage}`);
			if (response.ok) {
				const result = await response.json();
				if (activeTab === 'voyager1') {
					voyager1Images = [...voyager1Images, ...result.images];
					voyager1HasMore = result.hasMore;
					voyager1Page = nextPage;
				} else if (activeTab === 'voyager2') {
					voyager2Images = [...voyager2Images, ...result.images];
					voyager2HasMore = result.hasMore;
					voyager2Page = nextPage;
				} else if (activeTab === 'cassini') {
					cassiniImages = [...cassiniImages, ...result.images];
					cassiniHasMore = result.hasMore;
					cassiniPage = nextPage;
				} else if (activeTab === 'newhorizons') {
					newhorizonsImages = [...newhorizonsImages, ...result.images];
					newhorizonsHasMore = result.hasMore;
					newhorizonsPage = nextPage;
				} else {
					galileoImages = [...galileoImages, ...result.images];
					galileoHasMore = result.hasMore;
					galileoPage = nextPage;
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
		voyager1Images = data.voyager1Images || [];
		voyager2Images = data.voyager2Images || [];
		cassiniImages = data.cassiniImages || [];
		newhorizonsImages = data.newhorizonsImages || [];
		galileoImages = data.galileoImages || [];
		voyager1Page = 1;
		voyager2Page = 1;
		cassiniPage = 1;
		newhorizonsPage = 1;
		galileoPage = 1;
		voyager1HasMore = true;
		voyager2HasMore = true;
		cassiniHasMore = true;
		newhorizonsHasMore = true;
		galileoHasMore = true;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			searchImages();
		}
	}

	// Display name helper
	const probeDisplayNames: Record<ProbeName, string> = {
		voyager1: 'Voyager 1',
		voyager2: 'Voyager 2',
		cassini: 'Cassini',
		newhorizons: 'New Horizons',
		galileo: 'Galileo'
	};

	let currentDisplayName = $derived(probeDisplayNames[activeTab]);
</script>

<svelte:head>
	<title>Probes - Cosmic Mirror</title>
	<meta name="description" content="Explore imagery from NASA's deep space probes: Voyager 1 & 2, Cassini at Saturn, New Horizons at Pluto, and Galileo at Jupiter." />
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
					<span class="text-xs tracking-[0.2em] {currentColors.accent} uppercase">Probes</span>
					<div class="h-4 w-px bg-white/10"></div>
					<span class="text-xs tracking-wider text-white/50 uppercase">Deep Space Missions</span>
				</div>
				<div class="w-20"></div>
			</div>
		</div>
	</header>

	<main class="relative z-10 max-w-7xl mx-auto px-8 py-8 space-y-8">
		<!-- Probe Selector -->
		<section class="space-y-4">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] {currentColors.accent} uppercase">Select Probe</span>
				<div class="h-px flex-1 bg-white/5"></div>
			</div>

			<div class="space-y-6">
				<!-- Probe Selection Buttons -->
				<div class="flex flex-wrap gap-2">
					{#each PROBES as probe}
						{@const colors = probeColors[probe.name]}
						<button
							type="button"
							class="px-4 py-2.5 text-left transition-all duration-200 border
								{activeTab === probe.name
									? colors.active
									: `bg-white/[0.02] border-white/10 text-white/50 hover:text-white/70 ${colors.inactive}`}"
							onclick={() => activeTab = probe.name}
						>
							<div class="flex items-center gap-2">
								<span class="text-sm tracking-wider uppercase">{probe.displayName}</span>
								{#if probe.active}
									<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
								{/if}
							</div>
							<div class="text-[10px] tracking-wider {activeTab === probe.name ? colors.text : 'text-white/30'}">
								{probe.target}
							</div>
						</button>
					{/each}
				</div>

				<!-- Selected Probe Details Panel -->
				{#if selectedProbe}
					<div class="bg-white/[0.02] border {currentColors.border} p-6">
						<!-- Header -->
						<div class="flex items-start justify-between mb-6">
							<div>
								<div class="flex items-center gap-3">
									<h3 class="text-lg font-medium tracking-wider {currentColors.accent} uppercase">{selectedProbe.displayName}</h3>
									<span class="px-2 py-0.5 text-[10px] tracking-wider uppercase {currentColors.statusBg} {currentColors.accent}">
										{selectedProbe.status}
									</span>
								</div>
								<p class="text-xs tracking-wider text-white/40 mt-1">{selectedProbe.fullName}</p>
							</div>
							<div class="text-right">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Target</p>
								<p class="text-sm tracking-wider {currentColors.text}">{selectedProbe.target}</p>
							</div>
						</div>

						<!-- Stats Grid -->
						<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
							<div class="space-y-1">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Launch</p>
								<p class="text-sm tracking-wider text-white/70">{selectedProbe.launchDate}</p>
							</div>
							<div class="space-y-1">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Mission</p>
								<p class="text-sm tracking-wider text-white/70">{selectedProbe.mission}</p>
							</div>
							<div class="space-y-1">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Agency</p>
								<p class="text-sm tracking-wider text-white/70">{selectedProbe.agency}</p>
							</div>
							<div class="space-y-1">
								<p class="text-[10px] tracking-wider text-white/30 uppercase">Distance/Status</p>
								<p class="text-sm tracking-wider text-white/70">{selectedProbe.distance}</p>
							</div>
						</div>

						<!-- Highlights -->
						<div class="pt-4 border-t border-white/5">
							<p class="text-[10px] tracking-wider text-white/30 uppercase mb-3">Mission Highlights</p>
							<ul class="space-y-2">
								{#each selectedProbe.highlights as highlight}
									<li class="flex items-start gap-2 text-sm text-white/50">
										<span class="{currentColors.accent} text-xs">&#9656;</span>
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
						bind:value={searchQuery}
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
				Images: <a href="https://images.nasa.gov" target="_blank" rel="noopener noreferrer" class="{currentColors.text} hover:opacity-100 transition-colors">NASA Image Library</a>
			</p>
		</div>
	</footer>
</div>

<Lightbox spaceImage={selectedImage} onClose={closeLightbox} />
