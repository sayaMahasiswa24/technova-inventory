import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      // Relasi Foreign Key ke tabel categories
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('CASCADE')
      table.string('name').notNullable()
      table.string('sku').unique().notNullable()
      table.integer('stock').defaultTo(0)
      table.integer('price').defaultTo(0)
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}