(async () => {
  await new Promise(r => setTimeout(r, 2500));
  const nav = performance.getEntriesByType('navigation')[0];
  const res = performance.getEntriesByType('resource');
  const bytes = res.reduce((a, r) => a + (r.transferSize || 0), 0);
  const result = {
    host: location.host,
    ttfb_ms: Math.round(nav.responseStart),
    load_ms: Math.round(nav.loadEventEnd),
    requests: res.length,
    transferred_mb: +(bytes / 1e6).toFixed(1),
    js_files: res.filter(r => /\.js/.test(r.name)).length,
    css_files: res.filter(r => /\.css/.test(r.name)).length,
    images: res.filter(r => /\.(png|jpe?g|webp|avif|gif|svg)/.test(r.name)).length,
    wordpress: !!document.querySelector('[href*=wp-content]'),
    generator: document.querySelector('meta[name=generator]')?.content || null,
    gtm: [...new Set([...document.documentElement.innerHTML.matchAll(/GTM-[A-Z0-9]+/g)].map(m => m[0]))],
    plugins: [...new Set([...document.documentElement.innerHTML.matchAll(/wp-content\/plugins\/([a-z0-9_-]+)/gi)].map(m => m[1]))]
  };
  console.table(result);
  return result;
})();
