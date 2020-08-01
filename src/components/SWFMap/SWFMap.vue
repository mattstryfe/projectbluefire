<template>
  <v-row>
    <v-sheet class="col" width="100%" height="50vh">
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
          v-for="car in cars"
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
  },
  components: { LMap, LTileLayer, LMarker, LTooltip, LPopup, LMovingMarker, LIconDefault},
  data () {
    return {
      ticker: 0,
      icon: L.icon({
        iconUrl:
          'https://s3-eu-west-1.amazonaws.com/ct-documents/emails/A-static.png',
        iconSize: [21, 31],
        iconAnchor: [10.5, 31],
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
    // cars() {
    //   return [cars]
    // },
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
            // if (this.car1Counter === this.car1.features[0].geometry.coordinates.length)
            //   this.car1Counter = 0


            // this.$set(this.car1, 'latlng', latLng(
            //   car1.features[0].geometry.coordinates[this.car1Counter][1],
            //   car1.features[0].geometry.coordinates[this.car1Counter][0]
            // ))

            // console.log('car1', this.car1)

            // this.car1.latlng = Object.assign({}, this.car1)
            this.cars.forEach((car) => {
              // console.log('car', car)
              car.latlng = L.latLng(
                car.coordinates[this.car1Counter][1],
                car.coordinates[this.car1Counter][0]
              )
            })
            // this.car1.latlng = L.latLng(
            //   car1.features[0].geometry.coordinates[this.car1Counter][1],
            //   car1.features[0].geometry.coordinates[this.car1Counter][0]
            // )
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
  methods: {
    // randomizeMarkerCoords() {
    //   this.ticker += .01
    // },
    // initMap() {
    //   // this.swfMap = this.$refs.swfMap.mapObject
    // }
  }
}
</script>

<style scoped>
@import "~leaflet/dist/leaflet.css";

</style>
