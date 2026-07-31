/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'metrics.index': {
    methods: ["GET","HEAD"],
    pattern: '/metrics',
    tokens: [{"old":"/metrics","type":0,"val":"metrics","end":""}],
    types: placeholder as Registry['metrics.index']['types'],
  },
  'categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/categories',
    tokens: [{"old":"/api/categories","type":0,"val":"api","end":""},{"old":"/api/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.index']['types'],
  },
  'categories.store': {
    methods: ["POST"],
    pattern: '/api/categories',
    tokens: [{"old":"/api/categories","type":0,"val":"api","end":""},{"old":"/api/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.store']['types'],
  },
  'items.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/items',
    tokens: [{"old":"/api/items","type":0,"val":"api","end":""},{"old":"/api/items","type":0,"val":"items","end":""}],
    types: placeholder as Registry['items.index']['types'],
  },
  'items.store': {
    methods: ["POST"],
    pattern: '/api/items',
    tokens: [{"old":"/api/items","type":0,"val":"api","end":""},{"old":"/api/items","type":0,"val":"items","end":""}],
    types: placeholder as Registry['items.store']['types'],
  },
  'stock_transactions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/transactions',
    tokens: [{"old":"/api/transactions","type":0,"val":"api","end":""},{"old":"/api/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['stock_transactions.index']['types'],
  },
  'stock_transactions.store': {
    methods: ["POST"],
    pattern: '/api/transactions',
    tokens: [{"old":"/api/transactions","type":0,"val":"api","end":""},{"old":"/api/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['stock_transactions.store']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
