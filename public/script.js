const API_KEY = '73a44d12ca98272b5143400f14f463a1';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// 1) Función para comprobar estado de verificación
function isUserVerified() {
  return localStorage.getItem('verified') === 'true';
}

async function fetchPopularMovies() {
  const url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
  const response = await fetch(url);
  const data = await response.json();
  return data.results.slice(0, 10);
}

// 2) Renderizado de películas con lógica de reserva/verificación
function renderMovies(movies) {
  const container = document.getElementById('movies');
  container.innerHTML = '';

  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'movie-card';

    // Imagen de la película
    const img = document.createElement('img');
    img.src = IMG_BASE_URL + movie.poster_path;
    img.alt = movie.title;

    // Título de la película
    const title = document.createElement('div');
    title.className = 'movie-title';
    title.textContent = movie.title;

    // Botón Reservar
    const btnReservar = document.createElement('button');
    btnReservar.className = 'btn-reservar';
    btnReservar.textContent = 'Reservar';
    btnReservar.style.marginTop = '8px';

    // Div “Reservado” oculto por defecto
    const reservedTag = document.createElement('div');
    reservedTag.textContent = 'Reservado';
    reservedTag.style.color = 'red';
    reservedTag.style.marginTop = '4px';
    reservedTag.style.display = 'none';

    // Lógica al hacer click en Reservar
    btnReservar.addEventListener('click', () => {
      if (!isUserVerified()) {
        // No verificado → redirigir a login facial
        window.location.href = './RF.html';
      } else {
        // Ya verificado → mostrar “Reservado”
        reservedTag.style.display = 'block';
        // Aquí podrías añadir llamada a tu API de reserva si la tuvieras
      }
    });

    // Montaje de la tarjeta
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(btnReservar);
    card.appendChild(reservedTag);

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const movies = await fetchPopularMovies();
    renderMovies(movies);
  } catch (err) {
    console.error('Error al cargar películas:', err);
  }
});

// 0) Modal de contacto: creación y lógica
function createContactModal() {
  if (document.getElementById('contact-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'contact-overlay';
  Object.assign(overlay.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000'
  });

  const modal = document.createElement('div');
  modal.id = 'contact-modal';
  Object.assign(modal.style, {
    background: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '400px',
    boxSizing: 'border-box',
    textAlign: 'center',
    position: 'relative'
  });

  const closeBtn = document.createElement('span');
  closeBtn.innerHTML = '&times;';
  Object.assign(closeBtn.style, {
    position: 'absolute',
    top: '10px',
    right: '15px',
    cursor: 'pointer',
    fontSize: '24px'
  });
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  modal.appendChild(closeBtn);

  const title = document.createElement('h2');
  title.textContent = 'Contáctanos';
  modal.appendChild(title);

  // Sección Correo
  const correoDiv = document.createElement('div');
  const correoTitle = document.createElement('h3');
  correoTitle.textContent = 'Correo';
  correoDiv.appendChild(correoTitle);
  ['jairo.betancourt@epn.edu.ec', 'justin.imbaquingo@epn.edu.ec', 'cristian.tambaco@epn.edu.ec']
    .forEach(email => {
      const btn = document.createElement('button');
      btn.textContent = email;
      btn.style.margin = '5px';
      btn.addEventListener('click', () => {
        window.location.href = `mailto:${email}`;
      });
      correoDiv.appendChild(btn);
    });
  modal.appendChild(correoDiv);

  // Sección Llamada
  const callDiv = document.createElement('div');
  const callTitle = document.createElement('h3');
  callTitle.textContent = 'Llamada';
  callDiv.appendChild(callTitle);
  ['0984523160', '0962122064', '0961402549'].forEach(num => {
    const btn = document.createElement('button');
    btn.textContent = num;
    btn.style.margin = '5px';
    btn.addEventListener('click', () => {
      window.location.href = `tel:${num}`;
    });
    callDiv.appendChild(btn);
  });
  modal.appendChild(callDiv);

  // Sección WhatsApp
  const waDiv = document.createElement('div');
  const waTitle = document.createElement('h3');
  waTitle.textContent = 'WhatsApp';
  waDiv.appendChild(waTitle);
  [
    { display: '0984523160', code: '593984523160' },
    { display: '0962122064', code: '593962122064' },
    { display: '0961402549', code: '593961402549' }
  ].forEach(({ display, code }) => {
    const btn = document.createElement('button');
    btn.textContent = display;
    btn.style.margin = '5px';
    btn.addEventListener('click', () => {
      window.open(`https://wa.me/${code}`, '_blank');
    });
    waDiv.appendChild(btn);
  });
  modal.appendChild(waDiv);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

// 1) tuFuncion llama al modal en lugar de prompt
function tuFuncion() {
  createContactModal();
}

// 2) Toggle menú
function initMenuToggle() {
  const menuIcon = document.getElementById('menu-icon');
  const menu = document.getElementById('menu');
  if (!menuIcon || !menu) return;
  menuIcon.addEventListener('click', () => menu.classList.toggle('active'));
}

// Inicializar toggle al cargar
document.addEventListener('DOMContentLoaded', initMenuToggle);

window.addEventListener('load', () => {
  const video = document.getElementById("video");
  const estado = document.getElementById("estado");
  let rostrosRegistrados = [];
  let imagenesRegistradas = [];
  const modeloURL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights";

  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(modeloURL),
    faceapi.nets.faceLandmark68Net.loadFromUri(modeloURL),
    faceapi.nets.faceRecognitionNet.loadFromUri(modeloURL),
  ]).then(iniciarVideo).catch(error => {
    estado.innerText = "❌ Error al cargar modelos.";
    estado.classList.add('estado-error');
    console.error(error);
  });

  function iniciarVideo() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        video.srcObject = stream;
        estado.innerText = "✅ Modelos cargados. Cámara activa.";
        estado.classList.add('estado-exito');
      })
      .catch(err => {
        estado.innerText = "❌ Error al acceder a la cámara.";
        estado.classList.add('estado-error');
        console.error(err);
      });
  }

  async function registrarRostro() {
    const deteccion = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (!deteccion) {
      estado.innerText = "❗ No se detectó ningún rostro.";
      estado.classList.add('estado-error');
      return;
    }
    const canvas = faceapi.createCanvasFromMedia(video);
    const dataURL = canvas.toDataURL('image/jpeg');
    rostrosRegistrados.push(deteccion.descriptor);
    imagenesRegistradas.push(dataURL);
    estado.innerText = "✅ Rostro registrado correctamente.";
    estado.classList.add('estado-exito');
  }

  async function verificarRostro() {
    if (rostrosRegistrados.length === 0) {
      estado.innerText = "⚠️ Registra un rostro primero.";
      estado.classList.add('estado-error');
      return;
    }
    const deteccion = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (!deteccion) {
      estado.innerText = "❗ No se detectó ningún rostro.";
      estado.classList.add('estado-error');
      return;
    }
    let rostroVerificado = false;
    let imagenCoincidente = null;
    for (let i = 0; i < rostrosRegistrados.length; i++) {
      const distancia = faceapi.euclideanDistance(rostrosRegistrados[i], deteccion.descriptor);
      if (distancia < 0.5) {
        rostroVerificado = true;
        imagenCoincidente = imagenesRegistradas[i];
        break;
      }
    }
    if (rostroVerificado) {
      estado.innerText = "✅ Rostro verificado con éxito.";
      estado.classList.add('estado-exito');
      // Guardamos la verificación
      localStorage.setItem('verified', 'true');
      const imagenVerificada = document.createElement('img');
      imagenVerificada.src = imagenCoincidente;
      document.body.appendChild(imagenVerificada);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      estado.innerText = "❌ Rostro no coincide.";
      estado.classList.add('estado-error');
    }
  }

  window.registrarRostro = registrarRostro;
  window.verificarRostro = verificarRostro;
});
