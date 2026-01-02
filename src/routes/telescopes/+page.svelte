<script lang="ts">
	import type { SpaceImage } from '$lib/types/mars';
	import Lightbox from '$lib/components/Lightbox.svelte';

	let { data } = $props();

	let jwstImages: SpaceImage[] = $state(data.jwstImages || []);
	let hubbleImages: SpaceImage[] = $state(data.hubbleImages || []);
	let selectedImage: SpaceImage | null = $state(null);

	// Tab state
	let activeTab: 'jwst' | 'hubble' = $state('jwst');

	function handleImageClick(image: SpaceImage) {
		selectedImage = image;
	}

	function closeLightbox() {
		selectedImage = null;
	}

	let currentImages = $derived(activeTab === 'jwst' ? jwstImages : hubbleImages);
</script>

<svelte:head>
	<title>Space Telescopes - Space Explorer</title>
	<meta name="description" content="Browse stunning images from the James Webb Space Telescope and Hubble Space Telescope. Explore the universe through NASA's most powerful observatories." />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
	<!-- Header -->
	<header class="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
		<div class="max-w-7xl mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<a href="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
						<div class="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
							<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
							</svg>
						</div>
						<div>
							<h1 class="text-xl font-bold text-white">Space Telescopes</h1>
							<p class="text-gray-400 text-sm">JWST & Hubble imagery</p>
						</div>
					</a>
				</div>
				<nav class="flex items-center gap-4">
					<a href="/" class="text-gray-400 hover:text-white transition-colors text-sm">Home</a>
					<a href="/mars" class="text-gray-400 hover:text-white transition-colors text-sm">Mars Rovers</a>
				</nav>
			</div>
		</div>
	</header>

	<main class="max-w-7xl mx-auto px-4 py-8 space-y-10">
		<!-- Telescope Selector Tabs -->
		<div class="flex gap-4">
			<button
				type="button"
				class="px-6 py-3 rounded-lg font-medium transition-all {activeTab === 'jwst' ? 'bg-gradient-to-r from-amber-600 to-red-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}"
				onclick={() => activeTab = 'jwst'}
			>
				<span class="flex items-center gap-2">
					<span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">JW</span>
					James Webb
				</span>
			</button>
			<button
				type="button"
				class="px-6 py-3 rounded-lg font-medium transition-all {activeTab === 'hubble' ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}"
				onclick={() => activeTab = 'hubble'}
			>
				<span class="flex items-center gap-2">
					<span class="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold">H</span>
					Hubble
				</span>
			</button>
		</div>

		<!-- Image Grid -->
		<section class="space-y-4">
			<h2 class="text-2xl font-bold text-white">
				{activeTab === 'jwst' ? 'James Webb Space Telescope' : 'Hubble Space Telescope'} Images
			</h2>
			<p class="text-gray-400">
				Showing {currentImages.length} images
			</p>

			{#if currentImages.length === 0}
				<div class="flex flex-col items-center justify-center py-20 text-gray-400">
					<svg class="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>
					<p class="text-lg">No images available</p>
					<p class="text-sm">Check back later for new imagery</p>
				</div>
			{:else}
				<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
					{#each currentImages as image (image.id)}
						<button
							type="button"
							class="group relative aspect-square overflow-hidden rounded-lg bg-gray-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
							onclick={() => handleImageClick(image)}
						>
							<img
								src={image.thumbnail_src || image.img_src}
								alt={image.title}
								class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
								loading="lazy"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<div class="absolute bottom-0 left-0 right-0 p-3">
									<p class="text-white text-sm font-medium line-clamp-2">{image.title}</p>
									{#if image.date}
										<p class="text-gray-300 text-xs mt-1">{image.date}</p>
									{/if}
								</div>
							</div>
						</button>
					{/each}
				</div>
			{/if}
		</section>

		<!-- Educational Content -->
		<section class="border-t border-gray-800 pt-10 space-y-8">
			<h2 class="text-2xl font-bold text-white text-center">About Space Telescopes</h2>

			<div class="grid md:grid-cols-2 gap-6">
				<!-- JWST -->
				<article class="bg-gray-800/50 rounded-xl p-6 space-y-4">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 bg-gradient-to-br from-amber-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold">JW</div>
						<div>
							<h3 class="text-white font-semibold text-lg">James Webb Space Telescope</h3>
							<p class="text-gray-400 text-sm">Launched December 25, 2021</p>
						</div>
					</div>
					<p class="text-gray-400 text-sm leading-relaxed">
						The most powerful space telescope ever built, JWST observes the universe in infrared light.
						Its 6.5-meter gold-coated mirror can see the first galaxies formed after the Big Bang,
						study exoplanet atmospheres for signs of life, and peer through cosmic dust clouds
						to witness stars being born.
					</p>
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p class="text-gray-500">Primary Mirror</p>
							<p class="text-white">6.5 meters (21 feet)</p>
						</div>
						<div>
							<p class="text-gray-500">Location</p>
							<p class="text-white">L2 Lagrange Point</p>
						</div>
						<div>
							<p class="text-gray-500">Distance from Earth</p>
							<p class="text-white">1.5 million km</p>
						</div>
						<div>
							<p class="text-gray-500">Operating Temp</p>
							<p class="text-white">-233°C (-387°F)</p>
						</div>
						<div>
							<p class="text-gray-500">Instruments</p>
							<p class="text-white">NIRCam, NIRSpec, MIRI, FGS/NIRISS</p>
						</div>
						<div>
							<p class="text-gray-500">Sunshield Size</p>
							<p class="text-white">21m × 14m (tennis court)</p>
						</div>
					</div>
				</article>

				<!-- Hubble -->
				<article class="bg-gray-800/50 rounded-xl p-6 space-y-4">
					<div class="flex items-center gap-3">
						<div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">H</div>
						<div>
							<h3 class="text-white font-semibold text-lg">Hubble Space Telescope</h3>
							<p class="text-gray-400 text-sm">Launched April 24, 1990</p>
						</div>
					</div>
					<p class="text-gray-400 text-sm leading-relaxed">
						Operating for over 34 years, Hubble has revolutionized our understanding of the cosmos.
						It has captured iconic images of nebulae, galaxies, and cosmic events,
						helped determine the age of the universe at 13.8 billion years,
						and contributed to the discovery of dark energy.
					</p>
					<div class="grid grid-cols-2 gap-4 text-sm">
						<div>
							<p class="text-gray-500">Primary Mirror</p>
							<p class="text-white">2.4 meters (7.9 feet)</p>
						</div>
						<div>
							<p class="text-gray-500">Orbit Altitude</p>
							<p class="text-white">540 km above Earth</p>
						</div>
						<div>
							<p class="text-gray-500">Orbital Period</p>
							<p class="text-white">97 minutes</p>
						</div>
						<div>
							<p class="text-gray-500">Orbital Speed</p>
							<p class="text-white">27,000 km/h</p>
						</div>
						<div>
							<p class="text-gray-500">Instruments</p>
							<p class="text-white">WFC3, ACS, COS, STIS</p>
						</div>
						<div>
							<p class="text-gray-500">Observations</p>
							<p class="text-white">1.5+ million</p>
						</div>
					</div>
				</article>
			</div>

			<!-- Comparison -->
			<div class="bg-gray-800/30 rounded-xl p-6 space-y-4">
				<h3 class="text-white font-semibold text-lg">JWST vs Hubble: Complementary Observatories</h3>
				<div class="grid md:grid-cols-3 gap-6 text-sm">
					<div>
						<p class="text-purple-400 font-medium mb-2">Light Spectrum</p>
						<p class="text-gray-400">
							Hubble observes primarily in visible and ultraviolet light.
							JWST observes in infrared, seeing through cosmic dust and detecting the most distant objects.
						</p>
					</div>
					<div>
						<p class="text-purple-400 font-medium mb-2">Mirror Size</p>
						<p class="text-gray-400">
							JWST's 6.5m mirror collects 6× more light than Hubble's 2.4m mirror,
							enabling it to see fainter and more distant objects.
						</p>
					</div>
					<div>
						<p class="text-purple-400 font-medium mb-2">Location</p>
						<p class="text-gray-400">
							Hubble orbits Earth and can be serviced. JWST is 1.5 million km away at L2,
							where it stays cold for infrared observation.
						</p>
					</div>
				</div>
			</div>

			<!-- Science Highlights -->
			<div class="bg-gray-800/30 rounded-xl p-6 space-y-4">
				<h3 class="text-white font-semibold text-lg">Key Scientific Discoveries</h3>
				<div class="grid md:grid-cols-2 gap-4 text-sm">
					<div class="space-y-2">
						<p class="text-purple-400 font-medium">Hubble Discoveries</p>
						<ul class="text-gray-400 space-y-1 list-disc list-inside">
							<li>Determined the universe's age: 13.8 billion years</li>
							<li>Discovered dark energy accelerating cosmic expansion</li>
							<li>Found supermassive black holes in galaxy centers</li>
							<li>Detected water vapor on exoplanets</li>
							<li>Observed galaxies colliding and merging</li>
						</ul>
					</div>
					<div class="space-y-2">
						<p class="text-purple-400 font-medium">JWST Discoveries</p>
						<ul class="text-gray-400 space-y-1 list-disc list-inside">
							<li>Detected the most distant galaxies ever seen</li>
							<li>Analyzed exoplanet atmospheres for biosignatures</li>
							<li>Revealed star formation in unprecedented detail</li>
							<li>Studied the atmospheres of ice giants</li>
							<li>Observed the earliest supermassive black holes</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	</main>

	<!-- Footer -->
	<footer class="border-t border-gray-800 mt-10">
		<div class="max-w-7xl mx-auto px-4 py-8">
			<p class="text-gray-500 text-sm text-center">
				Images courtesy of <a href="https://webbtelescope.org" target="_blank" rel="noopener noreferrer" class="text-purple-400 hover:text-purple-300">NASA/ESA/CSA/STScI</a>.
				Hubble and Webb are international partnerships between NASA, ESA, and CSA.
			</p>
		</div>
	</footer>
</div>

<Lightbox spaceImage={selectedImage} onClose={closeLightbox} />
