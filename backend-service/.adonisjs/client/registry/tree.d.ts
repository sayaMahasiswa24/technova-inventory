/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  categories: {
    index: typeof routes['categories.index']
    store: typeof routes['categories.store']
  }
  items: {
    index: typeof routes['items.index']
    store: typeof routes['items.store']
  }
  stockTransactions: {
    index: typeof routes['stock_transactions.index']
    store: typeof routes['stock_transactions.store']
  }
}
