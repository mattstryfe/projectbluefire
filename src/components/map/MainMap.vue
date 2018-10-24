<template>
  <div>
    <v-card>
      <div id="mainMap"></div>
    </v-card>
  </div>
</template>

<script>
	import L from 'leaflet';
	import moment from 'moment';

	export default {
		name: 'MainMap',
    data () {
			return {
      }
    },
    props: [
      'userCoords',
      'finalWeatherData',
      'landAlertData',
      'marineAlertData',
      'staticLandAlerts',
      'affectedByAlerts',
      'randomGeoJson'
    ],
    watch: {
		  userCoords: function (val) {
		    const lat = val.coords.latitude
        const lng = val.coords.longitude

        this.map.setView([lat, lng], 5)
        L.marker([lat, lng]).addTo(this.map);
      },
			finalWeatherData: function (val) {
        this.map.setView([val.geo.lat, val.geo.lng], 9)
      },
      landAlertData: function (val) {
		    // uncomment for live data
        // this.alertsLayerLand.addData(val);
				this.alertsLayerLand.addData(this.staticLandAlerts);
      },
      marineAlertData: function (val) {
        this.alertsLayerMarine.addData(val);
      },
      affectedByAlerts: function (val) {
        this.alertsLayerAffected.addData(val.affectedAssets);
      },
      randomGeoJson: function (val) {
		    console.log('val', val)
		    this.testLayer.addData(val)
      }
    },
    computed: {

    },
    created: function () {

    },
    mounted: function () {
      this.buildBaseLayer();
      this.buildAlertsLayers();
    },
    methods: {
      buildBaseLayer: function() {
        let centerPoint = [39.8283, -98.5795]
		    let tileUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png';
        let baseMap = L.tileLayer(tileUrl, {
          minZoom: 2,
          maxZoom: 18,
        });

        this.map = L.map('mainMap', {
          center: centerPoint,
          zoom: 8,
          layers: [baseMap]
        });

        this.baseLayerGroup = {
          'Base Map': baseMap
        };

        this.mainControl = L.control.layers(this.baseLayerGroup, null, {
          position: 'topright',
          collapsed: false
        }).addTo(this.map)
      },
      buildAlertsLayers: function () {
        function addCustomIcon (feature, latlng) {
          L.divIcon()
          let affectByCustomIcon = new L.divIcon({
            html: '<i class="fas fa-bolt fa-3x"></i>',
            iconSize: [138, 138],
            className: 'cust-icon'
          })
          return L.marker(latlng, { icon: affectByCustomIcon })
        }

				function addFeature (feature, layer) {
					// If the feature (entry) contains a headline, add a popup to the map.
					// Note: features which contain [null] in geoCoords are already filtered and dealt with
					if (feature.properties && feature.properties.headline) {
						layer.bindTooltip(feature.properties.headline);
					}
				}

				function addStyle (feature) {
					switch (feature.properties.severity) {
						case 'Severe':
							return {'color': '#d12d36'};
						case 'Moderate':
							return {'color': '#d1762d'};
						case 'Minor':
							return {'color': '#d1c82d'};
					}
				}


        // Land layer holder
        // addTo map on load
				this.alertsLayerLand = L.geoJSON(null, {
					onEachFeature: addFeature,
					style: addStyle,
          attribution: this.landAlertData.title + ': ' + moment(this.landAlertData.updated).format('LT')
				}).addTo(this.map);

				// Marine layer
        this.alertsLayerMarine = L.geoJSON(null, {
          onEachFeature: addFeature,
          style: addStyle,
        }).addTo(this.map);

        // Test layer
        this.testLayer = L.geoJSON(null, {
          onEachFeature: addFeature,
          pointToLayer: addCustomIcon
        }).addTo(this.map)

        // Affected layer
        this.alertsLayerAffected = L.geoJSON(null, {
          onEachFeature: addFeature,
          pointToLayer: addCustomIcon
          // icon: affectByCustomIcon
        }).addTo(this.map)

				this.mainControl.addOverlay(this.alertsLayerLand, 'Land Alerts');
        this.mainControl.addOverlay(this.alertsLayerMarine, 'Marine Alerts');
        this.mainControl.addOverlay(this.alertsLayerAffected, 'Affected');
        this.mainControl.addOverlay(this.testLayer, 'test layer');

      }
    }
	}

</script>

<style scoped>
  #mainMap {
    height: 800px;
    z-index: 1;
  }
</style>
