import { BaseTransformer } from '@adonisjs/core/transformers'
import StockTransaction from '#models/stock_transaction'

export default class StockTransactionTransformer extends BaseTransformer<StockTransaction> {
  toObject() {
    return this.pick(this.resource, ['id'])
  }
}