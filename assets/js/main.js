document.addEventListener("DOMContentLoaded", () => {
  const switchBtn = document.querySelector("[data-lang-toggle]");
  if (!switchBtn) return;

  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const isChinese = path.startsWith("/cn");

  const pageMap = {
    "/": "/cn/",
    "/index.html": "/cn/",
    "/topic.html": "/cn/topic.html",
    "/contact.html": "/cn/contact.html",
    "/cn": "/",
    "/cn/": "/",
    "/cn/index.html": "/",
    "/cn/topic.html": "/topic.html",
    "/cn/contact.html": "/contact.html",
  };

  const target = pageMap[path] || (isChinese ? "/" : "/cn/");

  switchBtn.addEventListener("click", () => {
    window.location.href = target;
  });
});