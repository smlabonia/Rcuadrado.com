(function () {
  "use strict";

  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");

  if (toggle && nav) {
    var setNavState = function (isOpen) {
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      toggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    toggle.addEventListener("click", function () {
      setNavState(nav.classList.toggle("is-open"));
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        setNavState(false);
      });
    });
  }

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  document.querySelectorAll(".slider").forEach(function (slider) {
    var track = slider.querySelector(".slider-track");
    var slides = track ? Array.prototype.slice.call(track.children) : [];
    var prevBtn = slider.querySelector(".slider-prev");
    var nextBtn = slider.querySelector(".slider-next");
    var dotsWrap = slider.querySelector(".slider-dots");
    if (!track || !slides.length) return;

    var current = 0;

    var dots = slides.map(function (slide, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", "Ir a la tarjeta " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function maxScroll() {
      return track.scrollWidth - track.clientWidth;
    }

    // Traduce la posición real de scroll a un índice de tarjeta, tratando
    // el final del track como la última tarjeta aunque el cálculo por
    // ancho no dé un múltiplo exacto (evita que el último punto quede
    // inalcanzable).
    function indexFromScroll() {
      var max = maxScroll();
      if (max <= 1) return 0;
      if (track.scrollLeft >= max - 2) return slides.length - 1;
      var style = getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || "0") || 0;
      var step = slides[0].getBoundingClientRect().width + gap;
      if (!step) return 0;
      return Math.max(0, Math.min(Math.round(track.scrollLeft / step), slides.length - 1));
    }

    function render(index) {
      current = index;
      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle("is-active", active);
        if (active) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === slides.length - 1;
    }

    // Posición de scroll necesaria para alinear el borde izquierdo de la
    // tarjeta "index" con el borde izquierdo visible del track, calculada
    // por posición real en pantalla (no depende del layout interno).
    function targetScrollFor(index) {
      var trackRect = track.getBoundingClientRect();
      var slideRect = slides[index].getBoundingClientRect();
      var raw = track.scrollLeft + (slideRect.left - trackRect.left);
      return Math.max(0, Math.min(raw, maxScroll()));
    }

    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    }

    // Animación propia del scroll: no depende de que el navegador respete
    // scroll-behavior:smooth (algunos lo ignoran según configuración del
    // sistema) ni entra en conflicto con el scroll-snap, así el movimiento
    // siempre se ve deslizar tanto hacia la derecha como hacia la izquierda.
    var animationFrame = null;
    function animateScrollTo(target, duration) {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      var start = track.scrollLeft;
      var change = target - start;
      if (Math.abs(change) < 1) return;
      var startTime = null;
      // El scroll-snap del track "corrige" cualquier posición intermedia al
      // punto de snap más cercano apenas se asigna scrollLeft, lo que hacía
      // que la animación se viera como un salto. Lo desactivamos mientras
      // dura la animación manual y lo restauramos al finalizar.
      track.style.scrollSnapType = "none";
      function step(timestamp) {
        if (startTime === null) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        track.scrollLeft = start + change * easeInOutQuad(progress);
        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        } else {
          animationFrame = null;
          track.style.scrollSnapType = "";
        }
      }
      animationFrame = requestAnimationFrame(step);
    }

    function goTo(index) {
      index = Math.max(0, Math.min(index, slides.length - 1));
      animateScrollTo(targetScrollFor(index), 420);
    }

    function stepSize() {
      var style = getComputedStyle(track);
      var gap = parseFloat(style.columnGap || style.gap || "0") || 0;
      return slides[0].getBoundingClientRect().width + gap;
    }

    // Las flechas avanzan/retroceden un paso desde la posición real de
    // scroll (no contra el índice "current"). Cerca del final, la última
    // tarjeta puede quedar visualmente muy cerca de la anterior por el
    // recorte del track, así que apuntar a la alineación exacta de esa
    // tarjeta (goTo) a veces da una distancia casi nula y no se movía nada;
    // moverse un paso fijo garantiza desplazamiento visible siempre.
    function stepBy(direction) {
      var max = maxScroll();
      var target = Math.max(0, Math.min(track.scrollLeft + stepSize() * direction, max));
      animateScrollTo(target, 420);
    }

    var ticking = false;
    track.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          render(indexFromScroll());
          ticking = false;
        });
        ticking = true;
      }
    });
    window.addEventListener("resize", function () { render(indexFromScroll()); });
    render(0);

    if (prevBtn) prevBtn.addEventListener("click", function () { stepBy(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { stepBy(1); });
  });
})();
