import axios from 'axios'

// URL del backend PHP en XAMPP
const API_URL = '/api/index.php'

// Configuración global
axios.defaults.headers.common['Content-Type'] = 'application/json'

const apiService = {
  // UBICACIONES
  ubicaciones: {
    listar: () => axios.get(`${API_URL}?modulo=ubicaciones&accion=listar`),
    consultar: (id) => axios.get(`${API_URL}?modulo=ubicaciones&accion=consultar&id=${id}`),
    crear: (data) => axios.post(`${API_URL}?modulo=ubicaciones&accion=insertar`, data),
    actualizar: (id, data) => axios.post(`${API_URL}?modulo=ubicaciones&accion=actualizar&id=${id}`, data),
    eliminar: (id) => axios.get(`${API_URL}?modulo=ubicaciones&accion=eliminar&id=${id}`)
  },
  
  // RESPONSABLES
  responsables: {
    listar: () => axios.get(`${API_URL}?modulo=responsables&accion=listar`),
    consultar: (id) => axios.get(`${API_URL}?modulo=responsables&accion=consultar&id=${id}`),
    crear: (data) => axios.post(`${API_URL}?modulo=responsables&accion=insertar`, data),
    actualizar: (id, data) => axios.post(`${API_URL}?modulo=responsables&accion=actualizar&id=${id}`, data),
    eliminar: (id) => axios.get(`${API_URL}?modulo=responsables&accion=eliminar&id=${id}`)
  },
  
  // EQUIPOS
  equipos: {
    listar: () => axios.get(`${API_URL}?modulo=equipos&accion=listar`),
    consultar: (id) => axios.get(`${API_URL}?modulo=equipos&accion=consultar&id=${id}`),
    crear: (data) => axios.post(`${API_URL}?modulo=equipos&accion=insertar`, data),
    actualizar: (id, data) => axios.post(`${API_URL}?modulo=equipos&accion=actualizar&id=${id}`, data),
    eliminar: (id) => axios.get(`${API_URL}?modulo=equipos&accion=eliminar&id=${id}`)
  },
  
  // INFO
  info: () => axios.get(`${API_URL}?modulo=info`)
}

export default apiService