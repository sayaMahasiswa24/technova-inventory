import { test } from '@japa/runner'

test.group('Inventory Flow Integration Test', () => {

  // 1. Tes Endpoint Health Check (Wajib untuk Monitoring DevOps)
  test('pastikan endpoint health check merespons status OK', async ({ client }) => {
    const response = await client.get('/health')
    
    response.assertStatus(200)
    response.assertBodyContains({ status: 'OK' })
  })

  // 2. Tes Membuat Kategori Baru
  test('dapat membuat kategori barang baru', async ({ client, assert }) => {
    const response = await client.post('/api/categories').json({
      name: 'Perangkat Jaringan Test',
      description: 'Kategori khusus pengujian otomatis'
    })

    response.assertStatus(201)
    assert.exists(response.body().data.id)
    assert.equal(response.body().data.name, 'Perangkat Jaringan Test')
  })

  // 3. Tes Menambah Barang Baru ke Katalog
  test('dapat menambahkan barang baru dengan stok awal 0', async ({ client, assert }) => {
    // Ambil atau buat kategori dulu
    const catRes = await client.post('/api/categories').json({ name: 'Hardware Test' })
    const categoryId = catRes.body().data.id

    const response = await client.post('/api/items').json({
      categoryId: categoryId,
      name: 'Switch 24 Port Test',
      sku: 'SW-TEST-001',
      price: 1500000
    })

    response.assertStatus(201)
    assert.equal(response.body().data.stock, 0) // Stok awal harus 0
    assert.equal(response.body().data.sku, 'SW-TEST-001')
  })

  // 4. Tes Transaksi Stok Masuk (Stock In) & Verifikasi Stok Bertambah
  test('stok barang otomatis bertambah saat transaksi stok masuk', async ({ client, assert }) => {
    const catRes = await client.post('/api/categories').json({ name: 'Server Room' })
    const itemRes = await client.post('/api/items').json({
      categoryId: catRes.body().data.id,
      name: 'RAM Server 32GB',
      sku: 'RAM-TEST-002',
      price: 2000000
    })
    const itemId = itemRes.body().data.id

    // Lakukan transaksi stok masuk (+10)
    const trxRes = await client.post('/api/transactions').json({
      itemId: itemId,
      type: 'in',
      quantity: 10,
      notes: 'Restock pengujian'
    })

    trxRes.assertStatus(201)

    // Verifikasi kembali ke katalog, apakah stok sekarang menjadi 10
    const checkItem = await client.get('/api/items')
    const updatedItem = checkItem.body().data.find((i: any) => i.id === itemId)
    
    assert.equal(updatedItem.stock, 10)
  })

  // 5. Tes Validasi Stok Keluar (Stock Out) Jika Stok Tidak Cukup
  test('menolak transaksi stok keluar jika stok di gudang tidak mencukupi', async ({ client }) => {
    const catRes = await client.post('/api/categories').json({ name: 'Aksesoris' })
    const itemRes = await client.post('/api/items').json({
      categoryId: catRes.body().data.id,
      name: 'Kabel HDMI 2M',
      sku: 'HDMI-TEST-003',
      price: 50000
    })
    const itemId = itemRes.body().data.id // Stok saat ini 0

    // Coba keluarkan barang sebanyak 5 (seharusnya gagal / 400 Bad Request)
    const trxRes = await client.post('/api/transactions').json({
      itemId: itemId,
      type: 'out',
      quantity: 5,
      notes: 'Pengeluaran ilegal'
    })

    trxRes.assertStatus(400)
    trxRes.assertBodyContains({ message: 'Stok barang tidak mencukupi!' })
  })

})