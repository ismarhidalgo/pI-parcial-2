document.addEventListener("DOMContentLoaded", async () => {
  const listaProductos = "productos.json";
  let productos = await Producto.obtenerProductos(listaProductos);
  productos.forEach((producto) => producto.show("#productos"));

  const selectCategoria = document.querySelector("#categoria");
  selectCategoria.innerHTML = '<option value="">Todas las categorías</option>';
  const categoriasUnicas = [...new Set(productos.map((p) => p.categoria))];

  categoriasUnicas.forEach((categoria) => {
    const option = document.createElement("option");
    option.value = categoria;
    option.innerText = categoria;
    selectCategoria.appendChild(option);
  });

  document.querySelectorAll(".filtro-categoria").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const categoria = event.target.textContent.trim();
      const productosContenedor = document.querySelector("#productos");
      productosContenedor.innerHTML = "";

      if (categoria === "Todas las categorias") {
        productos.forEach((producto) => producto.show("#productos"));
        selectCategoria.value = "";
      } else {
        const productosFiltrados = productos.filter(
          (producto) => producto.categoria === categoria
        );
        productosFiltrados.forEach((producto) => producto.show("#productos"));
        selectCategoria.value = categoria;
      }
    });
  });

  const ordenPrecioSelect = document.querySelector("#ordenPrecio");

  function renderizarProductos(productosAMostrar) {
    const productosContenedor = document.querySelector("#productos");
    productosContenedor.innerHTML = "";
    productosAMostrar.forEach((producto) => producto.show("#productos"));
  }

  function manejarAgregarAlCarrito(productId) {
    const producto = productos.find((p) => p.id.toString() === productId);
    if (producto) {
      const productoEnCarrito = carrito.obtenerProducto(producto.id);
      if (!productoEnCarrito || productoEnCarrito.cantidad < producto.stock) {
        carrito.agregarProducto(producto);
        abrirOffcanvas();
        const stockAlert = document.getElementById("stockAlert");
        if (stockAlert) stockAlert.classList.add("d-none");
      } else {
        mostrarAlertaStock(producto);
      }
    }
  }

  selectCategoria.addEventListener("change", filtrarYOrdenarProductos);
  ordenPrecioSelect.addEventListener("change", filtrarYOrdenarProductos);

  document.querySelectorAll(".filtro-categoria").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const categoria = event.target.textContent.trim();
      selectCategoria.value =
        categoria === "Todas las categorias" ? "" : categoria;
      filtrarYOrdenarProductos();
    });
  });

  function filtrarYOrdenarProductos() {
    const categoriaSeleccionada = selectCategoria.value;
    const ordenSeleccionado = ordenPrecioSelect.value;

    let productosFiltrados = categoriaSeleccionada
      ? productos.filter((p) => p.categoria === categoriaSeleccionada)
      : [...productos];

    if (ordenSeleccionado === "asc") {
      productosFiltrados.sort((a, b) => a.precio - b.precio);
    } else if (ordenSeleccionado === "desc") {
      productosFiltrados.sort((a, b) => b.precio - a.precio);
    }

    renderizarProductos(productosFiltrados);


    if (categoriaSeleccionada && categoriaSeleccionada !== ultimaCategoriaMostrada) {
    mostrarOfertaEspecial(categoriaSeleccionada);
    ultimaCategoriaMostrada = categoriaSeleccionada;
  }




  }

  const alertasContainer = document.getElementById("alertas-container");

  function mostrarAlertaStock(producto) {
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

  document.querySelector("#productos").addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-add-to-cart")) {
      const productId = event.target.getAttribute("data-id");
      manejarAgregarAlCarrito(productId);
    }
  });

  document.querySelector("#verCarritoBtn").addEventListener("click", () => {
    abrirOffcanvas();
  });

  function abrirOffcanvas() {
    const modal = document.getElementById("myOffcanvas");
    carrito.mostrarCarrito();
  }

  document.querySelector("#productos").addEventListener("click", (event) => {
    if (event.target.classList.contains("btnSec")) {
      const productId = event.target.getAttribute("data-id");
      const producto = productos.find((p) => p.id.toString() === productId);
      if (producto) carrito.mostrarModal(producto);
    }
  });

  document.querySelector("#productos").addEventListener("click", (event) => {
    if (event.target.classList.contains("btn-info-producto")) {
      const productId = event.target.getAttribute("data-id");
      const producto = productos.find((p) => p.id.toString() === productId);
      if (producto) {
        carrito.mostrarModalProducto(producto);
        abrirModal();
      }
    }
  });

  function abrirModal() {
    const modal = document.getElementById("modalCarrito");
    carrito.mostrarCarrito();
    modal.style.display = "block";

    const cerrarModalBtn = modal.querySelector("#cerrarModal");
    cerrarModalBtn.onclick = function () {
      modal.style.display = "none";
    };

    const closeModal = modal.querySelector(".close");
    closeModal.onclick = function () {
      modal.style.display = "none";
    };

    window.onclick = function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    };
  }

  // LocalStorage
  carrito.productos = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.mostrarCarrito();

  // Guardar en localStorage cada vez que cambia el carrito
  const originalAgregar = carrito.agregarProducto.bind(carrito);
  carrito.agregarProducto = function (producto) {
    originalAgregar(producto);
    localStorage.setItem("carrito", JSON.stringify(this.productos));
  };

  const originalEliminar = carrito.eliminarProducto.bind(carrito);
  carrito.eliminarProducto = function (id) {
    originalEliminar(id);
    localStorage.setItem("carrito", JSON.stringify(this.productos));
  };

  const originalSumar = carrito.sumarProducto.bind(carrito);
  carrito.sumarProducto = function (id) {
    originalSumar(id);
    localStorage.setItem("carrito", JSON.stringify(this.productos));
  };

  const originalRestar = carrito.restarProducto.bind(carrito);
  carrito.restarProducto = function (id) {
    originalRestar(id);
    localStorage.setItem("carrito", JSON.stringify(this.productos));
  };
});


document.addEventListener("DOMContentLoaded", () => {
  const pagoEfectivo = document.getElementById("pagoEfectivo");
  const pagoTarjeta = document.getElementById("pagoTarjeta");
  const camposTarjeta = document.getElementById("camposTarjeta");

  function actualizarCamposTarjeta() {
    if (pagoTarjeta.checked) {
      camposTarjeta.style.display = "block";
      document.getElementById("nombreTarjeta").required = true;
      document.getElementById("numeroTarjeta").required = true;
      document.getElementById("cuotasPago").required = true;
    } else {
      camposTarjeta.style.display = "none";
      document.getElementById("nombreTarjeta").required = false;
      document.getElementById("numeroTarjeta").required = false;
      document.getElementById("cuotasPago").required = false;
    }
  }

  pagoEfectivo.addEventListener("change", actualizarCamposTarjeta);
  pagoTarjeta.addEventListener("change", actualizarCamposTarjeta);

  actualizarCamposTarjeta();
});




const ofertas = {
  "Piezas Sanitarias": {
    imagen: "img/oferta-sanitarios.png"
  },
  "Revestimientos": {
    imagen: "img/oferta-revestimientos.png"
  },
  "Accesorios": {
    imagen: "img/oferta-accesorios.png"
  },
  
};

let ultimaCategoriaMostrada = null;


document.addEventListener("DOMContentLoaded", () => {
  const btnCerrar = document.getElementById("cerrar-oferta");
  if (btnCerrar) {
    btnCerrar.addEventListener("click", cerrarOferta);
  }
});



function cerrarOferta() {
  const banner = document.getElementById("oferta-flotante");
  if (banner) {
    banner.classList.add("d-none");
  }
}

function mostrarOfertaEspecial(categoria) {
  const banner = document.getElementById("oferta-flotante");
  const img = document.getElementById("img-oferta");

  if (!banner || !img) return;

  const datos = ofertas[categoria];
  if (!datos) return;

  img.src = datos.imagen;
  banner.classList.remove("d-none");

  setTimeout(() => {
    banner.classList.add("d-none");
  }, 10000);
}

const modalCompra = document.getElementById("modalCompra");
const contenidoOriginalModal = modalCompra.innerHTML;

modalCompra.addEventListener("hidden.bs.modal", () => {

  modalCompra.innerHTML = contenidoOriginalModal;

  const pagoEfectivo = document.getElementById("pagoEfectivo");
  const pagoTarjeta = document.getElementById("pagoTarjeta");
  const camposTarjeta = document.getElementById("camposTarjeta");

  function actualizarCamposTarjeta() {
    if (pagoTarjeta.checked) {
      camposTarjeta.style.display = "block";
      document.getElementById("nombreTarjeta").required = true;
      document.getElementById("numeroTarjeta").required = true;
      document.getElementById("cuotasPago").required = true;
    } else {
      camposTarjeta.style.display = "none";
      document.getElementById("nombreTarjeta").required = false;
      document.getElementById("numeroTarjeta").required = false;
      document.getElementById("cuotasPago").required = false;
    }
  }

  pagoEfectivo.addEventListener("change", actualizarCamposTarjeta);
  pagoTarjeta.addEventListener("change", actualizarCamposTarjeta);
  actualizarCamposTarjeta(); 

  carrito.confirmarCompra();
});
