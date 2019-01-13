<template>
  <div>
    <v-card>
      <div id="mainMap"></div>
    </v-card>
  </div>
</template>

<script>
	import * as L from 'leaflet';
	import moment from 'moment';
	import 'leaflet.markercluster';
  import 'leaflet.markercluster/dist/leaflet.markercluster-src';
  import 'leaflet.markercluster.layersupport';
  import 'leaflet-extra-markers';

  import 'leaflet/dist/leaflet.css';
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
  import 'leaflet-extra-markers/dist/css/leaflet.extra-markers.min.css';

  // leaflet fixes
  import icon from 'leaflet/dist/images/marker-icon.png';
  import iconShadow from 'leaflet/dist/images/marker-shadow.png';


  export default {
		name: 'MainMap',
    data () {
			return {
      }
    },
    props: [
      'userCoords',
      'finalWeatherData',
      'landAlertData',
      'marineAlertData',
      'staticLandAlerts',
      'affectedByAlerts',
      'randomGeoJson',
      'twitterFeedData',
      'landAlertZonesFinal'
    ],
    watch: {
      zoneVal: function (val) {
        return this.$http.get(val.properties.affectedZones[0], this.headers).then(res => {
          this.zonesLayer.addData(res.body)
        })
      },
      twitterFeedData: function (val) {
        this.twitterBaseLayer.addData(val.userLoc);
        // do this because it's a cluster group...
        this.twitterClustersLayer.addLayer(this.twitterBaseLayer);

      },
		  userCoords: function (val) {
		    const lat = val.coords.latitude
        const lng = val.coords.longitude

        this.map.setView([lat, lng], 5)
        L.marker([lat, lng]).addTo(this.map);
      },
			finalWeatherData: function (val) {
        this.map.setView([val.geo.lat, val.geo.lng], 9)
      },
      landAlertData: function (val) {
		    // uncomment for live data
        this.alertsLayerLand.addData(val);
				// this.alertsLayerLand.addData(this.staticLandAlerts);
      },
      marineAlertData: function (val) {
        this.alertsLayerMarine.addData(val);
      },
      affectedByAlerts: function (val) {
		    // console.log('this.affectedByAlerts',this.affectedByAlerts)
        // this.numAffectedByAlerts = val.affectedAssets.length;
		    // console.log('numAffectedByAlerts', this.numAffectedByAlerts)
        this.alertsLayerAffected.addData(val.affectedAssets);
      },
      randomGeoJson: function (val) {
		    this.testLayer.addData(val)
      }
    },
    created: function () {
      // leaflet cluster fix
      // const toolTipOffset = L.point([0, -30]);
      const offset = [15, 40]
      let DefaultIcon = L.icon({
        iconUrl: icon,
        shadowUrl: iconShadow,
        iconAnchor: offset,
        shadowAnchor: offset
      });
      L.Marker.prototype.options.icon = DefaultIcon;

    },
    mounted: function () {
      this.buildBaseLayer();
      this.buildAlertsLayers();
      this.buildTwitterlayer();

    },
    methods: {
      buildBaseLayer: function() {
        let centerPoint = [39.8283, -98.5795]
		    let tileUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png';
        let baseMap = L.tileLayer(tileUrl, {
          minZoom: 2,
          maxZoom: 18,
        });

        this.map = L.map('mainMap', {
          center: centerPoint,
          zoom: 8,
          layers: [baseMap]
        });

        this.baseLayerGroup = {
          'Base Map': baseMap
        };

        this.mainControl = L.control.layers(this.baseLayerGroup, null, {
          position: 'topright',
          collapsed: false
        }).addTo(this.map)
      },
      buildTwitterlayer: function () {
        let popup = L.popup();

        function onMapClick(e) {
          popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(this.twitterClustersLayer);
        }

        function addFeature (feature, layer) {
          layer.bindTooltip(feature.properties.text);
        }

        this.twitterBaseLayer = L.geoJSON(null, {
          onEachFeature: addFeature
        });

        this.twitterClustersLayer = L.markerClusterGroup({
          // onEachFeature: addFeature
          // iconCreateFunction: function (cluster) {
          //   const markers = cluster.getAllChildMarkers();
          //   return L.divIcon({ html: `<div class="custom-marker"><span class="cluster-text">${markers.length}</span></div>`, className: null });
          // }
        })//.addTo(this.map)

        this.mainControl.addOverlay(this.twitterClustersLayer, 'Twitter Feed');

        // this.twitterClustersLayer.on('clustermouseover', onMapClick)
      },
      buildAlertsLayers: function () {
        function addCustomIcon (feature, latlng) {
          L.divIcon()
          let affectByCustomIcon = new L.divIcon({
            html: '<i class="fas fa-bolt fa-3x"></i>',
            iconSize: [138, 138],
            className: 'cust-icon'
          })
          return L.marker(latlng, { icon: affectByCustomIcon })
        }

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
          attribution: this.landAlertData.title + ': ' + moment(this.landAlertData.updated).format('LT')
				});

				// Marine layer
        this.alertsLayerMarine = L.geoJSON(null, {
          onEachFeature: addFeature,
          style: addStyle,
        })

        // Test layer
        this.testLayer = L.geoJSON(null, {
          onEachFeature: addFeature,
          pointToLayer: addCustomIcon
        })

        // Affected layer
        this.alertsLayerAffected = L.geoJSON(null, {
          onEachFeature: addFeature,
          pointToLayer: addCustomIcon
          // icon: affectByCustomIcon
        })

        // Test weather zones layer
        this.zonesLayer = L.geoJSON(null, {
          onEachFeature: addFeature,
          style: addStyle,
        }).addTo(this.map);

        this.mainControl.addOverlay(this.alertsLayerLand, 'Land Alerts');
        this.mainControl.addOverlay(this.alertsLayerMarine, 'Marine Alerts');
        this.mainControl.addOverlay(this.alertsLayerAffected, 'Affected by Alerts');
        this.mainControl.addOverlay(this.testLayer, 'Test Layer');
        this.mainControl.addOverlay(this.zonesLayer, 'Zones Layer')

      }
    }
	}

</script>
<style>
  .custom-marker {
    width: 25px;
    height: 25px;
    border-radius: 100px;
    border: 1px solid black;
  }
</style>
<style scoped>
  #mainMap {
    height: 800px;
    z-index: 1;
  }

</style>
