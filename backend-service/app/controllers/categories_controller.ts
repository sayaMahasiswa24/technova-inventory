import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'

export default class CategoriesController {
  // GET /api/categories
  async index({ response }: HttpContext) {
    const categories = await Category.query().preload('items')
    return response.ok({ data: categories })
  }

  // POST /api/categories
  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'description'])
    const category = await Category.create(data)
    return response.created({ message: 'Kategori berhasil dibuat!', data: category })
  }
}