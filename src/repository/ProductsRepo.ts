import NotFoundError from '../exceptions/NotFound';
import { Products } from './../models/Products';

interface IProductRepo {
  save(Products: Products): Promise<void>;
  update(Products: Products): Promise<void>;
  delete(ProductId: number): Promise<void>;
  getById(ProductsId: number): Promise<Products|null>;
  getAll(): Promise<Products[]>;
}

export class ProductsRepo implements IProductRepo {

  async save(products: Products): Promise<void> {
    try {
      await Products.create({
        name: products.name,
        description: products.description,
        value: products.value

      });
    } catch (error) {
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
      if(error instanceof NotFoundError) throw error
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
      if(error instanceof NotFoundError) throw error
      else throw new Error("Failed to fetch product data!");
    }
  }

  async getAll(): Promise<Products[]> {
    try {
      return await Products.findAll();
    } catch (error) {
      throw new Error("Failed to feacth all data!");
    }
  }

  async update(Product: Products): Promise<void> {
    try{
      const newProduct = await Products.findByPk(Product.id)
      if(!newProduct) throw new NotFoundError(`Product with id '${Product.id}' not found`);
      
      await Product.save()
    }catch(error){
      if(error instanceof NotFoundError) throw error
      else throw new Error("Failed to update data!");
    }
  }
}
