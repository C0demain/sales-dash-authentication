import NotFoundError from '../exceptions/NotFound';
import { Users } from '../models/Users';
import { Products } from './../models/Products';
import { SellsRepo } from './SellsRepo';

interface IProductRepo {
  save(Products: Products): Promise<void>;
  update(Products: Products): Promise<void>;
  delete(ProductId: number): Promise<void>;
  getById(ProductsId: number): Promise<Products | null>;
  getAll(userId: number): Promise<Products[]>;
}

export class ProductsRepo implements IProductRepo {

  async save(products: Products): Promise<void> {
    try {
      await Products.create({
        id: parseInt(await Products.max('id')) + 1,
        name: products.name
      });
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create Product!");
    }
  }

  async delete(ProductId: number): Promise<void> {
    try {
      //  find existing products
      const newProduct = await Products.findByPk(ProductId)

      if (!newProduct) throw new NotFoundError(`Product with id '${ProductId}' not found`);

      // delete
      await newProduct.destroy();
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to delete Product!");
    }
  }

  async getById(ProductId: number): Promise<Products> {
    try {
      //  find existing Products
      const newProduct = await Products.findByPk(ProductId)

      if (!newProduct) throw new NotFoundError(`Product with id '${ProductId}' not found`);

      return newProduct;
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to fetch product data!");
    }
  }

  async getAll(userId: number | undefined): Promise<Products[]> {
    try {
      if (userId !== undefined) {
        const user = await Users.findByPk(userId)
        if (!user) {
          console.log("User not found");
          throw new NotFoundError(`User with id '${userId}' not found`);
        }

        const sales = await new SellsRepo().getFiltered({ userId })
        const userProducts = await Promise.all(sales.map(async sale => {
          return await this.getById(sale.productId)
        }))

        return userProducts;
      } else {
        return await Products.findAll()
      }
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to fetch all data!");
    }
  }

  async update(product: Products): Promise<void> {
    try {
      const newProduct = await Products.findByPk(product.id)
      if (!newProduct) throw new NotFoundError(`Product with id '${product.id}' not found`);

      await product.save()
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      else throw new Error("Failed to update data!");
    }
  }
}
