<template>
  <div class="container">
    <h1 v-if="false">{{ appTitle }}</h1>
    <form class="row" role="form">
        <div class="form-group col-md-6">
          <label for="start">Starting point</label>
          <input
            type="text"
            class="form-control"
            id="start"
            aria-describedby="startHelp"
            placeholder="Start here"
            v-model="source"
            @blur="searchCoordinates('source', source)">
          <small id="startHelp" class="form-text">Address or coordinates</small>
        </div>
        <div class="form-group col-md-6">
          <label for="end">Ending point</label>
          <input
            type="text"
            class="form-control"
            id="end"
            aria-describedby="endHelp"
            placeholder="... and finish here"
            v-model="destination"
            @blur="searchCoordinates('destination', destination)"
            >
          <small id="endHelp" class="form-text">Address or coordinates</small>
        </div>
        <div class="form-group col-md-12">
          <button class="btn btn-primary" @click.prevent="calculate">Calculate</button>
        </div>
    </form>
    <div class="calculated-distance alert alert-success" v-show="calculatedDistance">Calculated distance: {{ calculatedDistance | kilometer }}</div>
    <p class="well"><a href="https://en.wikipedia.org/wiki/Haversine_formula">Haversine formula</a></p>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Distance',
  data () {
    return {
      appTitle: 'Calculate Distance',
      source: '',
      destination: '',
      coords: {},
      calculatedDistance: null
    };
  },
  methods: {
    searchCoordinates: function (ref, address) {
      // var googleGeocodingApi = 'http://maps.google.com/maps/api/geocode/json?address=';
      var openStreetMapApi = 'https://nominatim.openstreetmap.org/search?format=json&q=';

      axios.get(openStreetMapApi + address)
        .then((response) => {
          if (response.status === 200) {
            var result = response.data[0];
            this.coords[ref] = {
              'lat': result['lat'],
              'lon': result['lon']
            };
            this.$forceUpdate();
          }
        })
        .catch(e => {
          console.error(e);
        });
    },
    deg2rad: function (deg) {
      return deg * (Math.PI / 180);
    },
    calculate: function () {
      console.log('calculate method');
      var earthRadius = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(this.coords['destination']['lat'] - this.coords['source']['lat']);
      var dLon = this.deg2rad(this.coords['destination']['lon'] - this.coords['source']['lon']);
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(this.deg2rad(this.coords['source']['lat'])) * Math.cos(this.deg2rad(this.coords['destination']['lat'])) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
      this.calculatedDistance = earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // Distance in km
    }
  },
  filters: {
    kilometer: function (value) {
      return value + ' km';
    }
  }
};
</script>

<style scope>
.form-group {
  padding: 10px;
}
</style>
