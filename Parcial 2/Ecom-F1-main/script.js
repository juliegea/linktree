document.addEventListener('DOMContentLoaded', () => {
  const kebabMenu = document.querySelector('.kebab-menu');
  const fullScreenMenu = document.querySelector('.full-screen-menu');
  const closeBtn = document.querySelector('.close-btn');
  const cartLogo = document.querySelector('.cart-logo');
  const cartSidebar = document.createElement('div');
  const closeCartSidebarBtn = document.createElement('button');
  
  closeCartSidebarBtn.classList.add('close-cart-sidebar-btn');
  closeCartSidebarBtn.innerHTML = '&times;';
  cartSidebar.classList.add('cart-sidebar');
  cartSidebar.appendChild(closeCartSidebarBtn);
  document.body.appendChild(cartSidebar);

  // Mostrar menú al hacer clic en el botón kebab
  kebabMenu.addEventListener('click', () => {
    fullScreenMenu.classList.add('show');
  });

  // Ocultar menú al hacer clic en el botón de cierre
  closeBtn.addEventListener('click', () => {
    fullScreenMenu.classList.remove('show');
  });

  // Manejo del carrito
  let cart = [];

  function formatPrice(price) {
    return price.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartLogo.dataset.count = totalItems;
    cartSidebar.innerHTML = `
      <button class="close-cart-btn">&times;</button>
      <h2>Carrito</h2>
      <ul>
        ${cart.map(item => `<li>${item.name} x ${item.quantity} - $${formatPrice(item.price * item.quantity)}</li>`).join('')}
      </ul>
      <p>Total: $${formatPrice(cart.reduce((total, item) => total + item.price * item.quantity, 0))}</p>
    `;

    const closeCartBtn = cartSidebar.querySelector('.close-cart-btn');
    closeCartBtn.addEventListener('click', () => {
      cartSidebar.classList.remove('open');
      document.body.classList.remove('overlay'); // remove overlay class from body
    });
  }

  function addToCart(product) {
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    updateCart();
  }

  document.querySelectorAll('.btn-agregar-carrito').forEach((button, index) => {
    button.addEventListener('click', () => {
      button.textContent = 'Agregado al carrito';
      setTimeout(() => {
        button.textContent = 'Añadir al Carrito';
      }, 1000);

      const product = {
        id: index,
        name: button.parentElement.querySelector('h3').textContent,
        price: parseFloat(button.parentElement.querySelector('.precio').textContent.replace('$', '').replace('.', '').replace(',', '.'))
      };
      addToCart(product);
    });
  });

  cartLogo.addEventListener('click', () => {
    cartSidebar.classList.add('open');
    document.body.classList.add('overlay'); // add overlay class to body
  });

  closeCartSidebarBtn.addEventListener('click', () => {
    cartSidebar.classList.remove('open');
    document.body.classList.remove('overlay'); // remove overlay class from body
  });

  //*** Slides ***

  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const sliderContainer = document.querySelector('.slider-container');

  let currentSlide = 0;
  let autoSlideInterval;
  let startX = 0;
  let isDragging = false;

  // Función para mostrar un slide específico
  function showSlide(index) {
    // Ajustar el índice para que siempre esté dentro del rango
    currentSlide = (index + slides.length) % slides.length;

    // Mueve el contenedor del slider al slide correspondiente
    const offset = currentSlide * -100; // Usamos el 100vw para el desplazamiento
    sliderContainer.style.transform = `translateX(${offset}vw)`;

    // Actualiza los dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  // Función para avanzar al siguiente slide
  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  // Función para retroceder al slide anterior
  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Manejo de los dots
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      currentSlide = parseInt(dot.dataset.index);
      showSlide(currentSlide);
      resetAutoSlide();
    });
  });

  // Botones de navegación
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoSlide();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoSlide();
  });

  // Pase automático cada 5 segundos
  function startAutoSlide() {
    autoSlideInterval = setInterval(nextSlide, 5000);
  }

  // Reinicia el pase automático después de una interacción manual
  function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  }

  // Funcionalidad de "swipe" (deslizar) para dispositivos móviles
  sliderContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  sliderContainer.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touchX = e.touches[0].clientX;
    const deltaX = touchX - startX;

    if (deltaX > 50) {
      prevSlide();
      isDragging = false;
      resetAutoSlide();
    } else if (deltaX < -50) {
      nextSlide();
      isDragging = false;
      resetAutoSlide();
    }
  });

  sliderContainer.addEventListener('touchend', () => {
    isDragging = false;
  });

  // Inicializa el slider
  showSlide(currentSlide);
  startAutoSlide();

  // Selecciona todas las diapositivas
  const slids = document.querySelectorAll('.slide');

  // Función para cambiar las imágenes según el tamaño de la pantalla
  function updateSlides() {
    if (window.innerWidth <= 768) {
      slides[0].style.backgroundImage = "url('images/banner cel1.png')";
      slides[1].style.backgroundImage = "url('images/banner2.jpeg')";
      slides[2].style.backgroundImage = "url('images/banner3.jpeg')";
    } else {
      slides[0].style.backgroundImage = "url('images/banner1.png.jpg')";
      slides[1].style.backgroundImage = "url('images/banner2.png')";
      slides[2].style.backgroundImage = "url('images/banner3.png')";
    }
  }

  // Llama a la función en carga y al cambiar el tamaño de la ventana
  window.addEventListener('resize', updateSlides);
  updateSlides();


});


// Redireccion de secciones

function redirectToProduct(element) {
  // Obtiene el valor del atributo data-producto
  const producto = element.getAttribute('data-producto');
  // Construye la URL según el producto
  const url = `${producto}.html`;
  // Redirige a la URL construida
  window.location.href = url;
}


document.getElementById('search-bar').addEventListener('input', function() { // Barra de busqueda
  var filter = this.value.toLowerCase();
  var posts = document.querySelectorAll('.tarjeta-producto');

  posts.forEach(function(post) {
    var title = post.querySelector('h3').textContent.toLowerCase();
    post.classList.toggle('hidden', !title.includes(filter));
  });

  var visiblePosts = document.querySelectorAll('.tarjeta-producto:not(.hidden)');
  var productosGrid = document.querySelector('.productos-grid');

  productosGrid.classList.remove('two-products');
  if (visiblePosts.length === 2) {
    productosGrid.classList.add('two-products');
  }

  if (visiblePosts.length % 2 === 0) {
    productosGrid.style.justifyContent = 'space-around';
  } else {
    productosGrid.style.justifyContent = 'center';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const logos = document.querySelectorAll('.carrusel-content img'); // Selecciona los logos en el carrusel
  const productos = document.querySelectorAll('.tarjeta-producto'); // Selecciona todas las tarjetas de productos

  logos.forEach(logo => {
    logo.addEventListener('click', () => {
      const marcaSeleccionada = logo.getAttribute('data-producto').toLowerCase(); // Obtiene la marca seleccionada del logo

      productos.forEach(producto => {
        const marcaProducto = producto.querySelector('.detalle-producto h3').textContent.toLowerCase(); // Obtiene el nombre de la marca desde el producto

        if (marcaProducto.includes(marcaSeleccionada)) {
          producto.classList.remove('hidden'); // Asegúrate de que no esté oculto
          producto.style.display = 'flex'; // Configura un display adecuado para la tarjeta
        } else {
          producto.classList.add('hidden'); // Oculta los productos no coincidentes
          producto.style.display = 'none';
        }
      });
    });
  });
});

// JavaScript para gestionar el modal de login, el carrito y redirecciones

document.addEventListener("DOMContentLoaded", () => {
  // Modal de Login
  const loginModal = document.getElementById("login-modal");
  const openLoginModal = document.getElementById("open-login-modal");
  const closeLoginModal = document.getElementById("close-login-modal");

  openLoginModal.addEventListener("click", () => {
    loginModal.classList.add("active");
  });

  closeLoginModal.addEventListener("click", () => {
    loginModal.classList.remove("active");
  });

  // Validación de formulario de registro
  const registerForm = document.getElementById("register-form-element");

  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    if (!validarInput(username) || !validarInput(password)) {
      mostrarErrorRegistro("Usuario y contraseña deben tener entre 8 y 16 caracteres.");
      return;
    }

    // Lógica para registrar usuario
    console.log("Registro exitoso");
  });

  function validarInput(input) {
    return input.length >= 8 && input.length <= 16;
  }

  function mostrarErrorRegistro(mensaje) {
    const errorMessage = document.getElementById("register-error-message");
    errorMessage.textContent = mensaje;
    errorMessage.classList.remove("hidden");
  }

  // Validación de formulario de login
  const loginForm = document.getElementById("login-form-element");

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!validarInput(username) || !validarInput(password)) {
      mostrarError("Usuario y contraseña deben tener entre 8 y 16 caracteres.");
      return;
    }

    // Lógica para iniciar sesión
    console.log("Inicio de sesión exitoso");
  });

  function validarInput(input) {
    return input.length >= 8 && input.length <= 16;
  }

  function mostrarError(mensaje) {
    const errorMessage = document.getElementById("login-error-message");
    errorMessage.textContent = mensaje;
    errorMessage.classList.remove("hidden");
  }

  // Carrito
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartLink = document.getElementById("cart-link");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartItems = document.getElementById("cart-items");
  const cartEmptyMessage = document.getElementById("cart-empty");

  cartLink.addEventListener("click", () => {
    cartSidebar.classList.add("open");
  });

  closeCartBtn.addEventListener("click", () => {
    cartSidebar.classList.remove("open");
  });

  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-agregar-carrito")) {
      const producto = e.target.closest(".tarjeta-producto").dataset.producto;
      agregarAlCarrito(producto);
    }

    if (e.target.classList.contains("btn-eliminar")) {
      const producto = e.target.dataset.producto;
      eliminarDelCarrito(producto);
    }
  });

  // Inicializar el carrito
  let carrito = [];

  // Función para agregar productos al carrito
  function agregarAlCarrito(producto) {
    carrito.push(producto);
    renderizarCarrito(carrito);
  }

  // Función para eliminar productos del carrito
  function eliminarDelCarrito(producto) {
    const index = carrito.indexOf(producto);
    if (index !== -1) {
      carrito.splice(index, 1);
    }
    renderizarCarrito(carrito);
  }

  // Función para renderizar los productos en el carrito
  function renderizarCarrito(carrito) {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = ''; // Limpiar el contenido anterior
    carrito.forEach((producto) => {
      const li = document.createElement("li");
      li.textContent = producto;
      const eliminarBtn = document.createElement("button");
      eliminarBtn.textContent = "Eliminar";
      eliminarBtn.classList.add("btn-eliminar");
      eliminarBtn.dataset.producto = producto;
      eliminarBtn.addEventListener('click', () => {
        eliminarDelCarrito(producto);
      });
      li.appendChild(eliminarBtn);
      cartItems.appendChild(li);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const cartLogo = document.querySelector('.cart-logo');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart-btn');

    cartLogo.addEventListener('click', () => {
      // Cierra cualquier carrito abierto antes de abrir uno nuevo
      const openCartSidebar = document.querySelector('.cart-sidebar.open');
      if (openCartSidebar && openCartSidebar !== cartSidebar) {
        openCartSidebar.classList.remove('open');
      }
      cartSidebar.classList.add('open');
      document.body.classList.add('overlay');
    });

    closeCartBtn.addEventListener('click', () => {
      cartSidebar.classList.remove('open');
      document.body.classList.remove('overlay');
    });

    // Agregar productos al carrito
    document.querySelectorAll('.btn-agregar-carrito').forEach(button => {
      button.addEventListener('click', (event) => {
        const producto = event.target.dataset.producto;
        agregarAlCarrito(producto);
      });
    });
  });
});

