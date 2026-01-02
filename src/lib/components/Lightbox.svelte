<script lang="ts">
	import type { Photo, SpaceImage } from '$lib/types/mars';
	import { formatEarthDate, formatSol } from '$lib/api/nasa';

	interface Props {
		photo?: Photo | null;
		spaceImage?: SpaceImage | null;
		onClose: () => void;
	}

	let { photo = null, spaceImage = null, onClose }: Props = $props();

	// Determine which type of content we're showing
	let isPhoto = $derived(photo !== null);
	let isSpaceImage = $derived(spaceImage !== null);
	let hasContent = $derived(isPhoto || isSpaceImage);

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			onClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if hasContent}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Enter' && handleBackdropClick(e as unknown as MouseEvent)}
		role="dialog"
		aria-modal="true"
		aria-label="Image lightbox"
		tabindex="-1"
	>
		<button
			type="button"
			class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
			onclick={onClose}
			aria-label="Close lightbox"
		>
			<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		<div class="max-w-7xl max-h-full flex flex-col lg:flex-row gap-6 overflow-auto">
			<div class="flex-1 flex items-center justify-center">
				{#if isPhoto && photo}
					<img
						src={photo.img_src}
						alt="Mars surface from {photo.camera.full_name}"
						class="max-w-full max-h-[80vh] object-contain rounded-lg"
					/>
				{:else if isSpaceImage && spaceImage}
					<img
						src={spaceImage.img_src}
						alt={spaceImage.title}
						class="max-w-full max-h-[80vh] object-contain rounded-lg"
					/>
				{/if}
			</div>

			<div class="lg:w-80 bg-gray-900/80 rounded-lg p-6 space-y-4 max-h-[80vh] overflow-y-auto">
				{#if isPhoto && photo}
					<h2 class="text-xl font-semibold text-white">{photo.camera.full_name}</h2>

					<div class="space-y-3">
						<div>
							<p class="text-gray-400 text-sm">Rover</p>
							<p class="text-white">{photo.rover.name}</p>
						</div>

						<div>
							<p class="text-gray-400 text-sm">Sol (Mars Day)</p>
							<p class="text-white">{formatSol(photo.sol)}</p>
						</div>

						<div>
							<p class="text-gray-400 text-sm">Earth Date</p>
							<p class="text-white">{formatEarthDate(photo.earth_date)}</p>
						</div>

						<div>
							<p class="text-gray-400 text-sm">Camera</p>
							<p class="text-white">{photo.camera.name}</p>
						</div>
					</div>

					<div class="pt-4 border-t border-gray-700">
						<a
							href={photo.img_src}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
						>
							<span>Open full resolution</span>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
							</svg>
						</a>
					</div>
				{:else if isSpaceImage && spaceImage}
					<h2 class="text-xl font-semibold text-white">{spaceImage.title}</h2>

					<div class="space-y-3">
						{#if spaceImage.sourceDetails}
							<div>
								<p class="text-gray-400 text-sm">Source</p>
								<p class="text-white">{spaceImage.sourceDetails}</p>
							</div>
						{/if}

						{#if spaceImage.date}
							<div>
								<p class="text-gray-400 text-sm">Date</p>
								<p class="text-white">{spaceImage.date}</p>
							</div>
						{/if}

						{#if spaceImage.credits}
							<div>
								<p class="text-gray-400 text-sm">Credits</p>
								<p class="text-white">{spaceImage.credits}</p>
							</div>
						{/if}

						{#if spaceImage.description}
							<div>
								<p class="text-gray-400 text-sm">Description</p>
								<p class="text-white text-sm leading-relaxed">{spaceImage.description}</p>
							</div>
						{/if}
					</div>

					<div class="pt-4 border-t border-gray-700">
						<a
							href={spaceImage.img_src}
							target="_blank"
							rel="noopener noreferrer"
							class="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-colors"
						>
							<span>Open full resolution</span>
							<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
							</svg>
						</a>
					</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
