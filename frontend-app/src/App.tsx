import { useState, useEffect } from 'react'
import api from './services/api'

// Definisi Tipe Data TypeScript
interface Category {
  id: number
  name: string
}

interface Item {
  id: number
  name: string
  sku: string
  stock: number
  price: number
  category?: Category
}

export default function App() {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  // State untuk Form Tambah Barang
  const [newItemName, setNewItemName] = useState('')
  const [newItemSku, setNewItemSku] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('')

  // State untuk Form Transaksi Stok (Masuk/Keluar)
  const [selectedItemId, setSelectedItemId] = useState<number | ''>('')
  const [trxType, setTrxType] = useState<'in' | 'out'>('in')
  const [trxQty, setTrxQty] = useState('')
  const [trxNotes, setTrxNotes] = useState('')

  // Mengambil Data dari Backend AdonisJS
  const fetchData = async () => {
    try {
      setLoading(true)
      const [itemsRes, catRes] = await Promise.all([
        api.get('/items'),
        api.get('/categories')
      ])
      
      setItems(itemsRes.data.data || [])
      setCategories(catRes.data.data || [])
    } catch (error) {
      console.error('Gagal mengambil data dari server:', error)
      setMessage('⚠️ Gagal terhubung ke server AdonisJS. Pastikan backend sudah berjalan!')
    } finally {
      setLoading(false)
    }
  }

  // Buat Kategori Default jika belum ada (Opsional untuk tes awal)
  const createDefaultCategory = async () => {
    try {
      const res = await api.post('/categories', { name: 'Umum / Hardware', description: 'Kategori default' })
      setCategories([...categories, res.data.data])
      setSelectedCategory(res.data.data.id)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Fungsi Tambah Barang Baru
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItemName || !newItemSku || !selectedCategory) {
      alert('Mohon isi Nama, SKU, dan Kategori!')
      return
    }

    try {
      await api.post('/items', {
        name: newItemName,
        sku: newItemSku,
        price: Number(newItemPrice) || 0,
        categoryId: Number(selectedCategory)
      })
      setMessage('✅ Barang berhasil ditambahkan ke katalog!')
      setNewItemName('')
      setNewItemSku('')
      setNewItemPrice('')
      fetchData() // Refresh tabel
    } catch (error: any) {
      alert('Gagal menambah barang: ' + (error.response?.data?.message || error.message))
    }
  }

  // Fungsi Transaksi Stok
  const handleStockTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedItemId || !trxQty || Number(trxQty) <= 0) {
      alert('Pilih barang dan masukkan jumlah stok yang valid!')
      return
    }

    try {
      const res = await api.post('/transactions', {
        itemId: Number(selectedItemId),
        type: trxType,
        quantity: Number(trxQty),
        notes: trxNotes || (trxType === 'in' ? 'Restock gudang' : 'Barang keluar')
      })
      setMessage(`✅ ${res.data.message}`)
      setTrxQty('')
      setTrxNotes('')
      fetchData() // Refresh tabel stok otomatis
    } catch (error: any) {
      alert('Gagal transaksi: ' + (error.response?.data?.message || 'Stok tidak cukup atau error server'))
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      {/* Navbar / Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-10 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-emerald-400 flex items-center gap-2">
            📦 TechNova <span className="text-sm font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded">Inventory Service</span>
          </h1>
        </div>
        <button 
          onClick={fetchData} 
          className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition"
        >
          🔄 Refresh Data
        </button>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Notifikasi Message */}
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex justify-between items-center animate-fade-in">
            <span>{message}</span>
            <button onClick={() => setMessage(null)} className="text-slate-400 hover:text-white font-bold">&times;</button>
          </div>
        )}

        {/* Grid Kontrol Top (Form Tambah Barang & Form Transaksi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Form 1: Tambah Katalog Barang */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-slate-200 border-b border-slate-700 pb-2">
              ➕ Tambah Katalog Barang Baru
            </h2>
            {categories.length === 0 ? (
              <div className="text-center py-6 bg-slate-900/50 rounded-lg border border-dashed border-slate-700">
                <p className="text-sm text-slate-400 mb-3">Belum ada Kategori Barang di database.</p>
                <button 
                  onClick={createDefaultCategory}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded font-medium transition shadow-md"
                >
                  Buat Kategori "Umum / Hardware" Sekarang
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddItem} className="space-y-4 text-sm">
                <div>
                  <label className="block text-slate-400 mb-1">Kategori</label>
                  <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Nama Barang</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Router Wi-Fi 6"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">SKU (Koding Unik)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. RTX-001"
                      value={newItemSku}
                      onChange={(e) => setNewItemSku(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Harga Satuan (Rp)</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2 rounded-lg transition shadow-lg shadow-emerald-900/20">
                  Simpan Barang
                </button>
              </form>
            )}
          </div>

          {/* Form 2: Transaksi Arus Stok (Masuk/Keluar) */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-slate-200 border-b border-slate-700 pb-2">
              🔄 Transaksi Arus Stok
            </h2>
            <form onSubmit={handleStockTransaction} className="space-y-4 text-sm">
              <div>
                <label className="block text-slate-400 mb-1">Pilih Barang</label>
                <select 
                  value={selectedItemId} 
                  onChange={(e) => setSelectedItemId(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Pilih Barang dari Gudang --</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} (Stok saat ini: {item.stock})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Jenis Transaksi</label>
                  <select 
                    value={trxType} 
                    onChange={(e) => setTrxType(e.target.value as 'in' | 'out')}
                    className={`w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 font-semibold focus:outline-none ${
                      trxType === 'in' ? 'text-emerald-400 border-emerald-500/50' : 'text-rose-400 border-rose-500/50'
                    }`}
                  >
                    <option value="in">📥 Stok Masuk (+)</option>
                    <option value="out">📤 Stok Keluar (-)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Jumlah (Qty)</label>
                  <input 
                    type="number" 
                    placeholder="10"
                    min="1"
                    value={trxQty}
                    onChange={(e) => setTrxQty(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Catatan / Keterangan</label>
                <input 
                  type="text" 
                  placeholder="e.g. Pembelian dari suplier / Pengiriman ke klien A"
                  value={trxNotes}
                  onChange={(e) => setTrxNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button 
                type="submit" 
                className={`w-full font-medium py-2 rounded-lg transition shadow-lg ${
                  trxType === 'in' 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20' 
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/20'
                }`}
              >
                {trxType === 'in' ? 'Proses Stok Masuk' : 'Proses Stok Keluar'}
              </button>
            </form>
          </div>

        </div>

        {/* Tabel Data Katalog & Stok Barang */}
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-700/80 flex justify-between items-center bg-slate-800/80">
            <h3 className="font-semibold text-slate-200 flex items-center gap-2">
              📋 Status Gudang & Katalog Barang
            </h3>
            <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full border border-slate-700">
              Total Item: {items.length}
            </span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent text-emerald-500 rounded-full mb-2"></div>
              <p>Mengambil data dari server AdonisJS...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <p className="text-lg font-medium mb-1">Gudang Masih Kosong</p>
              <p className="text-sm">Silakan gunakan form di atas untuk menambahkan katalog barang pertama Anda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-700 text-xs uppercase tracking-wider">
                    <th className="py-3 px-6">ID</th>
                    <th className="py-3 px-6">SKU</th>
                    <th className="py-3 px-6">Nama Barang</th>
                    <th className="py-3 px-6">Kategori</th>
                    <th className="py-3 px-6 text-right">Harga Satuan</th>
                    <th className="py-3 px-6 text-center">Stok Saat Ini</th>
                    <th className="py-3 px-6 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition duration-150">
                      <td className="py-3 px-6 font-mono text-slate-400">#{item.id}</td>
                      <td className="py-3 px-6 font-mono text-emerald-400 font-medium">{item.sku}</td>
                      <td className="py-3 px-6 font-semibold text-slate-200">{item.name}</td>
                      <td className="py-3 px-6 text-slate-400">
                        <span className="bg-slate-700/50 px-2 py-0.5 rounded text-xs border border-slate-600/50">
                          {item.category?.name || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right font-mono">
                        Rp {Number(item.price).toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 px-6 text-center font-bold text-base">
                        <span className={item.stock === 0 ? 'text-rose-400' : 'text-slate-100'}>
                          {item.stock}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        {item.stock === 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Habis / Kosong
                          </span>
                        ) : item.stock < 5 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Menipis
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Aman
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  )
}