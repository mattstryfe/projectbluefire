<template>
  <v-row>
    <v-card class="col" width="100%" height="500px">
      <l-map
        ref="swfMap"
        @ready="initMap()"
        style="height: 80%"
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
<!--          <l-tooltip :options="{ permanent: true, interactive: true }">-->
<!--            <div @click="innerClick">-->
<!--              I am a tooltip-->
<!--              <p v-show="showParagraph">-->
<!--                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque-->
<!--                sed pretium nisl, ut sagittis sapien. Sed vel sollicitudin nisi.-->
<!--                Donec finibus semper metus id malesuada.-->
<!--              </p>-->
<!--            </div>-->
<!--          </l-tooltip>-->
        </l-marker>

      </l-map>
    </v-card>
  </v-row>

</template>

<script>
import L from 'leaflet'
import { latLng } from 'leaflet'
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from 'vue2-leaflet';
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
  components: { LMap, LTileLayer, LMarker},
  data () {
    return {
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
