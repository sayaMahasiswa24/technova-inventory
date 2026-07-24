import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/item'

export default class ItemsController {
  // GET /api/items
  async index({ response }: HttpContext) {
    const items = await Item.query().preload('category')
    return response.ok({ data: items })
  }

  // POST /api/items
  async store({ request, response }: HttpContext) {
    const data = request.only(['categoryId', 'name', 'sku', 'price'])
    // Default stok awal selalu 0, stok ditambah lewat transaksi
    const item = await Item.create({ ...data, stock: 0 })
    return response.created({ message: 'Barang berhasil ditambahkan!', data: item })
  }
}