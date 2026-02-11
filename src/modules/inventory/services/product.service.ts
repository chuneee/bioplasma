import api from "../../../shared/api/axios";
import { Product } from "../types/product.type";

export class ProductService {
  static async getProducts(): Promise<Product[]> {
    try {
      const { data } = await api.get("inventory");

      return data.data as Product[];
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  }

  static async createProduct(productData: Partial<Product>): Promise<Product> {
    const formData = new FormData();

    const { imagePath, ...rest } = productData;

    Object.entries(rest).forEach(([key, value]) => {
      if (
        value !== undefined &&
        value !== null &&
        key !== "imagePath" &&
        value !== undefined &&
        value !== ""
      ) {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value),
        );
      }
    });

    if (
      imagePath &&
      imagePath instanceof FileList &&
      imagePath[0] instanceof File &&
      imagePath.length > 0
    ) {
      formData.append("image", imagePath[0]);
    }

    try {
      const { data } = await api.post("inventory", formData);
      return data.data as Product;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }
  static async updateProduct(
    id: string,
    productData: Partial<Product>,
  ): Promise<Product> {
    try {
      const formData = new FormData();

      const { imagePath, hasExpiration, expirationDate, ...rest } = productData;

      Object.entries(rest).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          key !== "imagePath" &&
          value !== undefined &&
          value !== ""
        ) {
          formData.append(
            key,
            typeof value === "object" ? JSON.stringify(value) : String(value),
          );
        }
      });

      if (hasExpiration !== undefined) {
        // o
        formData.append("hasExpiration", hasExpiration ? "true" : "false");
      }

      if (hasExpiration !== undefined) {
        formData.append("expirationDate", String(expirationDate));
      }

      if (imagePath && imagePath instanceof File) {
        formData.append("image", imagePath);
      }

      const { data } = await api.patch(`inventory/${id}`, formData);
      return data.data as Product;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      await api.delete(`inventory/${id}`);
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }

  static async getProductById(id: string): Promise<Product> {
    try {
      const { data } = await api.get(`inventory/${id}`);
      return data.data as Product;
    } catch (error) {
      console.error("Error fetching product by ID:", error);
      throw error;
    }
  }
}
