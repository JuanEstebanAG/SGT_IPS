import axios from 'axios'

const API_URL = 'http://localhost/sgt/api/index.php'

const apiService = {
  // ===== UBICACIONES =====
  getUbicaciones() {
    return axios.get(`${API_URL}?modulo=ubicaciones&accion=listar`)
  },

  getUbicacion(id) {
    return axios.get(`${API_URL}?modulo=ubicaciones&accion=consultar&id=${id}`)
  },

  createUbicacion(data) {
    return axios.post(`${API_URL}?modulo=ubicaciones&accion=insertar`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
  },

  updateUbicacion(id, data) {
    return axios.post(`${API_URL}?modulo=ubicaciones&accion=actualizar&id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
  },

  deleteUbicacion(id) {
    return axios.delete(`${API_URL}?modulo=ubicaciones&accion=eliminar&id=${id}`)
  },

  // ===== RESPONSABLES =====
  getResponsables() {
    return axios.get(`${API_URL}?modulo=responsables&accion=listar`)
  },

  getResponsable(id) {
    return axios.get(`${API_URL}?modulo=responsables&accion=consultar&id=${id}`)
  },

  getResponsableByDoc(documento) {
    return axios.get(`${API_URL}?modulo=responsables&accion=consultarDoc&documento=${documento}`)
  },

  createResponsable(data) {
    return axios.post(`${API_URL}?modulo=responsables&accion=insertar`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
  },

  updateResponsable(id, data) {
    return axios.post(`${API_URL}?modulo=responsables&accion=actualizar&id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
  },

  deleteResponsable(id) {
    return axios.delete(`${API_URL}?modulo=responsables&accion=eliminar&id=${id}`)
  },

  // ===== EQUIPOS MÉDICOS =====
  getEquipos() {
    return axios.get(`${API_URL}?modulo=equipos&accion=listar`)
  },

  getEquipo(id) {
    return axios.get(`${API_URL}?modulo=equipos&accion=consultar&id=${id}`)
  },

  getEquiposByUbicacion(codigo) {
    return axios.get(`${API_URL}?modulo=equipos&accion=porUbicacion&codigo=${codigo}`)
  },

  getEquiposByResponsable(codigo) {
    return axios.get(`${API_URL}?modulo=equipos&accion=porResponsable&codigo=${codigo}`)
  },

  createEquipo(data) {
    return axios.post(`${API_URL}?modulo=equipos&accion=insertar`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
  },

  updateEquipo(id, data) {
    return axios.post(`${API_URL}?modulo=equipos&accion=actualizar&id=${id}`, data, {
      headers: { 'Content-Type': 'application/json' }
    })
  },

  deleteEquipo(id) {
    return axios.delete(`${API_URL}?modulo=equipos&accion=eliminar&id=${id}`)
  },

  // ===== INFORMACIÓN GENERAL =====
  getInfo() {
    return axios.get(`${API_URL}?modulo=info`)
  }
}

export default apiService