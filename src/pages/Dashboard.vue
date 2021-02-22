<template>
  <q-page>
      <q-page-sticky position="bottom-left" :offset="[18, 18]">
        <q-btn rounded label="Deslogar" size="sm" no-caps color="red" @click="logout" />
      </q-page-sticky>
      <div class="row area">
          <div class="col-md-3 col-sm-3">
            <div>
              <q-table
                style="max-height: 900px"
                virtual-scroll
                @request="onRequest"
                title="Colaboradores"
                bordered
                flat
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

                <template v-slot:body="props">
                  <q-card class="col-md-10 q-mb-sm q-ml-md q-mr-md card-collaborator" @click="setLocalization(props.row.position)" @mouseleave="{props.row.infoWinOpen = false}" @mouseover="{props.row.infoWinOpen = true}">
                    <q-card-section class="text-center">
                      <strong>{{ props.row.name }}</strong>
                    </q-card-section>
                  </q-card>
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
              <gmap-info-window :key="index" v-for="(m, index) in data" :options="m.infoOptions" :position="google && new google.maps.LatLng(m.position.lat, m.position.lng)" :opened="m.infoWinOpen">
              </gmap-info-window>

              <gmap-marker :key="index" v-for="(m, index) in data" :position="m.position" :clickable="true" :draggable="false" @click="center=m.position">
              </gmap-marker>
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

  created () {
    if (!localStorage.getItem('access_token')) {
      this.$router.push('/')
    }
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
      data: []
    }
  },

  mounted () {
    this.refresh()
  },

  methods: {
    setLocalization (position) {
      this.setCordenadas = { ...position }
    },

    refresh () {
      this.onRequest()
    },

    showPin (ele) {
      ele.infoWinOpen = true
    },

    async onRequest () {
      this.loading = true

      const returnedData = await this.$axios.get('User', { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } })

      console.log(returnedData)
      returnedData.data.forEach((item, i) => {
        returnedData.data[i].position = { lat: Number(returnedData.data[i].userAddress.latitude), lng: Number(returnedData.data[i].userAddress.longitude) }
        returnedData.data[i].infoOptions = { content: `${item.userAddress.addressName}, ${item.userAddress.zipCode} - ${item.userAddress.neighborhood}, ${item.userAddress.city} - ${item.userAddress.state}, ${item.userAddress.country}` }
        returnedData.data[i].infoWinOpen = false
      })

      this.data.splice(0, this.data.length, ...returnedData.data)

      this.loading = false
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

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #eee;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #f7f6f6;
}
</style>
