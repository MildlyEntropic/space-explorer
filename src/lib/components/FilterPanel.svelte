<script lang="ts">
	import { ROVER_CAMERAS, type RoverName } from '$lib/types/mars';

	interface Props {
		rover: RoverName;
		sol: number | null;
		solMin: number | null;
		solMax: number | null;
		dateStart: string;
		dateEnd: string;
		camera: string;
		search: string;
		maxSol: number;
		onSolChange: (sol: number | null) => void;
		onSolMinChange: (sol: number | null) => void;
		onSolMaxChange: (sol: number | null) => void;
		onDateStartChange: (date: string) => void;
		onDateEndChange: (date: string) => void;
		onCameraChange: (camera: string) => void;
		onSearchChange: (search: string) => void;
		onSearchInput?: (search: string) => void;
		onClearFilters: () => void;
		accentColor?: string;
	}

	let {
		rover,
		sol,
		solMin,
		solMax,
		dateStart,
		dateEnd,
		camera,
		search,
		maxSol,
		onSolChange,
		onSolMinChange,
		onSolMaxChange,
		onDateStartChange,
		onDateEndChange,
		onCameraChange,
		onSearchChange,
		onSearchInput,
		onClearFilters,
		accentColor = 'red'
	}: Props = $props();

	function handleSearchInput(e: Event) {
		const value = (e.target as HTMLInputElement).value;
		onSearchChange(value);
		if (onSearchInput) {
			onSearchInput(value);
		}
	}

	const cameras = $derived(ROVER_CAMERAS[rover] || []);

	// MER rovers (Spirit/Opportunity) don't have searchable metadata
	const isMERRover = $derived(rover === 'spirit' || rover === 'opportunity');

	const SEARCH_EXAMPLES: Record<RoverName, string[]> = {
		perseverance: ['rock', 'wheel', 'horizon', 'drill', 'sample'],
		curiosity: ['rock', 'wheel', 'sand', 'crater', 'mountain'],
		opportunity: [],
		spirit: []
	};

	const searchExamples = $derived(SEARCH_EXAMPLES[rover] || []);

	let solMode: 'single' | 'range' = $state('single');

	function handleSolInput(e: Event, callback: (sol: number | null) => void) {
		const target = e.target as HTMLInputElement;
		const value = target.value;
		if (value === '') {
			callback(null);
		} else {
			const num = parseInt(value, 10);
			if (!isNaN(num) && num >= 0) {
				callback(num);
			}
		}
	}

	function switchSolMode(mode: 'single' | 'range') {
		solMode = mode;
		// Clear the other mode's values
		if (mode === 'single') {
			onSolMinChange(null);
			onSolMaxChange(null);
		} else {
			onSolChange(null);
		}
	}

	const hasActiveFilters = $derived(
		sol !== null ||
		solMin !== null ||
		solMax !== null ||
		dateStart !== '' ||
		dateEnd !== '' ||
		camera !== '' ||
		search !== ''
	);

	// Dynamic focus classes based on accent color
	const focusClass = $derived({
		rose: 'focus:border-rose-500/50',
		red: 'focus:border-red-500/50',
		orange: 'focus:border-orange-500/50',
		amber: 'focus:border-amber-500/50'
	}[accentColor] || 'focus:border-red-500/50');

	const radioBgClass = $derived({
		rose: 'bg-rose-500',
		red: 'bg-red-500',
		orange: 'bg-orange-500',
		amber: 'bg-amber-500'
	}[accentColor] || 'bg-red-500');

	const radioBorderClass = $derived({
		rose: 'border-rose-500/50',
		red: 'border-red-500/50',
		orange: 'border-orange-500/50',
		amber: 'border-amber-500/50'
	}[accentColor] || 'border-red-500/50');

	const textClass = $derived({
		rose: 'text-rose-400/70 hover:text-rose-400',
		red: 'text-red-400/70 hover:text-red-400',
		orange: 'text-orange-400/70 hover:text-orange-400',
		amber: 'text-amber-400/70 hover:text-amber-400'
	}[accentColor] || 'text-red-400/70 hover:text-red-400');
</script>

<div class="bg-white/[0.02] border border-white/5 p-6 space-y-6">
	<!-- Sol Filter -->
	<div class="space-y-3">
		<div class="flex items-center gap-4">
			<span class="text-white/50 text-xs tracking-wider uppercase">Sol (Mars Day)</span>
			<div class="flex items-center gap-3">
				<button
					type="button"
					onclick={() => switchSolMode('single')}
					class="flex items-center gap-1.5 cursor-pointer"
				>
					<span class="w-3 h-3 border {solMode === 'single' ? radioBorderClass : 'border-white/30'} flex items-center justify-center">
						{#if solMode === 'single'}
							<span class="w-1.5 h-1.5 {radioBgClass}"></span>
						{/if}
					</span>
					<span class="text-white/40 text-xs tracking-wider uppercase">Single</span>
				</button>
				<button
					type="button"
					onclick={() => switchSolMode('range')}
					class="flex items-center gap-1.5 cursor-pointer"
				>
					<span class="w-3 h-3 border {solMode === 'range' ? radioBorderClass : 'border-white/30'} flex items-center justify-center">
						{#if solMode === 'range'}
							<span class="w-1.5 h-1.5 {radioBgClass}"></span>
						{/if}
					</span>
					<span class="text-white/40 text-xs tracking-wider uppercase">Range</span>
				</button>
			</div>
			{#if maxSol > 0}
				<span class="text-white/30 text-[10px] tracking-wider">max: {maxSol.toLocaleString()}</span>
			{/if}
		</div>

		{#if solMode === 'single'}
			<input
				type="number"
				min="0"
				max={maxSol}
				value={sol ?? ''}
				oninput={(e) => handleSolInput(e, onSolChange)}
				placeholder="Leave empty for latest"
				class="px-3 py-2 bg-white/[0.02] border border-white/10 text-white text-sm focus:outline-none {focusClass} transition-colors w-full max-w-xs"
			/>
		{:else}
			<div class="flex items-center gap-3">
				<input
					type="number"
					min="0"
					max={maxSol}
					value={solMin ?? ''}
					oninput={(e) => handleSolInput(e, onSolMinChange)}
					placeholder="From"
					class="px-3 py-2 bg-white/[0.02] border border-white/10 text-white text-sm focus:outline-none {focusClass} transition-colors w-28"
				/>
				<span class="text-white/30 text-xs">to</span>
				<input
					type="number"
					min="0"
					max={maxSol}
					value={solMax ?? ''}
					oninput={(e) => handleSolInput(e, onSolMaxChange)}
					placeholder="To"
					class="px-3 py-2 bg-white/[0.02] border border-white/10 text-white text-sm focus:outline-none {focusClass} transition-colors w-28"
				/>
			</div>
		{/if}
	</div>

	<!-- Date Filter -->
	<div class="space-y-3">
		<span class="text-white/50 text-xs tracking-wider uppercase">Earth Date Range</span>
		<div class="flex flex-wrap items-center gap-3">
			<input
				type="date"
				value={dateStart}
				onchange={(e) => onDateStartChange((e.target as HTMLInputElement).value)}
				class="px-3 py-2 bg-white/[0.02] border border-white/10 text-white text-sm focus:outline-none {focusClass} transition-colors"
			/>
			<span class="text-white/30 text-xs">to</span>
			<input
				type="date"
				value={dateEnd}
				onchange={(e) => onDateEndChange((e.target as HTMLInputElement).value)}
				class="px-3 py-2 bg-white/[0.02] border border-white/10 text-white text-sm focus:outline-none {focusClass} transition-colors"
			/>
		</div>
	</div>

	<!-- Camera and Search Row -->
	<div class="flex flex-wrap gap-6">
		<!-- Camera Select -->
		<div class="space-y-3">
			<label for="camera-select" class="text-white/50 text-xs tracking-wider uppercase">Camera</label>
			<select
				id="camera-select"
				value={camera}
				onchange={(e) => onCameraChange((e.target as HTMLSelectElement).value)}
				class="px-3 py-2 bg-white/[0.02] border border-white/10 text-white text-sm focus:outline-none {focusClass} transition-colors min-w-[160px]"
			>
				<option value="">All Cameras</option>
				{#each cameras as cam}
					<option value={cam.abbrev}>{cam.full_name}</option>
				{/each}
			</select>
		</div>

		<!-- Text Search -->
		<div class="flex-1 min-w-[200px] space-y-3">
			<label for="search-input" class="text-white/50 text-xs tracking-wider uppercase">Text Search</label>
			{#if isMERRover}
				<div class="text-white/30 text-xs italic py-2">
					Text search not available for legacy rovers
				</div>
			{:else}
				<input
					id="search-input"
					type="text"
					value={search}
					oninput={handleSearchInput}
					placeholder="Search captions, metadata..."
					class="px-3 py-2 bg-white/[0.02] border border-white/10 text-white text-sm focus:outline-none {focusClass} transition-colors w-full"
				/>
				<div class="flex flex-wrap gap-2 items-center">
					<span class="text-white/30 text-[10px] tracking-wider uppercase">Try:</span>
					{#each searchExamples as example}
						<button
							type="button"
							onclick={() => onSearchChange(example)}
							class="text-[10px] tracking-wider {textClass} transition-colors"
						>
							{example}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>

	<!-- Clear Filters -->
	{#if hasActiveFilters}
		<button
			type="button"
			onclick={onClearFilters}
			class="text-white/40 hover:text-white/70 text-xs tracking-wider uppercase transition-colors"
		>
			[ Clear all filters ]
		</button>
	{/if}
</div>
