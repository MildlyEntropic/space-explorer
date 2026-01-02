<script lang="ts">
	import { ROVERS, type RoverName, type RoverInfo } from '$lib/types/mars';

	interface Props {
		selected: RoverName;
		onSelect: (rover: RoverName) => void;
	}

	let { selected, onSelect }: Props = $props();

	// Get the currently selected rover's full info
	const selectedRover = $derived(ROVERS.find(r => r.name === selected) as RoverInfo);

	// Each rover gets a slightly different red shade
	const roverColors: Record<RoverName, { active: string; inactive: string; date: string; accent: string; border: string; text: string; statusBg: string }> = {
		perseverance: {
			active: 'bg-rose-500/20 border-rose-500/50 text-rose-400',
			inactive: 'hover:border-rose-500/30',
			date: 'text-rose-400/60',
			accent: 'text-rose-400',
			border: 'border-rose-500/30',
			text: 'text-rose-400/70',
			statusBg: 'bg-rose-500/20'
		},
		curiosity: {
			active: 'bg-red-500/20 border-red-500/50 text-red-400',
			inactive: 'hover:border-red-500/30',
			date: 'text-red-400/60',
			accent: 'text-red-400',
			border: 'border-red-500/30',
			text: 'text-red-400/70',
			statusBg: 'bg-red-500/20'
		},
		opportunity: {
			active: 'bg-orange-500/20 border-orange-500/50 text-orange-400',
			inactive: 'hover:border-orange-500/30',
			date: 'text-orange-400/60',
			accent: 'text-orange-400',
			border: 'border-orange-500/30',
			text: 'text-orange-400/70',
			statusBg: 'bg-orange-500/20'
		},
		spirit: {
			active: 'bg-amber-500/20 border-amber-500/50 text-amber-400',
			inactive: 'hover:border-amber-500/30',
			date: 'text-amber-400/60',
			accent: 'text-amber-400',
			border: 'border-amber-500/30',
			text: 'text-amber-400/70',
			statusBg: 'bg-amber-500/20'
		}
	};

	const currentColors = $derived(roverColors[selected]);
</script>

<div class="space-y-6">
	<!-- Rover Selection Buttons -->
	<div class="flex flex-wrap gap-2">
		{#each ROVERS as rover}
			{@const colors = roverColors[rover.name]}
			<button
				type="button"
				class="px-4 py-2.5 text-left transition-all duration-200 border
					{selected === rover.name
						? colors.active
						: `bg-white/[0.02] border-white/10 text-white/50 hover:text-white/70 ${colors.inactive}`}
					{!rover.available ? 'opacity-30 cursor-not-allowed' : ''}"
				onclick={() => rover.available && onSelect(rover.name)}
				disabled={!rover.available}
			>
				<div class="flex items-center gap-2">
					<span class="text-sm tracking-wider uppercase">{rover.displayName}</span>
					{#if rover.active}
						<span class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
					{/if}
					{#if !rover.available}
						<span class="text-[10px] tracking-wider opacity-70">(N/A)</span>
					{/if}
				</div>
				<div class="text-[10px] tracking-wider {selected === rover.name ? colors.date : 'text-white/30'}">
					{rover.dateRange}
				</div>
			</button>
		{/each}
	</div>

	<!-- Selected Rover Details Panel -->
	{#if selectedRover}
		<div class="bg-white/[0.02] border {currentColors.border} p-6">
			<!-- Header -->
			<div class="flex items-start justify-between mb-6">
				<div>
					<div class="flex items-center gap-3">
						<h3 class="text-lg font-medium tracking-wider {currentColors.accent} uppercase">{selectedRover.displayName}</h3>
						<span class="px-2 py-0.5 text-[10px] tracking-wider uppercase {currentColors.statusBg} {currentColors.accent}">
							{selectedRover.status}
						</span>
					</div>
					<p class="text-xs tracking-wider text-white/40 mt-1">{selectedRover.mission}</p>
				</div>
				<div class="text-right">
					<p class="text-[10px] tracking-wider text-white/30 uppercase">Landing Site</p>
					<p class="text-sm tracking-wider {currentColors.text}">{selectedRover.landingSite}</p>
				</div>
			</div>

			<!-- Stats Grid -->
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
				<div class="space-y-1">
					<p class="text-[10px] tracking-wider text-white/30 uppercase">Launch</p>
					<p class="text-sm tracking-wider text-white/70">{selectedRover.launchDate}</p>
				</div>
				<div class="space-y-1">
					<p class="text-[10px] tracking-wider text-white/30 uppercase">Landing</p>
					<p class="text-sm tracking-wider text-white/70">{selectedRover.landingDate}</p>
				</div>
				<div class="space-y-1">
					<p class="text-[10px] tracking-wider text-white/30 uppercase">Mass</p>
					<p class="text-sm tracking-wider text-white/70">{selectedRover.mass}</p>
				</div>
				<div class="space-y-1">
					<p class="text-[10px] tracking-wider text-white/30 uppercase">Power</p>
					<p class="text-sm tracking-wider text-white/70">{selectedRover.power}</p>
				</div>
			</div>

			<!-- Tech Specs Row -->
			<div class="flex flex-wrap gap-6 mb-6 pt-4 border-t border-white/5">
				<div class="space-y-1">
					<p class="text-[10px] tracking-wider text-white/30 uppercase">Top Speed</p>
					<p class="text-sm tracking-wider {currentColors.text}">{selectedRover.topSpeed}</p>
				</div>
				{#if selectedRover.distance}
					<div class="space-y-1">
						<p class="text-[10px] tracking-wider text-white/30 uppercase">Distance</p>
						<p class="text-sm tracking-wider {currentColors.text}">{selectedRover.distance}</p>
					</div>
				{/if}
			</div>

			<!-- Highlights -->
			<div class="pt-4 border-t border-white/5">
				<p class="text-[10px] tracking-wider text-white/30 uppercase mb-3">Mission Highlights</p>
				<ul class="space-y-2">
					{#each selectedRover.highlights as highlight}
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
