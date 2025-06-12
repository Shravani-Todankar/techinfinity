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

// Add corresponding URLs for each image
const imgLinks = [
    'https://example.com/portfolio/project-1',
    'https://example.com/portfolio/project-2',
    'https://example.com/portfolio/project-3',
    'https://example.com/services/web-development',
    'https://example.com/portfolio/project-4',
    'https://example.com/services/digital-marketing',
    'https://example.com/portfolio/project-5',
    'https://example.com/services/seo',
    'https://example.com/portfolio/project-6',
    'https://example.com/services/social-media',
    'https://example.com/portfolio/project-7',
    'https://example.com/services/animation',
    'https://example.com/portfolio/project-8',
    'https://example.com/case-studies/success-story-1',
    'https://example.com/portfolio/project-9',
    'https://example.com/case-studies/success-story-2',
    'https://example.com/portfolio/project-10',
    'https://example.com/blog/marketing-trends',
    'https://example.com/portfolio/project-11',
    'https://example.com/about-us',
    'https://example.com/portfolio/project-12',
    'https://example.com/contact',
    'https://example.com/portfolio/project-13',
    'https://example.com/blog/web-design-tips',
    'https://example.com/portfolio/project-14',
    'https://example.com/services/branding',
    'https://example.com/portfolio/project-15',
    'https://example.com/testimonials',
    'https://example.com/portfolio/project-16',
    'https://example.com/get-quote',
];

let originalPositions = [];
let centerImage = null;
let sectionOnePinned = false;
let animationComplete = false;
let infinityShiftComplete = false;

// Create and append images at random initial positions with links
imgSrcs.forEach((src, index) => {
    // Create anchor tag
    const link = document.createElement('a');
    link.href = imgLinks[index] || '#';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.classList.add('img-link');

    // Create image
    const img = document.createElement('img');
    img.src = src;
    img.classList.add('img-item');
    img.style.top = `${Math.random() * 80 + 5}vh`;
    img.style.left = `${Math.random() * 90 + 2}vw`;

    // Add click prevention during animations
    link.addEventListener('click', (e) => {
        // Prevent navigation during repel animation or transitions
        if (img.classList.contains('flip-active') || img.dataset.transitioning === 'true') {
            e.preventDefault();
            return false;
        }

        // Prevent navigation if animation is not complete
        if (!animationComplete) {
            e.preventDefault();
            return false;
        }
    });

    // Wrap image in link
    link.appendChild(img);
    infinityContainer.appendChild(link);
});

const images = [...document.querySelectorAll('.img-item')];

// Initialize GSAP ScrollTrigger for section pinning
function initializeSectionPinning() {
    gsap.registerPlugin(ScrollTrigger);

    // Pin section-one until animation is complete
    ScrollTrigger.create({
        trigger: "#section-one",
        start: "top top",
        end: () => animationComplete && infinityShiftComplete ? "+=0" : "+=10000", // Very large end value until animation completes
        pin: true,
        pinSpacing: false,
        onUpdate: self => {
            if (animationComplete && infinityShiftComplete && self.progress > 0) {
                // Hide the scroll indicator
                if (scrollIndicator) {
                    scrollIndicator.classList.remove('show');
                }

                // Unpin when animation is complete and user tries to scroll
                self.kill();
                enableScrollTransition();
            }
        }
    });
}

function reenableScrollIndicatorOnScrollUp() {
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
        trigger: "#section-one",
        start: "top top",
        end: "bottom top",
        onEnter: () => {
            if (animationComplete && scrollIndicator) {
                scrollIndicator.classList.add("show");
            }
        },
        onLeaveBack: () => {
            if (scrollIndicator) {
                scrollIndicator.classList.remove("show");
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
        enableRepelAndFlipProximity();

        document.getElementById('section-one').style.background = 'transparent';

        // NEW: Start the infinity shape shift down animation immediately after formation
        setTimeout(() => {
            shiftInfinityShapeDown();
        }, 1000); // Wait 1 second after infinity shape formation

        // Start text animation after the shape shift begins
        setTimeout(() => {
            animateSplitText(topText);
            topText.style.opacity = '1';
        }, 2000); // Wait 2 seconds to let shift animation start

        // Complete animation sequence and show scroll indicator
        setTimeout(() => {
            scrollIndicator.classList.add('show');

            // Mark animation as complete after text reveal
            setTimeout(() => {
                animationComplete = true;

                // Show header again after animation completes (WITHOUT layout shift)
                const header = document.querySelector('.header');
                header.classList.remove('hidden');

                // REMOVED: Layout shifting functionality
                // The header will now overlay without affecting layout

            }, 1000); // Wait 1 second after scroll indicator shows
        }, 4000); // Adjusted timing to account for earlier shift
    }, 4000);
}

// NEW FUNCTION: Smoothly shift the entire infinity shape downward
function shiftInfinityShapeDown() {
    const shiftDistance = window.innerHeight * 0.1; // Shift down by 30% of viewport height

    // Create a GSAP timeline for smooth coordinated movement
    const shiftTimeline = gsap.timeline({
        ease: "power2.inOut",
        onStart: () => {
            // Disable repel effect during transition
            infinityContainer.style.pointerEvents = 'none';
        },
        onComplete: () => {
            infinityShiftComplete = true;

            // Re-enable interactions
            infinityContainer.style.pointerEvents = 'auto';

            // Update original positions for repel effect
            images.forEach((img, idx) => {
                const rect = img.getBoundingClientRect();
                const containerRect = infinityContainer.getBoundingClientRect();
                originalPositions[idx] = {
                    x: rect.left + rect.width / 2 - containerRect.left,
                    y: rect.top + rect.height / 2 - containerRect.top
                };
            });

            // REMOVED: ScrollTrigger.refresh() that was causing layout shift
        }
    });

    // Shift the entire infinity container down
    shiftTimeline.to(infinityContainer, {
        y: shiftDistance,
        duration: 2.0,
        ease: "power2.inOut"
    }, 0);

    // Add a subtle scale effect to make the movement more dynamic
    shiftTimeline.to(infinityContainer, {
        scale: 0.92,
        duration: 1.0,
        ease: "power2.out",
        yoyo: true,
        repeat: 1
    }, 0.3);

    // Subtle opacity animation for smooth transition feel
    shiftTimeline.to(images, {
        opacity: 0.7,
        duration: 0.6,
        ease: "power1.inOut",
        stagger: 0.03
    }, 0.2)
        .to(images, {
            opacity: 1,
            duration: 1.0,
            ease: "power1.inOut",
            stagger: 0.02
        }, 1.0);
}

// Animate the top text split reveal with word-by-word animation
function animateSplitText(textElement) {
    const firstLine = ['Best', 'Digital', 'Creative'];
    const secondLine = ['Marketing', 'Agency'];

    textElement.textContent = '';

    const allWords = [];

    // First line
    const firstLineDiv = document.createElement('div');
    firstLineDiv.className = 'text-line';

    firstLine.forEach((word, wordIndex) => {
        const spanWrapper = document.createElement('span');

        // Set the class based on the word
        if (word === 'Creative') {
            spanWrapper.className = 'italic word-span';
        } else {
            spanWrapper.className = 'normal word-span';
        }

        // Set the word content directly (no letter splitting)
        spanWrapper.textContent = word;

        firstLineDiv.appendChild(spanWrapper);
        allWords.push(spanWrapper);
    });

    textElement.appendChild(firstLineDiv);

    // Second line
    const secondLineDiv = document.createElement('div');
    secondLineDiv.className = 'text-line';

    secondLine.forEach((word) => {
        const spanWrapper = document.createElement('span');
        spanWrapper.className = 'normal word-span';

        // Set the word content directly (no letter splitting)
        spanWrapper.textContent = word;

        secondLineDiv.appendChild(spanWrapper);
        allWords.push(spanWrapper);
    });

    textElement.appendChild(secondLineDiv);

    // Use GSAP to animate words with stagger (same style as letters)
    gsap.fromTo(allWords,
        {
            y: 100,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out",
            stagger: 0.2,
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

    const sectionTwo = document.querySelector('#section-two');
    const scrollIndicator = document.querySelector('.scroll-indicator'); // Already defined globally, but reassigned for safety

    sectionTwo.classList.add('visible');

    const transitionTl = gsap.timeline({
        scrollTrigger: {
            trigger: '#section-one',
            start: 'bottom 85%',
            end: 'bottom 15%',
            scrub: 2,
            onStart: () => {

                window.flowImages.forEach(({ img }) => {
                    img.dataset.transitioning = 'true';
                    img.style.zIndex = '200';
                });
            },
            onComplete: () => {
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
    const video = document.querySelector('.center-video');
    const videoOverlay = document.querySelector('.video-overlay');
    const playButton = document.getElementById('magneticPlayButton');

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
            end: "+=300vh",
            scrub: 2.5,
            pin: ".dm-zoom-reveal-wrapper-2",
            anticipatePin: 1,
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
            duration: 2.5,
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            ease: "sine.inOut",
            zIndex: 10 + i,
            x: targetPositions[i].x,
            y: targetPositions[i].y,
        }, 0.5 + i * 0.4);
    });

    // Phase 3: Images move further out and scale up (2-5s)
    imgs.forEach((img, i) => {
        const pos = targetPositions[i];
        const factor = 3.5;

        tl.to(img, {
            duration: 1,
            x: pos.x * factor,
            y: pos.y * factor,
            scale: 1.15 + i * 0.1,
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

    // Phase 6: Video animation (5s - end)
    tl.to(video, {
        opacity: 1,
        scale: 0.5,
        filter: "blur(10px)",
        duration: 0.8,
        ease: "power2.out",
    }, 5.0);

    tl.to(video, {
        scale: 1.5,
        filter: "blur(5px)",
        duration: 1.0,
        ease: "power2.inOut",
    }, 5.8);

    tl.to(video, {
        scale: 1.5,
        filter: "blur(2px)",
        width: "100%",
        height: "100%",
        duration: 1.5,
        ease: "power2.in",
    }, 6.8);

    // NEW: Phase 7: Show video overlay with magnetic play button (7.5s)
    tl.to(videoOverlay, {
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        onComplete: () => {
            // Initialize magnetic effect after overlay is visible
            initMagneticPlayButton();
        }
    }, 7.5);

    tl.to(video, {
        scale: 1.6,
        filter: "blur(5px)",
        duration: 0.7,
        ease: "power2.inOut",
    }, 8.3);

    // MAGNETIC PLAY BUTTON FUNCTIONALITY
    // MAGNETIC PLAY BUTTON FUNCTIONALITY - Replace the existing initMagneticPlayButton function
function initMagneticPlayButton() {
    const videoOverlay = document.getElementById('videoOverlay');
    const playButton = document.getElementById('playButton');
    
    console.log('Initializing magnetic button...', { videoOverlay, playButton });
    
    if (!videoOverlay || !playButton) {
        console.error('Video overlay or play button not found!');
        return;
    }

    const magneticStrength = 0.4;
    const magneticRadius = 200;
    let isHovering = false;
    let animationId = null;

    function updateMagneticEffect(e) {
        // Get the overlay's bounding rectangle
        const rect = videoOverlay.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Get mouse position
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Calculate distance from mouse to center
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance < magneticRadius) {
            // Mouse is within magnetic field
            const strength = (magneticRadius - distance) / magneticRadius;
            const moveX = deltaX * strength * magneticStrength;
            const moveY = deltaY * strength * magneticStrength;
            
            // Apply magnetic movement
            gsap.to(playButton, {
                x: moveX,
                y: moveY,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Scale up on hover
            if (!isHovering) {
                isHovering = true;
                gsap.to(playButton, {
                    scale: 1.1,
                    duration: 0.3,
                    ease: "power2.out"
                });
                
                // Add glow effect
                gsap.to(playButton, {
                    boxShadow: "0 0 30px rgba(255, 255, 255, 0.5)",
                    duration: 0.3,
                    ease: "power2.out"
                });
            }
        } else {
            // Mouse is outside magnetic field - reset
            if (isHovering) {
                resetButton();
            }
        }
    }

    function resetButton() {
        isHovering = false;
        gsap.to(playButton, {
            x: 0,
            y: 0,
            scale: 1,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            duration: 0.5,
            ease: "power2.out"
        });
    }

    function handlePlayButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Play button clicked!');
        
        // Disable magnetic effect
        videoOverlay.removeEventListener('mousemove', updateMagneticEffect);
        videoOverlay.removeEventListener('mouseleave', resetButton);
        
        // Add click animation
        gsap.to(playButton, {
            scale: 0.9,
            duration: 0.1,
            ease: "power2.out",
            onComplete: () => {
                gsap.to(playButton, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        });
        
        // Fade out overlay with delay
        setTimeout(() => {
            gsap.to(videoOverlay, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                onComplete: () => {
                    videoOverlay.style.pointerEvents = 'none';
                    videoOverlay.style.display = 'none';
                }
            });
        }, 500);
    }

    // Initialize immediately - don't wait for complex animations
    setTimeout(() => {
        // Make sure overlay is visible
        videoOverlay.style.opacity = '1';
        videoOverlay.style.pointerEvents = 'auto';
        
        // Add event listeners
        videoOverlay.addEventListener('mousemove', updateMagneticEffect);
        videoOverlay.addEventListener('mouseleave', resetButton);
        playButton.addEventListener('click', handlePlayButtonClick);
        
        console.log('Magnetic effect activated!');
        
        // Optional: Add entrance animation for play button
        gsap.fromTo(playButton, 
            { 
                scale: 0, 
                opacity: 0 
            },
            { 
                scale: 1, 
                opacity: 1, 
                duration: 0.6, 
                ease: "back.out(1.7)" 
            }
        );
        
    }, 500); // Small delay to ensure elements are ready
}
    
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

// section-five-service-provider
let serviceItems = document.querySelectorAll(".service-item");
let serviceImages = document.querySelectorAll(".service-image");

// adding eventListeners to all the service items
for (let i = 0; i < 5; i++) {
    // image reveal animation
    const animation = gsap.to(serviceImages[i], {
        opacity: 1,
        duration: 0.2,
        scale: 1,
        ease: "ease-in-out"
    });

    serviceItems[i].addEventListener("mouseenter", () => animation.play());
    serviceItems[i].addEventListener("mouseleave", () => animation.reverse());

    // initialization
    animation.reverse();
}

// to move image along with cursor
function moveImage(e) {
    gsap.to([...serviceImages], {
        css: {
            left: e.pageX + 50,
            top: e.pageY,
        },
        duration: 0.3,
    });
}

serviceItems.forEach((el) => {
    el.addEventListener("mousemove", moveImage);
});


// Counters section
// Intersection Observer for triggering animation when section comes into view
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            startCounters();
            observer.unobserve(entry.target); // Run animation only once
        }
    });
}, observerOptions);

// Observe the counter section
observer.observe(document.getElementById('counters'));

function startCounters() {
    const counterItems = document.querySelectorAll('.counter-item');
    const counterNumbers = document.querySelectorAll('.counter-number');

    // Add animation class to counter items
    counterItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('animate');
        }, index * 150);
    });

    // Animate counter numbers
    counterNumbers.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        const suffix = target === 100 ? '%' : '+';

        const updateCounter = () => {
            if (current < target) {
                current += increment;
                if (current > target) current = target;

                if (target === 100) {
                    counter.textContent = Math.ceil(current) + '%';
                } else {
                    counter.textContent = Math.ceil(current) + '+';
                }

                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };

        // Start counter animation with a slight delay
        setTimeout(updateCounter, 300);
    });
}

// Smooth scrolling for better demo experience
window.addEventListener('load', () => {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });
});


// circlering section
function initializeCircleRingAnimation() {
    const allCircles = gsap.utils.toArray('.circle-ring');
    const sectionTwo = document.querySelector('#section-two');

    // 1. Circle rings fade in when section comes into view
    ScrollTrigger.create({
        trigger: sectionTwo,
        start: "top 80%",
        onEnter: () => {
            allCircles.forEach((circle, index) => {
                gsap.to(circle, {
                    opacity: 1,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: index * 0.2 // Staggered fade-in
                });
            });
        }
    });

    // 2. Circle rings scale up and down on scroll
    ScrollTrigger.create({
        trigger: sectionTwo,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: self => {
            const progress = self.progress;
            allCircles.forEach((circle, index) => {
                // Each circle scales differently based on scroll
                const scaleAmount = 0.9 + Math.sin(progress * Math.PI * 3 + index) * 0.15;
                gsap.set(circle, {
                    scale: scaleAmount,
                    rotation: progress * 20 * (index + 1)
                });
            });
        }
    });
}

// svg line animation
// SVG Scroll Animation Script
function initSVGAnimation() {
    const svgSection = document.querySelector('.section-three');
    const svgPaths = document.querySelectorAll('.svg-line path');
    
    // Calculate total path length for each path
    svgPaths.forEach(path => {
        const pathLength = path.getTotalLength();
        path.style.strokeDasharray = pathLength;
        path.style.strokeDashoffset = pathLength;
    });
    
    function updateSVGAnimation() {
        const sectionTop = svgSection.offsetTop;
        const sectionHeight = svgSection.offsetHeight;
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Calculate when section starts and ends being visible
        const sectionStart = sectionTop - windowHeight;
        const sectionEnd = sectionTop + sectionHeight;
        
        // Calculate scroll progress within the section
        let scrollProgress = 0;
        
        if (scrollTop >= sectionStart && scrollTop <= sectionEnd) {
            scrollProgress = (scrollTop - sectionStart) / (sectionEnd - sectionStart);
            scrollProgress = Math.max(0, Math.min(1, scrollProgress));
        }
        
        // Apply animation to each path
        svgPaths.forEach(path => {
            const pathLength = path.getTotalLength();
            const drawLength = pathLength * scrollProgress;
            path.style.strokeDashoffset = pathLength - drawLength;
        });
    }
    
    // Initial call
    updateSVGAnimation();
    
    // Update on scroll
    window.addEventListener('scroll', updateSVGAnimation);
    
    // Update on resize
    window.addEventListener('resize', updateSVGAnimation);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initSVGAnimation);


// section-six animation
const imageData = [
    { src: 'https://picsum.photos/60/70?random=1', alt: 'Mountain landscape' },
    { src: 'https://picsum.photos/60/70?random=2', alt: 'Forest path' },
    { src: 'https://picsum.photos/60/70?random=3', alt: 'Ocean waves' },
    { src: 'https://picsum.photos/60/70?random=4', alt: 'City skyline' },
    { src: 'https://picsum.photos/60/70?random=5', alt: 'Desert landscape' },
    { src: 'https://picsum.photos/60/70?random=6', alt: 'Cherry blossoms' },
    { src: 'https://picsum.photos/60/70?random=7', alt: 'Northern lights' },
    { src: 'https://picsum.photos/60/70?random=8', alt: 'Lake reflection' },
    { src: 'https://picsum.photos/60/70?random=9', alt: 'Snowy mountains' },
    { src: 'https://picsum.photos/60/70?random=10', alt: 'Canyon vista' },
    { src: 'https://picsum.photos/60/70?random=11', alt: 'Sunset beach' },
    { src: 'https://picsum.photos/60/70?random=12', alt: 'Waterfall cascade' },
    { src: 'https://picsum.photos/60/70?random=13', alt: 'Tropical paradise' },
    { src: 'https://picsum.photos/60/70?random=14', alt: 'Mountain peak' },
    { src: 'https://picsum.photos/60/70?random=15', alt: 'River valley' },
    { src: 'https://picsum.photos/60/70?random=16', alt: 'Starry night' },
    { src: 'https://picsum.photos/60/70?random=17', alt: 'Golden hour' },
    { src: 'https://picsum.photos/60/70?random=18', alt: 'Rocky coastline' },
    { src: 'https://picsum.photos/60/70?random=19', alt: 'Alpine lake' },
    { src: 'https://picsum.photos/60/70?random=20', alt: 'Forest canopy' },
    { src: 'https://picsum.photos/60/70?random=21', alt: 'Ice formations' },
    { src: 'https://picsum.photos/60/70?random=22', alt: 'Volcanic landscape' },
    { src: 'https://picsum.photos/60/70?random=23', alt: 'Meadow flowers' },
    { src: 'https://picsum.photos/60/70?random=24', alt: 'Desert dunes' }
];

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Create images dynamically
function createInfinityGallery() {
    const infinityShape = document.getElementById('infinityShape');
    
    imageData.forEach((imageInfo, index) => {
        const imageItem = document.createElement('div');
        imageItem.className = 'infinity-image-item';
        
        const img = document.createElement('img');
        img.src = imageInfo.src;
        img.alt = imageInfo.alt;
        img.loading = 'lazy';
        
        imageItem.appendChild(img);
        infinityShape.appendChild(imageItem);
    });
}

// GSAP Infinity Line Animation

function initializeGSAPAnimation() {
    const imageItems = document.querySelectorAll('.infinity-image-item');
    const infinityShape = document.querySelector('.infinity-shape');
    
    // Ensure everything is completely hidden initially
    gsap.set(infinityShape, { opacity: 0 });
    gsap.set(imageItems, { opacity: 0, scale: 0, visibility: "hidden" });
    
    // Create ScrollTrigger for the infinity animation - FIXED TRIGGER POINT
    ScrollTrigger.create({
        trigger: ".section-six", // Keep original trigger
        start: "center bottom", // Start when center of section reaches bottom of viewport
        end: "+150vh", // Keep original end point
        scrub: 0.5, 
        onEnter: () => {
            gsap.to(infinityShape, { opacity: 1, duration: 0.3 });
        },
        onUpdate: self => {
            const progress = self.progress;
            
            imageItems.forEach((item, index) => {
                // Keep original calculation that was working
                const imageProgress = Math.max(0, Math.min(1, (progress * 50 - index * 0.8)));
                
                if (imageProgress > 0) {
                    gsap.set(item, { visibility: "visible" });
                    gsap.to(item, {
                        opacity: imageProgress,
                        scale: imageProgress,
                        duration: 0.15,
                        ease: "power3.out"
                    });
                } else {
                    gsap.set(item, { visibility: "hidden" });
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0,
                        duration: 0.15 
                    });
                }
            });
        }
    });
}

// Smooth parallax effect
function initializeParallax() {
    gsap.to(".section-six", {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
            trigger: ".section-six",
            start: "top bottom",
            end: "+300vh",
            scrub: 0.5
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createInfinityGallery();
    
    setTimeout(() => {
        initializeGSAPAnimation();
        initializeParallax();
    }, 50);
});

// Add error handling for images
window.addEventListener('load', () => {
    const imageItems = document.querySelectorAll('.infinity-image-item img');
    
    imageItems.forEach((img, index) => {
        img.addEventListener('error', () => {
            console.log(`Failed to load image at index ${index}`);
        });
    });
});


// Form functionality
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simple validation
    if (!data.name || !data.email || !data.requirements) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Simulate form submission
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        alert('Thank you! Your message has been submitted successfully.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Reset form except pre-filled values
        document.getElementById('requirements').value = '';
    }, 1500);
});

// Add smooth focus animations
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});


// go to top functionality
// Get the button element
const goToTopBtn = document.getElementById('goToTopBtn');
        
// Track scroll position and show/hide button
let isScrolling = false;

function handleScroll() {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Show button when scrolled down 300px
            if (scrollTop > 300) {
                goToTopBtn.classList.add('visible');
            } else {
                goToTopBtn.classList.remove('visible');
            }
            
            isScrolling = false;
        });
        isScrolling = true;
    }
}

// Smooth scroll to top function
function scrollToTop() {
    const scrollDuration = 800; // Duration in milliseconds
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    
    function smoothScroll() {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep);
            requestAnimationFrame(smoothScroll);
        }
    }
    
    smoothScroll();
}

// Alternative smooth scroll using built-in method (more modern)
function smoothScrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Event listeners
window.addEventListener('scroll', handleScroll);
goToTopBtn.addEventListener('click', smoothScrollToTop);

// Optional: Add keyboard support (Enter and Space)
goToTopBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        smoothScrollToTop();
    }
});


window.onload = () => {
    // Hide header immediately when page loads to give full space for animation
    const header = document.querySelector('.header');
    header.classList.add('hidden');


    // Initialize all existing animations
    initializeCircleRingAnimation();
    reenableScrollIndicatorOnScrollUp();
    initializeSectionPinning();
    fadeInImages();
    initializeServicesAnimation();

    // Optional: Add a small delay to ensure all elements are loaded
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
};
