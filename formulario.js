/* ============================================
   CONFIGURACIÓN DE ENVÍO POR MAIL
   ============================================
   1. Entrar a https://formspree.io y creá una cuenta con el mail que voy a usar,
      donde voy a recibir las respuestas.
   2. URL de la pagina ej:
      https://formspree.io/f/xxxxxxxx
   3. Reemplazar en el const si es necesario */

const FORMSPREE_URL = "https://formspree.io/f/mvzevyrk";



(function () {
  const modal = document.getElementById('modal-adopcion');
  const botonesAbrir = document.querySelectorAll('[data-abrir-modal="adopcion"]');
  const botonesCerrar = document.querySelectorAll('[data-cerrar-modal]');

  const pasos = document.querySelectorAll('.form-paso');
  const dots = document.querySelectorAll('.form-dot');
  const btnSiguiente = document.getElementById('btn-siguiente');
  const btnVolver = document.getElementById('btn-volver');
  const btnEnviar = document.getElementById('btn-enviar');
  const btnVolverInicio = document.getElementById('btn-volver-inicio');
  const form = document.getElementById('formulario');
  const vistaFormulario = document.getElementById('vista-formulario');
  const vistaConfirmacion = document.getElementById('vista-confirmacion');
  const formError = document.getElementById('form-error');

  let pasoActual = 0;

  /* ---------- Modal ---------- */

  function abrirModal(e) {
    e.preventDefault();
    modal.classList.add('modal-adopcion--visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal() {
    modal.classList.remove('modal-adopcion--visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  botonesAbrir.forEach(btn => btn.addEventListener('click', abrirModal));
  botonesCerrar.forEach(btn => btn.addEventListener('click', cerrarModal));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('modal-adopcion--visible')) {
      cerrarModal();
    }
  });

  /* ---------- Wizard de pasos ---------- */

  function mostrarPaso(i) {
    pasos.forEach(p => p.classList.remove('form-paso--activo'));
    pasos[i].classList.add('form-paso--activo');

    dots.forEach((d, idx) => {
      d.classList.remove('form-dot--activo', 'form-dot--hecho');
      if (idx === i) d.classList.add('form-dot--activo');
      else if (idx < i) d.classList.add('form-dot--hecho');
    });

    btnVolver.classList.toggle('btn-volver--visible', i > 0);
    btnSiguiente.style.display = i === pasos.length - 1 ? 'none' : 'inline-block';
    btnEnviar.style.display = i === pasos.length - 1 ? 'inline-block' : 'none';
    formError.textContent = '';
  }

  function camposValidos(paso) {
    const campos = paso.querySelectorAll('input[required], textarea[required]');
    for (const campo of campos) {
      if (campo.type === 'radio') {
        const grupo = paso.querySelectorAll(`input[name="${campo.name}"]`);
        if (![...grupo].some(r => r.checked)) return false;
      } else if (campo.type === 'checkbox') {
        if (!campo.checked) return false;
      } else if (!campo.value.trim()) {
        return false;
      }
    }
    return true;
  }

  btnSiguiente.addEventListener('click', () => {
    if (!camposValidos(pasos[pasoActual])) {
      formError.textContent = 'Completá todos los campos antes de continuar.';
      return;
    }
    pasoActual++;
    mostrarPaso(pasoActual);
  });

  btnVolver.addEventListener('click', () => {
    pasoActual--;
    mostrarPaso(pasoActual);
  });

  document.querySelectorAll('input[name="compromiso"]').forEach(chk => {
    chk.addEventListener('change', () => {
      const todos = document.querySelectorAll('input[name="compromiso"]');
      btnEnviar.disabled = ![...todos].every(c => c.checked);
    });
  });

  document.querySelectorAll('input[name="Más animales en el hogar"]').forEach(r => {
    r.addEventListener('change', (e) => {
      document.getElementById('detalle-animales').classList.toggle('subcampo--visible', e.target.value === 'Sí');
    });
  });

  document.querySelectorAll('input[name="Animal enfermo previamente"]').forEach(r => {
    r.addEventListener('change', (e) => {
      document.getElementById('detalle-enfermo').classList.toggle('subcampo--visible', e.target.value === 'Sí');
    });
  });

  /* ---------- Envío por mail (Formspree) ---------- */

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!camposValidos(pasos[pasoActual])) {
      formError.textContent = 'Completá todos los campos antes de enviar.';
      return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    try {
      const datos = new FormData(form);
      const respuesta = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: datos,
        headers: { 'Accept': 'application/json' }
      });

      if (!respuesta.ok) throw new Error('Error en el envío');

      vistaFormulario.style.display = 'none';
      vistaConfirmacion.classList.add('form-confirmacion--visible');
    } catch (error) {
      formError.textContent = 'No pudimos enviar el formulario. Probá de nuevo en unos minutos.';
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar';
    }
  });

  btnVolverInicio.addEventListener('click', () => {
    cerrarModal();
    vistaFormulario.style.display = 'block';
    vistaConfirmacion.classList.remove('form-confirmacion--visible');
    form.reset();
    document.querySelectorAll('.subcampo--visible').forEach(s => s.classList.remove('subcampo--visible'));
    pasoActual = 0;
    mostrarPaso(0);
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviar';
    window.location.hash = 'inicio';

    if (document.getElementById('inicio')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = 'index.html#inicio';
    }
  });

  mostrarPaso(0);
})();


/* ============================================
   FORMULARIO DE CONTACTO (contacto.html)
   ============================================
   Se ejecuta solo si la página tiene el formulario
   con id="formulario-contacto". */

(function () {
  const form = document.getElementById('formulario-contacto');
  if (!form) return;

  const btnEnviar = document.getElementById('contacto-enviar');
  const errorMsg = document.getElementById('contacto-error');
  const confirmacion = document.getElementById('contacto-confirmacion');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorMsg.textContent = '';

    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    try {
      const datos = new FormData(form);
      const respuesta = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: datos,
        headers: { 'Accept': 'application/json' }
      });

      if (!respuesta.ok) throw new Error('Error en el envío');

      form.reset();
      form.style.display = 'none';
      confirmacion.classList.add('contacto__confirmacion--visible');
    } catch (error) {
      errorMsg.textContent = 'No pudimos enviar tu mensaje. Probá de nuevo en unos minutos.';
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar mensaje';
    }
  });
})();