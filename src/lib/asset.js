// In the single-file build, images are embedded as data URIs in window.__ASSETS (see scripts/singlefile.py)
const EMBEDDED = typeof window !== 'undefined' ? window.__ASSETS : null
export const asset = (path) => (EMBEDDED && EMBEDDED[path]) || path
