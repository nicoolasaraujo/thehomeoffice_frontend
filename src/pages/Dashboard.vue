<template>
  <q-page>
      <q-page-sticky position="bottom-left" :offset="[18, 18]">
        <q-btn rounded label="Deslogar" size="sm" no-caps color="red" @click="logout" />
      </q-page-sticky>
      <div class="row area">
          <div class="col-md-3 col-sm-3">
            <div class="q-pa-md">
              <q-table
                grid
                style="height: 300px !important; background-color: red"
                :rows-per-page-options="[0]"
                grid-header
                title="Colaboradores"
                :data="data"
                row-key="name"
                :filter="filter"
                :visible-columns="[]"
                :pagination="pagination"
                hide-header
                hide-bottom
              >
                <template v-slot:top-right>
                  <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>

                <template v-slot:item="props" style="background-color: black">
                  <div class="col-md-12 q-mb-md">
                    <q-card class="card-collaborator" @click="setLocalization(props.row.position)">
                      <q-card-section class="text-center">
                        <strong>{{ props.row.name }}</strong>
                      </q-card-section>
                    </q-card>
                  </div>
                </template>
              </q-table>
            </div>
          </div>

          <div ref="areamap" class="col-md-9 col-sm-9">
            <gmap-map
                :position="google && new google.maps.LatLng(1.38, 103.8)"
                :zoom="12.75"
                :center="setCordenadas"
                style="width: 70vw; height: 100vh;"
                :style="[{'width': 100}]"
            >
              <gmap-marker :key="index" v-for="(m, index) in data" :position="m.position" :clickable="true" :draggable="true" @click="center=m.position"></gmap-marker>
            </gmap-map>
          </div>
      </div>
  </q-page>
</template>

<script>
import { gmapApi } from 'vue2-google-maps'

export default {
  name: 'Error404',

  computed: {
    google: gmapApi
  },

  data () {
    return {
      setCordenadas: { lat: -18.9208517, lng: -48.2702901 },
      filter: '',
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 50,
        rowsNumber: 10
      },
      data: [
        {
          name: 'Caliton Marcos Gonçalves Junior',
          position: {
            lat: -18.9060455,
            lng: -48.2574803
          },
          infoText: '<strong>Marker 1</strong>'
        },
        {
          name: 'Nicolas Araujo',
          position: {
            lat: -18.9428692,
            lng: -48.3131997
          },
          infoText: '<strong>Marker 2</strong>'
        },
        {
          name: 'Landix Sistemas',
          position: {
            lat: -18.8771292,
            lng: -48.2472295
          },
          infoText: '<strong>Marker 3</strong>'
        },
        {
          name: 'Caliton Marcos Gonçalves Junior',
          position: {
            lat: -18.9060455,
            lng: -48.2574803
          },
          infoText: '<strong>Marker 1</strong>'
        },
        {
          name: 'Nicolas Araujo',
          position: {
            lat: -18.9428692,
            lng: -48.3131997
          },
          infoText: '<strong>Marker 2</strong>'
        },
        {
          name: 'Landix Sistemas',
          position: {
            lat: -18.8771292,
            lng: -48.2472295
          },
          infoText: '<strong>Marker 3</strong>'
        },
        {
          name: 'Caliton Marcos Gonçalves Junior',
          position: {
            lat: -18.9060455,
            lng: -48.2574803
          },
          infoText: '<strong>Marker 1</strong>'
        },
        {
          name: 'Nicolas Araujo',
          position: {
            lat: -18.9428692,
            lng: -48.3131997
          },
          infoText: '<strong>Marker 2</strong>'
        },
        {
          name: 'Landix Sistemas',
          position: {
            lat: -18.8771292,
            lng: -48.2472295
          },
          infoText: '<strong>Marker 3</strong>'
        },

        {
          name: 'Caliton Marcos Gonçalves Junior',
          position: {
            lat: -18.9060455,
            lng: -48.2574803
          },
          infoText: '<strong>Marker 1</strong>'
        },
        {
          name: 'Nicolas Araujo',
          position: {
            lat: -18.9428692,
            lng: -48.3131997
          },
          infoText: '<strong>Marker 2</strong>'
        },
        {
          name: 'Landix Sistemas',
          position: {
            lat: -18.8771292,
            lng: -48.2472295
          },
          infoText: '<strong>Marker 3</strong>'
        },

        {
          name: 'Caliton Marcos Gonçalves Junior',
          position: {
            lat: -18.9060455,
            lng: -48.2574803
          },
          infoText: '<strong>Marker 1</strong>'
        },
        {
          name: 'Nicolas Araujo',
          position: {
            lat: -18.9428692,
            lng: -48.3131997
          },
          infoText: '<strong>Marker 2</strong>'
        },
        {
          name: 'Landix Sistemas',
          position: {
            lat: -18.8771292,
            lng: -48.2472295
          },
          infoText: '<strong>Marker 3</strong>'
        }

      ]
    }
  },

  methods: {
    setLocalization (position) {
      this.setCordenadas = { ...position }
    },

    logout () {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="stylus">
.area {
  width: 100%;
}

.card-collaborator:hover
  cursor: pointer;
  background-color: #f7f6f6
  transition: transform .28s, background-color .28s
</style>
