<template>
  <q-page>
      <q-page-sticky position="bottom-left" :offset="[18, 18]">
        <q-btn rounded label="Deslogar" size="sm" no-caps color="red" @click="logout" />
      </q-page-sticky>
      <div class="row area">
          <div class="col-md-3 col-sm-3 bg-grey-8">
            <div>
              <q-table
                style="max-height: 900px"
                virtual-scroll
                class="bg-grey-8"
                @request="onRequest"
                title="Colaboradores"
                table-header-class="text-brown"
                bordered
                flat
                :data="data"
                :columns="columns"
                row-key="name"
                :filter="filter"
                :visible-columns="[]"
                :pagination="pagination"
                hide-header
                hide-bottom
              >
                <template v-slot:top-right>
                  <q-input outlined bg-color="white" dense debounce="300" v-model="filter" placeholder="Buscar" input-style="color: black !important">
                    <template v-slot:append>
                      <q-icon name="search" />
                    </template>
                  </q-input>
                </template>

                <template v-slot:body="props">
                  <q-card class="col-md-10 q-mb-sm q-ml-md q-mr-md card-collaborator" @click="setLocalization(props.row.position)" @mouseleave="{props.row.infoWinOpen = false}" @mouseover="{ props.row.infoWinOpen = true; setLocalization(props.row.position);}">
                    <q-card-section class="text-center text-subtitle1">
                     {{ props.row.name }}
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

              <gmap-marker :key="m.id" v-for="m in data" :position="m.position" :clickable="true" :draggable="false" @click="m.infoWinOpen = true">
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
      columns: [
        {
          name: 'name',
          required: true,
          label: 'Nome',
          field: row => row.name,
          format: val => `${val}`
        }
      ],
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
      this.onRequest({
        filter: this.filter
      })
    },

    showPin (ele) {
      ele.infoWinOpen = true
    },

    async onRequest (props) {
      console.log(props)
      const filter = props.filter

      this.loading = true

      const returnedData = await this.$axios.get('User', { headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } })

      returnedData.data.sort(function (a, b) {
        if (a.name > b.name) {
          return 1
        }
        if (a.name < b.name) {
          return -1
        }
        // a must be equal to b
        return 0
      })

      console.log(returnedData)
      returnedData.data.forEach((item, i) => {
        returnedData.data[i].position = { lat: Number(returnedData.data[i].userAddress.latitude), lng: Number(returnedData.data[i].userAddress.longitude) }
        returnedData.data[i].infoOptions = { content: `<p class="text-overline" style="margin: 0 !important; padding: 0 !important">${item.name}</p> <br/> ${item.userAddress.addressName}, ${item.userAddress.zipCode} - ${item.userAddress.neighborhood}, ${item.userAddress.city} - ${item.userAddress.state}, ${item.userAddress.country}` }
        returnedData.data[i].infoWinOpen = false
      })

      if (filter === '') {
        this.data.splice(0, this.data.length, ...returnedData.data)
      } else {
        console.log('Entrei aqui')
        const filtedData = (query) => {
          return returnedData.data.filter(usuario => usuario.name.toLowerCase().indexOf(query.toLowerCase()) > -1)
        }
        console.log('Entrei aqui ====> ', filtedData(filter))
        this.data.splice(0, this.data.length, ...filtedData(filter))
      }

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

.q-table__title {
  color: white
}

.card-collaborator:hover
  cursor: pointer;
  background-color: #ccc
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
