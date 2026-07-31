import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Item from './item.js'

export default class StockTransaction extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'item_id' })
  declare itemId: number

  @column()
  declare type: 'in' | 'out'

  @column()
  declare quantity: number

  @column()
  declare notes: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Item)
  declare item: BelongsTo<typeof Item>
}
