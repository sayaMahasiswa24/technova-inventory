import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'items.index': { paramsTuple?: []; params?: {} }
    'items.store': { paramsTuple?: []; params?: {} }
    'stock_transactions.index': { paramsTuple?: []; params?: {} }
    'stock_transactions.store': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'categories.index': { paramsTuple?: []; params?: {} }
    'items.index': { paramsTuple?: []; params?: {} }
    'stock_transactions.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'categories.index': { paramsTuple?: []; params?: {} }
    'items.index': { paramsTuple?: []; params?: {} }
    'stock_transactions.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'categories.store': { paramsTuple?: []; params?: {} }
    'items.store': { paramsTuple?: []; params?: {} }
    'stock_transactions.store': { paramsTuple?: []; params?: {} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}