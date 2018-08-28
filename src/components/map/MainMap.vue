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
				// geoCoords: [-38.9072, 77.0369],
      }
    },
    props: ['finalWeatherData'],
    watch: {
			finalWeatherData: function (val) {
        this.map.setView([val.geo.lat, val.geo.lng], 13)
      }
    },
    computed: {

    },
    created: function () {
			console.log('finalWeatherData', this.finalWeatherData)
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

			// this.tileLayer.addTo(this.map);

			// setView([38.63, -90.23], 12)
    },
    methods: {

    }
	}

</script>

<style scoped>
  #mainMap {
    height: 500px;
    z-index: 1;
  }
</style>