import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
})

export const predict = (data) => API.post('/predict', data)
export const getOptions = () => API.get('/predict/options')
export const getHistory = (limit = 20) => API.get(`/predict/history?limit=${limit}`)
export const getSummary = () => API.get('/analytics/summary')
export const getPeakHours = () => API.get('/analytics/peak-hours')
export const getByWeather = () => API.get('/analytics/by-weather')
export const getByVehicle = () => API.get('/analytics/by-vehicle')