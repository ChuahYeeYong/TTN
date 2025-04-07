// LENIS
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);
// LENIS END

gsap.registerPlugin(ScrollTrigger);

$(function () {
  const $heroTitle = $(".hero-title");
  const $pinnedHero = $(".pinned-hero");

  if (!$heroTitle.length || !$pinnedHero.length) {
    console.error("Required elements (.hero-title or .pinned-hero) not found.");
    return;
  }

  const getScrollAmount = () => {
    let heroTitleWidth = $heroTitle[0].offsetWidth;
    let pinnedHeroWidth = $pinnedHero[0].offsetWidth;
    return -(heroTitleWidth - pinnedHeroWidth);
  };

  const horizontalMoveTween = gsap.to($heroTitle, {
    x: getScrollAmount,
    ease: "none", // IMPORTANT: Keep base tween linear
    paused: true,
  });

  gsap.to(horizontalMoveTween, {
    progress: 1,
    ease: "power1.out",
    scrollTrigger: {
      trigger: $pinnedHero[0],
      start: "top top",
      end: () => `+=${$heroTitle[0].offsetWidth * 0.5}`,
      pin: true,
      scrub: true,
      invalidateOnRefresh: true, // Recalculate on resize
    },
  });

  const tehTarikImage = $("#main-teh-tarik");
  const shakeTween = gsap.to(tehTarikImage, {
    duration: 2, // How long each part of the shake takes
    keyframes: [
      { rotation: 1, transformOrigin: "center bottom" },
      { rotation: -1, transformOrigin: "center bottom" },
      { rotation: 0, transformOrigin: "center bottom" },
    ],
    repeat: -1, // Repeat indefinitely while active
    repeatDelay: 0, // No delay between repeats
    ease: "none", // Linear ease
    paused: true, // Start in a paused state
  });

  let scrollStopTimeout = null;
  const scrollStopDelay = 150;

  // Function to run when scroll stops
  function onScrollStop() {
    shakeTween.pause();
  }
  const scrollTarget = typeof lenis.on === "function" ? lenis : $(window);

  scrollTarget.on("scroll", function () {
    if (!shakeTween.isActive()) {
      shakeTween.play();
    }
    // Clear the previous timeout (if exists)
    if (scrollStopTimeout !== null) {
      clearTimeout(scrollStopTimeout);
    }
    // Set a new timeout
    scrollStopTimeout = setTimeout(onScrollStop, scrollStopDelay);
  });
});

$("h1, h2").each(function () {
  const heading = $(this);
  const splitText = new SplitType(this, { types: "chars" });
  const chars = splitText.chars;

  gsap.from(chars, {
    opacity: 0,
    y: 30,
    rotation: 20,
    ease: "easeOutExpo",
    duration: 0.8,
    stagger: 0.06, // Stagger the animation of each character
    scrollTrigger: {
      trigger: heading, // Use the original heading element as the trigger
      start: "top bottom",
      once: true,
    },
  });
});
