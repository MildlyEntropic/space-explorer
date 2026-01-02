export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["og-image.svg","robots.txt","sitemap.xml"]),
	mimeTypes: {".svg":"image/svg+xml",".txt":"text/plain",".xml":"text/xml"},
	_: {
		client: {start:"_app/immutable/entry/start.nzSK8rjK.js",app:"_app/immutable/entry/app.CAJvfBEy.js",imports:["_app/immutable/entry/start.nzSK8rjK.js","_app/immutable/chunks/ndWPmFZT.js","_app/immutable/chunks/CUvoXlMx.js","_app/immutable/chunks/BxqdDpV2.js","_app/immutable/entry/app.CAJvfBEy.js","_app/immutable/chunks/CUvoXlMx.js","_app/immutable/chunks/BcHQezlt.js","_app/immutable/chunks/DziQLqqf.js","_app/immutable/chunks/BxqdDpV2.js","_app/immutable/chunks/D8CdmuON.js","_app/immutable/chunks/DejYQHkF.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js'))
		],
		remotes: {
			
		},
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/api/mer-image",
				pattern: /^\/api\/mer-image\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/mer-image/_server.ts.js'))
			},
			{
				id: "/api/mer",
				pattern: /^\/api\/mer\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/mer/_server.ts.js'))
			},
			{
				id: "/mars",
				pattern: /^\/mars\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/telescopes",
				pattern: /^\/telescopes\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
