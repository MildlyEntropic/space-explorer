import * as server from '../entries/pages/telescopes/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/telescopes/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/telescopes/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.B1bq4IaC.js","_app/immutable/chunks/DziQLqqf.js","_app/immutable/chunks/CUvoXlMx.js","_app/immutable/chunks/BcHQezlt.js","_app/immutable/chunks/D8CdmuON.js","_app/immutable/chunks/DejYQHkF.js","_app/immutable/chunks/Bye7VelS.js","_app/immutable/chunks/Bue3ZnWR.js","_app/immutable/chunks/DObfCoks.js"];
export const stylesheets = [];
export const fonts = [];
