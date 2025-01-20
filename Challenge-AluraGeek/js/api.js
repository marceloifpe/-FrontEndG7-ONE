// Oracle ONE G7 - Challenge AluraGeek | Development by Lucas Elias Dickmann
// API

const API_URL = "http://localhost:3000/products";

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Erro ao buscar produtos");
    }
    const products = await response.json();
    return products;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return [];
  }
}

async function createProduct(productData) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      throw new Error("Erro ao adicionar produto");
    }
    const product = await response.json();
    return product;
  } catch (error) {
    console.error("Erro ao adicionar produto:", error);
    return null;
  }
}

async function deleteProduct(productId) {
  try {
    const response = await fetch(`${API_URL}/${productId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Erro ao deletar produto");
    }
  } catch (error) {
    console.error("Erro ao deletar produto:", error);
  }
}

export { fetchProducts, createProduct, deleteProduct };
