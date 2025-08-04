class Producto {
  /**
   * Contructor del producto
   * @param {String} nombre
   * @param {String} descripcion
   * @param {String} id
   * @param {String} precio
   * @param {String} imagen
   * @param {String} categoria
   * @param {String} titulo
   * @param {String} stock
   */
  constructor(
    nombre,
    descripcion,
    id,
    precio,
    imagen,
    categoria,
    titulo,
    stock
  ) {
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.id = id;
    this.categoria = categoria;
    this.imagen = imagen;
    this.precio = parseFloat(precio);
    this.cantidad = 1;
    this.titulo = titulo;
    this.stock = stock;
  }


  toElement() {
    const productDiv = document.createElement("div");
    productDiv.classList.add("col-sm-12", "col-md-6", "col-lg-4", "mb-4");

    const card = document.createElement("div");
    card.classList.add("product_card");

    const img = document.createElement("img");
    img.src = this.imagen;

    const h3 = document.createElement("h3");
    h3.textContent = this.nombre;

    const h4 = document.createElement("h4");
    h4.textContent = this.titulo;

    const pDescripcion = document.createElement("p");
    pDescripcion.textContent = this.descripcion;
    pDescripcion.style.marginBottom = "20px";

    const pPrecio = document.createElement("p");
    pPrecio.classList.add("precio");
    pPrecio.textContent = `$${this.precio}`;

    const pStock = document.createElement("p");
    pStock.classList.add("stock");
    pStock.textContent = `$${this.stock}`;

    const button = document.createElement("button");
    button.classList.add("btn-add-to-cart");
    button.classList.add("btnSec");
    button.dataset.id = this.id;
    button.dataset.toggle = "offcanvas";
    button.dataset.toggle = "modal";
    button.dataset.target = "#carritoOffcanvas";
    button.textContent = "Agregar al Carrito";

    const hr = document.createElement("hr");
    hr.style.border = "1px solid white";

    const pCategoria = document.createElement("p");
    pCategoria.textContent = this.categoria;

    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(h4);
    card.appendChild(pDescripcion);
    card.appendChild(pPrecio);
    card.appendChild(button);
    card.appendChild(button);
    card.appendChild(hr);
    card.appendChild(pCategoria);
    card.appendChild(pStock);

    productDiv.appendChild(card);

    return productDiv;
  }

  show(selector) {
    const contenedor = document.querySelector(selector);

    const card = document.createElement("div");
    card.className = "card m-2 shadow-sm";
    card.style.width = "40rem";

    const img = document.createElement("img");
    img.src = this.imagen;
    img.alt = this.nombre;
    img.className = "card-img-top";

    const cardBody = document.createElement("div");
    cardBody.className = "card-body";

    const nombre = document.createElement("h3");
    nombre.className = "card-title";
    nombre.textContent = this.nombre;

    const titulo = document.createElement("h4");
    titulo.className = "card-subtitle";
    titulo.textContent = this.titulo;

    const descripcion = document.createElement("p");
    descripcion.className = "card-text";
    descripcion.textContent = this.descripcion;

    const precio = document.createElement("p");
    precio.className = "card-text fw-bold";
    precio.textContent = `Precio: $${this.precio}`;

    const stock = document.createElement("p");
    stock.className = "card-text fw-bold";
    stock.textContent = `Stock: ${this.stock}`;

    const btnAgregar = document.createElement("button");
    btnAgregar.textContent = "Agregar al carrito";
    btnAgregar.className = "btn btn-sm me-2 btn-add-to-cart";
    btnAgregar.setAttribute("data-id", this.id);

    const btnmi = document.createElement("button");
    btnmi.textContent = "Mostrar información";
    btnmi.className = "btn btn-sm me-2 btnSec";
    btnmi.setAttribute("data-id", this.id);


    const btnGroup = document.createElement("div");
    btnGroup.className = "d-flex justify-content-start gap-2 mt-3";
    btnGroup.append(btnAgregar, btnmi);

    cardBody.append(nombre, titulo, precio, stock, btnGroup);
    card.append(img, cardBody);
    contenedor.appendChild(card);
  }

  static async obtenerProductos(listaProductos) {
    const response = await fetch(listaProductos);
    const data = await response.json();
    return data.map(
      (item) =>
        new Producto(
          item.nombre,
          item.descripcion,
          item.id,
          item.precio,
          item.imagen,
          item.categoria,
          item.titulo,
          item.stock
        )
    );
  }
}
