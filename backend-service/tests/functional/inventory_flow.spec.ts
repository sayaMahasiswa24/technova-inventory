import { test } from '@japa/runner'
import Item from '#models/item'
import Category from '#models/category'
import db from '@adonisjs/lucid/services/db'

test.group('Stock Transactions API', (group) => {
  // Membersihkan database dummy setiap kali pengujian selesai agar tidak menumpuk
  group.each.teardown(async () => {
    await db.from('items').where('sku', 'TEST-001').delete()
    await db.from('categories').where('name', 'Kategori Testing').delete()
  })

  test('Skenario 1: Berhasil menambah stok barang (Tipe: IN)', async ({ client, assert }) => {
    // 1. SETUP: Buat data pancingan di Database menggunakan Object-Oriented Models
    const category = await Category.create({ name: 'Kategori Testing' })
    const item = await Item.create({
      categoryId: category.id,
      name: 'Barang Uji Coba',
      sku: 'TEST-001',
      price: 50000,
      stock: 0
    })

    // 2. ACTION: Robot (Client) menembak Endpoint API
    const response = await client.post('/api/transactions').json({
      itemId: item.id,
      type: 'in',
      quantity: 50,
      notes: 'Testing masuk stok dari Japa'
    })

    // 3. ASSERTION (Validasi Hasil API)
    response.assertStatus(201)
    response.assertBodyContains({ message: 'Transaksi berhasil!' })

    // 4. DATA VALIDATION (Cek kebenaran di dalam Database)
    await item.refresh() 
    assert.equal(item.stock, 50, 'Stok di database harusnya berubah jadi 50')
  })

  test('Skenario 2: Gagal mengurangi stok karena kuantitas tidak cukup (Tipe: OUT)', async ({ client, assert }) => {
    // 1. SETUP: Buat barang dengan stok awal cuma 10
    const category = await Category.create({ name: 'Kategori Testing' })
    const item = await Item.create({
      categoryId: category.id,
      name: 'Barang Uji Coba 2',
      sku: 'TEST-001',
      price: 50000,
      stock: 10 
    })

    // 2. ACTION: Robot mencoba mengeluarkan 100 barang
    const response = await client.post('/api/transactions').json({
      itemId: item.id,
      type: 'out',
      quantity: 100, 
      notes: 'Testing keluar stok berlebih'
    })

    // 3. ASSERTION (Validasi sistem harus menolak)
    response.assertStatus(400) // 400 = Bad Request (Ditolak)
    response.assertBodyContains({ message: 'Stok tidak mencukupi!' })

    // 4. DATA VALIDATION (Pastikan stok di DB tidak berubah / bocor)
    await item.refresh()
    assert.equal(item.stock, 10, 'Stok harus tetap 10, tidak boleh minus!')
  })
})