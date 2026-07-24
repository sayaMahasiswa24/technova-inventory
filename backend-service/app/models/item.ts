import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Category from './category.js'
import StockTransaction from './stock_transaction.js'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'category_id' })
  declare categoryId: number

  @column()
  declare name: string

  @column()
  declare sku: string

  @column()
  declare stock: number

  @column()
  declare price: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => StockTransaction)
  declare transactions: HasMany<typeof StockTransaction>
}