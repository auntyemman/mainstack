import { QueryOptions } from 'mongoose';
import { BaseRepository } from '../../common/configs/base.repository';
import { paginate, PaginationResult } from '../../common/utils/pagination';
import { IInventory, Inventory } from './inventory.model';

// Inventory Repository class
export class InventoryRepository extends BaseRepository<IInventory> {
  private readonly inventoryModel;
  constructor() {
    super(Inventory);
    this.inventoryModel = Inventory;
  }

  async findMany(
    query: QueryOptions,
    limit: number,
    page: number,
  ): Promise<PaginationResult<IInventory>> {
    const offset = (page - 1) * limit;
    // Using the paginate utility function
    return paginate(this.inventoryModel, query, limit, offset);
  }
}
