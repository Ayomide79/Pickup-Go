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
      var r = rating(car.id);
      var main = el("img", { "class": "gal-main", src: car.images[0] || "placeholder.svg", alt: carTitle(car) });
      var left = el("div", {}, [main]);
      if (car.images.length > 1) {
        var th = el("div", { "class": "thumbs" });
        car.images.forEach(function (src, i) {
          var t = el("img", { src: src, alt: carTitle(car) + " photo " + (i + 1), "class": i ? "" : "on" });
          t.onclick = function () { main.src = src; Array.prototype.forEach.call(th.children, function (x) { x.className = ""; }); t.className = "on"; };
          th.appendChild(t);
        });
        left.appendChild(th);
      }
      var spec = function (k, v) { return el("div", { "class": "spec" }, [document.createTextNode(k), el("b", { text: v })]); };
      left.appendChild(el("h1", { style: "font-size:2rem;margin-top:18px", text: carTitle(car) }));
      left.appendChild(el("p", { "class": "meta", text: car.type + " · " + car.city }));
      left.appendChild(r ? el("div", { "class": "rate" }, [el("i", { text: "★ " }), document.createTextNode(r.avg.toFixed(1) + " (" + r.n + " reviews)")]) : el("span", { "class": "new", text: "New listing" }));
      left.appendChild(el("div", { "class": "specs" }, [spec("Seats", String(car.seats)), spec("Transmission", car.transmission), spec("Fuel", car.fuel), spec("Delivery", car.delivery ? "Available" : "Pickup only")]));
      left.appendChild(el("h3", { text: "About this car" }));
      left.appendChild(el("p", { style: "white-space:pre-line", text: car.description }));
      left.appendChild(el("h3", { text: "Features" }));
      left.appendChild(el("ul", { "class": "feat" }, car.features.map(function (x) { return el("li", { text: x }); })));
      left.appendChild(el("h3", { style: "margin-top:22px", text: "Cancellation policy" }));
      left.appendChild(el("p", { text: window.POLICY }));
      left.appendChild(el("h3", { style: "margin-top:22px", text: "Reviews" }));
      var rv = el("div", { "class": "panel" });
      if (!r) rv.appendChild(el("p", { style: "margin:0", text: "No reviews yet. Be the first to rent this car." }));
      else r.list.forEach(function (x) {
        rv.appendChild(el("div", { "class": "rev" }, [el("div", { "class": "s", text: stars(x.rating) }), el("strong", { text: x.name }), el("span", { "class": "meta", text: "  " + x.date }), el("p", { style: "margin:4px 0 0", text: x.text })]));
      });
      left.appendChild(rv);

      var from = el("input", { type: "datetime-local", id: "c-from", value: P.get("from") || "" });
      var until = el("input", { type: "datetime-local", id: "c-until", value: P.get("until") || "" });
      var est = el("div", { "class": "est" });
      var go = el("a", { "class": "btn", style: "display:block", href: "#", text: "Request this car" });
      var right = el("div", { "class": "panel sticky", id: "book-card" }, [
        el("div", { "class": "price", style: "margin:0 0 10px" }, [document.createTextNode(money(car.price_per_day)), el("small", { text: " / day" })]),
        el("label", { "class": "meta", text: "Pickup" }), from,
        el("label", { "class": "meta", style: "display:block;margin-top:8px", text: "Drop-off" }), until, est, go,
        el("p", { "class": "meta", style: "margin:10px 0 0", text: "You won't be charged now. The owner confirms availability and your final total." })
      ]);
      box.appendChild(left); box.appendChild(right);
      function update() {
        var a = new Date(from.value), b = new Date(until.value);
        var q = new URLSearchParams({ car: car.id }); if (from.value) q.set("from", from.value); if (until.value) q.set("until", until.value);
        go.href = "booking.html?" + q; go.removeAttribute("aria-disabled");
        if (!validRange(a, b)) { est.innerHTML = "Pick pickup and drop-off to see your total."; return; }
        if (overlaps(car, a, b)) { est.innerHTML = "<b>Not available</b> for these dates. Try different dates."; go.setAttribute("aria-disabled", "true"); return; }
        var n = dayCount(a, b);
        est.innerHTML = money(car.price_per_day) + " x " + n + (n > 1 ? " days" : " day") + "<br><b>Estimated total " + money(car.price_per_day * n) + "</b>";
      }
      from.onchange = until.onchange = update; update();
      var mb = el("div", { "class": "mbar" }, [el("div", { "class": "price", style: "margin:0" }, [document.createTextNode(money(car.price_per_day)), el("small", { text: " / day" })]), el("a", { "class": "btn", href: "#book-card", text: "Choose dates" })]);
      document.body.appendChild(mb); document.body.classList.add("has-mbar");
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
