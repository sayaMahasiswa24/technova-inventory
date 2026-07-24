import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stock_transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // Relasi Foreign Key ke tabel items
      table.integer('item_id').unsigned().references('id').inTable('items').onDelete('CASCADE')
      table.enum('type', ['in', 'out']).notNullable() // 'in' = barang masuk, 'out' = barang keluar
      table.integer('quantity').notNullable()
      table.string('notes').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}