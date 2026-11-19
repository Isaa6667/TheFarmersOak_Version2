/* Roblox group announcements for The Farmers Oak.
   Tries the live feed (data-api on #announcements) first, then falls back
   to data/announcements.json. Newest announcement is always shown first. */
(function () {
  'use strict';

  var root = document.getElementById('announcements');
  if (!root) return;

  var list = root.querySelector('.ann-list');
  var status = root.querySelector('.ann-status');
  var sources = [root.getAttribute('data-api'), root.getAttribute('data-fallback')]
    .filter(function (s) { return s; });

  function slateText(node) {
    if (!node) return '';
    if (typeof node.text === 'string') return node.text;
    if (Array.isArray(node.children)) return node.children.map(slateText).join('');
    return '';
  }

  function bodyOf(item) {
    var c = item && item.message && item.message.content;
    if (!c) return '';
    if (c.plainText) return c.plainText;
    if (c.slate) {
      try { return slateText(JSON.parse(c.slate)); } catch (e) { /* ignore */ }
    }
    return c.markdown || '';
  }

  function load(i) {
    if (i >= sources.length) return Promise.reject(new Error('no source'));
    return fetch(sources[i], { headers: { Accept: 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (j) {
        if (!j || !Array.isArray(j.data)) throw new Error('bad data');
        return j.data;
      })
      .catch(function () { return load(i + 1); });
  }

  function render(items) {
    items = items
      .filter(function (a) { return !a.deletedAt; })
      .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

    list.textContent = '';
    if (!items.length) {
      status.textContent = 'No announcements just yet. Check back soon.';
      return;
    }
    status.hidden = true;

    var fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    items.forEach(function (a) {
      var art = document.createElement('article');
      art.className = 'ann';

      var h = document.createElement('h3');
      h.textContent = a.name || a.nameToDisplay || 'Announcement';
      art.appendChild(h);

      var meta = document.createElement('p');
      meta.className = 'ann-meta';
      var d = new Date(a.createdAt);
      var time = document.createElement('time');
      time.dateTime = a.createdAt;
      time.textContent = isNaN(d) ? '' : fmt.format(d);
      meta.appendChild(time);
      if (a.creatorInfo && a.creatorInfo.displayName) {
        var by = ' · Posted by ' + a.creatorInfo.displayName;
        if (a.creatorInfo.groupRoleName) by += ' (' + a.creatorInfo.groupRoleName + ')';
        meta.appendChild(document.createTextNode(by));
      }
      art.appendChild(meta);

      bodyOf(a).split(/\n{2,}/).forEach(function (para) {
        para = para.trim();
        if (!para) return;
        var p = document.createElement('p');
        p.textContent = para;
        art.appendChild(p);
      });

      list.appendChild(art);
    });
  }

  load(0).then(render).catch(function () {
    status.textContent = 'Announcements are unavailable right now. Please check our Roblox group.';
  });
})();
