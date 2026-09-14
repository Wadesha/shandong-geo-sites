/* 山东地质实地考察点 · 站点脚本
   只做三件事：明暗主题记忆、首页随机抽一处、总表筛选。无外部依赖。 */
(function () {
  "use strict";
  var K = "sdgs-theme";

  function root() { return document.documentElement; }

  function paint(t) {
    if (t) { root().setAttribute("data-theme", t); }
    else { root().removeAttribute("data-theme"); }
    var b = document.getElementById("themeBtn");
    if (b) { b.textContent = (t === "dark") ? "浅色" : (t === "light" ? "深色" : "主题"); }
  }

  try { paint(localStorage.getItem(K)); } catch (e) { paint(null); }

  function toggle() {
    var cur = root().getAttribute("data-theme");
    var dark = window.matchMedia && window.matchMedia("(prefers-color-scheme:dark)").matches;
    var next = (cur === "dark") ? "light" : (cur === "light" ? "dark" : (dark ? "light" : "dark"));
    try { localStorage.setItem(K, next); } catch (e) {}
    paint(next);
  }

  var DATA = window.__SITES__ || [];
  var PREFIX = window.__PREFIX__ || "";
  var cur = -1;

  function pick() {
    var v = document.getElementById("viewer");
    if (!DATA.length) { return; }
    var i = Math.floor(Math.random() * DATA.length);
    if (DATA.length > 1 && i === cur) { i = (i + 1) % DATA.length; }
    cur = i;
    var d = DATA[i];
    var why = (d.w || []).map(function (p) {
      return '<a class="tag p" href="' + PREFIX + 'p/' + p.toLowerCase() + '.html">' + p + "</a>";
    }).join("");
    var html = '<p class="vt">' + d.n + "</p>" +
      '<p class="psub">' + d.g + " ｜ " + (d.cty ? d.cty + " ｜ " : "") + d.loc + "</p>" +
      '<p class="q">' + d.s + "</p>" +
      (d.o ? '<p class="kvline">现场看点：' + d.o + "</p>" : "") +
      '<p class="kvline">时代：' + d.age + " ｜ 本页正文约 " + (d.wc || 0) + " 字" +
      " ｜ 术语 " + (d.tm || 0) + " 条 ｜ 原理标签：" + why + "</p>";
    if (v) { v.innerHTML = html; }
    var o = document.getElementById("btnopen");
    if (o) { o.href = PREFIX + "t/" + d.slug + ".html"; }
    var m = document.getElementById("pickmeta");
    if (m) { m.textContent = "第 " + (i + 1) + " / " + DATA.length + " 处"; }
  }

  function filter() {
    var q = document.getElementById("q");
    var g = document.getElementById("grp");
    var items = document.querySelectorAll("#all .it");
    var kw = q ? q.value.trim().toLowerCase() : "";
    var gv = g ? g.value : "";
    var n = 0;
    for (var i = 0; i < items.length; i++) {
      var el = items[i];
      var hay = (el.getAttribute("data-t") || "") + " " + (el.getAttribute("data-l") || "") +
        " " + (el.getAttribute("data-m") || "");
      var ok = (gv === "" || el.getAttribute("data-g") === gv) &&
        (kw === "" || hay.toLowerCase().indexOf(kw) >= 0);
      el.style.display = ok ? "" : "none";
      if (ok) { n++; }
    }
    var c = document.getElementById("cnt");
    if (c) { c.textContent = n; }
  }

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest) { return; }
    if (t.closest("[data-theme-toggle]")) { e.preventDefault(); toggle(); return; }
    if (t.closest("#btnnext")) { e.preventDefault(); pick(); return; }
  });

  document.addEventListener("input", function (e) {
    if (e.target && (e.target.id === "q" || e.target.id === "grp")) { filter(); }
  });
  document.addEventListener("change", function (e) {
    if (e.target && e.target.id === "grp") { filter(); }
  });

  if (document.getElementById("viewer") && DATA.length) { pick(); filter(); }
})();
