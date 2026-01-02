import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.9iheBke6.js","_app/immutable/chunks/DziQLqqf.js","_app/immutable/chunks/CUvoXlMx.js","_app/immutable/chunks/BcHQezlt.js","_app/immutable/chunks/D8CdmuON.js","_app/immutable/chunks/DejYQHkF.js","_app/immutable/chunks/Bye7VelS.js","_app/immutable/chunks/Bue3ZnWR.js","_app/immutable/chunks/BxqdDpV2.js"];
export const stylesheets = ["_app/immutable/assets/2.3It9fdUQ.css"];
export const fonts = [];
