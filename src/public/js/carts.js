
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

const splitTextIntoLines = (text, maxLength) => {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (const word of words) {
      if (currentLine.length + word.length <= maxLength) {
        currentLine += (currentLine.length > 0 ? " " : "") + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    return lines;
}

const generateTicket = (ticket) => {
    const { code, purchase_datetime, products, amount, purchaser} = ticket
    const title = "Fed-Tech";
    const purchaseDate = new Date(purchase_datetime).toLocaleString();

    let ticketContent = `=== ${title} ===\n\n`;
    ticketContent += `Código: ${code}\n`;
    ticketContent += `Fecha de Compra: ${purchaseDate}\n`;
    ticketContent += `Comprador: ${purchaser}\n`;
    ticketContent += "---------------------------------\n";
    ticketContent += "Productos    Monto     Cant    Total\n";
    ticketContent += "---------------------------------\n";
    products.forEach((product) => {
        const productNameLines = splitTextIntoLines(product.pid.title, 12);
        const formattedPrice = `$${product.pid.price.toFixed(2)}`;
        const formattedQuantity = product.quantity.toString();
        const formattedTotal = `$${(product.pid.price * product.quantity).toFixed(2)}`;

        for (let i = 0; i < productNameLines.length; i++) {
            const line = productNameLines[i];
            const isLastLine = i === productNameLines.length - 1;
            const formattedProductName = isLastLine ? line.padEnd(12) : line;
            const formattedPriceColumn = isLastLine ? formattedPrice.padEnd(9) : "";
            const formattedQuantityColumn = isLastLine ? formattedQuantity.padEnd(5) : "";
            const formattedTotalColumn = isLastLine ? formattedTotal : "";
            ticketContent += `${formattedProductName} ${formattedPriceColumn} ${formattedQuantityColumn} ${formattedTotalColumn}\n`;
        }
    });
    ticketContent += "---------------------------------\n";
    ticketContent += `Total${"".padEnd(30)} $${amount.toFixed(2)}`;
    
    return ticketContent;
}

const printTicket = (ticket) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Ticket de Compra</title>
        </head>
        <body>
            <pre style="white-space: pre-line;">${ticket}</pre>
        </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
};

const buyToCart = async () => {
    try {
        let cid = cart.id;
        let response = await fetch(`/api/carts/${cid}/purchase`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        });
        let data = await response.json();
        let statusResponse = data.status;
        if (statusResponse !== "success") {
            return Swal.fire({
                icon: "error",
                title: "Ups...",
                text: `El carrito no pudo ser comprado`,
            });
        }
        const ticket = generateTicket(data.payload)
        Swal.fire({
            title: `Compra realizada`,
            icon: "success",
            html: `<pre style="text-align: left; white-space: pre-line;">${ticket}</pre>`,
            showCancelButton: true,
            confirmButtonText: 'OK',
            cancelButtonText: 'Imprimir',
        }).then((result) => {
            if (result.isConfirmed) {
                location.reload();
            } else if (result.dismiss === 'cancel') {
                printTicket(ticket);
                location.reload();
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

    if (target.classList.contains("buy-to-cart")) {
        buyToCart();
    }
});


