// ===== CONFIGURACIÓN =====
// Cambia este número por el WhatsApp real de la clienta (solo números, con código de país)
const NUMERO_WHATSAPP = "573052809458";

// ===== CARRITO =====
let carrito = JSON.parse(localStorage.getItem("guanaCarrito")) || [];

// Elementos
const btnCarrito = document.getElementById("btnCarrito");
const modalCarrito = document.getElementById("modalCarrito");
const cerrarCarrito = document.getElementById("cerrarCarrito");
const carritoItems = document.getElementById("carritoItems");
const carritoBadge = document.getElementById("carritoBadge");
const carritoTotal = document.getElementById("carritoTotal");
const btnComprar = document.getElementById("btnComprar");

const modalFormulario = document.getElementById("modalFormulario");
const cerrarFormulario = document.getElementById("cerrarFormulario");
const formPedido = document.getElementById("formPedido");

// ===== FUNCIONES =====
function guardarCarrito() {
  localStorage.setItem("guanaCarrito", JSON.stringify(carrito));
  actualizarBadge();
}

function actualizarBadge() {
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  carritoBadge.textContent = totalItems;
  carritoBadge.style.display = totalItems > 0 ? "flex" : "none";
}

function formatearPrecio(precio) {
  return precio.toLocaleString("es-CO");
}

function renderCarrito() {
  if (carrito.length === 0) {
    carritoItems.innerHTML = `<p style="text-align:center;color:#999;padding:1rem;">Tu carrito está vacío</p>`;
    carritoTotal.textContent = "0";
    return;
  }

  let html = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    html += `
      <div class="carrito-item">
        <div class="carrito-item-info">
          <h4>${item.nombre}</h4>
          <div class="cantidad-control">
            <button class="btn-cantidad" onclick="cambiarCantidad(${index}, -1)">−</button>
            <span class="cantidad-numero">${item.cantidad}</span>
            <button class="btn-cantidad" onclick="cambiarCantidad(${index}, 1)">+</button>
          </div>
          <span class="subtotal">$${formatearPrecio(subtotal)}</span>
        </div>
        <button class="btn-eliminar" onclick="eliminarDelCarrito(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
  });

  carritoItems.innerHTML = html;
  carritoTotal.textContent = formatearPrecio(total);
}

function agregarAlCarrito(id, nombre, precio) {
  const existente = carrito.find(item => item.id === id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ id, nombre, precio: Number(precio), cantidad: 1 });
  }
  guardarCarrito();
  renderCarrito();
  
  // Feedback visual
  const badge = carritoBadge;
  badge.style.transform = "scale(1.3)";
  setTimeout(() => badge.style.transform = "scale(1)", 200);
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  renderCarrito();
}

function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;

  // Si la cantidad llega a 0 o menos, eliminamos el producto
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  guardarCarrito();
  renderCarrito();
}

// ===== EVENTOS =====
document.querySelectorAll(".btn-agregar").forEach(btn => {
  btn.addEventListener("click", (e) => {
    const card = e.target.closest(".producto-card");
    const id = card.dataset.id;
    const nombre = card.dataset.nombre;
    const precio = card.dataset.precio;
    agregarAlCarrito(id, nombre, precio);
  });
});

btnCarrito.addEventListener("click", () => {
  renderCarrito();
  modalCarrito.classList.add("activo");
});

cerrarCarrito.addEventListener("click", () => {
  modalCarrito.classList.remove("activo");
});

btnComprar.addEventListener("click", () => {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }
  modalCarrito.classList.remove("activo");
  modalFormulario.classList.add("activo");
});

cerrarFormulario.addEventListener("click", () => {
  modalFormulario.classList.remove("activo");
});

// Cerrar modales al hacer clic fuera
modalCarrito.addEventListener("click", (e) => {
  if (e.target === modalCarrito) modalCarrito.classList.remove("activo");
});
modalFormulario.addEventListener("click", (e) => {
  if (e.target === modalFormulario) modalFormulario.classList.remove("activo");
});

// Enviar a WhatsApp
formPedido.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const direccion = document.getElementById("direccion").value.trim();

  let mensaje = `¡Hola! Quiero hacer el siguiente pedido:%0A%0A`;
  mensaje += `*Cliente:* ${nombre} ${apellido}%0A`;
  mensaje += `*Teléfono:* ${telefono}%0A`;
  mensaje += `*Dirección:* ${direccion}%0A%0A`;
  mensaje += `*Pedido:*%0A`;

  let total = 0;
  carrito.forEach(item => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    mensaje += `• ${item.nombre} x${item.cantidad} = $${formatearPrecio(subtotal)}%0A`;
  });

  mensaje += `%0A*Total a pagar: $${formatearPrecio(total)}*`;

  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensaje}`;
  window.open(url, "_blank");

  // Vaciar el carrito después de enviar
  carrito = [];
  guardarCarrito();
  renderCarrito();
  modalFormulario.classList.remove("activo");
});

// Iniciar
actualizarBadge();


