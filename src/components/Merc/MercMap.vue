<template>
  <v-sheet
    style="height: calc(100vh - 48px)"
  >
    <AppointmentPopup
      class="px-1"
      v-show="appointmentPopupToggle"
      :featureInPopup="featureInPopup"
      ref="popup"
    />

    <l-map
      ref="mercMap"
      :zoom="zoom"
      :max-zoom="25"
      :center="thorncroft"
      :options:="mapOptions"
      @popupopen="popupOpened"
      @popupclosed="popupClosed"
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
import AppointmentPopup from '@/components/Merc/AppointmentPopup'
import L, { Icon } from 'leaflet'
import { LMap, LTileLayer, LIconDefault } from 'vue2-leaflet';
import vaData from '@/assets/data/virginiaCityDataSmall.json'

// Clustering
import { markerClusterGroup } from 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import {zipToGeo} from '@/services/SWFServices'

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
  components: { AppointmentPopup, LMap, LTileLayer, LIconDefault },
  data () {
    return {
      featureInPopup: {},
      appointmentPopupToggle: false,
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
      vaData
    }
  },
  created () {},
  destroyed () {},
  mounted () {
    this.loadAllAppointmentsToMap(this.appointments)
    this.loadVirginiaCityData(this.vaData)
  },
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
    popupClosed() {
      this.appointmentPopupToggle = false
    },
    popupOpened(event, feature) {
      // toggle popup open
      this.appointmentPopupToggle = true

      // after it's drawn in the DOM, update it so it properly resizes with data
      this.$nextTick(() => event.popup.update())

      // assign popup details to global for proper prop sending
      this.featureInPopup = event.popup._source.feature
    },
    buildGeoJson(entry, geometry) {
      return  {
        type: 'Feature',
        properties: {
          name: entry.city,
          rank: entry.rank,
          population: entry.population,
          popupContent: null
        },
        geometry: {
          type: 'Point',
          coordinates: geometry.location
        }
      };
    },
    async loadVirginiaCityData(vaData){
      // console.log('vadata', vaData[0].City)
      // const testCity = vaData[0].City
      // let geoData = await zipToGeo(testCity)
      // vaData[0].geo = geoData

      let listOfCities = []

      // Append geolocation deets
      for (let entry in vaData) {
        const { geometry } = await zipToGeo(vaData[entry].City)
        vaData[entry].geo = geometry
        listOfCities.push(this.buildGeoJson(vaData[entry], geometry))
      }

      // console.log('geoData', geoData.geometry.location)
      console.log('new vaData', vaData)
      console.log('list of cities', listOfCities)
    },
    loadAllAppointmentsToMap(appointments) {
      // clear markers layers before re-adding everything
      this.appointmentsLayer.clearLayers()

      const attachPopup = (feature, layer) => {
        const popup = L.popup()
          .setContent(this.$refs.popup.$el)

        // does this feature have a property named popupContent?
        if (feature.properties)
          layer.bindPopup(popup)
      }

      function pointToCircle(feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions)
      }

      const mercMap = this.$refs.mercMap.mapObject

      // add layer(s) with geoJSON appointments to layer
      this.appointmentsLayer.addLayer(L.geoJSON(appointments, {
        onEachFeature: attachPopup
      }))

      mercMap.addLayer(this.appointmentsLayer)
    }
  }
}
</script>

<style scoped>
>>>.leaflet-popup-content {
  margin: 5px !important;
}
>>>.leaflet-popup-content-wrapper {
  background-color: #333 !important;
  /*border-radius: 10px !important;*/
}
>>>.leaflet-popup-tip {
  background-color: #333 !important;
}
</style>
