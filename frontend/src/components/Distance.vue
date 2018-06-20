<template>
  <div class="container">
    <h1 v-show="false">{{ appTitle }}</h1>
    <form class="row" role="form">
        <div class="form-group col-md-6">
          <label for="source">Starting point</label>
          <input
            type="text"
            class="form-control"
            id="source"
            aria-describedby="startHelp"
            placeholder="Start here"
            v-model="sourceAddress"
            @blur="searchCoordinates('source', sourceAddress)">
        </div>
        <div class="form-group col-md-6">
          <label for="destination">Ending point</label>
          <input
            type="text"
            class="form-control"
            id="destination"
            aria-describedby="endHelp"
            placeholder="... and finish here"
            v-model="destinationAddress"
            @blur="searchCoordinates('destination', destinationAddress)"
            >
        </div>
        <div class="orbit-spinner" v-show="loading">
          <div class="orbit"></div>
          <div class="orbit"></div>
          <div class="orbit"></div>
        </div>
        <div class="form-group col-md-12">
          <button class="btn btn-primary btn-block" @click.prevent="calculate" :disabled="!btnEnabled">Calculate</button>
        </div>
    </form>
    <div class="alert alert-success" v-show="calculatedDistance">Calculated distance: {{ calculatedDistance | kilometer }}</div>
    <p><a href="https://en.wikipedia.org/wiki/Haversine_formula">Haversine formula</a></p>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'Distance',
  data () {
    return {
      appTitle: 'Calculate Distance',
      sourceAddress: '',
      destinationAddress: '',
      coords: {},
      calculatedDistance: null,
      btnEnabled: false,
      loading: false
    };
  },
  methods: {
    searchCoordinates: function (ref, address) {
      if (!address) {
        this.btnEnabled = false;
        this.calculatedDistance = '';
        delete this.coords[ref];
        return;
      }
      this.loading = true;
      var openStreetMapApi = 'https://nominatim.openstreetmap.org/search?format=json&q=';

      axios.get(openStreetMapApi + address)
        .then((response) => {
          if (response.status === 200) {
            var result = response.data[0];
            if (result) {
              this.coords[ref] = {
                'lat': result['lat'],
                'lon': result['lon']
              };
              if (this.coords['source'] && this.coords['destination']) {
                this.btnEnabled = true;
              }
              this.$forceUpdate();
              this.loading = false;
            }
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

.orbit-spinner, .orbit-spinner * {
  box-sizing: border-box;
}

.orbit-spinner {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  perspective: 800px;
  margin: 10px auto;
}

.orbit-spinner .orbit {
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}

.orbit-spinner .orbit:nth-child(1) {
  left: 0%;
  top: 0%;
  animation: orbit-spinner-orbit-one-animation 1200ms linear infinite;
  border-bottom: 3px solid #007bff;
}

.orbit-spinner .orbit:nth-child(2) {
  right: 0%;
  top: 0%;
  animation: orbit-spinner-orbit-two-animation 1200ms linear infinite;
  border-right: 3px solid #007bff;
}

.orbit-spinner .orbit:nth-child(3) {
  right: 0%;
  bottom: 0%;
  animation: orbit-spinner-orbit-three-animation 1200ms linear infinite;
  border-top: 3px solid #007bff ;
}

@keyframes orbit-spinner-orbit-one-animation {
  0% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
  }
}

@keyframes orbit-spinner-orbit-two-animation {
  0% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
  }
}

@keyframes orbit-spinner-orbit-three-animation {
  0% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
  }
}
</style>
