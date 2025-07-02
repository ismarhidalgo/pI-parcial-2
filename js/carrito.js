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

  mostrarInformacion(producto) {
    this.agregarProducto(producto);
    const carritoOffcanvas = new bootstrap.Offcanvas("#offcanvasRight");
    carritoOffcanvas.show();
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
  }

  eliminarProducto(id) {
    this.productos = this.productos.filter((p) => p.id !== id);
    this.guardarEnLocalStorage();
    this.mostrarCarrito();
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

      if (Array.isArray(this.productos) && this.productos.length > 0) {
        this.productos.forEach((producto) => {
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

        totalProductos = this.productos.reduce((acum, producto) => acum + producto.cantidad, 0);

        const productosCantidad = document.querySelector("#productos-total-WEB");
        if (productosCantidad) {
          productosCantidad.innerText = `Productos: ${totalProductos}`;
        }
      } else {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "El carrito está vacío";
        offcanvasBody.appendChild(emptyMessage);

        const productosCantidad = document.querySelector("#productos-total-WEB");
        if (productosCantidad) {
          productosCantidad.innerText = "Productos: 0";
        }

        const contadorCarrito = document.querySelector("#contador-carrito");
        if (contadorCarrito) {
          contadorCarrito.innerText = "0";
        }

        const totalElement = document.querySelector("#carrito-total");
        const totalWebElement = document.querySelector("#carrito-total-WEB");
        if (totalElement) totalElement.innerText = "Total: $0.00";
        if (totalWebElement) totalWebElement.innerText = "Total: $0.00";

        return;
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

  mostrarModalProducto(producto) {
    const modalBody = document.querySelector(".modal-content .modal-body");
    modalBody.innerHTML = "";

    const { nombre, imagen, cantidad = 1, precio } = producto;

    const productDiv = document.createElement("div");
    productDiv.style.display = "flex";
    productDiv.style.gap = "1rem";
    productDiv.style.alignItems = "center";

    const productImg = document.createElement("img");
    productImg.src = imagen;
    productImg.alt = nombre;
    productImg.style.width = "80px";
    productImg.style.height = "80px";
    productImg.style.objectFit = "cover";

    const productDescription = document.createElement("div");
    productDescription.innerHTML = `
      <strong>${nombre}</strong><br>
      Precio unitario: $${precio.toFixed(2)}<br>
      Cantidad: ${cantidad}<br>
      Total estimado: $${(precio * cantidad).toFixed(2)}
    `;

    productDiv.appendChild(productImg);
    productDiv.appendChild(productDescription);
    modalBody.appendChild(productDiv);
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
      productPrecio.textContent = producto.precio;

      const btnAgregar = document.createElement("button");
      btnAgregar.textContent = "Agregar al carrito";
      btnAgregar.className = "btn btn-success m-2";
      btnAgregar.onclick = () => {
        this.agregarProducto(producto);
        document.getElementById("modalCarrito").style.display = "none";
      };

      const btnCerrar = document.createElement("button");
      btnCerrar.textContent = "Cerrar";
      btnCerrar.className = "btnSec m-2";
      btnCerrar.onclick = () => {
        document.getElementById("modalCarrito").style.display = "none";
      };

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
      productDiv.appendChild(btnAgregar);
      productDiv.appendChild(btnCerrar);

      modalBody.appendChild(productDiv);
    }

    const modal = document.getElementById("modalCarrito");
    modal.style.display = "block";

    window.onclick = (event) => {
      if (event.target === modal) modal.style.display = "none";
    };
  }

  calcularTotal() {
    return this.productos
      .reduce((total, producto) => total + producto.precio * producto.cantidad, 0)
      .toFixed(2);
  }
}

const carrito = new Carrito();