<template>
  <v-row>
    <v-sheet class="col" width="100%" height="50vh">
      <l-map
        ref="swfMap"
        @ready="initMap()"
        :zoom="zoom"
        :center="userLoc"
        :options:="mapOptions"
      >
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        />

        <!-- User Loc Marker -->
        <l-marker :lat-lng="userLoc">
          <l-tooltip :options="{ permanent: true, interactive: true, direction: 'top', offset: tooltipOffset }">
            You are here!
          </l-tooltip>
        </l-marker>

        <l-marker
          v-for="marker in markers"
          :lat-lng="marker.coords"
          :key="marker.id"
          :icon="icon"
        />

      </l-map>
    </v-sheet>
  </v-row>

</template>

<script>
import L from 'leaflet'
import { latLng } from 'leaflet'
import { LMap, LTileLayer, LMarker, LTooltip } from 'vue2-leaflet';
import { Icon } from 'leaflet';

// Fix for webpack being terrible as usual
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: "SWFMap",
  props: {},
  components: { LMap, LTileLayer, LMarker, LTooltip},
  data () {
    return {
      markers: [
        { id:1, coords: [ 38.986, -77.484]},
        { id:2, coords: [ 38.986, -77.486]},
        { id:3, coords: [ 38.986, -77.488]},
        { id:4, coords: [ 38.988, -77.484]},
        { id:5, coords: [ 38.988, -77.486]},

      ],
      zoom: 13,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: 'Project Bluefire',
      currentZoom: 11.5,
      mapOptions: {
        zoomSnap: 0.5
      },
    }
  },
  created () {},
  destroyed () {},
  mounted () {},
  computed: {
    tooltipOffset() {
      return L.point(0, -10)
    },
    userLoc() {
      return latLng(this.$store.state.userLoc) || latLng(47.41322, -1.219482)
    }
  },
  watch: {},
  methods: {
    initMap() {
      this.swfMap = this.$refs.swfMap.mapObject
    }
  }
}
</script>

<style scoped>

</style>
