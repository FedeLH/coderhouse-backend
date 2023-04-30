const socket = io();
const productList = document.getElementById("product-list");

const createHtmlProduct = (product) => {
  const deleteButton = document.createElement("button");
  deleteButton.dataset["productId"] = product.id;
  deleteButton.classList.add("delete-product");
  deleteButton.innerText = "Eliminar producto";
  deleteButton.addEventListener("click", (_) => {
    const productId = deleteButton.dataset.productId;
    socket.emit("delete-product", productId);
  });

  const addToCartButton = document.createElement("button");
  addToCartButton.dataset["productId"] = product.id;
  addToCartButton.classList.add("add-to-cart");
  addToCartButton.innerText = "Añadir al carrito";

  const productElement = document.createElement("div");
  productElement.classList.add("product");
  productElement.innerHTML = `
        <img src=${product.thumbnails[0]} alt="Imagen del producto">
        <h2>${product.title}</h2>
        <p class="description">${product.description}</p>
        <p>Precio: ${product.price}</p>
        <p>Stock:${product.stock}</p>
    `;
  productElement.appendChild(deleteButton);
  productElement.appendChild(addToCartButton);

  return productElement;
};

document.querySelectorAll(".delete-product").forEach((button) => {
  button.addEventListener("click", (_) => {
    const productId = button.dataset.productId;
    socket.emit("delete-product", productId);
  });
});

socket.on("update-products", (products) => {
  productList.innerHTML = "";
  products.forEach((product) => {
    productList.appendChild(createHtmlProduct(product));
  });
});

socket.on("add-new-product", (product) => {
  productList.appendChild(createHtmlProduct(product));
});

document
  .querySelector("#add-product-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    const response = await fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    });
  });
