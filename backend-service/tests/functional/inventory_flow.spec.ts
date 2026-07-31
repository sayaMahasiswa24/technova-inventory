import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'
import Item from '#models/item'

test.group('Inventory Flow Integration Test', (group) => {
  // Memastikan database selalu bersih dan di-rollback setelah setiap tes selesai
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  // --- TES 1 ---
  test('dapat menambahkan barang baru dengan stok awal 0', async ({ client, assert }) => {
    // 1. Buat kategori terlebih dahulu
    const catRes = await client.post('/api/categories').json({
      name: 'Networking Test',
    })
    const categoryData = catRes.body().data
    const categoryId = Array.isArray(categoryData) ? categoryData[0].id : categoryData.id

    // 2. Buat barang menggunakan ID kategori di atas
    const response = await client.post('/api/items').json({
      categoryId: categoryId,
      name: 'Switch 24 Port Test',
      sku: 'SW-TEST-001',
      price: 1500000,
    })

    // 3. Validasi hasilnya
    response.assertStatus(201)
    const createdItem = response.body().data
    const item = Array.isArray(createdItem) ? createdItem[0] : createdItem
    assert.equal(item.stock, 0)
    assert.equal(item.sku, 'SW-TEST-001')
  })

  // --- TES 2 ---
  test('stok barang otomatis bertambah saat transaksi stok masuk', async ({ client, assert }) => {
    // 1. Buat kategori
    const catRes = await client.post('/api/categories').json({
      name: 'Komponen Test',
    })
    const categoryData = catRes.body().data
    const categoryId = Array.isArray(categoryData) ? categoryData[0].id : categoryData.id

    // 2. Buat barang (stok awal 0)
    const itemRes = await client.post('/api/items').json({
      categoryId: categoryId,
      name: 'RAM Server 32GB',
      sku: 'RAM-TEST-002',
      price: 2000000,
    })
    const itemData = itemRes.body().data
    const itemId = Array.isArray(itemData) ? itemData[0].id : itemData.id

    // 3. Lakukan transaksi stok masuk (+10)
    const trxRes = await client.post('/api/transactions').json({
      itemId: itemId,
      type: 'in',
      quantity: 10,
      notes: 'Barang masuk dari supplier',
    })
    // Validasi API transaksi berhasil
    trxRes.assertStatus(201)

    // 4. Periksa data langsung ke Database menggunakan OOP Model
    const checkItem = await Item.findOrFail(itemId)
    // Verifikasi bahwa properti stock di database sudah bertambah menjadi 10
    assert.equal(checkItem.stock, 10)
  })

  // --- TES 3 ---
  test('menolak transaksi stok keluar jika stok di gudang tidak mencukupi', async ({
    client,
    assert,
  }) => {
    // 1. Buat kategori
    const catRes = await client.post('/api/categories').json({
      name: 'Aksesoris Test',
    })
    const categoryData = catRes.body().data
    const categoryId = Array.isArray(categoryData) ? categoryData[0].id : categoryData.id

    // 2. Buat barang (stok awal 0)
    const itemRes = await client.post('/api/items').json({
      categoryId: categoryId,
      name: 'Kabel HDMI 2M',
      sku: 'HDMI-TEST-003',
      price: 50000,
    })
    const itemData = itemRes.body().data
    const itemId = Array.isArray(itemData) ? itemData[0].id : itemData.id

    // 3. Coba keluarkan barang sebanyak 5 (padahal stok saat ini 0)
    const trxRes = await client.post('/api/transactions').json({
      itemId: itemId,
      type: 'out',
      quantity: 5,
      notes: 'Kirim ke cabang',
    })

    // 4. Validasi bahwa API menolak permintaan ini (Harus 400 Bad Request)
    trxRes.assertStatus(400)

    // 5. Periksa data langsung ke Database menggunakan OOP Model
    const checkItem = await Item.findOrFail(itemId)
    // Verifikasi bahwa properti stock di database tidak minus dan tetap 0
    assert.equal(checkItem.stock, 0)
  })
})
