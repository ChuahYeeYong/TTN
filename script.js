// GSAP & LENIS INIT
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// GLOBAL ANIMATIONS
$(function () {
  // SPLIT TEXT ANIMATION
  $("h1, h2").each(function () {
    const heading = $(this);
    const splitText = new SplitType(this, { types: "lines" });
    const lines = splitText.lines;

    gsap.from(lines, {
      y: 30,
      rotation: 30,
      ease: "easeOutExpo",
      duration: 0.6,
      stagger: 0.05,
      scrollTrigger: {
        trigger: heading,
        start: "top bottom",
        once: true,
      },
    });
  });
});
$(function () {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const $element = $(element);

          // Prevent retriggering
          if (!$element.hasClass("typewriter-initialized")) {
            $element.addClass("typewriter-initialized active"); // Add active class

            const originalText = $element.text();
            $element.text("");

            const typewriter = new Typewriter(element, {
              cursor: "|",
            });

            typewriter
              .changeDelay(40)
              .typeString(originalText)
              .pauseFor(1000)
              .callFunction(() => {
                const cursor = element.querySelector(".Typewriter__cursor");
                if (cursor) {
                  cursor.style.display = "none";
                }
              })
              .start();
          }

          obs.unobserve(element); // Stop observing once triggered
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of element is visible
    }
  );

  $(".typewriter-box h3").each(function () {
    observer.observe(this);
  });
});
// GLOBAL ANIMATIONS END

// FIRST SECTION ANIMATIONS
$(function () {
  // Create pin for the hero section
  ScrollTrigger.create({
    trigger: ".pinned-hero",
    start: "top top",
    end: "+=1000",
    pin: true,
  });

  // Make the SVG visible and sized appropriately
  const svg = document.getElementById("motion-path");
  svg.setAttribute("width", "100vw");
  svg.setAttribute("height", "90%");
  svg.setAttribute("viewBox", "0 0 1500 500"); // Adjusted to encompass all paths

  // Configuration for sugar animations
  const sugarAnimations = [
    {
      element: "#sugar1",
      path: "#sugar-curve-1",
      delay: 0, // No delay
    },
    {
      element: "#sugar2",
      path: "#sugar-curve-1",
      delay: -0.2, // Delayed start
    },
    {
      element: "#sugar3",
      path: "#sugar-curve-2",
      delay: -0.2,
    },
    {
      element: "#sugar4",
      path: "#sugar-curve-2",
      delay: 0.2,
    },
    {
      element: "#sugar5",
      path: "#sugar-curve-3",
      delay: -0.15,
    },
    {
      element: "#sugar6",
      path: "#sugar-curve-3",
      delay: 0.3, // Delayed start after sugar5
    },
    {
      element: "#sugar7",
      path: "#sugar-curve-4",
      delay: 0, // Delayed start after sugar5
    },
    {
      element: "#sugar8",
      path: "#sugar-curve-4",
      delay: 0.1, // Delayed start after sugar5
    },
  ];

  // Set up animations for each sugar element
  sugarAnimations.forEach((config) => {
    const element = document.querySelector(config.element);

    // Hide initially
    gsap.set(element, {
      scale: 0.8, // Optional: Scale the sugar images if needed
      autoAlpha: 0,
    });

    // Calculate delay based on scroll progress
    const delayedStart = `top+=${config.delay * 1000} top`;

    // Create animation timeline with individual scroll trigger for each element
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".pin-spacer:has(.pinned-hero)",
        start: delayedStart, // Different start position based on delay
        end: "+=600",
        scrub: true,
      },
    });

    // Fade in
    tl.to(element, {
      autoAlpha: 1,
      duration: 0.1,
    });

    // Animate along the path from beginning to end
    tl.to(
      element,
      {
        motionPath: {
          path: config.path,
          align: config.path,
          start: 0, // Always start at beginning of path
          end: 1, // End at end of path
          alignOrigin: [0.5, 0.5],
        },
        ease: "none",
        duration: 0.8,
      },
      0
    );
  });
});
// TEH TARIK SHAKE
$(function () {
  const tehTarikImage = $(".monkey-container");
  const shakeTween = gsap.to(tehTarikImage, {
    duration: 2,
    keyframes: [
      { rotation: 1, transformOrigin: "center bottom" },
      { rotation: -1, transformOrigin: "center bottom" },
      { rotation: 0, transformOrigin: "center bottom" },
    ],
    repeat: -1,
    repeatDelay: 0,
    ease: "none",
    paused: true,
  });

  let scrollStopTimeout = null;
  const scrollStopDelay = 150;

  const scrollTarget = typeof lenis.on === "function" ? lenis : $(window);
  scrollTarget.on("scroll", function () {
    if (!shakeTween.isActive()) {
      shakeTween.play();
    }
    if (scrollStopTimeout !== null) {
      clearTimeout(scrollStopTimeout);
    }
    scrollStopTimeout = setTimeout(() => shakeTween.pause(), scrollStopDelay);
  });
});
$(function () {
  function animateParallax(id, xAmount, yAmount, rotation) {
    gsap.to(id, {
      x: xAmount,
      y: yAmount,
      rotate: rotation,
      scale: "1.03",
      scrollTrigger: {
        trigger: ".pin-spacer:has(.pinned-hero)",
        start: "top top",
        end: "+=1300",
        scrub: true,
      },
      ease: "easeOutExpo",
    });
  }

  animateParallax("#main-durian-left", "2vw");
  animateParallax("#main-green-durian-left", "1.5vw");
  animateParallax("#main-plant-right", "-5vw");
  animateParallax("#main-green-coconut", "-2vw");
  animateParallax("#lcw", "-3vw", "-5vw");
  animateParallax("#motorbike", "10vw", "0");
  animateParallax("#myvi", "-5vw", "5%", "0");
});
// FIRST SECTION ANIMATIONS END
// SECOND SECTION ANIMATIONS
$(document).ready(function () {
  // Initialize the horizontal scroll
  function initHorizontalScroll() {
    const $container = $(".overflow-container");
    const $pinnedSection = $(".pinned-horizontal-section");
    const totalWidth = $pinnedSection.outerWidth() - $(window).width();

    // Create a ScrollTrigger for the main horizontal scroll
    let scrollTrigger = ScrollTrigger.create({
      trigger: $container[0],
      start: "top top",
      end: `+=${totalWidth}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Move the pinned section horizontally
        gsap.set($pinnedSection, {
          x: -totalWidth * self.progress,
        });

        // Move #teh-tarik-aneh right by 30vw as scroll progresses
        gsap.set("#teh-tarik-aneh", {
          x: 35 * self.progress + "vw",
        });
      },
    });
  }
  initHorizontalScroll();
});
// SECOND SECTION ANIMATIONS END
// THIRD SECTION ANIMATIONS
$(function () {
  function animateParallax(id, xAmount, yAmount) {
    gsap.to(id, {
      x: xAmount,
      y: yAmount,
      scale: "1.1",
      scrollTrigger: {
        trigger: ".national-importance",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
      ease: "easeOutExpo",
    });
  }

  animateParallax(".national-green-mountain", "-15vw");
  animateParallax(".national-blue-mountain", "14vw");
});
// THIRD SECTION ANIMATIONS END
