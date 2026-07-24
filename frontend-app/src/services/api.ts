import axios from 'axios'

// Mengarahkan alamat dasar ke server AdonisJS
const api = axios.create({
  baseURL: 'http://localhost:3333/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

export default api