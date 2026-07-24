import router from '@adonisjs/core/services/router'
const CategoriesController = () => import('#controllers/categories_controller')
const ItemsController = () => import('#controllers/items_controller')
const StockTransactionsController = () => import('#controllers/stock_transactions_controller')
const MetricsController = () => import('#controllers/metrics_controller')

router.get('/metrics', [MetricsController, 'index'])

router.get('/', async () => {
  return { 
    message: 'Welcome to TechNova Inventory API Service 🚀', 
    version: '1.0.0',
    status: 'Running' 
  }
})

router.get('/health', async () => {
  return { status: 'OK', uptime: process.uptime(), timestamp: new Date() }
})

router.group(() => {
  router.get('/categories', [CategoriesController, 'index'])
  router.post('/categories', [CategoriesController, 'store'])

  router.get('/items', [ItemsController, 'index'])
  router.post('/items', [ItemsController, 'store'])

  router.get('/transactions', [StockTransactionsController, 'index'])
  router.post('/transactions', [StockTransactionsController, 'store'])
}).prefix('/api')