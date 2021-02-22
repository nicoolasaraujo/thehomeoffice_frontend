import axios from 'axios'

export default async ({ Vue }) => {
  const axiosInstance = axios.create({
    baseURL: process.env.API,
    withCredentials: false,
    crossdomain: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  Vue.prototype.$axios = axiosInstance
}
