(function () {
  var d = document;

  // Footer year
  var yr = d.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // Mobile menu
  var burger = d.querySelector('.burger'), nav = d.getElementById('nav');
  if (burger && nav) {
    var setNav = function (open) {
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.textContent = open ? 'Close' : 'Menu';
    };
    burger.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setNav(false); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  }

  // Hero slider
  var hero = d.querySelector('.hero');
  if (hero) {
    var slides = hero.querySelectorAll('.slide'), dots = hero.querySelectorAll('.dots button'), cur = 0, timer;
    var show = function (i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('on', n === cur); });
      dots.forEach(function (b, n) { b.setAttribute('aria-current', n === cur ? 'true' : 'false'); });
    };
    var play = function () {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      stop(); timer = setInterval(function () { show(cur + 1); }, 6500);
    };
    var stop = function () { clearInterval(timer); };
    var prev = hero.querySelector('.prev'), next = hero.querySelector('.next');
    if (prev) prev.addEventListener('click', function () { show(cur - 1); play(); });
    if (next) next.addEventListener('click', function () { show(cur + 1); play(); });
    dots.forEach(function (b, n) { b.addEventListener('click', function () { show(n); play(); }); });
    hero.addEventListener('mouseenter', stop); hero.addEventListener('mouseleave', play);
    hero.addEventListener('focusin', stop); hero.addEventListener('focusout', play);
    play();
  }

  // Contact form
  var form = d.getElementById('cf'), status = d.getElementById('fs');
  if (form && status) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form) })
        .then(function (r) { if (!r.ok) throw new Error(); form.reset(); status.textContent = 'Thanks! Your message has been sent.'; })
        .catch(function () { status.textContent = 'Sorry, that didn’t send. Please email TheFarmersOak@outlook.com instead.'; });
    });
  }

  // Share button (events page)
  var share = d.getElementById('share');
  if (share && navigator.share) {
    share.hidden = false;
    share.addEventListener('click', function () {
      navigator.share({ title: d.title, url: location.href }).catch(function () {});
    });
  }
})();
