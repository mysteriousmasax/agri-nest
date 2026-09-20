/* AGRI-NEST Map Helper
 * Provides lightweight Leaflet map previews for pages that only need a small embedded map.
 */

window.MapHelper = (function () {
  const initialized = {};

  function ensureLeaflet(callback) {
    if (typeof L === 'undefined') {
      setTimeout(() => ensureLeaflet(callback), 150);
      return;
    }
    function ensureLeaflet(callback) {
      if (typeof L === 'undefined') {
        setTimeout(() => ensureLeaflet(callback), 150);
        return;
      }
      callback();
    }

    ensureLeaflet(() => {
      if (!container) return;
      if (!container || container.dataset.mapInitialized === 'true') return;
      container.dataset.mapInitialized = 'true';
      const defaultZoom = options.zoom || 6;
      const map = L.map(containerId, {
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        attributionControl: false,
      }).setView(defaultCenter, defaultZoom);

      const satellite = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 19 }
      );
      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
      satellite.addTo(map);

      const markers = options.markers || [];
      markers.forEach((marker) => {
        if (!marker.coords) return;
        const popup = marker.popup || '';
        L.circleMarker(marker.coords, {
          radius: marker.radius || 6,
          color: marker.color || '#e9c46a',
          fillColor: marker.fillColor || '#e9c46a',
          fillOpacity: 0.9,
          weight: 2,
        })
          .bindPopup(popup)
          .addTo(map);
      });

      if (options.bounds) {
        map.fitBounds(options.bounds, { padding: [20, 20] });
      }

      if (options.onClick) {
        container.style.cursor = 'pointer';
        map.on('click', () => options.onClick());
      }

      setTimeout(() => map.invalidateSize(), 100);
      container.dataset.mapInitialized = 'true';
    });
  }

  return {
    initMiniMap,
  };
})();
