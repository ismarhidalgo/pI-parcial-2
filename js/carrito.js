class Carrito {
  constructor() {
    this.productos = [];
    this.cargarDesdeLocalStorage();
  }

  guardarEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(this.productos));
  }

  cargarDesdeLocalStorage() {
    const datos = localStorage.getItem("carrito");
    if (datos) {
      this.productos = JSON.parse(datos);
      this.mostrarCarrito();
    }
  }

    mostrarModal(producto) {
  const modalBody = document.querySelector(".modal-content .modal-body");

  if (modalBody) {
    modalBody.innerHTML = "";

    const productDiv = document.createElement("div");
    productDiv.classList.add("d-flex", "flex-column", "align-items-center", "text-center");

    const productImg = document.createElement("img");
    productImg.alt = producto.nombre;
    productImg.src = producto.imagen;
    productImg.style.width = "150px";
    productImg.style.height = "150px";
    productImg.classList.add("mb-3", "img-fluid");

    const productNombre = document.createElement("h2");
    productNombre.textContent = producto.nombre;

    const productDescripcion = document.createElement("p");
    productDescripcion.textContent = producto.descripcion;

    const productPrecio = document.createElement("p");
    productPrecio.textContent = `$${producto.precio}`;

    const btnAgregar = document.createElement("button");
    btnAgregar.textContent = "Agregar al carrito";
    btnAgregar.className = "btnSec";
    btnAgregar.onclick = () => {
      this.agregarProducto(producto);
      /*document.getElementById("modalCarrito").style.display = "none";*/
    };

    const btnCerrar = document.createElement("button");
    btnCerrar.textContent = "Cerrar";
    btnCerrar.className = "btn btn-success m-2";
    btnCerrar.onclick = () => {
      document.getElementById("modalCarrito").style.display = "none";
    };

    /* */

    const cerrarModalBtnX = document.getElementById("closeModal");
    if (cerrarModalBtnX) {
      cerrarModalBtnX.onclick = () => {
        const modal = document.getElementById("modalCarrito");
        modal.style.display = "none";
      };
    }

    productDiv.appendChild(productNombre);
    productDiv.appendChild(productImg);
    productDiv.appendChild(productDescripcion);
    productDiv.appendChild(productPrecio);
    productDiv.appendChild(btnAgregar);
    productDiv.appendChild(btnCerrar);

    modalBody.appendChild(productDiv);

    const modal = document.getElementById("modalCarrito");
    modal.style.display = "block";

    window.onclick = (event) => {
      if (event.target === modal) modal.style.display = "none";
    };
  }
}

  agregarProducto(producto) {
    const productoExistente = this.productos.find((p) => p.id === producto.id);
    if (productoExistente) {
      if (productoExistente.cantidad < producto.stock) {
        productoExistente.cantidad += 1;
      } else {
        this.mostrarAlertaStock(producto);
        return;
      }
    } else {
      producto.cantidad = 1;
      this.productos.push(producto);
    }
    this.guardarEnLocalStorage();
    this.mostrarCarrito();
    this.actualizarStockVisual(producto.id);
  }

  eliminarProducto(id) {
    const producto = this.obtenerProducto(id);
    this.productos = this.productos.filter((p) => p.id !== id);
    this.guardarEnLocalStorage();
    this.mostrarCarrito();
    if (producto) {
      this.actualizarStockVisual(id);
    }
  }

  restarProducto(id) {
    const producto = this.productos.find((p) => p.id === id);
    if (producto) {
      producto.cantidad -= 1;
      if (producto.cantidad <= 0) {
        this.eliminarProducto(id);
      } else {
        this.guardarEnLocalStorage();
        this.mostrarCarrito();
        this.actualizarStockVisual(id);
      }
    }
  }

  sumarProducto(id) {
    const producto = this.productos.find((p) => p.id === id);
    if (producto) {
      if (producto.cantidad < producto.stock) {
        producto.cantidad += 1;
        this.guardarEnLocalStorage();
        this.mostrarCarrito();
        this.actualizarStockVisual(id);
      } else {
        this.mostrarAlertaStock(producto);
      }
    }
  }

  mostrarAlertaStock(producto) {
    const alertasContainer = document.getElementById("alertas-container");
    if (!alertasContainer) return;

    const alerta = document.createElement("div");
    alerta.className = "alert alert-warning alert-dismissible fade show";
    alerta.role = "alert";
    alerta.innerHTML = `
      <strong>${producto.nombre}</strong>: No se puede agregar más cantidad. Stock máximo (${producto.stock}) alcanzado.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    `;
    alertasContainer.appendChild(alerta);

    setTimeout(() => {
      alerta.classList.remove("show");
      alerta.classList.add("hide");
      setTimeout(() => alerta.remove(), 500);
    }, 4000);
  }

  obtenerProducto(id) {
    return this.productos.find((p) => p.id === id);
  }

  mostrarCarrito() {
  const offcanvasBody = document.querySelector(".offcanvas-body");

  if (offcanvasBody) {
    offcanvasBody.innerHTML = "";
    let totalProductos = 0;

    const productosConCantidad = this.productos.filter(p => p.cantidad > 0);

    if (productosConCantidad.length > 0) {
      productosConCantidad.forEach((producto) => {
        const { nombre, imagen, cantidad, precio } = producto;

        const productDiv = document.createElement("div");
        productDiv.className = "carrito-item";

        const productImg = document.createElement("img");
        productImg.src = imagen;
        productImg.alt = nombre;

        const infoDiv = document.createElement("div");
        infoDiv.className = "info";
        infoDiv.innerHTML = `
          <strong>${nombre}</strong><br>
          ${cantidad} x $${precio.toFixed(2)}<br>
          <span>Total: $${(precio * cantidad).toFixed(2)}</span>
        `;

        const btnSumar = document.createElement("button");
        btnSumar.textContent = "➕";
        btnSumar.className = "carrito-btn sumar";
        btnSumar.onclick = () => this.sumarProducto(producto.id);

        const btnRestar = document.createElement("button");
        btnRestar.textContent = "➖";
        btnRestar.className = "carrito-btn restar";
        btnRestar.onclick = () => this.restarProducto(producto.id);

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "🗑️";
        btnEliminar.className = "carrito-btn eliminar";
        btnEliminar.onclick = () => this.eliminarProducto(producto.id);

        productDiv.appendChild(productImg);
        productDiv.appendChild(infoDiv);
        productDiv.appendChild(btnSumar);
        productDiv.appendChild(btnRestar);
        productDiv.appendChild(btnEliminar);
        offcanvasBody.appendChild(productDiv);
      });

      totalProductos = productosConCantidad.reduce(
        (acum, producto) => acum + producto.cantidad,
        0
      );
    } else {
      const emptyMessage = document.createElement("p");
      emptyMessage.textContent = "El carrito está vacío";
      offcanvasBody.appendChild(emptyMessage);
    }

    const productosCantidad = document.querySelector("#productos-total-WEB");
    if (productosCantidad) {
      productosCantidad.innerText = `Productos: ${totalProductos}`;
    }

    const contadorCarrito = document.querySelector("#contador-carrito");
    if (contadorCarrito) {
      contadorCarrito.innerText = totalProductos;
    }

    const total = this.calcularTotal();

    const totalElement = document.querySelector("#carrito-total");
    const totalWebElement = document.querySelector("#carrito-total-WEB");

    if (totalElement) totalElement.innerText = `Total: $${total}`;
    if (totalWebElement) totalWebElement.innerText = `Total: $${total}`;
  }
}

  actualizarStockVisual(id) {
    const producto = this.obtenerProducto(id);
    const stockSpan = document.querySelector(`#stock-${id}`);
    if (producto && stockSpan) {
      const stockRestante = producto.stock - producto.cantidad;
      stockSpan.innerText = `Stock: ${stockRestante}`;
    } else if (!producto && stockSpan) {
      const stockOriginal = parseInt(stockSpan.dataset.originalStock);
      stockSpan.innerText = `Stock: ${stockOriginal}`;
    }
  }

  calcularTotal() {
    return this.productos
      .reduce(
        (total, producto) => total + producto.precio * producto.cantidad,
        0
      )
      .toFixed(2);
  }

  vaciarCarrito() {
    this.productos = [];
    this.guardarEnLocalStorage();
    this.mostrarCarrito();
  }

  confirmarCompra() {
    const form = document.getElementById("formCompra");
    const modalBody = document.querySelector("#modalCompra .modal-body");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const total = this.calcularTotal();
      if (total > 0) {
        modalBody.innerHTML = `
  <div class="mensaje-confirmacion">
    <h5>¡Gracias por tu compra!</h5>
    <p>Total pagado: <strong>$${total}</strong></p>
    <p>Recibirás un correo con los detalles de tu pedido.</p>
    <p>Ante cualquier duda, no dudes en contactarnos.</p>
  </div>
`;

document.querySelector("#modalCompra .modal-footer").style.display = "none";

        this.vaciarCarrito();
        form.reset();
      } else {
        modalBody.innerHTML = `<p class="text-danger">❌ El carrito está vacío. Agrega productos antes de confirmar la compra.</p>`;
      }
    });
  }
}

const carrito = new Carrito();
carrito.confirmarCompra();

document.addEventListener("DOMContentLoaded", () => {
  const btnFinalizar = document.getElementById("btnFinalizarCompra");

  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", () => {
      const total = parseFloat(carrito.calcularTotal());

      if (total > 0) {
        const modalCompra = new bootstrap.Modal(document.getElementById("modalCompra"));
        modalCompra.show();
      } else {
        const alerta = document.createElement("div");
        alerta.className = "alert alert-danger mt-3 text-center";
        alerta.innerText = "⚠️ El carrito está vacío. Agrega productos antes de finalizar la compra.";

        const container = document.querySelector("#alertas-container") || document.body;
        container.appendChild(alerta);

        setTimeout(() => alerta.remove(), 3000);
      }
    });
  }
})

