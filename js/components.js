document.addEventListener("DOMContentLoaded", async () => {
  const headerSlot = document.getElementById("site-header");
  const footerSlot = document.getElementById("site-footer");

  try {
    const [headerResponse, footerResponse] = await Promise.all([
      fetch("/components/header.html"),
      fetch("/components/footer.html")
    ]);

    if (!headerResponse.ok || !footerResponse.ok) {
      throw new Error("Failed to load website components.");
    }

    const [headerHTML, footerHTML] = await Promise.all([
      headerResponse.text(),
      footerResponse.text()
    ]);

    if (headerSlot) {
      headerSlot.innerHTML = headerHTML;
    }

    if (footerSlot) {
      footerSlot.innerHTML = footerHTML;
    }

    const currentPage =
      location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll("#nav a[data-page]").forEach(link => {
      if (link.dataset.page === currentPage) {
        link.setAttribute("aria-current", "page");
      }
    });

    const burger = document.querySelector(".burger");
    const nav = document.getElementById("nav");

    if (burger && nav) {
      burger.addEventListener("click", () => {
        const isOpen = burger.getAttribute("aria-expanded") === "true";

        burger.setAttribute("aria-expanded", String(!isOpen));
        nav.classList.toggle("open", !isOpen);
      });
    }

    const year = document.getElementById("yr");

    if (year) {
      year.textContent = new Date().getFullYear();
    }

  } catch (error) {
    console.error("Website components could not load:", error);
  }
});
