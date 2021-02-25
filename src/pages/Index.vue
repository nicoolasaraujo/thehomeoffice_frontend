<template>
  <q-page class="flex flex-center">
    <div class="map">
      <GmapMap
          ref="mapRef"
          :position="google && new google.maps.LatLng(1.38, 103.8)"
          :zoom="12.75"
          :center="setCordenadas"
          :options="options"
          style="width: 100vw; height: 100vh;"
      />
    </div>

    <div class="form flex flex-center">
      <q-page-sticky position="top-right" :offset="[18, 18]">
        <q-btn rounded label="Admin" size="sm" no-caps color="red" @click="diagAdmin = true" />
      </q-page-sticky>

      <div class="form__search">
        <div class="form__search">
          <label class="q-field row no-wrap items-start q-input q-field--borderless q-validation-component">
              <div class="q-field__inner relative-position col self-stretch column justify-center">
                  <div tabindex="-1" class="q-field__control relative-position row no-wrap">
                      <div class="q-field__control-container col relative-position row no-wrap q-anchor--skip">
                          <!-- <GmapAutocomplete class="q-field__native q-placeholder form__input" :class="[user.address !== ''? 'form__input--no-empty': '']" placeholder="Onde está trabalhando?" @place_changed="setPlace"/> -->
                            <gmap-autocomplete :value="user.userAddress.description"
                              class="q-field__native q-placeholder form__input"
                              :class="[user.userAddress.description !== ''? 'form__input--no-empty': '']"
                              placeholder="Onde está trabalhando?"
                              @place_changed="setPlace"
                              :select-first-on-enter="true">
                            </gmap-autocomplete>

                      </div>
                  </div>
              </div>
              <!-- <div class="q-field__after q-field__marginal row no-wrap items-center">
                  <q-btn id="teste" icon="search" round color="primary" no-caps @click="diagForm = true" />
              </div> -->
          </label>
        </div>
      </div>
    </div>

    <q-dialog v-model="diagForm">
      <q-card style="min-width: 300px">
        <q-card-section class="">
          <GmapMap
            class="login-page-3"
            ref="mapRef"
            :position="google && new google.maps.LatLng(1.38, 103.8)"
            :zoom="17"
            :center="setCordenadas"
            :options="options"
            style="width: 500px; height: 250px;"
          >
            <gmap-info-window :options="infoOptions" :position="google && new google.maps.LatLng(this.setCordenadas.lat, this.setCordenadas.lng)" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
            </gmap-info-window>

            <GmapMarker
              :position="google && new google.maps.LatLng(this.setCordenadas.lat, this.setCordenadas.lng)"
              :clickable="true"
              :draggable="false"
              title="Estou Trabalhando aqui!"
              @click="infoWinOpen = true"
            />
          </GmapMap>
          <!-- <q-input input-class="text-center" input-style="font-size: 1rem" borderless v-model="user.address.description" placeholder="Endereço" /> -->

          <div class="form__search">
            <label class="q-field row no-wrap items-start q-input q-field--borderless q-validation-component">
                <div class="q-field__inner relative-position col self-stretch column justify-center">
                    <div tabindex="-1" class="q-field__control relative-position row no-wrap">
                        <div class="q-field__control-container col relative-position row no-wrap q-anchor--skip">
                          <gmap-autocomplete :value="user.userAddress.description"
                            class="q-field__native q-placeholder"
                            placeholder="Onde está trabalhando?"
                            @place_changed="setPlace"
                            :select-first-on-enter="true">
                          </gmap-autocomplete>
                        </div>
                    </div>
                </div>
            </label>
          </div>

        </q-card-section>

        <q-card-section class="col q-gutter-md">
          <div class="row flex-center flex">
            <div class="col-md-12 q-gutter-md">
              <q-input dense class="col" filled v-model="user.name" label="Nome Completo" />
              <q-input type="email" dense class="col" filled v-model="user.email" label="Email" />
              <q-input type="password" dense class="col" filled v-model="user.password" label="Senha" />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="flex flex-center">
          <q-btn label="Registrar Endereço" icon-right="eva-map-outline" rounded color="primary" no-caps @click="registerUser" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="diagAdmin">
      <q-card style="min-width: 300px">
        <q-card-section class="text-center">
          <span class="text-center" style="font-size: 1rem">Logar Admin</span>
        </q-card-section>

        <q-card-section class="col q-gutter-md">
          <q-input dense class="col" filled input-class="text-center"  v-model="admin.email" label="Email" type="email"/>
          <q-input dense class="col" filled input-class="text-center"  v-model="admin.password" label="Senha" type="password" />

        </q-card-section>

        <q-card-section class="flex flex-center">
          <q-btn label="Acessar" rounded color="primary" no-caps @click="login" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>j

<script>
import { gmapApi } from 'vue2-google-maps'

// const google = gmapApi
export default {
  name: 'PageIndex',
  data () {
    return {
      markers: [],
      merda: '',
      infoWinOpen: false,
      infoOptions: {
        content: 'Estou Trabalhando aqui!'
        // optional: offset infowindow so it visually sits nicely on top of our marker
      },
      setCordenadas: { lat: -18.9208517, lng: -48.2702901 },
      diagAdmin: false,
      map: {},
      place: '',
      admin: {
        email: '',
        password: ''
      },
      options: {
        zoomControl: false,
        fullscreenControl: false,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        disableDefaultUi: false
      },
      searchField: '',
      diagForm: false,
      user: {
        name: '',
        userAddress: {
          description: ''
        },
        email: '',
        password: ''
      }
    }
  },

  computed: {
    google: gmapApi
  },

  methods: {
    openDashboard () {
      this.$router.push('dashboard')
    },

    async login () {
      try {
        const loginResult = await this.$axios.post('/User/login', this.admin)

        localStorage.setItem('access_token', loginResult.data.token)
        this.openDashboard()
      } catch (e) {
        console.log(e)
      }
    },

    setPlace (place) {
      this.place = place
      this.setCordenadas.lat = this.place.geometry.location.lat()
      this.setCordenadas.lng = this.place.geometry.location.lng()

      const listaAddress = this.place.formatted_address.split(',')

      this.user.userAddress.addressName = listaAddress[0]
      this.user.userAddress.zipCode = listaAddress[1].split('-')[0].trim()
      this.user.userAddress.neighborhood = listaAddress[1].split('-')[1]

      this.user.userAddress.city = listaAddress[2].split('-')[0].trim()
      this.user.userAddress.state = listaAddress[2].split('-')[1]

      this.user.userAddress.country = listaAddress[4]

      this.user.userAddress.latitude = this.setCordenadas.lat.toString()
      this.user.userAddress.longitude = this.setCordenadas.lng.toString()

      this.diagForm = true

      console.log('Eis aqui o malandrao: ', this.user)
      this.user.userAddress.description = this.place.formatted_address
    },

    async registerUser () {
      try {
        const { name, email, password } = this.user

        const sendUser = { name, email, password }

        console.log('Estou enviando este nego: ', sendUser)

        const userResult = await this.$axios.post('User', sendUser)

        console.log(userResult)
        if (userResult.data.token) {
          const addressResult = await this.$axios.post(`User/${userResult.data.id}/places`, this.user.userAddress, { headers: { Authorization: `Bearer ${userResult.data.token}` } })

          console.log('Deu bom meu chapa: ', addressResult)
          this.user = { userAddress: { description: '' } }
          this.diagForm = false
          this.$q.notify({
            color: 'green',
            textColor: 'white',
            icon: 'success',
            message: 'Registro realizado com Sucesso! 😁 Obrigado pela disposição :)',
            position: 'center',
            timeout: Math.random() * 5000 + 3000
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="stylus">

.map {
  height: 100%;
  width: 100%;
  position:absolute;
  z-index: 0; /* Set z-index to 0 as it will be on a layer below the contact form */
}

.form {
  position: relative;
  z-index: 1; /* The z-index should be higher than Google Maps */
  width: 100%;
  height: 100vh;
  background-color: rgba(0,0,0, .8);
}

.form__search {
  background: white;
  border-radius: 30px;
  width: auto;
  height: auto;
  padding: 0 1rem 0 1rem;
  transition: 1s
}

.form__input {
  font-size: 1rem;
  width: 180px;
  transition: .5s
}

.form__input:focus {
  width: 700px;
  transform: translateX(60px) scale(1.2);
}

.form__input--no-empty {
  width: 700px;
  transform: translateX(60px) scale(1.2);
  transition: 1s

}
</style>
