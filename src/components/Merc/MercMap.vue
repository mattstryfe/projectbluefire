<template>
  <v-sheet
    class=""
    height="800px"
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
import L, {Icon} from 'leaflet'
import { LMap, LTileLayer, LIconDefault } from 'vue2-leaflet';
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
      thorncroft: L.latLng( 38.986346499999996, -77.48165809999999),
      icon: L.icon({
        iconUrl: require('@/assets/images/s2000-icon.png'),
        iconSize: [21, 21],
        iconAnchor: [10, 10],
        popupAnchor: [4, -25],
      }),
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
  },
  watch: {},
  methods: {}
}
</script>

<style scoped>
</style>
