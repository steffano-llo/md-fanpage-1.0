document.addEventListener('DOMContentLoaded', () => {
    /* --- GSAP Scroll Animations for Inner Page --- */
    gsap.registerPlugin(ScrollTrigger);

    // Gallery Grid items animation (Individual appear on scroll)
    const videoItems = gsap.utils.toArray('.video-item');
    videoItems.forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                toggleActions: 'play none none none' // Play once, never reverse to prevent layout jumping
            },
            y: 20, // Reduced from 100 to a subtle 20 to avoid extreme layout shifts
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        });

        /* --- Hover Video Previews Logic --- */
        const hoverVideo = item.querySelector('.hover-video');
        if (hoverVideo) {
            item.addEventListener('mouseenter', () => {
                hoverVideo.play();
            });
            item.addEventListener('mouseleave', () => {
                hoverVideo.pause();
                hoverVideo.currentTime = 0; // Reset video to start
            });
        }
    });

    // Footer animation
    gsap.from('.footer-content > *', {
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 90%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
    });

    /* --- Click to play full video --- */
    if (videoItems.length > 0) {
        videoItems.forEach((item) => {
            item.addEventListener('click', () => {
                const targetPage = item.getAttribute('data-page');
                if (targetPage) {
                    window.location.href = targetPage;
                }
            });
        });

        /* --- Album Video Filtering --- */
        const filterBtns = document.querySelectorAll('.filter-btn');
        if (filterBtns.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update active state
                    filterBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    const filterValue = btn.getAttribute('data-filter');

                    // 1. Fade out / Scale down all currently visible items
                    const visibleItems = Array.from(videoItems).filter(item => !item.classList.contains('hidden-item'));

                    // Kill any active tweens on these items (like ScrollTriggers that might be running)
                    gsap.killTweensOf(videoItems);

                    if (visibleItems.length > 0) {
                        gsap.to(visibleItems, {
                            opacity: 0,
                            scale: 0.8,
                            y: 0, // Force reset any residual Y offset
                            duration: 0.3,
                            ease: 'power2.in',
                            onComplete: () => {
                                // 2. Hide items that don't match, show items that do
                                videoItems.forEach(item => {
                                    if (filterValue === 'all' || item.getAttribute('data-album') === filterValue) {
                                        item.classList.remove('hidden-item');
                                    } else {
                                        item.classList.add('hidden-item');
                                    }
                                });

                                // 3. Fade in / Scale up the newly visible items
                                const newVisibleItems = Array.from(videoItems).filter(item => !item.classList.contains('hidden-item'));
                                if (newVisibleItems.length > 0) {
                                    gsap.fromTo(newVisibleItems,
                                        { opacity: 0, scale: 0.8, y: 0 },
                                        {
                                            opacity: 1,
                                            scale: 1,
                                            y: 0,
                                            duration: 0.4,
                                            stagger: 0.05,
                                            ease: 'back.out(1.2)',
                                            onComplete: () => ScrollTrigger.refresh() // Recalculate page height!
                                        }
                                    );
                                } else {
                                    ScrollTrigger.refresh();
                                }
                            }
                        });
                    } else {
                        // Edge case if somehow 0 items were visible
                        videoItems.forEach(item => {
                            if (filterValue === 'all' || item.getAttribute('data-album') === filterValue) {
                                item.classList.remove('hidden-item');
                            } else {
                                item.classList.add('hidden-item');
                            }
                        });
                        const newVisibleItems = Array.from(videoItems).filter(item => !item.classList.contains('hidden-item'));
                        gsap.fromTo(newVisibleItems,
                            { opacity: 0, scale: 0.8, y: 0 },
                            {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                duration: 0.4,
                                stagger: 0.05,
                                ease: 'back.out(1.2)',
                                onComplete: () => ScrollTrigger.refresh() // Recalculate page height!
                            }
                        );
                    }
                });
            });
        }
    }

    /* --- Info Page Fade In Animation --- */
    const infoSection = document.getElementById('info-content');
    if (infoSection) {
        // Master timeline for the info page load
        const tl = gsap.timeline();

        // 1. Fade in the whole section (background + overlay)
        tl.to(infoSection, {
            opacity: 1,
            duration: 1.2,
            ease: 'power2.inOut'
        });

        // Slide and fade in the text wrapper slightly after
        tl.to('.info-content-wrapper', {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power3.out'
        }, "-=0.6"); // overlap animation
    }

    /* --- Photo Gallery Fade-In Animation --- */
    const photoItems = document.querySelectorAll('.photo-item');
    if (photoItems.length > 0) {
        gsap.to(photoItems, {
            scrollTrigger: {
                trigger: '.photo-gallery-section',
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            stagger: { amount: 1.2 } /* Fast, dynamic cascade: all 50 photos finish stagger within 1.2s */
        });
    }

    /* --- Streaming Icons Fade-In Animation --- */
    const streamIcons = document.querySelectorAll('.stream-icon');
    if (streamIcons.length > 0) {
        // Set initial state for icons
        gsap.set(streamIcons, { opacity: 0, y: 20, scale: 0.9 });

        gsap.to(streamIcons, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.6, // wait slightly for the video iframe to load before popping in
            stagger: 0.15, // cascading pop-in effect
            ease: 'back.out(1.7)' // gives a slight, elegant bounce
        });
    }
});
