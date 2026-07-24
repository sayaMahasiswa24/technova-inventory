import type { HttpContext } from '@adonisjs/core/http'
import client from 'prom-client'

// Inisialisasi pengumpulan metrik default Node.js (CPU, Memory, Event Loop, dll.)
const collectDefaultMetrics = client.collectDefaultMetrics
collectDefaultMetrics({ prefix: 'technova_' })

// Contoh metrik kustom: Menghitung total request API
export const httpRequestCounter = new client.Counter({
  name: 'technova_http_requests_total',
  help: 'Total jumlah HTTP request ke backend TechNova',
  labelNames: ['method', 'route', 'status_code'],
})

export default class MetricsController {
  // GET /metrics
  async index({ response }: HttpContext) {
    response.header('Content-Type', client.register.contentType)
    return response.send(await client.register.metrics())
  }
}