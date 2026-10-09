(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var money = function (n) { return "$" + Number(n).toLocaleString("en-US"); };
  var cars = function () { return window.CARS.filter(function (c) { return c.active; }); };
  var byId = function (id) { return cars().filter(function (c) { return c.id === id; })[0]; };
  var P = new URLSearchParams(location.search);
  var el = function (tag, attrs, kids) {
    var e = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (k === "text") e.textContent = attrs[k]; else e.setAttribute(k, attrs[k]); });
    (kids || []).forEach(function (k) { if (k) e.appendChild(k); });
    return e;
  };
  function rating(id) {
    var r = (window.REVIEWS || {})[id] || [];
    if (!r.length) return null;
    var s = 0; r.forEach(function (x) { s += x.rating; });
    return { avg: s / r.length, n: r.length, list: r };
  }
  function stars(n) { var k = Math.round(n); return "★★★★★".slice(0, k) + "☆☆☆☆☆".slice(0, 5 - k); }
  function overlaps(c, a, b) {
    return c.booked.some(function (r) { return a < new Date(r.to + "T23:59:59") && b > new Date(r.from + "T00:00:00"); });
  }
  function dayCount(a, b) { return Math.max(1, Math.ceil((b - a) / 864e5)); }
  function validRange(a, b) { return !isNaN(a) && !isNaN(b) && b > a; }
  function favs() { try { return JSON.parse(localStorage.getItem("pg_favs") || "[]"); } catch (e) { return []; } }
  function setFavs(v) { try { localStorage.setItem("pg_favs", JSON.stringify(v)); } catch (e) {} }
  function carTitle(c) { return c.year + " " + c.name; }

  // Header and footer
  var h = $("#site-header");
  if (h) h.innerHTML = '<div class="wrap"><a href="index.html" class="logo">Pickup <b>&amp;</b> Go</a><nav><a href="index.html#cars">Cars</a><a href="index.html#how">How it works</a><a href="index.html#faq">FAQ</a><a href="#contact">Contact</a></nav></div>';
  var f = $("#site-footer");
  if (f) {
    var C = window.CONTACT;
    f.innerHTML = '<div class="wrap cols"><div><strong style="color:#fff;font-size:1.2rem">Pickup &amp; Go</strong><p>Rent the exact car you want, straight from the owner. Send a request, get a reply, and hit the road.</p></div>' +
      '<div><strong style="color:#fff">Email</strong>' + C.emails.map(function (e) { return '<div><a href="mailto:' + e + '">' + e + '</a></div>'; }).join("") + '</div>' +
      '<div><strong style="color:#fff">Phone</strong>' + C.phones.map(function (p) { return '<div><a href="tel:' + p.replace(/\D/g, "") + '">' + p + '</a></div>'; }).join("") + '</div></div>';
  }

  // ---------- HOME ----------
  var grid = $("#car-grid");
  if (grid) {
    var type = "All", sortBy = "rec";
    var qWhere = $("#q-where"), qFrom = $("#q-from"), qUntil = $("#q-until");
    qWhere.value = P.get("where") || ""; qFrom.value = P.get("from") || ""; qUntil.value = P.get("until") || "";
    var types = ["All"]; cars().forEach(function (c) { if (types.indexOf(c.type) < 0) types.push(c.type); }); types.push("Saved ♥");
    var chips = $("#chips");
    types.forEach(function (t) {
      var b = el("button", { type: "button", "class": "chip" + (t === "All" ? " on" : ""), text: t });
      b.onclick = function () { type = t; Array.prototype.forEach.call(chips.children, function (x) { x.className = "chip"; }); b.className = "chip on"; render(); };
      chips.appendChild(b);
    });
    $("#sort").onchange = function () { sortBy = this.value; render(); };
    $("#search-form").onsubmit = function (e) { e.preventDefault(); render(); document.getElementById("cars").scrollIntoView(); };

    function qs() {
      var p = new URLSearchParams();
      if (qFrom.value) p.set("from", qFrom.value);
      if (qUntil.value) p.set("until", qUntil.value);
      return p.toString() ? "&" + p.toString() : "";
    }
    function card(c) {
      var r = rating(c.id), fv = favs().indexOf(c.id) >= 0;
      var a = new Date(qFrom.value), b = new Date(qUntil.value), ok = validRange(a, b), n = ok ? dayCount(a, b) : 0;
      var heart = el("button", { type: "button", "class": "heart" + (fv ? " on" : ""), "aria-label": "Save " + c.name, text: fv ? "♥" : "♡" });
      heart.onclick = function () {
        var v = favs(), i = v.indexOf(c.id);
        if (i >= 0) v.splice(i, 1); else v.push(c.id);
        setFavs(v); render();
      };
      var rateEl = r ? el("div", { "class": "rate" }, [el("i", { text: "★ " }), document.createTextNode(r.avg.toFixed(1) + " (" + r.n + ")")]) : el("span", { "class": "new", text: "New listing" });
      var link = el("a", { "class": "cl", href: "car.html?id=" + encodeURIComponent(c.id) + qs() }, [
        el("img", { "class": "ph", src: c.images[0] || "placeholder.svg", alt: carTitle(c), loading: "lazy" }),
        el("div", { "class": "bd" }, [
          el("h3", { text: carTitle(c) }),
          el("div", { "class": "meta", text: c.type + " · " + c.seats + " seats · " + c.city }),
          rateEl,
          el("div", { "class": "price" }, [document.createTextNode(money(c.price_per_day)), el("small", { text: " / day" }), ok ? el("small", { text: "  ·  " + money(c.price_per_day * n) + " for " + n + (n > 1 ? " days" : " day") }) : null])
        ])
      ]);
      return el("div", { "class": "card" }, [link, heart, c.delivery ? el("span", { "class": "tag", text: "Delivery" }) : null]);
    }
    function render() {
      var w = qWhere.value.trim().toLowerCase();
      var a = new Date(qFrom.value), b = new Date(qUntil.value), ok = validRange(a, b);
      var list = cars().filter(function (c) {
        if (w && (c.city + " " + c.name + " " + c.type + " " + c.year).toLowerCase().indexOf(w) < 0) return false;
        if (type === "Saved ♥") { if (favs().indexOf(c.id) < 0) return false; }
        else if (type !== "All" && c.type !== type) return false;
        if (ok && overlaps(c, a, b)) return false;
        return true;
      });
      list.sort(function (x, y) {
        if (sortBy === "low") return x.price_per_day - y.price_per_day;
        if (sortBy === "high") return y.price_per_day - x.price_per_day;
        if (sortBy === "top") { var rx = rating(x.id), ry = rating(y.id); return (ry ? ry.avg : 0) - (rx ? rx.avg : 0); }
        return 0;
      });
      $("#count").textContent = list.length + (list.length === 1 ? " car" : " cars") + (ok ? " available for your dates" : " available");
      grid.innerHTML = "";
      if (!list.length) grid.appendChild(el("div", { "class": "panel", text: "No cars match. Try other dates, another city, or clear the filters." }));
      list.forEach(function (c) { grid.appendChild(card(c)); });
      var p = new URLSearchParams(); if (qWhere.value) p.set("where", qWhere.value); if (qFrom.value) p.set("from", qFrom.value); if (qUntil.value) p.set("until", qUntil.value);
      history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : ""));
    }
    [qWhere, qFrom, qUntil].forEach(function (i) { i.addEventListener("change", render); });
    render();
  }

  // ---------- CAR PAGE ----------
  var box = $("#car-detail");
  if (box) {
    var car = byId(P.get("id"));
    if (!car) { box.appendChild(el("div", { "class": "panel", text: "This car is not available." })); }
    else {
      document.title = carTitle(car) + " | Pickup & Go";
      var r = rating(car.id), imgs = car.images.length ? car.images : ["placeholder.svg"];
      var sec = function (title, kids) { return el("div", { "class": "sec" }, [el("h2", { text: title })].concat(kids)); };

      // Hero photo + View photos
      function openViewer() {
        var ov = el("div", { "class": "viewer", role: "dialog", "aria-label": "Photos" });
        var close = el("button", { type: "button", "class": "vclose", "aria-label": "Close photos", text: "✕" });
        var shut = function () { ov.remove(); document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
        var onKey = function (e) { if (e.key === "Escape") shut(); };
        close.onclick = shut; document.addEventListener("keydown", onKey);
        ov.appendChild(el("div", { "class": "vtop" }, [close, el("strong", { text: carTitle(car) + (r ? "  •  ★ " + r.avg.toFixed(1) : "") })]));
        var list = el("div", { "class": "vlist" });
        imgs.forEach(function (src, i) { list.appendChild(el("img", { src: src, alt: carTitle(car) + " photo " + (i + 1), loading: "lazy" })); });
        ov.appendChild(list); document.body.appendChild(ov); document.body.style.overflow = "hidden"; close.focus();
      }
      var heroImg = el("img", { src: imgs[0], alt: carTitle(car) });
      var fv = favs().indexOf(car.id) >= 0;
      var heart = el("button", { type: "button", "class": "heart" + (fv ? " on" : ""), "aria-label": "Save " + car.name, text: fv ? "♥" : "♡" });
      heart.onclick = function () { var v = favs(), i = v.indexOf(car.id); if (i >= 0) v.splice(i, 1); else v.push(car.id); setFavs(v); heart.className = "heart" + (i < 0 ? " on" : ""); heart.textContent = i < 0 ? "♥" : "♡"; };
      var vb = el("button", { type: "button", "class": "viewph", text: "View " + imgs.length + (imgs.length > 1 ? " photos" : " photo") });
      heroImg.onclick = vb.onclick = openViewer;
      box.appendChild(el("div", { "class": "hero-img" }, [heroImg, heart, vb]));

      // Title + quick facts
      var ratingEl = r ? el("span", {}, [el("strong", { text: r.avg.toFixed(1) + " " }), el("span", { "class": "rate" }, [el("i", { text: "★" })]), document.createTextNode(" (" + r.n + (r.n > 1 ? " reviews)" : " review)"))]) : el("span", { "class": "new", text: "New listing" });
      var sub = el("div", { "class": "meta", style: "font-size:1rem;display:flex;gap:8px;flex-wrap:wrap;align-items:center" }, [document.createTextNode(car.year + (car.trim ? " " + car.trim : "")), document.createTextNode("·"), ratingEl]);
      if (car.host && car.host.badge) { sub.appendChild(document.createTextNode("·")); sub.appendChild(el("span", { "class": "new", text: car.host.badge })); }
      box.appendChild(el("h1", { style: "font-size:2rem;margin:16px 0 4px", text: car.name }));
      box.appendChild(sub);
      var chip = function (t) { return el("div", { "class": "spec" }, [document.createTextNode(t)]); };
      var chipsEl = el("div", { "class": "specs" }, [chip(car.seats + " seats"), chip(car.fuel)]);
      if (car.mpg) chipsEl.appendChild(chip(car.mpg + " MPG"));
      chipsEl.appendChild(chip(car.transmission));
      box.appendChild(chipsEl);
      if (car.description) box.appendChild(el("p", { style: "white-space:pre-line", text: car.description }));

      // Your trip
      var from = el("input", { type: "datetime-local", id: "c-from", value: P.get("from") || "" });
      var until = el("input", { type: "datetime-local", id: "c-until", value: P.get("until") || "" });
      var lab = function (t, inp) { return el("label", { "class": "form", style: "font-weight:600;gap:6px;display:grid" }, [document.createTextNode(t), inp]); };
      box.appendChild(sec("Your trip", [el("div", { "class": "form" }, [lab("Trip start", from), lab("Trip end", until)])]));
      box.appendChild(sec("Pickup & return location", [el("p", { style: "margin:0", text: car.city }), el("p", { "class": "meta", style: "margin:4px 0 0", text: car.delivery ? "Delivery to you is available on request. The owner confirms details." : "Pickup only. The owner shares the exact address after approval." })]));
      box.appendChild(sec("Cancellation policy", [el("p", { style: "margin:0", text: window.POLICY })]));
      if (car.distance) box.appendChild(sec("Distance included", [el("p", { style: "margin:0", text: car.distance }), car.extra_mile ? el("p", { "class": "meta", style: "margin:4px 0 0", text: car.extra_mile }) : null]));
      if (car.protection) box.appendChild(sec("Protection", [el("p", { style: "margin:0", text: car.protection })]));

      // Vehicle features (grouped, with More/Less)
      var groups = car.feature_groups ? JSON.parse(JSON.stringify(car.feature_groups)) : { "Features": (car.features || []).slice() };
      if (car.min_age) { groups["Additional features"] = (groups["Additional features"] || []).concat("Must be " + car.min_age + "+ to book"); }
      var fWrap = el("div", { "class": "feats" }), total = 0;
      Object.keys(groups).forEach(function (g) {
        if (!groups[g].length) return;
        fWrap.appendChild(el("h3", { style: "margin:14px 0 4px", text: g }));
        groups[g].forEach(function (x) { total++; fWrap.appendChild(el("div", { "class": "fi", text: x })); });
      });
      var fKids = [fWrap];
      if (total > 8) {
        fWrap.className = "feats collapsed";
        var tg = el("button", { type: "button", "class": "btn alt", style: "width:100%;margin-top:10px", text: "Show all features" });
        tg.onclick = function () { var c = fWrap.className.indexOf("collapsed") >= 0; fWrap.className = c ? "feats" : "feats collapsed"; tg.textContent = c ? "Less" : "Show all features"; };
        fKids.push(tg);
      }
      box.appendChild(sec("Vehicle features", fKids));

      // Included in the price
      var inc = window.INCLUDED || [
        { title: "Convenience", items: ["Clear pickup and return instructions from the owner", "Reach the owner by phone or email"] },
        { title: "Peace of mind", items: ["Keep the vehicle tidy, no car wash needed"] }
      ];
      box.appendChild(sec("Included in the price", inc.map(function (g) {
        return el("div", {}, [el("h3", { style: "margin:12px 0 4px", text: g.title })].concat(g.items.map(function (x) { return el("div", { "class": "fi", text: x }); })));
      })));

      // Host
      if (car.host && car.host.name) box.appendChild(sec("Hosted by", [el("p", { style: "margin:0" }, [el("strong", { text: car.host.name }), document.createTextNode(car.host.trips ? "  ·  " + car.host.trips + " trips" : "")])]));

      // Reviews
      var rv = [];
      if (!r) rv.push(el("p", { style: "margin:0", text: "No reviews yet. Rent this car and be the first to review it." }));
      else {
        rv.push(el("div", { style: "font-size:2.2rem;font-weight:800" }, [document.createTextNode(r.avg.toFixed(1) + " "), el("span", { "class": "rate" }, [el("i", { text: "★" })]), el("span", { "class": "meta", style: "font-size:1rem;font-weight:500", text: "  " + r.n + (r.n > 1 ? " ratings" : " rating") })]));
        ["Cleanliness", "Maintenance", "Communication", "Convenience", "Accuracy"].forEach(function (k) {
          var vals = r.list.filter(function (x) { return x.cats && typeof x.cats[k] === "number"; }).map(function (x) { return x.cats[k]; });
          if (!vals.length) return;
          var av = vals.reduce(function (p, q) { return p + q; }, 0) / vals.length;
          rv.push(el("div", { "class": "bar-row" }, [el("span", { text: k }), el("div", { "class": "track" }, [el("div", { "class": "fill", style: "width:" + (av / 5 * 100) + "%" })]), el("strong", { text: av.toFixed(1) })]));
        });
        r.list.forEach(function (x) {
          var kids = [el("div", { "class": "s", style: "color:var(--teal-d);letter-spacing:2px", text: stars(x.rating) }), el("p", { style: "margin:4px 0", text: x.text }), el("div", { "class": "meta", text: x.name + " • " + x.date })];
          if (x.reply) kids.push(el("div", { "class": "note", style: "margin-top:8px" }, [el("strong", { text: (car.host && car.host.name ? car.host.name : "Owner") + "'s response" }), el("p", { style: "margin:4px 0 0", text: x.reply })]));
          rv.push(el("div", { "class": "rev" }, kids));
        });
      }
      box.appendChild(sec("Reviews", rv));

      // Bottom booking bar
      var priceEl = el("div", {}), go = el("a", { "class": "btn", href: "#", text: "Continue" });
      var bar = el("div", { "class": "bbar" }, [priceEl, go]);
      document.body.appendChild(bar); document.body.classList.add("has-mbar");
      var update = function () {
        var a = new Date(from.value), b = new Date(until.value);
        var q = new URLSearchParams({ car: car.id }); if (from.value) q.set("from", from.value); if (until.value) q.set("until", until.value);
        go.href = "booking.html?" + q; go.removeAttribute("aria-disabled");
        if (!validRange(a, b)) { priceEl.innerHTML = "<b style='font-size:1.15rem'>" + money(car.price_per_day) + "/day</b><div class='meta'>Pick dates for your total</div>"; return; }
        if (overlaps(car, a, b)) { priceEl.innerHTML = "<b>Not available</b><div class='meta'>Try different dates</div>"; go.setAttribute("aria-disabled", "true"); return; }
        var n = dayCount(a, b);
        priceEl.innerHTML = "<b style='font-size:1.15rem'>" + money(car.price_per_day * n) + " total</b><div class='meta'>" + n + (n > 1 ? " days" : " day") + " · " + money(car.price_per_day) + "/day · estimate</div>";
      };
      from.onchange = until.onchange = update; update();
    }
  }

  // ---------- BOOKING PAGE ----------
  var form = $("#booking-form");
  if (form) {
    var sel = $("#car-select"), pf = form.pickup_time, df = form.dropoff_time;
    cars().forEach(function (c) { sel.appendChild(el("option", { value: c.id, text: carTitle(c) + " (" + money(c.price_per_day) + "/day)" })); });
    if (P.get("car") && byId(P.get("car"))) sel.value = P.get("car");
    pf.value = P.get("from") || ""; df.value = P.get("until") || "";
    var estEl = $("#est");
    function upd() {
      var c = byId(sel.value), a = new Date(pf.value), b = new Date(df.value);
      $("#est-total").value = "";
      if (!c || !validRange(a, b)) { estEl.textContent = "Choose your dates to see an estimated total."; return; }
      var n = dayCount(a, b), t = c.price_per_day * n;
      estEl.innerHTML = money(c.price_per_day) + " x " + n + (n > 1 ? " days" : " day") + " = <b>" + money(t) + "</b> estimated (owner confirms final total)";
      $("#est-total").value = money(t);
      $("#delivery-row").style.display = c.delivery ? "flex" : "none";
    }
    [sel, pf, df].forEach(function (i) { i.addEventListener("change", upd); }); upd();
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var c = byId(sel.value), err = $("#form-error"), btn = $("#send-btn");
      err.style.display = "none";
      var fail = function (m) { err.textContent = m; err.style.display = "block"; err.scrollIntoView({ behavior: "smooth", block: "center" }); };
      var a = new Date(pf.value), b = new Date(df.value);
      if (!c) return fail("Choose a car.");
      if (isNaN(a) || isNaN(b)) return fail("Enter pickup and drop-off date and time.");
      if (a < new Date()) return fail("Pickup time must be in the future.");
      if (b <= a) return fail("Drop-off must be after pickup.");
      if (overlaps(c, a, b)) return fail("Those dates overlap an existing booking for this car. Choose different dates.");
      $("#car-name").value = carTitle(c);
      if (!window.FORM_ENDPOINT) return fail("Booking is not connected yet. Please call or email us using the details below.");
      btn.disabled = true; btn.textContent = "Sending...";
      fetch(window.FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
        .then(function (r) { if (r.ok) location.href = "thanks.html"; else throw new Error(); })
        .catch(function () { btn.disabled = false; btn.textContent = "Send rental request"; fail("Could not send your request. Please try again or call us."); });
    });
  }
})();
