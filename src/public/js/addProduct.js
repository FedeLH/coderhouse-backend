document
  .querySelector("#add-product-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    fetch("/api/products", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "content-type": "application/json" },
    })
        .then(response => {
            if(response.status === 404) return response.json()
            if(!response.ok) throw new Error("Error HTTP: " + response.status)
            return response.json()
        })
        .then( data => {
            if(data.status === 'error') throw new Error(data.payload.message)
            console.log(JSON.stringify(data.payload))
            Swal.fire({
                text: `El producto ${data.payload.title} se creo correctamente`,
                icon: 'success',
                title: '¡Bien!'
            }).then(_ => window.location.replace('/products'));
        })
        .catch(error => Swal.fire({
            text: `No se pudo crear el producto. ${error.message}`,
            icon: 'error',
            title: 'Ups...'
        }))
  });