/*
  Curso de Ética Profesional · reproductor tipo feed (como TikTok), sin cuentas ni "me gusta".
  - Todo el curso es una secuencia de pasos a pantalla completa, en el orden del esquema (js/curso.js).
  - Se avanza deslizando, con la rueda, con las flechas del teclado o con los botones.
    Los videos se pueden saltar; las preguntas y el mapa hay que completarlos para seguir.
  - Videos: vertical en celular y horizontal en PC; sonido, subtítulos, "Leer" y "Transcripción".
  - El avance se guarda en este navegador (localStorage).
*/
(function () {
  "use strict";
  var C = window.CURSO;
  var T = window.TRANSCRIPCIONES || {};
  var $ = function (id) { return document.getElementById(id); };
  var app = $("app"), pista = $("pista"), barras = $("barras"), vivo = $("vivo");
  var reducido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Pasos ----------
  var P = [];
  C.secciones.forEach(function (s, si) {
    s.pasos.forEach(function (p, k) {
      p.sec = s; p.si = si; p.k = k;
      P.push(p);
    });
  });
  var porId = {};
  P.forEach(function (p, i) { porId[p.id] = i; });

  // ---------- Estado guardado en el navegador ----------
  var st = { i: 0, vis: {}, vid: {}, r: {}, enl: {}, sonido: false, cc: true };
  function cargar() {
    try {
      var o = JSON.parse(localStorage.getItem(C.clave) || "null");
      if (o) Object.keys(st).forEach(function (k) { if (o[k] !== undefined) st[k] = o[k]; });
    } catch (e) {}
  }
  function guardar() {
    try { localStorage.setItem(C.clave, JSON.stringify(st)); } catch (e) {}
  }
  var ultimo = 0;
  function guardarCadaRato() {
    var t = Date.now();
    if (t - ultimo > 5000) { ultimo = t; guardar(); }
  }

  // ---------- Utilidades ----------
  function el(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt !== undefined) e.textContent = txt;
    return e;
  }
  function anunciar(txt) {
    vivo.textContent = "";
    setTimeout(function () { vivo.textContent = txt; }, 60);
  }
  function completo(k) {
    var p = P[k];
    if (p.tipo === "video") return !!st.vid[p.id];
    if (p.tipo === "enlace") return !p.url || !!st.enl[p.id];
    if (p.tipo === "mapa") return !!st.r[p.id];
    if (["portada", "lectura", "faq", "documento", "fin"].indexOf(p.tipo) >= 0) return true;
    return st.r[p.id] !== undefined;
  }
  // ¿Este paso impide seguir? Los videos no: se puede avanzar aunque no se hayan terminado.
  function bloquea(k) { return P[k].tipo !== "video" && !completo(k); }
  // Primer paso que impide seguir: hasta ahí se puede llegar
  function alcanzable() {
    for (var k = 0; k < P.length; k++) if (bloquea(k)) return k;
    return P.length - 1;
  }
  function orientacion() {
    return window.innerWidth / window.innerHeight < 1 ? "vertical" : "horizontal";
  }
  function nombreSeccion(s) { return s.numero + " · " + s.titulo; }

  // ---------- Construcción ----------
  var videos = {};
  var mapas = {}; // pasos de tipo "mapa": su iframe
  P.forEach(function (p, k) {
    var s = el("section", "paso");
    s.style.top = k * 100 + "%";
    s.id = "paso-" + p.id;
    s.tabIndex = -1;
    s.setAttribute("aria-roledescription", "paso");
    var f = {
      portada: construirPortada, video: construirVideo, lectura: construirLectura, faq: construirFaq,
      documento: construirDocumento, enlace: construirEnlace, parejas: construirParejas, vf: construirVF,
      clasificar: construirClasificar, opcion: construirOpcion, completar: construirCompletar, fin: construirFin,
      palabra: construirPalabra, ordenar: construirOrdenar,
      mapa: construirMapa,
    }[p.tipo];
    f(s, p);
    s.setAttribute("aria-label", "Paso " + (k + 1) + " de " + P.length + ": " + etiquetaPaso(p));
    pista.appendChild(s);
  });
  C.secciones.forEach(function () {
    var b = el("span");
    b.appendChild(el("i"));
    barras.appendChild(b);
  });

  function etiquetaPaso(p) {
    var t = p.titulo || p.pregunta || p.sec.titulo;
    return tipoPaso(p) + ", " + t;
  }
  function tipoPaso(p) {
    return { portada: "Introducción", video: "Video", lectura: "Lectura", faq: "Preguntas frecuentes", documento: "Documento", enlace: p.etiqueta || "Enlace", fin: "Final", mapa: "Mapa interactivo" }[p.tipo] || "Actividad";
  }

  function construirPortada(s, p) {
    s.className += " paso-portada";
    var d = el("div", "portada");
    d.appendChild(el("span", "tira portada-num", p.sec.numero));
    var h = el("h2", "tira portada-tit", p.sec.titulo);
    d.appendChild(h);
    if (p.texto) {
      d.appendChild(el("p", "portada-sub", p.sub || (/^5\./.test(p.sec.numero) ? "Objetivo" : "Antes de empezar")));
      d.appendChild(el("p", "portada-texto", p.texto));
    }
    s.appendChild(d);
  }

  function construirVideo(s, p) {
    s.className += " paso-video" + (p.fuentes ? "" : " unica");
    var v = el("video");
    v.setAttribute("playsinline", "");
    v.preload = "none";
    v.disablePictureInPicture = true;
    v.setAttribute("aria-label", "Video: " + p.titulo);
    if (p.subtitulos) {
      var tr = el("track");
      tr.kind = "captions";
      tr.srclang = "es";
      tr.label = "Español";
      tr.src = p.subtitulos;
      v.appendChild(tr);
    }
    var play = el("button", "play");
    play.type = "button";
    play.setAttribute("aria-label", "Reproducir: " + p.titulo);
    play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
    var info = el("div", "info-video");
    info.appendChild(el("span", "pildora", nombreSeccion(p.sec)));
    info.appendChild(el("h2", "", p.titulo));
    var lt = el("div", "linea-tiempo");
    lt.setAttribute("aria-hidden", "true");
    var visto = el("div", "lt-visto"), avance = el("div", "lt-avance");
    lt.appendChild(visto);
    lt.appendChild(avance);
    s.appendChild(v);
    s.appendChild(play);
    s.appendChild(info);
    s.appendChild(lt);
    var o = { v: v, play: play, visto: visto, avance: avance, p: p, orient: null, k: P.indexOf(p) };
    videos[p.id] = o;

    function alternar() {
      if (v.paused) reproducir(o); else v.pause();
    }
    play.addEventListener("click", alternar);
    v.addEventListener("click", function () {
      if (v.muted) { activarSonido(true); return; }
      alternar();
    });
    v.addEventListener("play", function () { play.hidden = true; pintarAviso(); });
    v.addEventListener("pause", function () { play.hidden = false; pintarAviso(); });
    v.addEventListener("volumechange", pintarSonido);
    v.addEventListener("timeupdate", function () {
      if (!v.paused) st.vis[p.id] = Math.max(st.vis[p.id] || 0, v.currentTime);
      pintarVideo(o);
      guardarCadaRato();
    });
    v.addEventListener("ended", function () {
      st.vid[p.id] = true;
      st.vis[p.id] = v.duration;
      guardar();
      pintarVideo(o);
      pintarNav();
      anunciar("Video terminado.");
    });
    v.addEventListener("loadedmetadata", function () { aplicarSubtitulos(o); });
    lt.addEventListener("click", function (e) {
      var r = lt.getBoundingClientRect();
      var t = ((e.clientX - r.left) / r.width) * (v.duration || 0);
      v.currentTime = Math.max(0, t);
    });
  }
  function fuentes(p) {
    if (p.fuentes) { var or = orientacion(); return { src: p.fuentes[or], poster: p.portadas[or], or: or }; }
    return { src: p.fuente, poster: p.portada, or: "unica" };
  }
  function fuenteVideo(o) {
    var f = fuentes(o.p);
    if (f.or === o.orient) return;
    var t = o.v.currentTime || 0;
    var sonando = !o.v.paused;
    o.orient = f.or;
    o.v.poster = f.poster;
    o.v.src = f.src;
    o.v.preload = "metadata";
    if (t > 0 || sonando) {
      o.v.addEventListener("loadedmetadata", function g() {
        o.v.removeEventListener("loadedmetadata", g);
        o.v.currentTime = t;
        if (sonando) reproducir(o);
      });
    }
  }
  function pintarVideo(o) {
    var d = o.v.duration || 1;
    o.avance.style.width = (100 * o.v.currentTime) / d + "%";
    o.visto.style.width = (100 * Math.min(st.vid[o.p.id] ? d : st.vis[o.p.id] || 0, d)) / d + "%";
  }
  function reproducir(o) {
    o.v.muted = !st.sonido;
    var pr = o.v.play();
    if (pr && pr.catch) {
      pr.catch(function () {
        // El navegador no deja reproducir con sonido sin un toque: se intenta sin sonido
        if (!o.v.muted) { o.v.muted = true; o.v.play().catch(function () {}); }
      });
    }
  }
  function aplicarSubtitulos(o) {
    for (var j = 0; j < o.v.textTracks.length; j++) o.v.textTracks[j].mode = st.cc ? "showing" : "hidden";
  }

  function tarjetaBase(s, etiqueta, gris) {
    s.className += " paso-tarjeta" + (gris ? " gris" : "");
    var t = el("article", "tarjeta");
    t.appendChild(el("span", "etiqueta", etiqueta));
    s.appendChild(t);
    return t;
  }
  function construirLectura(s, p) {
    var t = tarjetaBase(s, "Lectura");
    t.appendChild(el("h2", "", p.titulo));
    t.appendChild(el("p", "", p.texto));
    t.appendChild(el("p", "fuente", p.fuente));
  }
  function construirFaq(s, p) {
    var t = tarjetaBase(s, "Información importante");
    t.appendChild(el("h2", "", p.titulo));
    var lista = el("div", "faq");
    p.preguntas.forEach(function (q) {
      var d = el("details");
      d.appendChild(el("summary", "", q.p));
      var r = el("div", "faq-r");
      if (q.r.length > 1) {
        var ul = el("ul");
        q.r.forEach(function (x) { ul.appendChild(el("li", "", x)); });
        r.appendChild(ul);
      } else r.appendChild(el("p", "", q.r[0]));
      d.appendChild(r);
      lista.appendChild(d);
    });
    t.appendChild(lista);
  }
  function construirDocumento(s, p) {
    var t = tarjetaBase(s, "Documento");
    t.appendChild(el("h2", "", p.titulo));
    t.appendChild(el("p", "", p.texto));
    var b = el("div", "botones");
    var abrir = el("a", "boton principal", "Abrir la revista");
    abrir.href = p.archivo;
    abrir.target = "_blank";
    abrir.rel = "noopener";
    abrir.appendChild(el("span", "solo-lector", " (se abre en otra pestaña)"));
    var bajar = el("a", "boton", "Descargar");
    bajar.href = p.archivo;
    bajar.setAttribute("download", "");
    b.appendChild(abrir);
    b.appendChild(bajar);
    t.appendChild(b);
    if (p.detalle) t.appendChild(el("p", "detalle", p.detalle));
  }
  function construirEnlace(s, p) {
    var t = tarjetaBase(s, p.etiqueta || "Enlace", true);
    t.appendChild(el("h2", "", p.titulo));
    t.appendChild(el("p", "", p.texto));
    if (p.url) {
      var b = el("div", "botones");
      var a = el("a", "boton principal", p.boton || "Abrir");
      a.href = p.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.appendChild(el("span", "solo-lector", " (se abre en otra pestaña)"));
      a.addEventListener("click", function () {
        st.enl[p.id] = true;
        guardar();
        pintarNav();
      });
      b.appendChild(a);
      t.appendChild(b);
    } else {
      t.appendChild(el("p", "pendiente", "El enlace estará disponible pronto. Por ahora puedes continuar."));
    }
  }
  // Mapa interactivo (otra página dentro del paso). Se completa cuando avisa que se descubrió todo.
  function construirMapa(s, p) {
    s.className += " paso-mapa";
    var f = el("iframe");
    f.title = p.titulo;
    f.setAttribute("allow", "autoplay");
    s.appendChild(f);
    mapas[p.id] = { f: f, p: p };
  }
  window.addEventListener("message", function (e) {
    var d = e.data || {};
    if (d.tipo !== "mapa-beneficios") return;
    Object.keys(mapas).forEach(function (id) {
      if (e.source !== mapas[id].f.contentWindow) return;
      if (d.fin && !st.r[id]) {
        st.r[id] = true;
        guardar();
        pintarNav();
        anunciar("Descubriste todo el mapa. Ya puedes continuar.");
      }
    });
  });

  function construirFin(s, p) {
    var t = tarjetaBase(s, C.titulo);
    t.appendChild(el("div", "fin-icono", "🎉"));
    t.firstChild.nextSibling.setAttribute("aria-hidden", "true");
    t.appendChild(el("h2", "", p.titulo));
    t.appendChild(el("p", "", p.texto));
  }

  // ---------- Preguntas ----------
  function botonVerVideo(t, p) {
    if (!p.verEnVideo) return;
    var pie = el("div", "pie");
    var ver = el("button", "boton", "▶ Ver en el video");
    ver.type = "button";
    ver.addEventListener("click", function () {
      var k = porId[p.verEnVideo.paso];
      ir(k, true);
      var o = videos[p.verEnVideo.paso];
      var irA = function () {
        o.v.currentTime = p.verEnVideo.t;
        reproducir(o);
      };
      if (o.v.readyState >= 1) irA();
      else o.v.addEventListener("loadedmetadata", function g() { o.v.removeEventListener("loadedmetadata", g); irA(); });
    });
    pie.appendChild(ver);
    t.appendChild(pie);
  }
  function respondida(p) {
    guardar();
    pintarNav();
    anunciar("Pregunta respondida. Ya puedes continuar.");
  }

  function construirParejas(s, p) {
    var t = tarjetaBase(s, "Pregunta", true);
    t.appendChild(el("h2", "", p.pregunta));
    t.appendChild(el("p", "instruccion", p.instruccion + " Elige una situación y luego su pareja."));
    var g = el("div", "parejas");
    var izq = el("div", "parejas-col"), der = el("div", "parejas-col");
    izq.setAttribute("role", "group");
    izq.setAttribute("aria-label", "Situaciones");
    der.setAttribute("role", "group");
    der.setAttribute("aria-label", "Opciones");
    g.appendChild(izq);
    g.appendChild(der);
    t.appendChild(g);
    botonVerVideo(t, p);

    var sel = { izq: null, der: null }, unidas = 0, fallos = 0;
    function boton(col, texto, lado, valor, cls) {
      var b = el("button", "pareja " + (cls || ""));
      b.type = "button";
      b.innerHTML = '<span class="num" aria-hidden="true"></span><span></span>';
      b.lastChild.textContent = texto;
      b.dataset.valor = valor;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", function () {
        if (b.disabled) return;
        if (sel[lado]) { sel[lado].classList.remove("elegida"); sel[lado].setAttribute("aria-pressed", "false"); }
        sel[lado] = b;
        b.classList.add("elegida");
        b.setAttribute("aria-pressed", "true");
        if (sel.izq && sel.der) probar(sel.izq, sel.der);
      });
      col.appendChild(b);
      return b;
    }
    var bIzq = p.izquierda.map(function (x, k) { return boton(izq, x.texto, "izq", String(k)); });
    p.derecha.forEach(function (x) { boton(der, x.texto, "der", x.id, "valor"); });

    function unir(bi, bd) {
      unidas++;
      [bi, bd].forEach(function (x) {
        x.classList.remove("elegida");
        x.classList.add("unida");
        x.disabled = true;
        x.removeAttribute("aria-pressed");
        x.firstChild.textContent = String(unidas);
      });
      bi.setAttribute("aria-label", bi.lastChild.textContent + ": unida con " + bd.lastChild.textContent);
    }
    function probar(bi, bd) {
      sel.izq = sel.der = null;
      var ok = bd.dataset.valor === p.izquierda[+bi.dataset.valor].correcta;
      if (ok) {
        unir(bi, bd);
        anunciar("Correcto: " + bi.lastChild.textContent + ", " + bd.lastChild.textContent + ".");
        if (unidas === p.izquierda.length) { st.r[p.id] = { fallos: fallos }; respondida(p); }
      } else {
        fallos++;
        anunciar("No es correcto. Intenta otra pareja.");
        [bi, bd].forEach(function (x) {
          x.classList.remove("elegida");
          x.setAttribute("aria-pressed", "false");
          x.classList.add("fallo");
        });
        setTimeout(function () { [bi, bd].forEach(function (x) { x.classList.remove("fallo"); }); }, 650);
      }
    }
    p._restaurar = function () {
      if (st.r[p.id] === undefined) return;
      var ders = der.querySelectorAll(".pareja");
      bIzq.forEach(function (bi, k) {
        for (var j = 0; j < ders.length; j++) if (ders[j].dataset.valor === p.izquierda[k].correcta) unir(bi, ders[j]);
      });
    };
  }

  function construirVF(s, p) {
    var t = tarjetaBase(s, "Pregunta", true);
    t.appendChild(el("h2", "", p.pregunta));
    var lista = el("div", "vf");
    t.appendChild(lista);
    botonVerVideo(t, p);
    var respuestas = [];
    var filas = p.afirmaciones.map(function (a, k) {
      var f = el("div", "vf-fila");
      f.setAttribute("role", "group");
      var texto = el("p", "", a.texto);
      texto.id = p.id + "-a" + k;
      f.setAttribute("aria-labelledby", texto.id);
      f.appendChild(texto);
      var bs = el("div", "vf-botones");
      var bv = el("button", "", "Verdadero"), bf = el("button", "", "Falso");
      bv.type = bf.type = "button";
      bs.appendChild(bv);
      bs.appendChild(bf);
      f.appendChild(bs);
      lista.appendChild(f);
      function elegir(valor) {
        if (respuestas[k] !== undefined) return;
        respuestas[k] = valor;
        marcar(k, valor);
        anunciar(valor === a.correcta ? "Correcto." : "Incorrecto. La respuesta es " + (a.correcta ? "verdadero." : "falso."));
        if (respuestas.filter(function (x) { return x !== undefined; }).length === p.afirmaciones.length) {
          st.r[p.id] = respuestas.slice();
          respondida(p);
        }
      }
      bv.addEventListener("click", function () { elegir(true); });
      bf.addEventListener("click", function () { elegir(false); });
      return { f: f, bv: bv, bf: bf, texto: texto };
    });
    function marcar(k, valor) {
      var x = filas[k], a = p.afirmaciones[k];
      x.bv.disabled = x.bf.disabled = true;
      (valor ? x.bv : x.bf).classList.add("elegido");
      (a.correcta ? x.bv : x.bf).classList.add("es-correcta");
      var bien = valor === a.correcta;
      x.f.classList.add(bien ? "bien" : "mal");
      x.texto.appendChild(el("span", "marca", bien ? "✓ Correcto" : "✗ Incorrecto"));
    }
    p._restaurar = function () {
      var r = st.r[p.id];
      if (!r) return;
      r.forEach(function (valor, k) { respuestas[k] = valor; marcar(k, valor); });
    };
  }

  function construirClasificar(s, p) {
    var t = tarjetaBase(s, "Pregunta", true);
    t.appendChild(el("h2", "", p.pregunta));
    t.appendChild(el("p", "instruccion", p.instruccion));
    var caja = el("div", "clasif");
    var actual = el("div", "clasif-actual");
    actual.setAttribute("aria-live", "polite");
    var cuenta = el("span", "clasif-cuenta"), texto = el("p", "clasif-texto");
    actual.appendChild(cuenta);
    actual.appendChild(texto);
    var botones = el("div", "clasif-botones");
    var cols = el("div", "clasif-cols");
    var listas = {};
    p.grupos.forEach(function (g, k) {
      var b = el("button", "clasif-btn g" + k);
      b.type = "button";
      b.innerHTML = '<span aria-hidden="true"></span> ';
      b.firstChild.textContent = g.icono;
      b.appendChild(document.createTextNode(g.texto));
      b.addEventListener("click", function () { elegir(g.id, b); });
      botones.appendChild(b);
      var c = el("div", "clasif-col g" + k);
      c.appendChild(el("h3", "", g.texto));
      var ul = el("ul");
      c.appendChild(ul);
      cols.appendChild(c);
      listas[g.id] = ul;
    });
    caja.appendChild(actual);
    caja.appendChild(botones);
    caja.appendChild(cols);
    t.appendChild(caja);
    botonVerVideo(t, p);

    var i = 0, fallos = 0, ocupado = false;
    function pintar() {
      var listo = i >= p.items.length;
      actual.hidden = botones.hidden = listo;
      if (listo) return;
      cuenta.textContent = i + 1 + " de " + p.items.length;
      texto.textContent = p.items[i].texto;
    }
    function colocar(k) { listas[p.items[k].correcta].appendChild(el("li", "", p.items[k].texto)); }
    function elegir(g, b) {
      if (ocupado || i >= p.items.length) return;
      if (g === p.items[i].correcta) {
        colocar(i);
        i++;
        pintar();
        if (i === p.items.length) { st.r[p.id] = { fallos: fallos }; respondida(p); }
      } else {
        fallos++;
        ocupado = true;
        anunciar("No es correcto. Prueba el otro lado.");
        actual.classList.add("fallo");
        b.classList.add("fallo");
        setTimeout(function () {
          ocupado = false;
          actual.classList.remove("fallo");
          b.classList.remove("fallo");
        }, 650);
      }
    }
    pintar();
    p._restaurar = function () {
      if (st.r[p.id] === undefined) return;
      for (; i < p.items.length; i++) colocar(i);
      pintar();
    };
  }

  function construirOpcion(s, p) {
    var t = tarjetaBase(s, p.etiqueta || "Pregunta", true);
    t.appendChild(el("h2", "", p.pregunta));
    if (p.caso) t.appendChild(el("p", "caso", p.caso));
    var lista = el("div", "opciones");
    t.appendChild(lista);
    botonVerVideo(t, p);
    var bs = p.opciones.map(function (o, k) {
      var b = el("button", "opcion");
      b.type = "button";
      b.innerHTML = '<span class="letra" aria-hidden="true"></span><span></span>';
      b.firstChild.textContent = String.fromCharCode(65 + k);
      b.lastChild.textContent = o.texto;
      b.addEventListener("click", function () {
        if (st.r[p.id] !== undefined) return;
        st.r[p.id] = o.id;
        marcar(o.id);
        anunciar(o.correcta ? "Correcto." : "Incorrecto. La respuesta correcta está marcada en verde.");
        respondida(p);
      });
      lista.appendChild(b);
      return b;
    });
    function marcar(id) {
      p.opciones.forEach(function (o, k) {
        var b = bs[k];
        b.disabled = true;
        if (o.id === id) {
          b.classList.add(o.correcta ? "bien" : "mal");
          b.lastChild.appendChild(el("span", "marca", o.correcta ? "✓ Correcto" : "✗ Tu respuesta"));
        } else if (o.correcta) {
          b.classList.add("es-correcta");
          b.lastChild.appendChild(el("span", "marca", "✓ Respuesta correcta"));
        }
      });
    }
    p._restaurar = function () { if (st.r[p.id] !== undefined) marcar(st.r[p.id]); };
  }

  function construirCompletar(s, p) {
    var t = tarjetaBase(s, "Pregunta", true);
    t.appendChild(el("h2", "", p.pregunta));
    t.appendChild(el("p", "instruccion", p.instruccion));
    var lista = el("div", "completar");
    t.appendChild(lista);
    botonVerVideo(t, p);
    var resp = [];
    var filas = p.frases.map(function (f, k) {
      var fila = el("div", "comp-fila");
      fila.setAttribute("role", "group");
      var frase = el("p", "comp-frase");
      frase.id = p.id + "-f" + k;
      fila.setAttribute("aria-labelledby", frase.id);
      frase.appendChild(document.createTextNode(f.antes + " "));
      var hueco = el("span", "hueco");
      hueco.appendChild(el("span", "solo-lector", "espacio en blanco"));
      frase.appendChild(hueco);
      frase.appendChild(document.createTextNode(f.despues));
      fila.appendChild(frase);
      var ops = el("div", "comp-ops");
      var bs = f.opciones.map(function (o, j) {
        var b = el("button", "", o);
        b.type = "button";
        b.addEventListener("click", function () {
          if (resp[k] !== undefined) return;
          resp[k] = j;
          marcar(k, j);
          anunciar(j === f.correcta ? "Correcto." : "Incorrecto. La respuesta es: " + f.opciones[f.correcta] + ".");
          if (resp.filter(function (x) { return x !== undefined; }).length === p.frases.length) {
            st.r[p.id] = resp.slice();
            respondida(p);
          }
        });
        ops.appendChild(b);
        return b;
      });
      fila.appendChild(ops);
      lista.appendChild(fila);
      return { fila: fila, frase: frase, hueco: hueco, bs: bs };
    });
    function marcar(k, j) {
      var x = filas[k], f = p.frases[k];
      x.hueco.textContent = f.opciones[j];
      x.hueco.classList.add("lleno");
      var bien = j === f.correcta;
      x.fila.classList.add(bien ? "bien" : "mal");
      x.frase.appendChild(el("span", "marca", bien ? "✓ Correcto" : "✗ Incorrecto"));
      x.bs.forEach(function (b, m) {
        b.disabled = true;
        if (m === j) b.classList.add("elegido");
        if (m === f.correcta) b.classList.add("es-correcta");
      });
    }
    p._restaurar = function () {
      var r = st.r[p.id];
      if (!r) return;
      r.forEach(function (j, k) { resp[k] = j; marcar(k, j); });
    };
  }

  // Completa la palabra: se tocan las letras en orden (con algunas letras de más para despistar)
  function construirPalabra(s, p) {
    var t = tarjetaBase(s, "Actividad", true);
    t.appendChild(el("h2", "", p.pregunta));
    t.appendChild(el("p", "instruccion", p.instruccion));
    var caja = el("div", "palabra");
    var cuenta = el("span", "clasif-cuenta");
    var frase = el("p", "palabra-frase");
    var huecos = el("div", "palabra-huecos");
    huecos.setAttribute("role", "status");
    var letras = el("div", "palabra-letras");
    letras.setAttribute("role", "group");
    letras.setAttribute("aria-label", "Letras disponibles");
    var hechas = el("ul", "palabra-hechas");
    caja.appendChild(cuenta);
    caja.appendChild(frase);
    caja.appendChild(huecos);
    caja.appendChild(letras);
    caja.appendChild(hechas);
    t.appendChild(caja);
    botonVerVideo(t, p);
    var i = 0, pos = 0, fallos = 0;
    var EXTRA = "AEIOURSTLN";
    function textoFrase(f, palabra) {
      var d = f.despues || "";
      return f.antes + " " + palabra + (/^[,.:;]/.test(d) ? "" : " ") + d;
    }
    function barajar(a) {
      for (var k = a.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var x = a[k]; a[k] = a[j]; a[j] = x; }
      return a;
    }
    function pintar() {
      huecos.textContent = "";
      letras.textContent = "";
      var listo = i >= p.frases.length;
      cuenta.hidden = frase.hidden = huecos.hidden = letras.hidden = listo;
      if (listo) return;
      var f = p.frases[i];
      cuenta.textContent = "Frase " + (i + 1) + " de " + p.frases.length;
      frase.textContent = textoFrase(f, "_".repeat(f.palabra.length));
      f.palabra.split("").forEach(function () {
        var h = el("span", "hueco-letra");
        h.setAttribute("aria-hidden", "true");
        huecos.appendChild(h);
      });
      huecos.setAttribute("aria-label", "Palabra de " + f.palabra.length + " letras. Llevas: ninguna letra");
      var extra = EXTRA.split("").filter(function (c) { return f.palabra.indexOf(c) < 0; });
      var fichas = f.palabra.split("").concat(barajar(extra).slice(0, Math.min(3, extra.length)));
      barajar(fichas).forEach(function (c) {
        var b = el("button", "letra-ficha", c);
        b.type = "button";
        b.setAttribute("aria-label", "Letra " + c);
        b.addEventListener("click", function () { tocar(b, c); });
        letras.appendChild(b);
      });
    }
    function tocar(b, c) {
      var f = p.frases[i];
      if (!f || b.disabled) return;
      if (c === f.palabra[pos]) {
        pos++;
        b.disabled = true;
        b.classList.add("usada");
        var h = huecos.children[pos - 1];
        h.textContent = c;
        h.classList.add("lleno");
        huecos.setAttribute("aria-label", "Llevas: " + f.palabra.slice(0, pos));
        if (pos === f.palabra.length) {
          hechas.appendChild(el("li", "", "✓ " + textoFrase(f, f.mostrar || f.palabra)));
          anunciar("Correcto: " + f.palabra + ".");
          i++;
          pos = 0;
          if (i === p.frases.length) { st.r[p.id] = { fallos: fallos }; respondida(p); }
          setTimeout(pintar, 350);
        }
      } else {
        fallos++;
        anunciar("Esa letra no va ahí. Prueba otra.");
        b.classList.add("fallo");
        setTimeout(function () { b.classList.remove("fallo"); }, 450);
      }
    }
    pintar();
    p._restaurar = function () {
      if (st.r[p.id] === undefined) return;
      p.frases.forEach(function (f) { hechas.appendChild(el("li", "", "✓ " + textoFrase(f, f.mostrar || f.palabra))); });
      i = p.frases.length;
      pintar();
    };
  }

  // Ordena los pasos: se tocan en el orden correcto y van bajando a la lista numerada
  function construirOrdenar(s, p) {
    var t = tarjetaBase(s, "Actividad", true);
    t.appendChild(el("h2", "", p.pregunta));
    t.appendChild(el("p", "instruccion", p.instruccion));
    var lista = el("ol", "ordenar-lista");
    var opciones = el("div", "ordenar-opciones");
    opciones.setAttribute("role", "group");
    opciones.setAttribute("aria-label", "Pasos por ordenar");
    t.appendChild(lista);
    t.appendChild(opciones);
    botonVerVideo(t, p);
    var sig = 0, fallos = 0;
    var orden = p.items.map(function (x, k) { return k; });
    for (var k = orden.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var x = orden[k]; orden[k] = orden[j]; orden[j] = x; }
    if (orden.every(function (v, k) { return v === k; })) orden.reverse();
    var botones = orden.map(function (k) {
      var b = el("button", "ordenar-btn", p.items[k]);
      b.type = "button";
      b.addEventListener("click", function () { elegir(k, b); });
      opciones.appendChild(b);
      return b;
    });
    function colocar(k) { lista.appendChild(el("li", "", p.items[k])); }
    function elegir(k, b) {
      if (k === sig) {
        colocar(k);
        b.remove();
        sig++;
        anunciar("Correcto, paso " + sig + ".");
        if (sig === p.items.length) { opciones.hidden = true; st.r[p.id] = { fallos: fallos }; respondida(p); }
      } else {
        fallos++;
        anunciar("Ese no es el paso " + (sig + 1) + ". Prueba otro.");
        b.classList.add("fallo");
        setTimeout(function () { b.classList.remove("fallo"); }, 450);
      }
    }
    p._restaurar = function () {
      if (st.r[p.id] === undefined) return;
      botones.forEach(function (b) { b.remove(); });
      p.items.forEach(function (x, k) { colocar(k); });
      opciones.hidden = true;
    };
  }

  // ---------- Cabecera, controles y avisos ----------
  var ICO_SONIDO = "M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06A9 9 0 0 0 14 3.23z";
  var ICO_MUDO = "M16.5 12A4.5 4.5 0 0 0 14 8v2.18l2.45 2.45c.03-.2.05-.41.05-.63zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0 0 21 12a9 9 0 0 0-7-8.77v2.06A7 7 0 0 1 19 12zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a9 9 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z";

  function videoActual() { var p = P[st.i]; return p.tipo === "video" ? videos[p.id] : null; }
  function pintarSonido() {
    var o = videoActual();
    var con = o ? !o.v.muted : st.sonido;
    $("ico-sonido").setAttribute("d", con ? ICO_SONIDO : ICO_MUDO);
    $("btn-sonido").setAttribute("aria-pressed", con ? "true" : "false");
    $("txt-sonido").textContent = con ? "Sonido" : "Sin sonido";
    $("btn-sonido").setAttribute("aria-label", con ? "Quitar el sonido" : "Activar el sonido");
    pintarAviso();
  }
  function pintarAviso() {
    var o = videoActual();
    $("aviso-sonido").hidden = !(o && o.v.muted && !o.v.paused);
  }
  function activarSonido(si) {
    st.sonido = si;
    guardar();
    var o = videoActual();
    if (o) {
      o.v.muted = !si;
      if (si && o.v.paused) reproducir(o);
    }
    pintarSonido();
  }
  function pintarRail() {
    var p = P[st.i];
    var esVideo = p.tipo === "video";
    document.body.classList.toggle("en-video", esVideo);
    document.body.classList.toggle("en-tarjeta", !esVideo);
    $("rail").hidden = !esVideo;
    if (!esVideo) return;
    $("btn-leer").hidden = !p.leer;
    $("btn-trans").hidden = !T[p.id];
    $("btn-cc").hidden = !p.subtitulos;
    $("btn-cc").setAttribute("aria-pressed", st.cc ? "true" : "false");
    $("btn-cc").setAttribute("aria-label", st.cc ? "Ocultar subtítulos" : "Mostrar subtítulos");
    pintarSonido();
  }
  function pintarCabecera() {
    var p = P[st.i];
    $("titulo-seccion").textContent = nombreSeccion(p.sec);
    $("paso-actual").textContent = "Paso " + (p.k + 1) + " de " + p.sec.pasos.length + " · " + tipoPaso(p);
    var hechos = 0;
    C.secciones.forEach(function (s, si) {
      var n = 0;
      s.pasos.forEach(function (q) { if (completo(porId[q.id]) && porId[q.id] <= maxVisitado()) n++; });
      hechos += n;
      var b = barras.children[si];
      b.classList.toggle("actual", si === p.si);
      b.firstChild.style.width = (100 * n) / s.pasos.length + "%";
    });
    barras.setAttribute("aria-label", "Avance del curso: " + Math.round((100 * hechos) / P.length) + " %");
  }
  function pintarNav() {
    var abajo = $("btn-abajo");
    $("btn-arriba").disabled = st.i === 0;
    var ultimoPaso = st.i === P.length - 1;
    abajo.disabled = ultimoPaso;
    var ok = !bloquea(st.i);
    abajo.classList.toggle("listo", !ultimoPaso && ok);
    abajo.setAttribute("aria-label", ok ? "Paso siguiente" : "Completa este paso para continuar");
    $("ico-abajo").setAttribute("d", ok ? "M12 17l7-7-1.4-1.4L12 14.2 6.4 8.6 5 10z" : "M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2zm-7-2a2 2 0 0 1 4 0v2h-4z");
    pintarCabecera();
  }
  var visitado = 0;
  function maxVisitado() { return Math.max(visitado, st.i); }

  // ---------- Navegación ----------
  function ir(j, forzar) {
    if (j < 0 || j >= P.length || j === st.i) return;
    if (j > st.i && !forzar) {
      for (var k = st.i; k < j; k++) {
        if (bloquea(k)) {
          app.style.setProperty("--tr", "translateY(" + -st.i * 100 + "%)");
          app.classList.remove("rebote");
          void app.offsetWidth;
          app.classList.add("rebote");
          anunciar("Completa este paso para continuar.");
          return;
        }
      }
    }
    var o = videoActual();
    if (o) o.v.pause();
    var m = mapas[P[st.i].id];
    if (m && m.f.contentWindow) m.f.contentWindow.postMessage({ tipo: "mapa-pausar" }, "*");
    st.i = j;
    visitado = Math.max(visitado, j);
    mostrar(true);
    guardar();
  }
  function mostrar(enfocar) {
    pista.style.transform = "translateY(" + -st.i * 100 + "%)";
    P.forEach(function (p, k) {
      var s = $("paso-" + p.id);
      var activo = k === st.i;
      s.setAttribute("aria-hidden", activo ? "false" : "true");
      if (activo) s.removeAttribute("inert"); else s.setAttribute("inert", "");
      if (p.tipo === "video" && Math.abs(k - st.i) <= 1) fuenteVideo(videos[p.id]);
      if (p.tipo === "mapa" && Math.abs(k - st.i) <= 1 && !mapas[p.id].f.getAttribute("src")) mapas[p.id].f.src = p.src;
    });
    pintarRail();
    pintarNav();
    var p = P[st.i];
    anunciar("Paso " + (st.i + 1) + " de " + P.length + ". " + nombreSeccion(p.sec) + ". " + etiquetaPaso(p) + ".");
    if (enfocar) $("paso-" + p.id).focus({ preventScroll: true });
    var o = videoActual();
    if (o && !reducido) reproducir(o);
    pintarAviso();
  }
  function siguiente() { ir(st.i + 1); }
  function anterior() { ir(st.i - 1); }

  $("btn-abajo").addEventListener("click", siguiente);
  $("btn-arriba").addEventListener("click", anterior);
  $("btn-sonido").addEventListener("click", function () {
    var o = videoActual();
    activarSonido(o ? o.v.muted : !st.sonido);
  });
  $("aviso-sonido").addEventListener("click", function () { activarSonido(true); });
  $("btn-cc").addEventListener("click", function () {
    st.cc = !st.cc;
    guardar();
    Object.keys(videos).forEach(function (id) { aplicarSubtitulos(videos[id]); });
    pintarRail();
  });

  // ---------- Paneles ----------
  var panel = $("panel");
  var origenPanel = null;
  function abrirPanel(titulo, nodos, origen) {
    $("panel-titulo").textContent = titulo;
    var c = $("panel-cuerpo");
    c.textContent = "";
    nodos.forEach(function (n) { c.appendChild(n); });
    var o = videoActual();
    if (o) o.v.pause();
    origenPanel = origen;
    panel.showModal();
    c.scrollTop = 0;
  }
  panel.addEventListener("close", function () { if (origenPanel) origenPanel.focus(); });
  $("panel-cerrar").addEventListener("click", function () { panel.close(); });
  $("btn-leer").addEventListener("click", function () {
    var p = P[st.i];
    var l = typeof p.leer === "string" ? P[porId[p.leer]] : p.leer;
    var n = [el("p", "", l.texto)];
    if (l.fuente) n.push(el("p", "fuente", l.fuente));
    abrirPanel(l.titulo, n, this);
  });
  $("btn-trans").addEventListener("click", function () {
    var p = P[st.i];
    var n = (T[p.id] || []).map(function (x) { return el("p", "", x); });
    abrirPanel("Transcripción: " + p.titulo, n, this);
  });
  [panel, $("indice")].forEach(function (d) {
    // Cerrar al tocar fuera del panel
    d.addEventListener("click", function (e) { if (e.target === d) d.close(); });
  });

  var indice = $("indice");
  function pintarIndice() {
    var lista = $("indice-lista");
    lista.textContent = "";
    var tope = alcanzable();
    C.secciones.forEach(function (s, si) {
      var primero = porId[s.pasos[0].id];
      var hechos = s.pasos.filter(function (q) { return completo(porId[q.id]) && porId[q.id] <= maxVisitado(); }).length;
      var li = el("li");
      var b = el("button", "indice-item" + (P[st.i].si === si ? " actual" : ""));
      b.type = "button";
      b.appendChild(el("span", "indice-num", s.numero));
      b.appendChild(el("span", "indice-tit", s.titulo));
      var estado = hechos === s.pasos.length ? "Completada" : primero > tope ? "Bloqueada" : hechos ? "En curso" : "Disponible";
      b.appendChild(el("span", "indice-estado" + (estado === "Completada" ? " hecho" : ""), estado));
      if (P[st.i].si === si) b.setAttribute("aria-current", "step");
      b.disabled = primero > tope;
      b.addEventListener("click", function () {
        indice.close();
        ir(primero, true);
      });
      li.appendChild(b);
      lista.appendChild(li);
    });
  }
  $("btn-indice").addEventListener("click", function () {
    pintarIndice();
    var o = videoActual();
    if (o) o.v.pause();
    indice.showModal();
  });
  indice.addEventListener("close", function () { $("btn-indice").focus(); });
  $("indice-cerrar").addEventListener("click", function () { indice.close(); });
  $("btn-reiniciar").addEventListener("click", function () {
    if (!window.confirm("¿Borrar tu avance en este navegador y empezar de nuevo?")) return;
    try { localStorage.removeItem(C.clave); } catch (e) {}
    window.location.reload();
  });

  // ---------- Teclado, rueda y gestos ----------
  function hayDialogo() { return panel.open || indice.open; }
  document.addEventListener("keydown", function (e) {
    if (hayDialogo() || e.altKey || e.ctrlKey || e.metaKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); siguiente(); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); anterior(); }
    else if (e.key === " " && tag !== "button" && tag !== "a" && tag !== "summary") {
      var o = videoActual();
      if (!o) return;
      e.preventDefault();
      if (o.v.paused) reproducir(o); else o.v.pause();
    }
  });

  var enfriando = false;
  app.addEventListener("wheel", function (e) {
    var t = e.target.closest ? e.target.closest(".tarjeta") : null;
    if (t && t.scrollHeight > t.clientHeight + 2) {
      var abajoFin = t.scrollTop + t.clientHeight >= t.scrollHeight - 2;
      var arribaFin = t.scrollTop <= 0;
      if ((e.deltaY > 0 && !abajoFin) || (e.deltaY < 0 && !arribaFin)) return;
    }
    e.preventDefault();
    if (enfriando || Math.abs(e.deltaY) < 25) return;
    enfriando = true;
    setTimeout(function () { enfriando = false; }, 750);
    if (e.deltaY > 0) siguiente(); else anterior();
  }, { passive: false });

  var y0 = null, x0 = null, t0 = 0, tarjeta = null, scroll0 = 0;
  app.addEventListener("pointerdown", function (e) {
    y0 = e.clientY; x0 = e.clientX; t0 = Date.now();
    tarjeta = e.target.closest ? e.target.closest(".tarjeta") : null;
    scroll0 = tarjeta ? tarjeta.scrollTop : 0;
  });
  app.addEventListener("pointerup", function (e) {
    if (y0 === null) return;
    var dy = e.clientY - y0, dx = e.clientX - x0;
    y0 = null;
    if (tarjeta && tarjeta.scrollTop !== scroll0) return;
    if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx) * 1.3 && Date.now() - t0 < 900) {
      if (dy < 0) siguiente(); else anterior();
    }
  });
  // En celular el scroll interno de una tarjeta larga necesita touch-action propio
  app.addEventListener("pointercancel", function () { y0 = null; });

  window.addEventListener("resize", function () {
    P.forEach(function (p, k) { if (p.tipo === "video" && Math.abs(k - st.i) <= 1) fuenteVideo(videos[p.id]); });
  });
  window.addEventListener("pagehide", guardar);

  // ---------- Arranque ----------
  cargar();
  if (!(st.i >= 0 && st.i < P.length)) st.i = 0;
  st.i = Math.min(st.i, alcanzable());
  visitado = st.i;
  P.forEach(function (p) { if (p._restaurar) p._restaurar(); });
  pista.style.transition = "none";
  mostrar(false);
  Object.keys(videos).forEach(function (id) { pintarVideo(videos[id]); });
  void pista.offsetWidth;
  pista.style.transition = "";
})();
