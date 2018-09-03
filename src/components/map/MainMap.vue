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
    props: ['finalWeatherData', 'alertDataLand', 'alertDataMarine'],
    watch: {
			finalWeatherData: function (val) {
        this.map.setView([val.geo.lat, val.geo.lng], 13)
      },
      alertDataLand: function (val) {
				console.log('alertDataLand updated!', val)
				this.alertsLayerLand.addData(val);
      },
      alertDataMarine: function (val) {
        console.log('alertDataMarine updated!', val)
        this.alertsLayerMarine.addData(val);
      },
    },
    computed: {

    },
    created: function () {
      // console.log('alertDataLand', this.alertDataLand);
      // console.log('alertDataMarine', this.alertDataMarine)
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


      this.buildAlertsLayers();

    },
    methods: {
      buildAlertsLayers: function () {
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
          attribution: this.alertDataLand.title + ': ' + moment(this.alertDataLand.updated).format('LT')
				}).addTo(this.map);

				// Marine layer holder
        this.alertsLayerMarine = L.geoJSON(null, {
          onEachFeature: addFeature,
          style: addStyle,
          attribution: this.alertDataLand.title + ': ' + moment(this.alertDataLand.updated).format('LT')
        });

				this.mainControl.addOverlay(this.alertsLayerLand, 'Land Alerts');
        this.mainControl.addOverlay(this.alertsLayerMarine, 'Marine Alerts');

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
