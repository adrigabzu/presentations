/* Shared behaviour for presentation pages: appearance switcher + the linked
   particle background used on adrianzucco.com. No dependencies. */

(function () {
  "use strict";

  /* ---------- Appearance switcher ----------
     Same storage key as the Blowfish theme on adrianzucco.com ("appearance"),
     so the two sites agree on light/dark when opened in the same browser.
     The <html class="dark"> flag itself is set by an inline snippet in <head>
     to avoid a flash of the wrong theme. */

  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  function apply(isDark) {
    root.classList.toggle("dark", isDark);
    document.querySelectorAll(".theme-toggle").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
    });
    window.dispatchEvent(new CustomEvent("appearancechange"));
  }

  document.querySelectorAll(".theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = !root.classList.contains("dark");
      try {
        localStorage.setItem("appearance", next ? "dark" : "light");
      } catch (e) {
        /* storage unavailable — the toggle still works for this page view */
      }
      apply(next);
    });
  });

  media.addEventListener("change", function (e) {
    var stored = null;
    try {
      stored = localStorage.getItem("appearance");
    } catch (e2) {}
    if (!stored) apply(e.matches);
  });

  apply(root.classList.contains("dark"));

  /* ---------- Particle background ----------
     A small stand-in for the particles.js field on adrianzucco.com: drifting
     dots joined by lines when they come close. Also a fitting backdrop for a
     workshop about mapping connections. */

  var canvas = document.getElementById("particles");
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext("2d");
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  var dots = [];
  var w = 0;
  var h = 0;
  var dpr = 1;
  var LINK_DIST = 150;

  function palette() {
    var cs = getComputedStyle(root);
    return {
      ink: cs.getPropertyValue("--net-ink").trim() || "0, 0, 0",
      dot: parseFloat(cs.getPropertyValue("--net-dot")) || 0.25,
      line: parseFloat(cs.getPropertyValue("--net-line")) || 0.18
    };
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var target = Math.min(120, Math.round((w * h) / 12000));
    while (dots.length > target) dots.pop();
    while (dots.length < target) {
      dots.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 1 + Math.random() * 2
      });
    }
  }

  function draw() {
    var pal = palette();
    ctx.clearRect(0, 0, w, h);

    for (var i = 0; i < dots.length; i++) {
      for (var j = i + 1; j < dots.length; j++) {
        var dx = dots[i].x - dots[j].x;
        var dy = dots[i].y - dots[j].y;
        var d = Math.hypot(dx, dy);
        if (d < LINK_DIST) {
          ctx.strokeStyle =
            "rgba(" + pal.ink + ", " +
            (pal.line * (1 - d / LINK_DIST)).toFixed(3) + ")";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = "rgba(" + pal.ink + ", " + pal.dot + ")";
    for (var k = 0; k < dots.length; k++) {
      ctx.beginPath();
      ctx.arc(dots[k].x, dots[k].y, dots[k].r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function step() {
    for (var i = 0; i < dots.length; i++) {
      var p = dots[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    }
    draw();
    if (!reduced.matches) requestAnimationFrame(step);
  }

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      resize();
      draw();
    }, 150);
  });
  window.addEventListener("appearancechange", draw);

  resize();
  draw();
  if (!reduced.matches) requestAnimationFrame(step);
})();
