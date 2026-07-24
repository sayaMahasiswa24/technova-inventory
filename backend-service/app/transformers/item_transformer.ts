import { BaseTransformer } from '@adonisjs/core/transformers'
import Item from '#models/item'

export default class ItemTransformer extends BaseTransformer<Item> {
  toObject() {
    return this.pick(this.resource, ['id'])
  }
}