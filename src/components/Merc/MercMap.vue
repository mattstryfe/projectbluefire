<template>
  <v-sheet
    style="height: calc(100vh - 125px)"
  >

    <l-map
      ref="mercMap"
      :zoom="zoom"
      :center="thorncroft"
      :options:="mapOptions"
    >
      <l-icon-default />

      <l-tile-layer
        :url="url"
        :attribution="attribution"
      />

    </l-map>

  </v-sheet>
</template>

<script>
import L, { Icon } from 'leaflet'
import { LMap, LTileLayer, LIconDefault } from 'vue2-leaflet';

// Clustering
import { markerClusterGroup } from 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

// Fix for webpack being terrible as usual
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  name: "MercMap",
  props: {},
  components: { LMap, LTileLayer, LIconDefault },
  data () {
    return {
      appointmentsLayer: L.markerClusterGroup(),
      thorncroft: L.latLng( 38.986346499999996, -77.48165809999999),
      // icon: L.icon({
      //   iconUrl: require('@/assets/images/s2000-icon.png'),
      //   iconSize: [21, 21],
      //   iconAnchor: [10, 10],
      //   popupAnchor: [4, -25],
      // }),
      zoom: 13,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'Project Bluefire',
      currentZoom: 11.5,
      mapOptions: {
        zoomSnap: 0.5
      },
    }
  },
  created () {
  },
  destroyed () {},
  mounted () {},
  computed: {
    appointments() {
      // console.log('appointments', this.$store.state.appointments)
      return this.$store.state.appointments
    },
    tooltipOffset() {
      return L.point(0, -10)
    },
  },
  watch: {
    appointments(newAppts, oldAppts) {
      if (newAppts.length === 0)
        return

      this.loadAllAppointmentsToMap(newAppts)
    }
  },
  methods: {
    loadAllAppointmentsToMap(appointments) {
      // clear markers layers before re-adding everything
      this.appointmentsLayer.clearLayers()

      function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.authenticated_user) {
          layer.bindPopup(feature.properties.authenticated_user);
        }
      }
      function pointToCircle(feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions)
      }

      const mercMap = this.$refs.mercMap.mapObject

      // const geojsonMarkerOptions = {
      //   radius: 8,
      //   fillColor: "rgba(0, 225, 0, .8)",
      //   color: "#000",
      //   weight: 1,
      //   opacity: 1,
      //   fillOpacity: 0.8
      // };



      // add layer(s) with geoJSON appointments to layer
      this.appointmentsLayer.addLayer(L.geoJSON(appointments, {
        onEachFeature: onEachFeature
      }))

      mercMap.addLayer(this.appointmentsLayer)

      // const circle = L.circle([51.508, -0.11], {
      //   color: 'red',
      //   fillColor: '#f03',
      //   fillOpacity: 0.5,
      //   radius: 500
      // })

      // add data
      // geoJSON layers accept arrays. No need to loop over results
      // appointmentLayer.addData(appointments)
    }
  }
}
</script>

<style scoped>
</style>
