<template>
  <v-row class="align-center justify-center">
    <v-sheet class="col col-lg-8 col-12" height="800px" style="z-index: 0">

      <MapControls/>

      <l-map
        ref="swfMap"
        :zoom="zoom"
        :center="thorncroft"
        :options:="mapOptions"
      >
        <l-icon-default />

        <l-tile-layer
          :url="url"
          :attribution="attribution"
        />

        <l-moving-marker
          v-for="car in cars[0].features"
          :lat-lng="car.latlng"
          :duration="duration"
          :icon="icon"
          :key="car.id"
        >
        </l-moving-marker>

      </l-map>

    </v-sheet>
  </v-row>

</template>

<script>
import L from 'leaflet'
import { LMap, LTileLayer, LMarker, LTooltip, LPopup, LIconDefault } from 'vue2-leaflet';
import LMovingMarker from 'vue2-leaflet-movingmarker'

// Car 1
import cars from '@/templates/paths/car-path-1'
import { Icon } from 'leaflet';
import MapControls from '@/components/MapControls/MapControls'

// Fix for webpack being terrible as usual
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  name: "SWFMap",
  props: {
    duration: { type: Number, default: 2000 },
    keepAtCenter: { type: Boolean, default: false },
    isSocketConnected: { type: Boolean, default: false },
    socketMessage: { type: String, default: 'empty message' }
  },
  components: {MapControls, LMap, LTileLayer, LMarker, LTooltip, LPopup, LMovingMarker, LIconDefault},
  data () {
    return {
      ticker: 0,
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
      thorncroft: L.latLng( 38.986346499999996, -77.48165809999999),
      interval: null,
      car1Counter: 0,
      cars
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
      return L.latLng(this.$store.state.userLoc) || L.latLng(47.41322, -1.219482)
    }
  },
  watch: {
    duration: {
      handler(value, oldValue) {
        if (value !== oldValue) {
          clearInterval(this.interval)

          const moveCar1 = () => {
            this.cars[0].features.forEach((car) => {
              if (this.car1Counter === car.geometry.coordinates.length)
                this.car1Counter = 0

              car.latlng = L.latLng(
                car.geometry.coordinates[this.car1Counter][1],
                car.geometry.coordinates[this.car1Counter][0]
              )
            })

            this.car1Counter += 1
          }

          this.interval = setInterval(() => {
            moveCar1()
          }, value)
          moveCar1()
        }
      },
      immediate: true
    }
  },
  methods: {}
}
</script>

<style scoped>

@import "~leaflet/dist/leaflet.css";
</style>
