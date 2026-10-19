const TOKEN = {
  mint: "Goqx3oFohWoTnuJbVhT7DcGfq6EjLrPyhTEuyHUZpump",
  buyBase: "https://pump.fun/coin/",
  dexBase: "https://dexscreener.com/solana/",
};

function isLiveMint(mint) {
  return Boolean(mint && mint.length > 20);
}

function applyTokenLinks() {
  const mint = TOKEN.mint.trim();
  const live = isLiveMint(mint);
  const buyUrl = live ? `${TOKEN.buyBase}${mint}` : "https://pump.fun";
  const dexUrl = live ? `${TOKEN.dexBase}${mint}` : "https://dexscreener.com/solana";

  document.querySelectorAll('a[href="https://pump.fun"]').forEach((a) => {
    a.href = buyUrl;
  });

  const dexLink = document.getElementById("dexscreener-link");
  if (dexLink) dexLink.href = dexUrl;

  const display = document.getElementById("ca-display");
  if (display && live) display.textContent = mint;

  const frame = document.getElementById("chart-frame");
  if (frame && live && !document.getElementById("dexscreener-embed")) {
    frame.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.id = "dexscreener-embed";
    iframe.className = "dexscreener-embed";
    iframe.title = "DexScreener $CATEUS Chart";
    iframe.src = `${dexUrl}?embed=1&loadChartSettings=0&trades=0&tabs=0&info=0&chartLeftToolbar=0&chartDefaultOnMobile=1&chartTheme=dark&chartStyle=1&chartType=usd&interval=15`;
    iframe.allow = "clipboard-write";
    iframe.loading = "lazy";
    frame.appendChild(iframe);
  }
}

function initContract() {
  const display = document.getElementById("ca-display");
  const copyBtn = document.getElementById("copy-ca");
  const toast = document.getElementById("copy-toast");
  if (!display || !copyBtn || !toast) return;

  copyBtn.addEventListener("click", async () => {
    const address = display.textContent.trim();
    if (!isLiveMint(address)) {
      toast.textContent = "Mint address coming soon — launching on pump.fun.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
      return;
    }

    try {
      await navigator.clipboard.writeText(address);
      copyBtn.classList.add("copied");
      copyBtn.querySelector("span").textContent = "Copied!";
      toast.textContent = "Mint address copied!";
      toast.classList.add("show");

      setTimeout(() => {
        copyBtn.classList.remove("copied");
        copyBtn.querySelector("span").textContent = "Copy";
        toast.classList.remove("show");
      }, 2500);
    } catch {
      toast.textContent = "Copy failed — select and copy manually.";
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2500);
    }
  });
}

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const header = document.querySelector(".site-header");

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });

  links.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function initReveals() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;

  if (!("IntersectionObserver" in window)) {
    nodes.forEach((el) => el.classList.add("in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  nodes.forEach((el) => io.observe(el));
}

function initMemeLightbox() {
  const lightbox = document.getElementById("meme-lightbox");
  if (!lightbox) return;

  const img = lightbox.querySelector(".lightbox-img");
  const caption = lightbox.querySelector(".lightbox-caption");
  const closeBtn = lightbox.querySelector(".lightbox-close");

  const close = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    img.src = "";
    img.alt = "";
    caption.textContent = "";
  };

  document.querySelectorAll(".meme-item, .relic-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      const src = btn.dataset.full;
      const text = btn.dataset.caption || "";
      const thumb = btn.querySelector("img");
      img.src = src;
      img.alt = thumb ? thumb.alt : text;
      caption.textContent = text;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
    });
  });

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) close();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applyTokenLinks();
  initContract();
  initNav();
  initReveals();
  initMemeLightbox();
});
