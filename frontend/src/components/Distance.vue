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
            @blur="searchCoordinates(source)">
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
            @blur="searchCoordinates(destination)"
            >
          <small id="endHelp" class="form-text">Address or coordinates</small>
        </div>
    </form>
    <pre class="lead">{{ coords }}</pre>
    <div class="calculated-distance" v-if="calculatedDistance">{{ calculatedDistance }}</div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Distance',
  data () {
    return {
      appTitle: 'Calculate Distance',
      calculatedDistance: null,
      source: '',
      destination: '',
      coords: {}
    };
  },
  methods: {
    searchCoordinates: function (ref) {
      // var googleGeocodingApi = 'http://maps.google.com/maps/api/geocode/json?address=';
      var openStreetMapApi = 'https://nominatim.openstreetmap.org/search?format=json&q=';

      axios.get(openStreetMapApi + ref)
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data);
            var result = response.data[0];
            if (!this.coords[ref]) {
              this.coords[ref] = {};
            }
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
    }
  }
};
</script>

<style scope>
.form-group {
  padding: 10px;
}
</style>
