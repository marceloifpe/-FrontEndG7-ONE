// Oracle ONE G7 - Challenge AluraGeek | Development by Lucas Elias Dickmann
// script.js

import { fetchProducts, createProduct, deleteProduct } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const addButton = document.querySelector(".button-add");
  const cleanButton = document.querySelector(".button-clean");
  const nameInput = document.querySelector(".input-name");
  const valueInput = document.querySelector(".input-value");
  const fileInput = document.querySelector(".input-file");
  const productsContainer = document.querySelector(".products-container");

  async function loadProducts() {
    const products = await fetchProducts();
    let currentColumn;

    products.forEach((product, index) => {
      if (index % 3 === 0) {
        currentColumn = document.createElement("div");
        currentColumn.classList.add("products-columns");
        productsContainer.appendChild(currentColumn);
      }

      const productCard = document.createElement("div");
      productCard.classList.add("product-card");

      productCard.innerHTML = `
        <div class="container-img">
          <img src="${product.image}" alt="${product.name}" />
        </div>
        <div class="title-product">${product.name}</div>
        <div class="container-value">
          <div class="value">$ ${product.value}</div>
          <img class="icon-trash" src="./icons/lixeira.svg" data-id="${product.id}" />
        </div>
      `;

      currentColumn.appendChild(productCard);
    });

    document.querySelectorAll(".icon-trash").forEach((icon) => {
      icon.addEventListener("click", async (event) => {
        const productId = event.target.getAttribute("data-id");
        const confirmation = confirm(
          "Você tem certeza que deseja excluir este produto?"
        );
        if (confirmation) {
          await deleteProduct(productId);
          event.target.closest(".product-card").remove();
        }
      });
    });
  }

  await loadProducts();

  addButton.addEventListener("click", async () => {
    const productName = nameInput.value;
    const productValue = valueInput.value;
    const productImage = fileInput.files[0];

    if (productName && productValue && productImage) {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const productData = {
          name: productName,
          value: productValue,
          image: e.target.result,
        };

        const products = await fetchProducts();
        let nextId = 1;
        if (products.length > 0) {
          const lastProduct = products[products.length - 1];
          nextId = parseInt(lastProduct.id, 10) + 1;
        }
        productData.id = nextId.toString();

        const newProduct = await createProduct(productData);
        if (newProduct) {
          const productCard = document.createElement("div");
          productCard.classList.add("product-card");

          productCard.innerHTML = `
            <div class="container-img">
              <img src="${newProduct.image}" alt="${newProduct.name}" />
            </div>
            <div class="title-product">${newProduct.name}</div>
            <div class="container-value">
              <div class="value">$ ${newProduct.value}</div>
              <img class="icon-trash" src="./icons/lixeira.svg" data-id="${newProduct.id}" />
            </div>
          `;

          productsContainer.appendChild(productCard);

          nameInput.value = "";
          valueInput.value = "";
          fileInput.value = "";

          productCard
            .querySelector(".icon-trash")
            .addEventListener("click", async (event) => {
              const productId = event.target.getAttribute("data-id");
              const confirmation = confirm(
                "Você tem certeza que deseja excluir este produto?"
              );
              if (confirmation) {
                await deleteProduct(productId);
                event.target.closest(".product-card").remove();
              }
            });
        } else {
          console.error("Erro ao adicionar produto");
        }
      };

      reader.readAsDataURL(productImage);
    } else {
      alert("Por favor, preencha todos os campos!");
    }
  });

  cleanButton.addEventListener("click", () => {
    console.log("Botão limpar clicado");
    nameInput.value = "";
    valueInput.value = "";
    fileInput.value = "";
  });
});
