<script lang="ts">
	import type { Photo } from '$lib/types/mars';
	import { formatEarthDate, formatSol } from '$lib/api/nasa';

	interface Props {
		photos: Photo[];
		onPhotoClick?: (photo: Photo) => void;
		accentColor?: string;
	}

	let { photos, onPhotoClick, accentColor = 'red' }: Props = $props();

	// Track which images should start loading (sequential loading for MER)
	let loadedCount = $state(0);
	let previousLength = $state(0);

	// Check if this is a MER image (proxied through our API)
	function isMERImage(src: string): boolean {
		return src.includes('/api/mer-image');
	}

	// For MER images, only load if it's within the loaded batch
	function shouldLoad(index: number, src: string): boolean {
		if (!isMERImage(src)) return true; // Non-MER images load normally
		return index < loadedCount + 3; // Load 3 at a time
	}

	// When an image loads, increment counter to trigger next batch
	function handleImageLoad() {
		loadedCount++;
	}

	// Retry failed images
	function handleImageError(e: Event) {
		const img = e.target as HTMLImageElement;
		const retries = parseInt(img.dataset.retries || '0', 10);
		if (retries < 2) {
			img.dataset.retries = (retries + 1).toString();
			const separator = img.src.includes('?') ? '&' : '?';
			img.src = img.src.split('&_retry=')[0] + `${separator}_retry=${retries + 1}`;
		} else {
			// Give up and move on
			loadedCount++;
		}
	}

	// Reset loaded count only when doing a fresh search (length decreases or goes to different set)
	$effect(() => {
		if (photos) {
			// If photos array shrunk or is a completely new set, reset
			if (photos.length < previousLength || (photos.length > 0 && previousLength === 0)) {
				loadedCount = 0;
			}
			previousLength = photos.length;
		}
	});

	// Dynamic classes based on accent color
	const hoverBorderClass = $derived({
		rose: 'hover:border-rose-500/30',
		red: 'hover:border-red-500/30',
		orange: 'hover:border-orange-500/30',
		amber: 'hover:border-amber-500/30'
	}[accentColor] || 'hover:border-red-500/30');

	const cornerClass = $derived({
		rose: 'border-rose-500/50',
		red: 'border-red-500/50',
		orange: 'border-orange-500/50',
		amber: 'border-amber-500/50'
	}[accentColor] || 'border-red-500/50');

	const spinnerClass = $derived({
		rose: 'border-t-rose-500/50',
		red: 'border-t-red-500/50',
		orange: 'border-t-orange-500/50',
		amber: 'border-t-amber-500/50'
	}[accentColor] || 'border-t-red-500/50');
</script>

{#if photos.length === 0}
	<div class="flex flex-col items-center justify-center py-20 text-white/30">
		<svg class="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
		</svg>
		<p class="text-xs tracking-wider uppercase">Select a rover and search</p>
	</div>
{:else}
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
		{#each photos as photo, index (photo.id)}
			<button
				type="button"
				class="group relative aspect-square overflow-hidden bg-white/[0.02] border border-white/5 {hoverBorderClass} cursor-pointer focus:outline-none transition-all duration-300"
				onclick={() => onPhotoClick?.(photo)}
			>
				{#if shouldLoad(index, photo.img_src)}
					<img
						src={photo.img_src}
						alt="Mars surface from {photo.camera.full_name}"
						class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
						loading="lazy"
						onerror={handleImageError}
						onload={handleImageLoad}
					/>
				{:else}
					<div class="w-full h-full flex items-center justify-center">
						<div class="w-6 h-6 border border-white/20 {spinnerClass} rounded-full animate-spin"></div>
					</div>
				{/if}
				<div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
					<div class="absolute bottom-0 left-0 right-0 p-3 space-y-1">
						<p class="text-white/90 text-xs font-medium truncate">{photo.camera.full_name}</p>
						<p class="text-white/50 text-[10px] tracking-wider">{formatSol(photo.sol)} · {formatEarthDate(photo.earth_date)}</p>
					</div>
				</div>

				<!-- Corner accent on hover -->
				<div class="absolute top-0 left-0 w-3 h-3 border-t border-l {cornerClass} opacity-0 group-hover:opacity-100 transition-opacity"></div>
				<div class="absolute bottom-0 right-0 w-3 h-3 border-b border-r {cornerClass} opacity-0 group-hover:opacity-100 transition-opacity"></div>
			</button>
		{/each}
	</div>
{/if}
