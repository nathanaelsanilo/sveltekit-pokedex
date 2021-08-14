const c = [
	() => import("..\\..\\..\\src\\routes\\__layout.svelte"),
	() => import("..\\components\\error.svelte"),
	() => import("..\\..\\..\\src\\routes\\index.svelte"),
	() => import("..\\..\\..\\src\\routes\\pokemon\\[id].svelte"),
	() => import("..\\..\\..\\src\\routes\\about.svelte")
];

const d = decodeURIComponent;

export const routes = [
	// src/routes/index.svelte
	[/^\/$/, [c[0], c[2]], [c[1]]],

	// src/routes/pokemon/[id].svelte
	[/^\/pokemon\/([^/]+?)\/?$/, [c[0], c[3]], [c[1]], (m) => ({ id: d(m[1])})],

	// src/routes/about.svelte
	[/^\/about\/?$/, [c[0], c[4]], [c[1]]],

	// src/routes/api/pokemon/index.js
	[/^\/api\/pokemon\/?$/],

	// src/routes/api/pokemon/[id].js
	[/^\/api\/pokemon\/([^/]+?)\/?$/]
];

export const fallback = [c[0](), c[1]()];