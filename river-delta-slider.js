/*
  River Delta ScrollSliderFullWidth — external widget script
  =============================================================
  Host this file (e.g. https://your-host/river-delta-slider.js) and paste
  ONLY this into a Webflow "Embed" element, wherever the section should
  appear on the page:

    <script src="https://your-host/river-delta-slider.js"></script>
    <div id="dbr-widget-river-delta"></div>

  Everything else (CSS, markup, GSAP, the fonts link) is loaded/injected by
  this script itself — the Embed never needs to change again. All future
  edits happen here, in this one file.
*/
(function () {
  var MOUNT_ID = "dbr-widget-river-delta";

  var CSS = `
  .rd-slider,
  .rd-slider * {
    box-sizing: border-box;
  }
  .rd-slider {
    position: relative;
    width: 100vw;
    height: 100vh;
    height: 100svh; /* accounts for browser chrome (address bar, etc.) where supported */
    overflow: hidden;
    background: #fdf4ec;
  }

  .rd-bg {
    position: absolute;
    inset: 0;
    transform-origin: center;
  }
  .rd-bg-img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .rd-bg-gradient {
    position: absolute;
    inset: 0;
    opacity: 0;
    pointer-events: none;
    background: linear-gradient(to bottom, #f7e5d7 0%, #f7e5d7 50%, rgba(247, 229, 215, 0) 100%);
  }
  .rd-track {
    position: relative;
    display: flex;
    height: 100%;
    width: 500vw;
  }
  .rd-slide {
    position: relative;
    height: 100%;
    width: 100vw;
    flex-shrink: 0;
  }

  .rd-slide-intro {
    padding: 0 24px;
  }
  .rd-intro-heading-wrap {
    position: absolute;
    left: 50%;
    top: 44%;
    transform: translate(-50%, -100%);
    width: 100%;
    max-width: 896px;
    padding: 0 24px;
  }
  .rd-intro-heading {
    margin: 0;
    text-align: center;
    font-family: "tosh-a", sans-serif;
    font-weight: 700;
    font-size: 36px;
    line-height: 1.05;
    color: #455d43;
  }
  .rd-intro-heading span {
    display: block;
  }
  .rd-intro-coords {
    position: absolute;
    top: calc(53% + 24px);
    left: 24.8%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    white-space: nowrap;
  }
  #rdCta {
    position: absolute;
    top: 68%;
    left: 50%;
    transform: translateX(-50%);
  }
  .rd-mode-mobile .rd-swipe-hint {
    position: absolute;
    top: 68%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 0;
  }

  /* heading + flower group shared by slide types A, B and the mobile stat split */
  .rd-heading-group {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .rd-flower {
    pointer-events: none;
    position: absolute;
    top: -70px;
    left: 50%;
    transform: translateX(-50%);
    height: 288px;
    width: auto;
    max-width: none;
    opacity: 0.7;
  }
  .rd-heading2 {
    position: relative;
    margin: 0;
    text-align: center;
    font-family: "tosh-a", sans-serif;
    font-weight: 700;
    font-size: 30px;
    line-height: 1.2;
    color: #455d43;
  }
  .rd-heading2 span {
    display: block;
  }
  @media (min-width: 640px) {
    .rd-heading2 {
      font-size: 36px;
    }
    .rd-intro-heading {
      font-size: 43.2px;
    }
  }
  @media (min-width: 768px) {
    .rd-heading2 {
      font-size: 48px;
    }
    .rd-intro-heading {
      font-size: 57.6px;
    }
  }

  .rd-slide-a {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 64px;
    text-align: center;
    padding: 24px 24px 64px;
  }
  .rd-body {
    max-width: 768px;
    font-family: barlow, sans-serif;
    font-size: 19.2px;
    font-weight: 700;
    line-height: 1.6;
    color: #26302a;
    margin: 0;
  }
  @media (min-width: 640px) {
    .rd-body {
      font-size: 21.6px;
    }
  }
  .rd-quote {
    margin: 32px 0 0;
    max-width: 640px;
    font-family: alegreya, serif;
    font-style: italic;
    font-size: 20px;
    color: #455d43;
  }
  .rd-cta {
    margin-top: 40px;
    border: none;
    cursor: pointer;
    border-radius: 999px;
    background: #455d43;
    padding: 14px 32px;
    font-family: barlow, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #fdf4ec;
    text-transform: uppercase;
    transition: transform 0.2s;
  }
  .rd-cta:hover {
    transform: scale(1.03);
  }
  /* mobile-only visual hint (see the media query below) — not clickable, the
     whole slider is a native swipe carousel on mobile so there's nothing to tap */
  .rd-swipe-hint {
    display: none;
    margin-top: 40px;
    align-items: center;
    gap: 8px;
    border-radius: 999px;
    background: #455d43;
    padding: 14px 32px;
    font-family: barlow, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #fdf4ec;
    text-transform: uppercase;
  }
  .rd-swipe-hint-arrow {
    width: 16px;
    height: 16px;
    animation: rd-swipe-nudge 1.4s ease-in-out infinite;
  }
  @keyframes rd-swipe-nudge {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(4px);
    }
  }
  .rd-down-arrow {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 24px;
    height: 24px;
    color: #455d43;
  }

  .rd-slide-b {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 64px;
    padding: 24px 24px 64px;
    text-align: center;
  }
  .rd-stat-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 40px;
    width: 100%;
    max-width: 1152px;
    padding: 0 16px;
  }
  @media (min-width: 640px) {
    .rd-stat-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  /* mobile only: one stat per slide (see the matchMedia split in the script below) */
  .rd-slide-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 64px;
    padding: 32px 32px 64px;
    text-align: center;
  }
  .rd-stat {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
  }
  .rd-stat-number-wrap {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .rd-stat-illustration {
    pointer-events: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 168px;
    width: auto;
    max-width: none;
    opacity: 0.7;
  }
  .rd-stat-number {
    position: relative;
    font-family: "tosh-a", sans-serif;
    font-weight: 700;
    font-size: 48px;
    color: #ce6a49;
  }
  .rd-stat-text {
    max-width: 320px;
    font-family: barlow, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    color: #26302a;
    margin: 0;
  }

  /* pin marker (slide 0) -- the dot itself is baked into the map image; this is
     just the arrow pointing at it, anchored so its tip lands exactly on the dot */
  .rd-pin {
    position: absolute;
    top: 53%;
    left: 49.6%;
    transform: translate(-50%, -100%);
  }
  .rd-pin-arrow {
    width: 24px;
    height: 54px;
    color: #455d43;
  }
  .rd-pin-place {
    font-family: alegreya, serif;
    font-style: italic;
    font-size: 14px;
    color: #455d43;
  }
  .rd-pin-coords {
    font-family: barlow, sans-serif;
    font-size: 14px;
    color: rgba(38, 48, 42, 0.8);
  }

  /* fixed overlay chrome */
  .rd-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  .rd-chrome-top {
    display: none;
    align-items: flex-start;
    justify-content: space-between;
    padding: 24px;
  }
  .rd-back {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 8px;
    border: none;
    cursor: pointer;
    border-radius: 999px;
    background: #455d43;
    padding: 10px 20px;
    font-family: barlow, sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.05em;
    color: #fdf4ec;
    text-transform: uppercase;
  }
  .rd-dots {
    pointer-events: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rd-dot {
    height: 10px;
    width: 10px;
    border-radius: 999px;
    background: rgba(69, 93, 67, 0.25);
    border: none;
    cursor: pointer;
    transition: all 0.3s;
    padding: 0;
  }
  .rd-dot:hover {
    background: rgba(69, 93, 67, 0.4);
  }
  .rd-dot.active {
    width: 24px;
    background: #ce6a49;
  }

  /* Mobile: plain native swipe carousel, no pin/wheel hijack. The button becomes
     a static hint, Back goes away (there's no fullscreen mode to exit), dots
     stay visible always instead of only while "activated".
     Scoped to a JS-added class (.rd-mode-mobile), NOT a width media query — the
     mobile/desktop choice must match the one-time JS decision that also splits
     the stat slides, and a live @media re-evaluating on its own (e.g. a mobile
     browser's address bar collapsing and changing the viewport height/width
     after load) would otherwise disagree with that frozen JS decision and leave
     the UI in a broken mixed state. */
  .rd-mode-mobile #rdCta {
    display: none;
  }
  .rd-mode-mobile .rd-swipe-hint {
    display: flex;
  }
  .rd-mode-mobile #rdChromeTop {
    display: flex !important;
  }
  .rd-mode-mobile #rdBack {
    display: none;
  }
  .rd-mode-mobile .rd-track-native {
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    width: 100% !important;
  }
  .rd-mode-mobile .rd-track-native > .rd-slide {
    scroll-snap-align: start;
  }
  /* mobile has no "activate" transition to fade this in via GSAP (it's just a
     native swipe carousel from the start) -- show it statically instead. The
     gradient's own stops are percentage-based, so they stay proportional to
     the section's height on any screen size without needing to change here. */
  .rd-mode-mobile .rd-bg-gradient {
    opacity: 1;
  }

  @media (min-width: 640px) {
    .rd-stat-text {
      font-size: 16px;
    }
    .rd-quote {
      font-size: 24px;
    }
    .rd-stat-number {
      font-size: 60px;
    }
    .rd-chrome-top {
      padding: 40px;
    }
  }
`;

  var MARKUP = `
<section class="rd-slider" id="rdSlider">
  <div class="rd-bg" id="rdBg">
    <img src="https://cdn.prod.website-files.com/6a4d2455e075b8e04999d6bd/6a58d7bde07d902567b6913a_0856b41d833c3f2463daa48b99e3f108_mapa_Cultural-Flow.webp" alt="Map of the Saskatchewan River Delta" class="rd-bg-img" />
  </div>
  <div class="rd-bg-gradient" id="rdBgGradient"></div>

  <div class="rd-track" id="rdTrack">
    <!-- slide 0: intro (map + pin + CTA) -->
    <div class="rd-slide rd-slide-intro">
      <div class="rd-intro-heading-wrap">
        <h1 class="rd-intro-heading"><span>About the</span><span>Saskatchewan River Delta.</span></h1>
      </div>

      <!-- arrow tip lands exactly on the dot baked into the map image itself -->
      <div class="rd-pin">
        <svg class="rd-pin-arrow" viewBox="0 0 49.28 111.45" fill="currentColor" aria-hidden="true">
          <path
            d="M49.28,76.81c-6.23,1-20.83,8.93-20.83,34.63h-10.89c0-26.09-12.73-33.74-17.56-34.65l1.18-6.26c5.79,1.09,14.09,6.42,18.9,18.43V0h6.37v89.09c5.62-12.27,15.4-17.54,21.82-18.57l1.01,6.29Z"
          />
        </svg>
      </div>

      <div class="rd-intro-coords">
        <span class="rd-pin-place">Saskatchewan River Delta</span>
        <span class="rd-pin-coords">53.9438, -102.3106</span>
      </div>

      <button type="button" class="rd-cta" id="rdCta">DISCOVER WHY IT MATTERS</button>
      <div class="rd-swipe-hint" aria-hidden="true">
        <span>DISCOVER WHY IT MATTERS</span>
        <svg viewBox="0 0 24 24" fill="none" class="rd-swipe-hint-arrow">
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- slide 1: intro paragraph -->
    <div class="rd-slide rd-slide-a">
      <div class="rd-heading-group">
        <img class="rd-flower" src="https://cdn.prod.website-files.com/6a4d2455e075b8e04999d6bd/6a613d952eac2a0b91c66f6a_flor.png" alt="" aria-hidden="true" />
        <h2 class="rd-heading2"><span>About the</span><span>Saskatchewan River Delta.</span></h2>
      </div>
      <p class="rd-body">
        One of the largest inland freshwater deltas in North America, the Saskatchewan River Delta
        is a vast network of wetlands, lakes and forest that shelters thousands of species, supports
        migratory bird routes, stores immense amounts of carbon and has sustained Indigenous
        communities for generations.
      </p>
      <svg class="rd-down-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 4v14M6 13l6 6 6-6"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <!-- slide 2: fauna stats -->
    <div class="rd-slide rd-slide-b">
      <div class="rd-heading-group">
        <img class="rd-flower" src="https://cdn.prod.website-files.com/6a4d2455e075b8e04999d6bd/6a613d952eac2a0b91c66f6a_flor.png" alt="" aria-hidden="true" />
        <h2 class="rd-heading2"><span>About the</span><span>Saskatchewan River Delta.</span></h2>
      </div>
      <div class="rd-stat-grid">
        <div class="rd-stat">
          <div class="rd-stat-number-wrap">
            <img class="rd-stat-illustration" src="https://cdn.prod.website-files.com/6a4d2455e075b8e04999d6bd/6a5a46cf891017802f352828_gaviota%402x.webp" alt="" aria-hidden="true" />
            <span class="rd-stat-number">80%</span>
          </div>
          <p class="rd-stat-text">
            Eighty percent of North America's migrating waterfowl funnel through the 10,000 sq km
            Saskatchewan River Delta (only 0.1% of Canada's total land area).
          </p>
        </div>
        <div class="rd-stat">
          <div class="rd-stat-number-wrap">
            <img class="rd-stat-illustration" src="https://cdn.prod.website-files.com/6a4d2455e075b8e04999d6bd/6a5a46ceb2313e023dd673b1_pelicano%402x.webp" alt="" aria-hidden="true" />
            <span class="rd-stat-number">200+</span>
          </div>
          <p class="rd-stat-text">
            More than 200 bird species live in or rely on the area during migration, making it an
            internationally recognized Important Bird Area. The marshes host nesting pelicans, grebes,
            and terns, while hundreds of thousands of waterfowl stop there to breed and rest.
          </p>
        </div>
        <div class="rd-stat">
          <div class="rd-stat-number-wrap">
            <img class="rd-stat-illustration" src="https://cdn.prod.website-files.com/6a4d2455e075b8e04999d6bd/6a5a46ce14f77c5f024d3dfd_salmon%402x.webp" alt="" aria-hidden="true" />
            <span class="rd-stat-number">48</span>
          </div>
          <p class="rd-stat-text">
            Forty-eight fish species call the Saskatchewan River Delta home, including walleye,
            northern pike, and the endangered lake sturgeon.
          </p>
        </div>
      </div>
    </div>

    <!-- slide 3: biodiversity stats -->
    <div class="rd-slide rd-slide-b">
      <div class="rd-heading-group">
        <img class="rd-flower" src="https://cdn.prod.website-files.com/6a4d2455e075b8e04999d6bd/6a613d952eac2a0b91c66f6a_flor.png" alt="" aria-hidden="true" />
        <h2 class="rd-heading2"><span>About the</span><span>Saskatchewan River Delta.</span></h2>
      </div>
      <div class="rd-stat-grid">
        <div class="rd-stat">
          <div class="rd-stat-number-wrap">
            <img class="rd-stat-illustration" src="https://cdn.prod.website-files.com/6a4d2455e075b8e04999d6bd/6a5a47c94e16cf9e2c6024b5_nutria%402x.webp" alt="" aria-hidden="true" />
            <span class="rd-stat-number">43</span>
          </div>
          <p class="rd-stat-text">
            Forty-three mammal species are sustained by the delta's forests and waterways including
            large predators (like wolves, lynx, and black bears) as well as iconic northern wildlife
            like moose, elk, beavers, muskrats, and northern river otters.
          </p>
        </div>
        <div class="rd-stat">
          <div class="rd-stat-number-wrap">
            <img class="rd-stat-illustration" src="https://cdn.prod.website-files.com/6a4d2455e075b8e04999d6bd/6a5a47c9e4724a8514cc55a1_planta_icon%402x.webp" alt="" aria-hidden="true" />
            <span class="rd-stat-number">100+</span>
          </div>
          <p class="rd-stat-text">
            More than 100 plant species anchor the wetland ecosystems that are critical for purifying
            water in shallow marshes and providing food and shelter for wildlife, control erosion, and
            support forest succession and biodiversity.
          </p>
        </div>
        <div class="rd-stat">
          <div class="rd-stat-number-wrap">
            <img class="rd-stat-illustration" src="https://cdn.prod.website-files.com/6a4d2455e075b8e04999d6bd/6a5a47c9b3f5f2061f69c384_duck%402x.webp" alt="" aria-hidden="true" />
            <span class="rd-stat-number">589M</span>
          </div>
          <p class="rd-stat-text">
            An estimated 589M tonnes of organic carbon stored in the delta's soils and ecosystems.
            This carbon mass equates to the greenhouse gas emissions from roughly 460 million
            automobiles over a year.
          </p>
        </div>
      </div>
    </div>

    <!-- slide 4: closing + CTA -->
    <div class="rd-slide rd-slide-a">
      <div class="rd-heading-group">
        <img class="rd-flower" src="https://cdn.prod.website-files.com/6a4d2455e075b8e04999d6bd/6a613d952eac2a0b91c66f6a_flor.png" alt="" aria-hidden="true" />
        <h2 class="rd-heading2"><span>About the</span><span>Saskatchewan River Delta.</span></h2>
      </div>
      <p class="rd-body">
        Decades of upstream dams, agricultural runoff and development have altered the river's
        natural flow. Channels are shrinking, habitats are shifting and wildlife is beginning to
        disappear. But there is still time to change the current.
      </p>
      <p class="rd-quote">Help the Delta find its rhythm again, and life will follow.</p>
      <button type="button" class="rd-cta">SUPPORT THE RESTORATION</button>
    </div>
  </div>

  <div class="rd-overlay">
    <div class="rd-chrome-top" id="rdChromeTop">
      <button type="button" class="rd-back" id="rdBack">
        <svg viewBox="0 0 24 24" fill="none" style="width: 14px; height: 14px" aria-hidden="true">
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Back
      </button>
      <div class="rd-dots" id="rdDots"></div>
    </div>
  </div>
</section>
`;

  function injectFonts() {
    if (document.querySelector("link[data-rd-fonts]")) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://use.typekit.net/fsc2ova.css";
    link.setAttribute("data-rd-fonts", "");
    document.head.appendChild(link);
  }

  function injectStyles() {
    var style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function loadGsap(callback) {
    if (window.gsap) {
      callback();
      return;
    }
    var script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js";
    script.onload = callback;
    document.head.appendChild(script);
  }

  function runSlider() {
  // Drives the slider from wheel input instead of real document scroll. The section
  // never grows the document's height — it swaps between static-in-flow and
  // position:fixed-over-a-same-height-placeholder — so activating/deactivating can
  // never shift page content below it (no ScrollTrigger pin-spacer involved).
    var SLIDE_COUNT = 5;
    var SLIDE_ADVANCE_VH = 90;
    var BACKGROUND_SCALE = 2.52;
    var SNAP_IDLE_MS = 160;
    var EXIT_THRESHOLD_PX = 80;

    var section = document.getElementById("rdSlider");
    var track = document.getElementById("rdTrack");
    var bg = document.getElementById("rdBg");
    var bgGradient = document.getElementById("rdBgGradient");
    var cta = document.getElementById("rdCta");
    var backBtn = document.getElementById("rdBack");
    var chromeTop = document.getElementById("rdChromeTop");
    var dotsWrap = document.getElementById("rdDots");

    // Mobile gets a fundamentally different interaction model (see below), not
    // just a layout tweak — computed once on load, not re-checked on resize.
    // Sets a class rather than leaning on a live @media query so every mobile-
    // only style rule is guaranteed to agree with this same one-time decision,
    // even if the viewport's reported size shifts slightly right after load.
    var isMobile = window.matchMedia("(max-width: 639px)").matches;
    section.classList.toggle("rd-mode-mobile", isMobile);

    // Mobile: a 3-column stat slide doesn't fit a narrow screen — split each of
    // its 3 stats into its own full slide instead (5 slides -> 9). Desktop is
    // untouched.
    if (isMobile) {
      Array.from(track.querySelectorAll(".rd-slide-b")).forEach(function (groupSlide) {
        var headingGroup = groupSlide.querySelector(".rd-heading-group");
        Array.from(groupSlide.querySelectorAll(".rd-stat")).forEach(function (stat) {
          var single = document.createElement("div");
          single.className = "rd-slide rd-slide-stat";
          if (headingGroup) single.appendChild(headingGroup.cloneNode(true));
          single.appendChild(stat);
          track.insertBefore(single, groupSlide);
        });
        groupSlide.remove();
      });
      SLIDE_COUNT = track.children.length;
    }

    for (var i = 0; i < SLIDE_COUNT; i++) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "rd-dot" + (i === 0 ? " active" : "");
      dot.setAttribute("aria-label", "Go to slide " + (i + 1));
      dot.addEventListener(
        "click",
        (function (idx) {
          return function () {
            goTo(idx);
          };
        })(i),
      );
      dotsWrap.appendChild(dot);
    }
    var dotEls = dotsWrap.querySelectorAll(".rd-dot");

    function setActiveIndex(i) {
      dotEls.forEach(function (d, idx) {
        d.classList.toggle("active", idx === i);
      });
    }

    var goTo;

    if (isMobile) {
      // ---- Mobile: plain native swipe carousel, normal vertical page scroll ----
      // No pin, no wheel capture, no fullscreen takeover — the browser's own touch
      // scrolling handles everything, which is what actually works reliably on
      // real devices (wheel events never fire from touch, which is why the
      // desktop wheel-hijack approach silently did nothing on real phones).
      track.classList.add("rd-track-native");

      // Mobile has no separate "activate" step (it's a swipe carousel from the
      // start), but the map should still zoom in once the visitor actually
      // steps off the intro slide, and back out if they swipe back to it.
      var MOBILE_BACKGROUND_SCALE = 1.5;
      var mobileBgZoomedIn = false;
      var setMobileBackgroundZoom = function (index) {
        if (index > 0 && !mobileBgZoomedIn) {
          mobileBgZoomedIn = true;
          gsap.to(bg, { scale: MOBILE_BACKGROUND_SCALE, duration: 2, ease: "expo.out" });
        } else if (index === 0 && mobileBgZoomedIn) {
          mobileBgZoomedIn = false;
          gsap.to(bg, { scale: 1, duration: 0.5, ease: "power2.out" });
        }
      };

      goTo = function (index) {
        track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
      };

      var scrollTimer = null;
      track.addEventListener("scroll", function () {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(function () {
          var index = Math.round(track.scrollLeft / track.clientWidth);
          setActiveIndex(index);
          setMobileBackgroundZoom(index);
        }, 80);
      });
    } else {
      // ---- Desktop: pin + wheel-driven virtual navigation (unchanged) ----
      track.style.width = SLIDE_COUNT * 100 + "vw";

      var isActive = false;
      var slideUnits = 0;
      var overscroll = 0;
      var idleTimer = null;
      var placeholder = null;
      var savedScrollY = 0;
      var proxy = { units: 0 };
      var tween = null;

      var slideAdvancePx = function () {
        return window.innerHeight * (SLIDE_ADVANCE_VH / 100);
      };

      // Plain scrollTo(x, y) inherits the page's scroll-behavior CSS (e.g. sites that
      // enable smooth-scrolling for anchor links) — each of our own per-frame calls
      // would then kick off a competing native smooth-scroll, producing janky,
      // anchor-link-style motion. Forcing "instant" bypasses that unconditionally.
      var scrollToInstant = function (y) {
        window.scrollTo({ top: y, left: 0, behavior: "instant" });
      };

      var render = function () {
        gsap.set(track, { xPercent: (-100 * slideUnits) / SLIDE_COUNT });
        setActiveIndex(Math.round(slideUnits));
      };

      var engageBackground = function () {
        gsap.to(bg, { scale: BACKGROUND_SCALE, duration: 2, ease: "expo.out" });
        gsap.to(bgGradient, { opacity: 1, duration: 2, ease: "expo.out" });
      };
      var releaseBackground = function () {
        gsap.to(bg, { scale: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(bgGradient, { opacity: 0, duration: 0.5, ease: "power2.out" });
      };

      var tweenTo = function (target, duration, onComplete) {
        if (tween) tween.kill();
        proxy.units = slideUnits;
        target = Math.max(0, Math.min(SLIDE_COUNT - 1, target));
        tween = gsap.to(proxy, {
          units: target,
          duration: duration,
          ease: "power1.inOut",
          onUpdate: function () {
            slideUnits = proxy.units;
            render();
          },
          onComplete: onComplete,
        });
      };

      var snapToNearest = function () {
        overscroll = 0;
        tweenTo(Math.round(slideUnits), 0.4);
      };

      var lockScroll = function () {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      };
      var unlockScroll = function () {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };

      var restoreStaticPosition = function () {
        section.style.position = "";
        section.style.top = "";
        section.style.left = "";
        section.style.right = "";
        if (placeholder) placeholder.remove();
        placeholder = null;
      };

      var exit = function (direction) {
        var height = section.getBoundingClientRect().height;
        var targetY = direction === "forward" ? savedScrollY + height : Math.max(0, savedScrollY - height);

        window.removeEventListener("wheel", handleWheel);
        clearTimeout(idleTimer);
        if (tween) tween.kill();

        isActive = false;
        setActiveIndex(0);
        chromeTop.style.display = "none";
        releaseBackground();
        gsap.set(track, { xPercent: 0 });
        unlockScroll();

        // Slide the fixed section out of the way in lockstep with the real scroll
        // advancing underneath it, so releasing back to normal scroll reads as one
        // continuous motion instead of an instant cut to the new position.
        var scrollProxy = { y: savedScrollY };
        gsap.to(scrollProxy, {
          y: targetY,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: function () {
            section.style.transform = "translateY(" + -(scrollProxy.y - savedScrollY) + "px)";
            scrollToInstant(scrollProxy.y);
          },
          onComplete: function () {
            section.style.transform = "";
            restoreStaticPosition();
            scrollToInstant(targetY);
          },
        });

        slideUnits = 0;
        overscroll = 0;
      };

      var handleWheel = function (e) {
        e.preventDefault();
        if (tween) tween.kill();
        clearTimeout(idleTimer);

        var delta = e.deltaY / slideAdvancePx();
        var next = slideUnits + delta;

        if (next < 0) {
          overscroll += -delta * slideAdvancePx();
          slideUnits = 0;
          if (overscroll > EXIT_THRESHOLD_PX) return exit("backward");
        } else if (next > SLIDE_COUNT - 1) {
          overscroll += delta * slideAdvancePx();
          slideUnits = SLIDE_COUNT - 1;
          if (overscroll > EXIT_THRESHOLD_PX) return exit("forward");
        } else {
          overscroll = 0;
          slideUnits = next;
        }

        render();
        idleTimer = setTimeout(snapToNearest, SNAP_IDLE_MS);
      };

      goTo = function (index) {
        clearTimeout(idleTimer);
        tweenTo(index, 0.6);
      };

      var activate = function (entryIndex) {
        if (isActive) return;

        savedScrollY = window.scrollY;
        var rect = section.getBoundingClientRect();

        // If the CTA was clicked before the section had fully scrolled into
        // place (its top isn't flush with the viewport top yet), pinning it
        // right here would snap in a misaligned position -- the fixed section
        // wouldn't fully cover the viewport, showing a sliver of whatever
        // comes after it on the page. alignThenActivate() (below) is what
        // guards against this by aligning first; this direct entry point
        // assumes the section is already aligned.
        placeholder = document.createElement("div");
        placeholder.style.height = rect.height + "px";
        placeholder.style.width = "100%";
        section.parentElement.insertBefore(placeholder, section);

        section.style.position = "fixed";
        section.style.top = "0";
        section.style.left = "0";
        section.style.right = "0";

        lockScroll();
        window.addEventListener("wheel", handleWheel, { passive: false });

        isActive = true;
        chromeTop.style.display = "flex";
        engageBackground();
        goTo(entryIndex == null ? 1 : entryIndex);
      };

      // Smoothly scrolls the section flush with the viewport top before
      // handing off to activate() -- see the comment inside activate() for
      // why this matters. Guarded by `aligning` so a second click mid-scroll
      // can't kick off a race with two competing scroll/activate sequences.
      var aligning = false;
      var alignThenActivate = function (entryIndex) {
        if (isActive || aligning) return;

        var rect = section.getBoundingClientRect();
        if (Math.abs(rect.top) < 1) {
          activate(entryIndex);
          return;
        }

        aligning = true;
        var targetY = window.scrollY + rect.top;
        var settled = false;
        var fallbackTimer;

        var finish = function () {
          if (settled) return;
          settled = true;
          aligning = false;
          window.removeEventListener("scrollend", finish);
          clearTimeout(fallbackTimer);
          activate(entryIndex);
        };

        window.addEventListener("scrollend", finish);
        // Safety net: some browsers don't support/fire "scrollend" (or won't
        // fire it if the smooth scroll gets interrupted) -- without this,
        // a missed event would leave the slider stuck un-activated forever.
        fallbackTimer = setTimeout(finish, 700);
        window.scrollTo({ top: targetY, left: 0, behavior: "smooth" });
      };

      var deactivate = function () {
        if (!isActive) return;
        clearTimeout(idleTimer);
        tweenTo(0, 0.6, function () {
          window.removeEventListener("wheel", handleWheel);
          unlockScroll();
          restoreStaticPosition();
          slideUnits = 0;
          overscroll = 0;
          isActive = false;
          setActiveIndex(0);
          chromeTop.style.display = "none";
          releaseBackground();
          gsap.set(track, { xPercent: 0 });
          scrollToInstant(savedScrollY);
        });
      };

      cta.addEventListener("click", function () {
        alignThenActivate(1);
      });
      backBtn.addEventListener("click", deactivate);
    }
  }

  function init() {
    var mount = document.getElementById(MOUNT_ID);
    if (!mount) return;
    injectFonts();
    injectStyles();
    mount.innerHTML = MARKUP;
    loadGsap(runSlider);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
