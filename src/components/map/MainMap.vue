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
    props: '',
    created: function () {

    },
    mounted: function () {
			this.map = L.map('mainMap').setView([38.63, -90.23], 12);
			this.tileLayer = L.tileLayer(
				'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png',
				{
					maxZoom: 18,
				}
			);
			this.tileLayer.addTo(this.map);
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