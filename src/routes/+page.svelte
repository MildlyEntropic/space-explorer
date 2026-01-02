<script lang="ts">
	// Portal cards - modular, easy to add more
	const portals = [
		{
			title: 'APOD',
			subtitle: 'Astronomy Picture of the Day',
			description: 'Daily images from across the universe with professional explanations.',
			href: '/apod',
			accent: 'green',
			icon: 'sun'
		},
		{
			title: 'ROVERS',
			subtitle: 'Surface Exploration',
			description: 'Surface photos from Perseverance, Curiosity, Opportunity & Spirit.',
			href: '/rovers',
			accent: 'red',
			icon: 'rover'
		},
		{
			title: 'OBSERVATORIES',
			subtitle: 'Space Telescopes & Satellites',
			description: 'JWST, Hubble, Spitzer, Chandra, and Earth-observing EPIC imagery.',
			href: '/observatories',
			accent: 'violet',
			icon: 'telescope'
		},
		{
			title: 'PROBES',
			subtitle: 'Deep Space Missions',
			description: 'Voyager, Cassini, New Horizons, and Galileo planetary exploration.',
			href: '/probes',
			accent: 'cyan',
			icon: 'probe'
		},
		{
			title: 'EDUCATION',
			subtitle: 'Learn & Explore',
			description: 'Constellations, Galactic Tick, Solar System guide, HR diagrams, and more.',
			href: '/education',
			accent: 'yellow',
			icon: 'education'
		}
	];

	const accentColors: Record<string, { border: string; text: string; glow: string; bg: string }> = {
		green: { border: 'border-emerald-500/40', text: 'text-emerald-400', glow: 'group-hover:shadow-emerald-500/30', bg: 'bg-emerald-500/15' },
		red: { border: 'border-red-500/40', text: 'text-red-400', glow: 'group-hover:shadow-red-500/30', bg: 'bg-red-500/15' },
		violet: { border: 'border-violet-500/40', text: 'text-violet-400', glow: 'group-hover:shadow-violet-500/30', bg: 'bg-violet-500/15' },
		cyan: { border: 'border-cyan-500/40', text: 'text-cyan-400', glow: 'group-hover:shadow-cyan-500/30', bg: 'bg-cyan-500/15' },
		yellow: { border: 'border-amber-500/40', text: 'text-amber-400', glow: 'group-hover:shadow-amber-500/30', bg: 'bg-amber-500/15' }
	};
</script>

<div class="min-h-screen bg-black flex flex-col relative overflow-hidden">
	<!-- Background grid effect -->
	<div class="absolute inset-0 opacity-[0.03]" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>

	<!-- Subtle vignette -->
	<div class="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/50 pointer-events-none"></div>

	<!-- Header -->
	<header class="relative z-10 border-b border-white/5">
		<div class="max-w-7xl mx-auto px-8 py-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-light tracking-[0.3em] text-white/90 uppercase">Cosmic Mirror</h1>
					<p class="text-xs tracking-[0.2em] text-white/50 uppercase mt-1">NASA Imagery Portal</p>
				</div>
				<div class="flex items-center gap-4">
					<div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
					<span class="text-xs tracking-wider text-white/50 uppercase">Online</span>
				</div>
			</div>
		</div>
	</header>

	<!-- Main Portal Grid -->
	<main class="relative z-10 flex-1 flex items-center px-8 py-12">
		<div class="w-full max-w-7xl mx-auto">
			<!-- Section label -->
			<div class="flex items-center gap-4 mb-8">
				<div class="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent"></div>
				<span class="text-xs tracking-[0.3em] text-white/50 uppercase">Select Database</span>
				<div class="h-px flex-1 bg-gradient-to-l from-white/20 to-transparent"></div>
			</div>

			<div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
				{#each portals as portal}
					{@const colors = accentColors[portal.accent]}
					<a
						href={portal.href}
						class="group relative bg-white/[0.02] backdrop-blur-sm border {colors.border} hover:border-white/20 transition-all duration-300 hover:shadow-lg {colors.glow} overflow-hidden"
					>
						<!-- Corner accents -->
						<div class="absolute top-0 left-0 w-4 h-4 border-t border-l {colors.border}"></div>
						<div class="absolute top-0 right-0 w-4 h-4 border-t border-r {colors.border}"></div>
						<div class="absolute bottom-0 left-0 w-4 h-4 border-b border-l {colors.border}"></div>
						<div class="absolute bottom-0 right-0 w-4 h-4 border-b border-r {colors.border}"></div>

						<!-- Content -->
						<div class="p-6 space-y-4">
							<!-- Header row -->
							<div class="flex items-start justify-between">
								<div class="space-y-1">
									<h2 class="text-lg font-medium tracking-wider text-white/90 uppercase">
										{portal.title}
									</h2>
									<p class="text-[10px] tracking-wider {colors.text} uppercase">
										{portal.subtitle}
									</p>
								</div>
								<!-- Icon -->
								<div class="w-10 h-10 {colors.bg} flex items-center justify-center">
									{#if portal.icon === 'sun'}
										<!-- APOD - Sun/star burst -->
										<svg class="w-5 h-5 {colors.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<circle cx="12" cy="12" r="5" stroke-width="1.5"/>
											<path stroke-width="1.5" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
										</svg>
									{:else if portal.icon === 'rover'}
										<!-- Rovers - wheeled vehicle -->
										<svg class="w-5 h-5 {colors.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<rect x="4" y="8" width="16" height="8" rx="2" stroke-width="1.5"/>
											<circle cx="7" cy="16" r="2" stroke-width="1.5"/>
											<circle cx="17" cy="16" r="2" stroke-width="1.5"/>
											<path stroke-width="1.5" d="M12 8V5M10 5h4"/>
										</svg>
									{:else if portal.icon === 'telescope'}
										<!-- Observatories - telescope -->
										<svg class="w-5 h-5 {colors.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-width="1.5" d="M21 6l-9 9M12 15l-3 6M12 15l3 6"/>
											<circle cx="18" cy="6" r="3" stroke-width="1.5"/>
											<path stroke-width="1" d="M6 9l6 6" opacity="0.5"/>
										</svg>
									{:else if portal.icon === 'probe'}
										<!-- Probes - spacecraft with antenna -->
										<svg class="w-5 h-5 {colors.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-width="1.5" d="M12 2v4M8 6h8l-4 14-4-14z"/>
											<circle cx="12" cy="2" r="1" fill="currentColor"/>
											<path stroke-width="1" d="M8 10h8M9 14h6" opacity="0.5"/>
										</svg>
									{:else if portal.icon === 'education'}
										<!-- Education - open book with stars -->
										<svg class="w-5 h-5 {colors.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-width="1.5" d="M12 6.5V19M12 6.5C10.5 5 8 4 5 4v13c3 0 5.5 1 7 2.5M12 6.5C13.5 5 16 4 19 4v13c-3 0-5.5 1-7 2.5"/>
											<circle cx="7" cy="2" r="0.5" fill="currentColor"/>
											<circle cx="17" cy="3" r="0.5" fill="currentColor"/>
											<circle cx="19" cy="1" r="0.5" fill="currentColor"/>
										</svg>
									{:else}
										<svg class="w-5 h-5 {colors.text}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<circle cx="12" cy="12" r="9" stroke-width="1.5"/>
											<path stroke-width="1" d="M12 3a9 9 0 0 0 0 18M3 12h18" opacity="0.5"/>
										</svg>
									{/if}
								</div>
							</div>

							<!-- Divider -->
							<div class="h-px bg-white/5"></div>

							<!-- Description -->
							<p class="text-sm text-white/60 leading-relaxed">
								{portal.description}
							</p>

							<!-- Action row -->
							<div class="flex items-center justify-between pt-2">
								<span class="text-[10px] tracking-wider text-white/40 uppercase">Access</span>
								<div class="flex items-center gap-2 text-white/50 group-hover:text-white/80 transition-colors">
									<span class="text-xs tracking-wider uppercase">Enter</span>
									<svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</div>
						</div>

						<!-- Hover scan line effect -->
						<div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
							<div class="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-scan"></div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</main>

	<!-- Footer -->
	<footer class="relative z-10 border-t border-white/5">
		<div class="max-w-7xl mx-auto px-8 py-6">
			<div class="flex flex-col sm:flex-row items-center justify-between gap-4">
				<p class="text-xs tracking-wider text-white/50">
					Data: <a href="https://nasa.gov" target="_blank" rel="noopener noreferrer" class="text-white/70 hover:text-white/90 transition-colors">NASA</a> · Unofficial project
				</p>
				<a
					href="https://ko-fi.com/avactus"
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 hover:border-white/30 text-white/60 hover:text-white/80 text-xs tracking-wider uppercase transition-all"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.881 8.948c-.773-4.085-4.859-4.593-4.859-4.593H.723c-.604 0-.679.798-.679.798s-.082 7.324-.022 11.822c.164 2.424 2.586 2.672 2.586 2.672s8.267-.023 11.966-.049c2.438-.426 2.683-2.566 2.658-3.734 4.352.24 7.422-2.831 6.649-6.916zm-11.062 3.511c-1.246 1.453-4.011 3.976-4.011 3.976s-.121.119-.31.023c-.076-.057-.108-.09-.108-.09-.443-.441-3.368-3.049-4.034-3.954-.709-.965-1.041-2.7-.091-3.71.951-1.01 3.005-1.086 4.363.407 0 0 1.565-1.782 3.468-.963 1.904.82 1.832 3.011.723 4.311zm6.173.478c-.928.116-1.682.028-1.682.028V7.284h1.77s1.971.551 1.971 2.638c0 1.913-.985 2.667-2.059 3.015z"/></svg>
					Support
				</a>
			</div>
		</div>
	</footer>
</div>

<style>
	@keyframes scan {
		0% { top: 0; }
		100% { top: 100%; }
	}
	.animate-scan {
		animation: scan 2s ease-in-out infinite;
	}
</style>
