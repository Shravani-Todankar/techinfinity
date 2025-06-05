
// ===== FIRST SECTION: INFINITY SHAPE ANIMATION =====
const container = document.getElementById('container');
const infinityContainer = document.getElementById('infinity-container');
const topText = document.getElementById('top-text');
const scrollIndicator = document.querySelector('.scroll-indicator');

const imgSrcs = [
    'https://picsum.photos/id/1011/60/70',
    'https://picsum.photos/id/1015/60/70',
    'https://picsum.photos/id/1016/60/70',
    'https://picsum.photos/id/1018/60/70',
    'https://picsum.photos/id/1020/60/70',
    'https://picsum.photos/id/1024/60/70',
    'https://picsum.photos/id/1027/60/70',
    'https://picsum.photos/id/1031/60/70',
    'https://picsum.photos/id/1033/60/70',
    'https://picsum.photos/id/1035/60/70',
    'https://picsum.photos/id/1036/60/70',
    'https://picsum.photos/id/1038/60/70',
    'https://picsum.photos/id/1040/60/70',
    'https://picsum.photos/id/1043/60/70',
    'https://picsum.photos/id/1044/60/70',
    'https://picsum.photos/id/1049/60/70',
    'https://picsum.photos/id/1050/60/70',
    'https://picsum.photos/id/1053/60/70',
    'https://picsum.photos/id/1057/60/70',
    'https://picsum.photos/id/1060/60/70',
    'https://picsum.photos/id/1062/60/70',
    'https://picsum.photos/id/1063/60/70',
    'https://picsum.photos/id/1067/60/70',
    'https://picsum.photos/id/1068/60/70',
    'https://picsum.photos/id/1071/60/70',
    'https://picsum.photos/id/1073/60/70',
    'https://picsum.photos/id/1074/60/70',
    'https://picsum.photos/id/1080/60/70',
    'https://picsum.photos/id/1084/60/70',
    'https://picsum.photos/id/1081/60/70',
];

let originalPositions = [];
let centerImage = null;
let sectionOnePinned = false;
let animationComplete = false;

// Create and append images at random initial positions
imgSrcs.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('img-item');
    img.style.top = `${Math.random() * 80 + 5}vh`;
    img.style.left = `${Math.random() * 90 + 2}vw`;
    infinityContainer.appendChild(img);
});

const images = [...document.querySelectorAll('.img-item')];

// Initialize GSAP ScrollTrigger for section pinning
function initializeSectionPinning() {
    gsap.registerPlugin(ScrollTrigger);

    // Pin section-one until animation is complete
    ScrollTrigger.create({
        trigger: "#section-one",
        start: "top top",
        end: () => animationComplete ? "+=0" : "+=10000", // Very large end value until animation completes
        pin: true,
        pinSpacing: false,
        onUpdate: self => {
            if (animationComplete && self.progress > 0) {
                // Unpin when animation is complete and user tries to scroll
                self.kill();
                enableScrollTransition();
            }
        }
    });
}

// Fade in images one by one
function fadeInImages(index = 0) {
    if (index >= images.length) {
        setTimeout(alignImagesInRow, 1000);
        return;
    }
    images[index].style.opacity = '1';
    setTimeout(() => fadeInImages(index + 1), 100);
}

// Align images in a horizontal row
function alignImagesInRow() {
    const containerWidth = infinityContainer.clientWidth;
    const margin = 10;
    const totalWidth = images.length * (60 + margin) - margin;

    let startX = (containerWidth - totalWidth) / 2;

    images.forEach((img, idx) => {
        img.style.top = `${infinityContainer.offsetHeight / 2 + 40}px`;
        img.style.left = `${startX + idx * (60 + margin)}px`;
        img.style.transform = 'translate(0, 0)';
    });

    setTimeout(formInfinityShape, 2000);
}

// Form the infinity shape of images
function formInfinityShape() {
    container.classList.add('slow-transition');

    const containerWidth = infinityContainer.clientWidth;
    const containerHeight = infinityContainer.clientHeight;
    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;
    const baseSize = Math.min(centerX, centerY) / 2.5;
    const a = baseSize * 6.5;

    let flowImages = [];
    let staticImages = [];

    images.forEach((img, idx) => {
        const t = (idx / images.length) * 2 * Math.PI;
        const denom = 1 + Math.pow(Math.cos(t), 2);
        const x = a * Math.sin(t) / denom;
        const y = a * Math.sin(t) * Math.cos(t) / denom;

        const posX = centerX + x;
        const posY = centerY + y;

        // Identify the flowing section of the infinity curve
        // Select top-right section: images that are on the right side (x > 0) and in the upper part (y < centerY)
        const isInFlowSection = x > 50 && y < 0;

        if (isInFlowSection) {
            flowImages.push({ img, idx, x, y, posX, posY, t });
        } else {
            staticImages.push({ img, idx, x, y, posX, posY });
        }

        img.style.left = `${posX}px`;
        img.style.top = `${posY}px`;
        img.style.setProperty('--repel-x', '0px');
        img.style.setProperty('--repel-y', '0px');
        img.style.transform = `translate(var(--repel-x), var(--repel-y)) translate(-50%, -50%) rotateY(0deg)`;

        originalPositions[idx] = { x: posX, y: posY };
    });

    // Store flow and static images for transition
    window.flowImages = flowImages;
    window.staticImages = staticImages;

    setTimeout(() => {
        container.classList.remove('slow-transition');
        container.classList.add('infinity-formed');

        animateSplitText(topText);
        topText.style.opacity = '1';
        enableRepelAndFlipProximity();

        document.getElementById('section-one').style.background = 'transparent';


        // Complete animation sequence and show scroll indicator
        setTimeout(() => {
            scrollIndicator.classList.add('show');
            // Mark animation as complete after text reveal
            setTimeout(() => {
                animationComplete = true;
                // Refresh ScrollTrigger to allow unpinning
                ScrollTrigger.refresh();
            }, 1000); // Wait 1 second after scroll indicator shows
        }, 2000);
    }, 4000);
}

// Animate the top text split reveal with proper spacing
function animateSplitText(textElement) {
    const firstLine = ['Best', 'Digital', 'Creative'];
    const secondLine = ['Marketing', 'Agency'];

    textElement.textContent = '';

    const allLetters = [];

    // First line
    const firstLineDiv = document.createElement('div');
    firstLineDiv.className = 'text-line';

    firstLine.forEach((word, wordIndex) => {
        const spanWrapper = document.createElement('span');

        // Set the class based on the word
        if (word === 'Creative') {
            spanWrapper.className = 'italic';
        } else {
            spanWrapper.className = 'normal';
        }

        // Split each word into individual letters
        for (let i = 0; i < word.length; i++) {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = word[i];
            spanWrapper.appendChild(letterSpan);
            allLetters.push(letterSpan);
        }

        firstLineDiv.appendChild(spanWrapper);
    });

    textElement.appendChild(firstLineDiv);

    // Second line
    const secondLineDiv = document.createElement('div');
    secondLineDiv.className = 'text-line';

    secondLine.forEach((word) => {
        const spanWrapper = document.createElement('span');
        spanWrapper.className = 'normal';

        // Split each word into individual letters
        for (let i = 0; i < word.length; i++) {
            const letterSpan = document.createElement('span');
            letterSpan.textContent = word[i];
            spanWrapper.appendChild(letterSpan);
            allLetters.push(letterSpan);
        }

        secondLineDiv.appendChild(spanWrapper);
    });

    textElement.appendChild(secondLineDiv);

    // Use GSAP to animate letters with stagger
    gsap.fromTo(allLetters,
        {
            y: 100,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.05,
            delay: 0.3
        }
    );
}

// Enable repel and flip effect on mouse proximity
function enableRepelAndFlipProximity() {
    const maxRepelDistance = 100;
    const maxRepelAmount = 35;

    infinityContainer.addEventListener('mousemove', (e) => {
        const rect = infinityContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        images.forEach((img, idx) => {
            // Skip repel effect for transitioning images
            if (img.dataset.transitioning === 'true') {
                return;
            }

            const orig = originalPositions[idx];
            const dx = orig.x - mouseX;
            const dy = orig.y - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxRepelDistance) {
                const repelFactor = (maxRepelDistance - dist) / maxRepelDistance;
                const offsetX = (dx / dist) * repelFactor * maxRepelAmount;
                const offsetY = (dy / dist) * repelFactor * maxRepelAmount;

                img.style.setProperty('--repel-x', `${offsetX}px`);
                img.style.setProperty('--repel-y', `${offsetY}px`);
            } else {
                img.style.setProperty('--repel-x', '0px');
                img.style.setProperty('--repel-y', '0px');
            }

            if (dist < maxRepelDistance) {
                img.classList.add('flip-active');
            } else {
                img.classList.remove('flip-active');
            }
        });
    });

    infinityContainer.addEventListener('mouseleave', () => {
        images.forEach(img => {
            if (img.dataset.transitioning === 'true') {
                return;
            }
            img.style.setProperty('--repel-x', '0px');
            img.style.setProperty('--repel-y', '0px');
            img.classList.remove('flip-active');
        });
    });
}

// ===== SCROLL TRANSITION: FLOW IMAGES DOWN, OTHERS FADE =====
function enableScrollTransition() {
    if (!window.flowImages || !window.staticImages) return;

    // Show section-two when transition begins
    const sectionTwo = document.querySelector('#section-two');
    sectionTwo.classList.add('visible');

    // Create timeline for the transition
    const transitionTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#section-one',
            start: 'bottom 85%',
            end: 'bottom 15%',
            scrub: 2,
            onStart: () => {
                // Mark flow images as transitioning
                window.flowImages.forEach(({ img }) => {
                    img.dataset.transitioning = 'true';
                    img.style.zIndex = '200';
                });
            },
            onComplete: () => {
                // Hide all images after transition
                images.forEach(img => {
                    img.style.opacity = '0';
                });
            }
        }
    });

    // Animate ONLY the flow images to move down toward section-two
    // Sort flow images from left to right (leftmost first) and limit top-left to 2 leftmost
    let sortedFlowImages = window.flowImages.sort((a, b) => a.x - b.x);

    // Separate top-left images and limit to 2 leftmost
    const topLeftImages = sortedFlowImages.filter(({ x, y }) => x < -50 && y < 0);
    const otherFlowImages = sortedFlowImages.filter(({ x, y }) => !(x < -50 && y < 0));
    const limitedTopLeft = topLeftImages.slice(0, 2); // Take only 2 leftmost

    // Combine limited top-left with other flow images and re-sort
    sortedFlowImages = [...limitedTopLeft, ...otherFlowImages].sort((a, b) => a.x - b.x);

    sortedFlowImages.forEach(({ img, posX, posY }, index) => {
        // Calculate target position (center of section-two)
        const targetX = window.innerWidth / 2;
        const targetY = window.innerHeight * 1.5; // Move to section-two

        const currentRect = img.getBoundingClientRect();
        const moveX = targetX - (currentRect.left + currentRect.width / 2);
        const moveY = targetY - (currentRect.top + currentRect.height / 2);

        // Increased stagger delay for more noticeable sequence
        const staggerDelay = index * 0.2; // Start from leftmost with increasing delay

        transitionTl
            .to(img, {
                x: moveX * 0.3,
                y: moveY * 0.3,
                scale: 1.2,
                opacity: 0.9,
                rotation: 5,
                duration: 0.3,
                ease: 'power1.out',
            }, staggerDelay)
            .to(img, {
                x: moveX * 0.7,
                y: moveY * 0.7,
                scale: 2,
                opacity: 0.7,
                rotation: 15,
                filter: 'blur(1px)',
                duration: 0.4,
                ease: 'power1.inOut'
            }, staggerDelay + 0.3)
            .to(img, {
                x: moveX,
                y: moveY,
                scale: 3.5,
                opacity: 0.4,
                rotation: 25,
                filter: 'blur(3px)',
                duration: 0.3,
                ease: 'power2.in'
            }, staggerDelay + 0.7)
            .to(img, {
                scale: 5,
                opacity: 0,
                rotation: 35,
                filter: 'blur(8px)',
                duration: 0.2,
                ease: 'power2.in'
            }, staggerDelay + 1.0);
    });

    // Fade out ALL static images (they don't move, just fade)
    gsap.to(window.staticImages.map(({ img }) => img), {
        opacity: 0,
        scale: 0.8,
        filter: 'blur(2px)',
        duration: 0.8,
        ease: 'power2.inOut',
        scrollTrigger: {
            trigger: '#section-one',
            start: 'bottom 80%',
            end: 'bottom 40%',
            scrub: 2
        }
    });

    // Initialize second section after transition is enabled
    initializeSecondSection();
}

// ===== SECOND SECTION: ENHANCED 3D ZOOM SCROLL ANIMATION =====
function initializeSecondSection() {
    const imgs = gsap.utils.toArray('.dm-zoom-reveal-img-2');
    const circle = document.querySelector('.circle-ring');
    const text = document.querySelector('.center-text');
    const sectionTwo = document.querySelector('#section-two');

    // Define precise target positions for a balanced spread
    const targetPositions = [
        { x: -300, y: -200 },   // Top left
        { x: 300, y: -220 },    // Top right  
        { x: -350, y: 100 },    // Mid left
        { x: 350, y: 140 },     // Mid right
        { x: -200, y: 300 },    // Bottom left
        { x: 200, y: 320 },     // Bottom right
        { x: 0, y: -350 },      // Top center
        { x: 0, y: 350 },       // Bottom center
        { x: 0, y: 0 }          // Center (featured image)
    ];

    // Create the main timeline with ScrollTrigger
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: sectionTwo,
            start: "top top",
            end: "+=100vh",
            scrub: 1,
            pin: ".dm-zoom-reveal-wrapper-2",
            anticipatePin: 1,
            onUpdate: self => {
                // Optional: Add dynamic effects based on scroll progress
                const progress = self.progress;
                if (progress > 0.8) {
                    // Near end of animation
                }
            }
        }
    });

    // Phase 1: Text appears (0-1.5s)
    tl.to(text, {
        opacity: 1,
        duration: 1.5,
        ease: "power1.inOut",
    }, 0);

    // Phase 2: Images popup from center and move to positions (0.5-4s)
    imgs.forEach((img, i) => {
        tl.to(img, {
            duration: 4,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            ease: "power2.out",
            zIndex: 10 + i,
            x: targetPositions[i].x,
            y: targetPositions[i].y,
        }, 1 + i * 0.6); // Staggered appearance
    });

    // Phase 3: Images move further out and scale up (2-5s)
    imgs.forEach((img, i) => {
        const pos = targetPositions[i];
        const factor = 3.5; // How far they move out

        tl.to(img, {
            duration: 1,
            x: pos.x * factor,
            y: pos.y * factor,
            scale: 1.15 + i * 0.1, // Slight scale variation
            ease: "power4.in",
            opacity: 1,
            filter: "blur(0px)",
            zIndex: 0,
        }, 2 + i * 0.5);

        // Phase 4: Fade out as they leave viewport (3-5.5s)
        tl.to(img, {
            duration: 0.6,
            opacity: 0,
            ease: "power1.out",
        }, 3 + i * 0.5);
    });

    // Phase 5: Final cleanup - fade out text (4.5-5.3s)
    tl.to(text, {
        opacity: 0,
        duration: 0.8,
        ease: "power1.out",
    }, 4.5);
}

// ===== THIRD SECTION: SERVICES TEXT REVEAL ANIMATION =====
function initializeServicesAnimation() {
    const servicesTitle = document.getElementById('services-title');
    const text = 'Services';

    // Clear the existing text and create letter spans
    servicesTitle.innerHTML = '';

    // Split text into individual letters and create spans
    for (let i = 0; i < text.length; i++) {
        const letterSpan = document.createElement('span');
        letterSpan.textContent = text[i];
        letterSpan.classList.add('letter');
        letterSpan.style.animationDelay = `${i * 0.1}s`;
        servicesTitle.appendChild(letterSpan);
    }

    const letters = servicesTitle.querySelectorAll('.letter');

    // Create GSAP ScrollTrigger animation
    gsap.set(letters, {
        y: 150,
        rotationX: -90,
        opacity: 0,
        transformOrigin: "center bottom"
    });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: "#section-three",
            start: "top 80%",
            end: "top 20%",
            toggleActions: "play none none reverse",
            onStart: () => {
                // Add a subtle scale animation to the container
                gsap.fromTo('.services-container',
                    { scale: 0.8 },
                    { scale: 1, duration: 0.6, ease: "back.out(1.7)" }
                );
            }
        }
    });

    // Animate each letter with stagger
    tl.to(letters, {
        y: 0,
        rotationX: 0,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(2.5)",
        stagger: {
            amount: 0.6,
            from: "start"
        }
    });

    // Add a secondary animation for extra flair
    tl.to(letters, {
        duration: 0.4,
        ease: "power2.out",
        stagger: {
            amount: 0.2,
            from: "start"
        }
    }, "-=0.4");
}

// ===== VIDEO ZOOM ANIMATION =====
function initializeVideoZoomAnimation() {
    const videoSection = document.getElementById('video-section');
    const playButton = document.querySelector('.play-button');

    // Initial state: video section is scaled down and blurred
    gsap.set(videoSection, {
        scale: 0.7,
        opacity: 0,
        filter: 'blur(10px)',
        transformOrigin: 'center center'
    });

    // Create the zoom-in animation timeline
    const videoTl = gsap.timeline({
        scrollTrigger: {
            trigger: videoSection,
            start: "top 90%",        // Start when video section is 90% in viewport
            end: "top 30%",          // End when video section is 30% in viewport
            scrub: 1.5,              // Smooth scrubbing
            anticipatePin: 1,
            onStart: () => {
                // Add interaction class when animation starts
                videoSection.classList.add('zoomed');
            },
            onComplete: () => {
                // Ensure final state is perfect
                gsap.set(videoSection, {
                    scale: 1,
                    opacity: 1,
                    filter: 'blur(0px)'
                });
            }
        }
    });

    // Main zoom animation phases
    videoTl
        // Phase 1: Initial reveal (fade in and start scaling)
        .to(videoSection, {
            opacity: 0.6,
            scale: 0.8,
            filter: 'blur(5px)',
            duration: 0.3,
            ease: 'power2.out'
        })
        // Phase 2: Zoom to normal size with clarity
        .to(videoSection, {
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.5,
            ease: 'power3.out'
        })
        // Phase 3: Slight overshoot for bounce effect
        .to(videoSection, {
            scale: 1.02,
            duration: 0.15,
            ease: 'power2.inOut'
        })
        // Phase 4: Settle to final size
        .to(videoSection, {
            scale: 1,
            duration: 0.05,
            ease: 'power1.out'
        });

    // Additional hover enhancement when video is visible
    videoSection.addEventListener('mouseenter', () => {
        if (videoSection.classList.contains('zoomed')) {
            gsap.to(videoSection, {
                scale: 1.03,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(playButton, {
                scale: 1.1,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        }
    });

    videoSection.addEventListener('mouseleave', () => {
        if (videoSection.classList.contains('zoomed')) {
            gsap.to(videoSection, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
            gsap.to(playButton, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    });

    // Click handler for the play button
    playButton.addEventListener('click', () => {
        // Add click animation
        gsap.to(playButton, {
            scale: 0.95,
            duration: 0.1,
            ease: 'power2.inOut',
            yoyo: true,
            repeat: 1
        });

        // Add functionality to remove overlay and enable video controls
        setTimeout(() => {
            const videoOverlay = document.querySelector('.video-overlay');
            const videoIframe = document.querySelector('.video-iframe');

            gsap.to(videoOverlay, {
                opacity: 0,
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    videoOverlay.style.display = 'none';
                    videoIframe.style.pointerEvents = 'auto';
                    // Restart video with controls
                    const newSrc = videoIframe.src.replace('controls=0', 'controls=1').replace('autoplay=1&mute=1', 'autoplay=1');
                    videoIframe.src = newSrc;
                }
            });
        }, 200);
    });
}

// Initialize everything when page loads
window.onload = () => {
    initializeSectionPinning();
    fadeInImages();
    initializeServicesAnimation();
    initializeVideoZoomAnimation(); // Add this line
};
