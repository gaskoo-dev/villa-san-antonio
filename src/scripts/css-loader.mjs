export async function resolve(specifier, context, nextResolve) {
  if (specifier.includes('.css') || specifier.includes('.scss')) {
    const resolved = await nextResolve(specifier, context).catch(() => ({
      url: specifier.startsWith('file:') ? specifier : new URL(specifier, context.parentURL).href,
    }))
    return {
      format: 'module',
      shortCircuit: true,
      url: resolved.url,
    }
  }
  return nextResolve(specifier, context)
}

export async function load(url, context, nextLoad) {
  if (url.includes('.css') || url.includes('.scss')) {
    return {
      format: 'module',
      shortCircuit: true,
      source: 'export default {}',
    }
  }
  return nextLoad(url, context)
}
