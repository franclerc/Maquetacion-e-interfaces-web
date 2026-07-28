/* ============================================
   MODALES DE HISTORIAS (historias.html)
   ============================================
   Abre/cierra los modales de cada animal.
   Convención: data-abrir-historia="rio" abre el modal
   con id="modal-historia-rio". */

(function () {
  const botonesAbrir = document.querySelectorAll('[data-abrir-historia]');
  const modales = document.querySelectorAll('.modal-historia');

  if (!modales.length) return; // esta página no tiene modales de historias

  function abrirModal(id) {
    const modal = document.getElementById('modal-historia-' + id);
    if (!modal) return;
    modal.classList.add('modal-historia--visible');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function cerrarModal(modal) {
    modal.classList.remove('modal-historia--visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  botonesAbrir.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      abrirModal(btn.dataset.abrirHistoria);
    });
  });

  modales.forEach(modal => {
    modal.querySelectorAll('[data-cerrar-historia], .modal-historia__fondo').forEach(el => {
      el.addEventListener('click', () => cerrarModal(modal));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-historia--visible').forEach(cerrarModal);
    }
  });
})();