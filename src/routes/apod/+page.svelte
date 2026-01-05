<script lang="ts">
	import type { SpaceImage } from '$lib/types/mars';
	import Lightbox from '$lib/components/Lightbox.svelte';

	let { data } = $props();

	let todayApod: SpaceImage | null = $state(data.todayApod);
	let recentApod: SpaceImage[] = $state(data.recentApod || []);
	let selectedImage: SpaceImage | null = $state(null);

	// Pagination state
	let loading = $state(false);
	let hasMore = $state(true);
	let lastLoadedDate = $derived(recentApod.length > 0 ? recentApod[recentApod.length - 1].date : null);

	// Search state
	let searchKeyword = $state('');
	let startDate = $state('');
	let endDate = $state('');
	let debounceTimer: ReturnType<typeof setTimeout>;

	// Filtered images based on search
	let filteredImages = $derived.by(() => {
		if (!searchKeyword) return recentApod.slice(1);
		const searchLower = searchKeyword.toLowerCase();
		return recentApod.slice(1).filter(
			(img) =>
				img.title.toLowerCase().includes(searchLower) ||
				(img.description && img.description.toLowerCase().includes(searchLower))
		);
	});

	function handleImageClick(image: SpaceImage) {
		selectedImage = image;
	}

	function closeLightbox() {
		selectedImage = null;
	}

	function handleSearchInput(value: string) {
		searchKeyword = value;
	}

	async function searchByDate() {
		if (!startDate && !endDate) return;

		loading = true;
		try {
			const params = new URLSearchParams();
			if (endDate) params.set('end_date', endDate);
			if (startDate && endDate) {
				const start = new Date(startDate);
				const end = new Date(endDate);
				const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
				params.set('count', String(Math.min(daysDiff + 1, 30)));
			} else {
				params.set('count', '12');
			}

			const response = await fetch(`/api/apod?${params}`);
			const result = await response.json();

			recentApod = [recentApod[0], ...result.images];
			hasMore = result.hasMore;
		} catch (err) {
			console.error('Failed to search APOD:', err);
		} finally {
			loading = false;
		}
	}

	async function loadMore() {
		if (loading || !hasMore || !lastLoadedDate) return;

		loading = true;
		try {
			const endDateObj = new Date(lastLoadedDate);
			endDateObj.setDate(endDateObj.getDate() - 1);
			const endDateStr = endDateObj.toISOString().split('T')[0];

			const response = await fetch(`/api/apod?end_date=${endDateStr}&count=6`);
			const result = await response.json();

			if (result.images.length > 0) {
				recentApod = [...recentApod, ...result.images];
			}
			hasMore = result.hasMore && result.images.length > 0;
		} catch (err) {
			console.error('Failed to load more APOD:', err);
		} finally {
			loading = false;
		}
	}

	function clearSearch() {
		searchKeyword = '';
		startDate = '';
		endDate = '';
	}
</script>

<svelte:head>
	<title>APOD - Cosmic Mirror</title>
	<meta name="description" content="Explore NASA's Astronomy Picture of the Day archive. A different image of our universe each day." />
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
					<span class="text-xs tracking-[0.2em] text-apod uppercase">APOD</span>
					<div class="h-4 w-px bg-white/10"></div>
					<span class="text-xs tracking-wider text-white/50 uppercase">Astronomy Picture of the Day</span>
				</div>
				<div class="w-20"></div>
			</div>
		</div>
	</header>

	<main class="relative z-10 max-w-7xl mx-auto px-8 py-8 space-y-12">
		<!-- Today's APOD -->
		{#if todayApod}
			<section class="space-y-4">
				<div class="flex items-center gap-4">
					<span class="text-[10px] tracking-[0.3em] text-apod uppercase">Today's Image</span>
					<div class="h-px flex-1 bg-white/5"></div>
					<span class="text-[10px] tracking-wider text-white/50">{todayApod.date}</span>
				</div>

				<button
					type="button"
					class="relative w-full overflow-hidden bg-white/[0.02] border border-apod/20 hover:border-apod/40 cursor-pointer group text-left transition-all duration-300"
					onclick={() => handleImageClick(todayApod!)}
				>
					<!-- Corner accents -->
					<div class="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-apod/50"></div>
					<div class="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-apod/50"></div>
					<div class="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-apod/50"></div>
					<div class="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-apod/50"></div>

					<div class="aspect-video md:aspect-[21/9] relative">
						<img
							src={todayApod.img_src}
							alt={todayApod.title}
							class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
						<div class="absolute bottom-0 left-0 right-0 p-8">
							<div class="space-y-3">
								<h3 class="text-white text-2xl md:text-3xl font-light tracking-wide">{todayApod.title}</h3>
								<p class="text-white/60 text-sm leading-relaxed line-clamp-2 max-w-3xl">{todayApod.description}</p>
								{#if todayApod.credits}
									<p class="text-white/50 text-xs tracking-wider uppercase">Credit: {todayApod.credits}</p>
								{/if}
							</div>
						</div>

						<!-- View indicator -->
						<div class="absolute top-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
							<span class="text-[10px] tracking-wider text-white/70 uppercase">View Full</span>
						</div>
					</div>
				</button>
			</section>
		{/if}

		<!-- Search/Filter Section -->
		<section class="space-y-4">
			<div class="flex items-center gap-4">
				<span class="text-[10px] tracking-[0.3em] text-white/50 uppercase">Search Archive</span>
				<div class="h-px flex-1 bg-white/5"></div>
			</div>

			<div class="flex flex-wrap gap-4 items-end">
				<!-- Keyword Search -->
				<div class="flex-1 min-w-[200px]">
					<label class="block text-[10px] tracking-wider text-white/40 uppercase mb-2">Keyword</label>
					<input
						type="text"
						value={searchKeyword}
						oninput={(e) => handleSearchInput(e.currentTarget.value)}
						placeholder="Search titles & descriptions..."
						class="w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 text-white/90 text-sm placeholder-white/30 focus:border-apod/50 focus:outline-none transition-colors"
					/>
				</div>

				<!-- Date Range -->
				<div class="flex gap-3 items-end">
					<div>
						<label class="block text-[10px] tracking-wider text-white/40 uppercase mb-2">From</label>
						<input
							type="date"
							bind:value={startDate}
							min="1995-06-16"
							max={new Date().toISOString().split('T')[0]}
							class="px-3 py-2.5 bg-white/[0.02] border border-white/10 text-white/90 text-sm focus:border-apod/50 focus:outline-none transition-colors"
						/>
					</div>
					<div>
						<label class="block text-[10px] tracking-wider text-white/40 uppercase mb-2">To</label>
						<input
							type="date"
							bind:value={endDate}
							min="1995-06-16"
							max={new Date().toISOString().split('T')[0]}
							class="px-3 py-2.5 bg-white/[0.02] border border-white/10 text-white/90 text-sm focus:border-apod/50 focus:outline-none transition-colors"
						/>
					</div>
					<button
						type="button"
						onclick={searchByDate}
						disabled={loading || (!startDate && !endDate)}
						class="px-4 py-2.5 bg-apod/20 border border-apod/30 text-apod text-xs tracking-wider uppercase hover:bg-apod/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{loading ? 'Loading...' : 'Search'}
					</button>
					{#if searchKeyword || startDate || endDate}
						<button
							type="button"
							onclick={clearSearch}
							class="px-4 py-2.5 bg-white/[0.02] border border-white/10 text-white/50 text-xs tracking-wider uppercase hover:text-white/80 hover:border-white/20 transition-colors"
						>
							Clear
						</button>
					{/if}
				</div>
			</div>
		</section>

		<!-- Recent Archive -->
		{#if filteredImages.length > 0}
			<section class="space-y-6">
				<div class="flex items-center gap-4">
					<span class="text-[10px] tracking-[0.3em] text-white/50 uppercase">Archive</span>
					<div class="h-px flex-1 bg-white/5"></div>
					<span class="text-[10px] tracking-wider text-white/50">{filteredImages.length} images</span>
				</div>

				<div class="grid grid-cols-2 md:grid-cols-3 gap-3">
					{#each filteredImages as image (image.id)}
						<button
							type="button"
							class="group relative aspect-square overflow-hidden bg-white/[0.02] border border-white/5 hover:border-white/20 cursor-pointer text-left transition-all duration-300"
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
									<p class="text-white/60 text-[10px] tracking-wider">{image.date}</p>
									<p class="text-white/90 text-xs font-medium line-clamp-2">{image.title}</p>
								</div>
							</div>

							<!-- Corner accent on hover -->
							<div class="absolute top-0 left-0 w-3 h-3 border-t border-l border-apod/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
							<div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-apod/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
						</button>
					{/each}
				</div>

				<!-- Load More Button -->
				{#if hasMore && !searchKeyword}
					<div class="flex justify-center pt-4">
						<button
							type="button"
							onclick={loadMore}
							disabled={loading}
							class="px-6 py-2.5 bg-white/[0.02] border border-white/10 hover:border-white/20 text-xs tracking-wider uppercase text-white/70 hover:text-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							{loading ? 'Loading...' : 'Load More'}
						</button>
					</div>
				{/if}
			</section>
		{:else if searchKeyword}
			<section class="py-12 text-center">
				<p class="text-white/40 text-sm">No images found matching "{searchKeyword}"</p>
			</section>
		{/if}
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5 mt-12">
		<div class="max-w-7xl mx-auto px-8 py-6">
			<p class="text-xs tracking-wider text-white/50 text-center">
				Data source: <a href="https://apod.nasa.gov" target="_blank" rel="noopener noreferrer" class="text-apod/70 hover:text-apod transition-colors">NASA APOD</a>
			</p>
		</div>
	</footer>
</div>

<Lightbox spaceImage={selectedImage} onClose={closeLightbox} />
