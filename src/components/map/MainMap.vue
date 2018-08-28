<template>
  <div>
    <v-card>
      <div id="mainMap"></div>
    </v-card>
  </div>
</template>

<script>
	import L from 'leaflet';

	export default {
		name: 'MainMap',
    data () {
			return {

      }
    },
    props: ['finalWeatherData', 'weatherAlertData'],
    watch: {
			finalWeatherData: function (val) {
        this.map.setView([val.geo.lat, val.geo.lng], 13)
      },
      weatherAlertData: function (val) {
				console.log('weatherAlertData updated!', val)
				this.alertsLayer.addData(val);
      }
    },
    computed: {

    },
    created: function () {
			console.log('finalWeatherData', this.finalWeatherData);
      console.log('weatherAlertData', this.weatherAlertData);
    },
    mounted: function () {
      let tileUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png';
			let baseMap = L.tileLayer(tileUrl, {
					minZoom: 2,
					maxZoom: 18,
      });
			this.map = L.map('mainMap', {
				center: [39.8283, -98.5795],
        // center: this.newGeos,
        zoom: 4,
        layers: [baseMap]
      });

			this.baseLayerGroup = {
				'Base Map': baseMap
			};

			this.mainControl = L.control.layers(this.baseLayerGroup, null, {
				position: 'topright',
        collapsed: false
      }).addTo(this.map)


      this.buildAlertsLayer();

    },
    methods: {
      buildAlertsLayer: function () {
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

				this.alertsLayer = L.geoJSON(null, {
					onEachFeature: addFeature,
					style: addStyle
				});

				this.mainControl.addOverlay(this.alertsLayer, 'Alerts');
      }
    }
	}

</script>

<style scoped>
  #mainMap {
    height: 500px;
    z-index: 1;
  }
</style>