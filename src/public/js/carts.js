
const cart = document.querySelector(".cart");

const delToCart = async (pid) => {
    try {
        let cid = cart.id;
        let response = await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        });
        let data = await response.json();
        let statusResponse = data.status;
        if (statusResponse !== "success") {
            return Swal.fire({
                icon: "error",
                title: "Ups...",
                text: `El producto no pudo ser eliminado`,
            });
        }
        Swal.fire({
            text: `Producto eliminado`,
            toast: true,
            position: "top-right",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
        });
        location.reload();
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Ups...",
            text: `Ocurrió un error: ${error} ${error.message}`,
        });
    }
};

const updateQuantity = async (cid, pid, quantity) => {
    try {
        let response = await fetch(`/api/carts/${cid}/products/${pid}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ quantity }) // Send the updated quantity in the request body
        });
        
        let data = await response.json();
        let statusResponse = data.status;
        
        if (statusResponse !== "success") {
            return Swal.fire({
                icon: "error",
                title: "Ups...",
                text: `El producto no pudo ser actualizado`,
            });
        }
        
        Swal.fire({
            text: `Producto actualizado`,
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

const decreaseQuantity = (input) => {
    let currentQuantity = parseInt(input.value);
    if (currentQuantity > 1) {
        currentQuantity--;
        input.value = currentQuantity;
    }
};

const increaseQuantity = (input) => {
    let currentQuantity = parseInt(input.value);
    currentQuantity++;
    input.value = currentQuantity;
};

const validateQuantityInput = (input) => {
    let currentQuantity = parseInt(input.value);
    if (isNaN(currentQuantity) || currentQuantity <= 0) {
        input.value = 1;
    }
};

document.addEventListener("input", async (event) => {
    const target = event.target;

    if (target.classList.contains("quantity-input")) {
        validateQuantityInput(target);
        
        const container = target.closest(".product");
        const cid = cart.id;
        const pid = container.getAttribute("id");
        const quantity = parseInt(target.value);
        await updateQuantity(cid, pid, quantity);
    }
});

document.addEventListener("click", async (event) => {
    const target = event.target;

    if (target.classList.contains("decrease-button")) {
        const input = target.closest(".product").querySelector(".quantity-input");
        decreaseQuantity(input);
        validateQuantityInput(input);

        const container = target.closest(".product");
        const cid = cart.id;
        const pid = container.getAttribute("id");
        const quantity = parseInt(input.value);
        await updateQuantity(cid, pid, quantity);
    }

    if (target.classList.contains("increase-button")) {
        const input = target.closest(".product").querySelector(".quantity-input");
        increaseQuantity(input);
        validateQuantityInput(input);

        const container = target.closest(".product");
        const cid = cart.id;
        const pid = container.getAttribute("id");
        const quantity = parseInt(input.value);
        await updateQuantity(cid, pid, quantity);
    }

    if (target.classList.contains("del-to-cart")) {
        const container = target.closest(".product");
        const pid = container.getAttribute("id");
        delToCart(pid);
    }
});


