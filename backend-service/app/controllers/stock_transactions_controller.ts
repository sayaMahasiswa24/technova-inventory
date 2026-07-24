import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import StockTransaction from '#models/stock_transaction'
import Item from '#models/item'

export default class StockTransactionsController {
  // GET /api/transactions
  async index({ response }: HttpContext) {
    const transactions = await StockTransaction.query().preload('item').orderBy('created_at', 'desc')
    return response.ok({ data: transactions })
  }

  // POST /api/transactions
  async store({ request, response }: HttpContext) {
    const { itemId, type, quantity, notes } = request.only(['itemId', 'type', 'quantity', 'notes'])

    // Gunakan DB Transaction agar aman
    const trx = await db.transaction()

    try {
      const item = await Item.findOrFail(itemId, { client: trx })

      if (type === 'out' && item.stock < quantity) {
        await trx.rollback()
        return response.badRequest({ message: 'Stok barang tidak mencukupi!' })
      }

      // Update stok pada Item
      if (type === 'in') {
        item.stock += Number(quantity)
      } else {
        item.stock -= Number(quantity)
      }
      await item.useTransaction(trx).save()

      // Catat riwayat transaksi
      const transaction = await StockTransaction.create({
        itemId,
        type,
        quantity: Number(quantity),
        notes,
      }, { client: trx })

      await trx.commit()
      return response.created({ message: 'Transaksi berhasil dicatat & stok diperbarui!', data: transaction })
    } catch (error) {
      await trx.rollback()
        return response.internalServerError({ message: 'Terjadi kesalahan transaksi', error: error.message })
    }
  }
}