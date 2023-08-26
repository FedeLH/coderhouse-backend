let url = window.location.href;
let urlObj = new URL(url);
let searchParams = urlObj.searchParams;
let sort = document.getElementById("sort");
let category = document.getElementById("category");
let state = document.getElementById("status");

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

const updateUser = async (uid, updatedData) => {
    try {
      let response = await fetch(`/api/users/${uid}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updatedData)
      });
      let data = await response.json();
      let statusResponse = data.status;
      if (statusResponse !== "success") {
        return Swal.fire({
          icon: "error",
          title: "Ups...",
          text: `El usuario no pudo ser actualizado`,
        });
      }
      Swal.fire({
        text: `Usuario actualizado`,
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

const lookUser = async (uid) => {
  try {
    let response = await fetch(`/api/users/${uid}`, {
      method: "GET",
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

    const { first_name, last_name, email, gender, password, status, role } = data.payload[0];
    const validRoles = ["admin", "premium", "user"];
    const roleSelectOptions = validRoles
    .map(validRole => `<option value="${validRole}" ${role === validRole ? 'selected' : ''}>${validRole}</option>`)
    .join('');

    const formHTML = `
    <form id="userUpdateForm">
        <input type="text" name="first_name" value="${first_name}" placeholder="First Name">
        <input type="text" name="last_name" value="${last_name}" placeholder="Last Name">
        <input type="email" name="email" value="${email}" placeholder="Email">
        <input type="text" name="gender" value="${gender}" placeholder="Gender">
        <label>Status: <input type="checkbox" name="status" ${status ? 'checked' : ''}></label>
        <select name="role">${roleSelectOptions}</select>
    </form>
    `;

    Swal.fire({
        title: 'Modificar usuario',
        html: formHTML,
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Modificar usuario',
        preConfirm: () => {
            const formData = {
                first_name: document.querySelector('input[name="first_name"]').value,
                last_name: document.querySelector('input[name="last_name"]').value,
                email: document.querySelector('input[name="email"]').value,
                gender: document.querySelector('input[name="gender"]').value,
                status: document.querySelector('input[name="status"]').checked,
                role: document.querySelector('select[name="role"]').value
            };
            return formData;
        }
    }).then(result => {
        if (result.isConfirmed) {
            const updatedData = result.value;
            updateUser(uid, updatedData);
        }
    });
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Ups...",
      text: `Ocurrió un error: ${error} ${error.message}`,
    });
  }
};

const deleteUser = async (uid) => {
  try {
    let response = await fetch(`/api/users/${uid}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    let data = await response.json();
    let statusResponse = data.status;
    if (statusResponse !== "success") {
      return Swal.fire({
        icon: "error",
        title: "Ups...",
        text: `El usuario no pudo ser eliminado`,
      });
    }
    Swal.fire({
      text: `Usuario eliminado`,
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

const deleteUsers = async () => {
  try {
    let response = await fetch(`/api/users`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
    });
    if (!response.ok) {
      console.error("Error deleting users:", response.status, response.statusText);
    } else {
      let data = await response.json();
      let statusResponse = data.status;
      if (statusResponse !== "success") {
        return Swal.fire({
          icon: "error",
          title: "Ups...",
          text: `Los usuarios no pudieron ser eliminados ${JSON.stringify(response)}`,
        });
      }
      Swal.fire({
        text: data.message,
        toast: true,
        position: "top-right",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      setTimeout(() => {
        location.reload();
      }, 1500);
    }
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

  if (target.classList.contains("look-user")) {
    const container = target.closest(".user");
    const uid = container.getAttribute("id");
    lookUser(uid);
  }

  if (target.classList.contains("del-user")) {
    const container = target.closest(".user");
    const uid = container.getAttribute("id");
    deleteUser(uid);
  }

  if (target.classList.contains("del-users")) {
    deleteUsers();
  }
});