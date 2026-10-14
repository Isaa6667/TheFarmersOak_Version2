(function () {
  var d = document;

  var yr = d.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  var burger = d.querySelector('.burger');
  var nav = d.getElementById('nav');

  if (burger && nav) {
    var setNav = function (open) {
      nav.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.textContent = open ? 'Close' : 'Menu';
    };

    burger.addEventListener('click', function () {
      setNav(!nav.classList.contains('open'));
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
  }

  var hero = d.querySelector('.hero');

  if (hero) {
    var slides = hero.querySelectorAll('.slide');
    var dots = hero.querySelectorAll('.dots button');
    var cur = 0;
    var timer;

    var show = function (i) {
      if (!slides.length) return;

      cur = (i + slides.length) % slides.length;

      slides.forEach(function (slide, n) {
        slide.classList.toggle('on', n === cur);
      });

      dots.forEach(function (dot, n) {
        dot.setAttribute('aria-current', n === cur ? 'true' : 'false');
      });
    };

    var stop = function () {
      clearInterval(timer);
    };

    var play = function () {
      stop();

      if (
        slides.length > 1 &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ) {
        timer = setInterval(function () {
          show(cur + 1);
        }, 6500);
      }
    };

    var prev = hero.querySelector('.prev');
    var next = hero.querySelector('.next');

    if (prev) {
      prev.addEventListener('click', function () {
        show(cur - 1);
        play();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(cur + 1);
        play();
      });
    }

    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () {
        show(n);
        play();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', play);
    hero.addEventListener('focusin', stop);
    hero.addEventListener('focusout', play);

    play();
  }

  var share = d.getElementById('share');

  if (share && navigator.share) {
    share.hidden = false;

    share.addEventListener('click', function () {
      navigator.share({
        title: d.title,
        url: location.href
      }).catch(function () {});
    });
  }
})();
