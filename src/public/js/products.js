let url = window.location.href;
let urlObj = new URL(url);
let searchParams = urlObj.searchParams;
let sort = document.getElementById("sort");
let category = document.getElementById("category");
let state = document.getElementById("status");
// let buttons = document.querySelectorAll(".add-to-cart");
let cart = document.querySelector(".cart");

const findIndex = (valueToFind, options) => {
  for (let i = 0; i < options.length; i++) {
    if (options[i].value === valueToFind) {
      return i;
    }
  }
};

if (searchParams.has("sort")) {
  sort.selectedIndex = findIndex(searchParams.get("sort"), sort.options);
}

if (searchParams.has("query")) {
  queryObj = JSON.parse(searchParams.get("query"));
  let valueStatus = queryObj.status ?? "none";
  state.selectedIndex = findIndex(valueStatus, state.options);
  let valueCategory = queryObj.category ?? "none";
  category.selectedIndex = findIndex(valueCategory, category.options);
}

const changeOptions = (select) => {
  let value = select.options[select.selectedIndex].value;
  if (searchParams.has(select.name)) {
    if (value === "none") {
      if (select.name === "query") {
        queryObj = JSON.parse(searchParams.get("query"));
        delete queryObj[select.id];
        if (Object.keys(queryObj).length > 0) {
          value = JSON.stringify(queryObj);
          searchParams.set(select.name, value);
        } else {
          searchParams.delete("query");
        }
      } else {
        searchParams.delete(select.name);
      }
    } else {
      if (select.name === "query") {
        queryObj = JSON.parse(searchParams.get("query"));
        queryObj = { ...queryObj, [select.id]: value };
        value = JSON.stringify(queryObj);
      }
      searchParams.set(select.name, value);
    }
  } else {
    if (select.name === "query") {
      queryObj = JSON.parse(searchParams.get("query"));
      queryObj = { ...queryObj, [select.id]: value };
      value = JSON.stringify(queryObj);
    }
    searchParams.set(select.name, value);
  }
  if (searchParams.toString().length > 0) {
    window.location.href =
      urlObj.origin + urlObj.pathname + "?" + searchParams.toString();
  } else {
    window.location.href = urlObj.origin + urlObj.pathname;
  }
};

const changePage = (page) => {
  if (searchParams.has("page")) searchParams.delete("page");
  if (searchParams.toString().length > 0) {
    window.location.href =
      urlObj.origin +
      urlObj.pathname +
      "?page=" +
      page +
      "&" +
      searchParams.toString();
  } else {
    window.location.href = urlObj.origin + urlObj.pathname + "?page=" + page;
  }
};

const addToCart = async (pid) => {
  try {
    let cid = cart.id;
    let response = await fetch(`/api/carts/${cid}/products/${pid}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
    });
    let data = await response.json();
    let statusResponse = data.status;
    if (statusResponse !== "success") {
      return Swal.fire({
        icon: "error",
        title: "Ups...",
        text: `El producto no pudo ser agregado`,
      });
    }
    Swal.fire({
      text: `Producto agregado`,
      toast: true,
      position: "top-right",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Ups...",
      text: `Ocurrió un error: ${error} ${error.message}`,
    });
  }
};

const delProduct = async (pid) => {
  try {
    let response = await fetch(`/api/products/${pid}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    let data = await response.json();
    let statusResponse = data.status;
    if (statusResponse !== "success") {
      return Swal.fire({
        icon: "error",
        title: "Ups...",
        text: `El producto no pudo ser borrado`,
      });
    }
    Swal.fire({
      text: `Producto borrado`,
      toast: true,
      position: "top-right",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    setTimeout(() => {
      location.reload();
    }, 1500);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Ups...",
      text: `Ocurrió un error: ${error} ${error.message}`,
    });
  }
};

const recoveryProduct = async (pid) => {
  try {
    const dataBody = { status: true };
    let response = await fetch(`/api/products/${pid}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(dataBody)
    });
    let data = await response.json();
    let statusResponse = data.status;
    if (statusResponse !== "success") {
      return Swal.fire({
        icon: "error",
        title: "Ups...",
        text: `El producto no pudo ser recuperado`,
      });
    }
    Swal.fire({
      text: `Producto habilitado`,
      toast: true,
      position: "top-right",
      icon: "success",
      showConfirmButton: false,
      timer: 1500,
    });
    setTimeout(() => {
      location.reload();
    }, 1500);
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Ups...",
      text: `Ocurrió un error: ${error} ${error.message}`,
    });
  }
};

document.addEventListener("click", async (event) => {
  const target = event.target;

  if (target.classList.contains("login")) {
    window.location.href = "/login";
  }

  if (target.classList.contains("recovery-product")) {
    const container = target.closest(".product");
    const pid = container.getAttribute("id");
    recoveryProduct(pid);
  }

  if (target.classList.contains("del-product")) {
      const container = target.closest(".product");
      const pid = container.getAttribute("id");
      delProduct(pid);
  }

  if (target.classList.contains("add-to-cart")) {
    const container = target.closest(".product");
    const pid = container.getAttribute("id");
    addToCart(pid);
  }
});