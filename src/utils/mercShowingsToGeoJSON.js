// Pure adapter: Merc showing rows → a GeoJSON FeatureCollection for the Mapbox source. Kept
// store-agnostic (currentUid is INJECTED, not read from a plugin) so it's trivially unit-testable.
// `isMine` (posted by the current agent) drives the mine-vs-marketplace pin color.
export function showingsToGeoJSON(rows, { currentUid = null } = {}) {
  return {
    type: 'FeatureCollection',
    features: rows
      .filter((r) => r.property && Number.isFinite(r.property.lat) && Number.isFinite(r.property.lng))
      .map((r) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [r.property.lng, r.property.lat] },
        properties: { id: r.id, allocation: r.allocation ?? 0, isMine: r.postingAgentId === currentUid }
      }))
  }
}
