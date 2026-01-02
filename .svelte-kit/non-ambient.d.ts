
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/api" | "/api/mer-image" | "/api/mer" | "/api/observatories" | "/api/probes" | "/apod" | "/education" | "/observatories" | "/probes" | "/rovers";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/api": Record<string, never>;
			"/api/mer-image": Record<string, never>;
			"/api/mer": Record<string, never>;
			"/api/observatories": Record<string, never>;
			"/api/probes": Record<string, never>;
			"/apod": Record<string, never>;
			"/education": Record<string, never>;
			"/observatories": Record<string, never>;
			"/probes": Record<string, never>;
			"/rovers": Record<string, never>
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/mer-image" | "/api/mer-image/" | "/api/mer" | "/api/mer/" | "/api/observatories" | "/api/observatories/" | "/api/probes" | "/api/probes/" | "/apod" | "/apod/" | "/education" | "/education/" | "/observatories" | "/observatories/" | "/probes" | "/probes/" | "/rovers" | "/rovers/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/og-image.svg" | "/robots.txt" | "/sitemap.xml" | string & {};
	}
}