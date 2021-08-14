import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\t<head>\n\t\t<meta charset=\"utf-8\" />\n\t\t<link rel=\"icon\" href=\"/favicon.png\" />\n\t\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t\t" + head + "\n\t</head>\n\t<body>\n\t\t<div id=\"svelte\">" + body + "</div>\n\t</body>\n</html>\n";

let options = null;

const default_settings = { paths: {"base":"","assets":"/."} };

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings = default_settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: "/./_app/start-415bfa48.js",
			css: ["/./_app/assets/start-8077b9bf.css"],
			js: ["/./_app/start-415bfa48.js","/./_app/chunks/vendor-517bfb6a.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => "/./_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: /** @param {Error & {frame?: string}} error */ (error) => {
			if (error.frame) {
				console.error(error.frame);
			}
			console.error(error.stack);
			error.stack = options.get_stack(error);
		},
		hooks: get_hooks(user_hooks),
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		prerender: true,
		read: settings.read,
		root,
		service_worker: null,
		router: true,
		ssr: true,
		target: "#svelte",
		template,
		trailing_slash: "never"
	};
}

const d = decodeURIComponent;
const empty = () => ({});

const manifest = {
	assets: [{"file":"favicon.png","size":1571,"type":"image/png"}],
	layout: "src/routes/__layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/pokemon\/([^/]+?)\/?$/,
						params: (m) => ({ id: d(m[1])}),
						a: ["src/routes/__layout.svelte", "src/routes/pokemon/[id].svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/about\/?$/,
						params: empty,
						a: ["src/routes/__layout.svelte", "src/routes/about.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'endpoint',
						pattern: /^\/api\/pokemon\/?$/,
						params: empty,
						load: () => import("..\\..\\src\\routes\\api\\pokemon\\index.js")
					},
		{
						type: 'endpoint',
						pattern: /^\/api\/pokemon\/([^/]+?)\/?$/,
						params: (m) => ({ id: d(m[1])}),
						load: () => import("..\\..\\src\\routes\\api\\pokemon\\[id].js")
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, resolve }) => resolve(request)),
	serverFetch: hooks.serverFetch || fetch
});

const module_lookup = {
	"src/routes/__layout.svelte": () => import("..\\..\\src\\routes\\__layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components\\error.svelte"),"src/routes/index.svelte": () => import("..\\..\\src\\routes\\index.svelte"),"src/routes/pokemon/[id].svelte": () => import("..\\..\\src\\routes\\pokemon\\[id].svelte"),"src/routes/about.svelte": () => import("..\\..\\src\\routes\\about.svelte")
};

const metadata_lookup = {"src/routes/__layout.svelte":{"entry":"/./_app/pages/__layout.svelte-9a88c352.js","css":["/./_app/assets/pages/__layout.svelte-f562ecec.css"],"js":["/./_app/pages/__layout.svelte-9a88c352.js","/./_app/chunks/vendor-517bfb6a.js"],"styles":[]},".svelte-kit/build/components/error.svelte":{"entry":"/./_app/error.svelte-6e55aa1d.js","css":[],"js":["/./_app/error.svelte-6e55aa1d.js","/./_app/chunks/vendor-517bfb6a.js"],"styles":[]},"src/routes/index.svelte":{"entry":"/./_app/pages/index.svelte-d8b90b68.js","css":[],"js":["/./_app/pages/index.svelte-d8b90b68.js","/./_app/chunks/vendor-517bfb6a.js"],"styles":[]},"src/routes/pokemon/[id].svelte":{"entry":"/./_app/pages/pokemon/[id].svelte-01506cfe.js","css":[],"js":["/./_app/pages/pokemon/[id].svelte-01506cfe.js","/./_app/chunks/vendor-517bfb6a.js"],"styles":[]},"src/routes/about.svelte":{"entry":"/./_app/pages/about.svelte-96de3b61.js","css":[],"js":["/./_app/pages/about.svelte-96de3b61.js","/./_app/chunks/vendor-517bfb6a.js"],"styles":[]}};

async function load_component(file) {
	return {
		module: await module_lookup[file](),
		...metadata_lookup[file]
	};
}

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}