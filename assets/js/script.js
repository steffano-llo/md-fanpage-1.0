document.addEventListener('DOMContentLoaded', () => {

    /* --- Spotlight Effect --- */
    const heroSection = document.querySelector('.hero');
    const layerTextContent = document.querySelector('.layer-text'); // Seleccionamos el contenedor del texto

    if (heroSection) {
        window.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            if (e.clientY <= rect.bottom) { // Only update if over the hero section area
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Si el ratón se mueve por primera vez sobre el video, quitamos el desenfoque del texto
                if (layerTextContent && !layerTextContent.classList.contains('is-focused')) {
                    layerTextContent.classList.add('is-focused');
                }

                // Use GSAP for butter smooth cursor tracking
                gsap.to(heroSection, {
                    '--cursor-x': `${x}px`,
                    '--cursor-y': `${y}px`,
                    duration: 0.4,
                    ease: 'power3.out'
                });
            }
        });

        document.addEventListener('mouseleave', () => {
            gsap.to(heroSection, {
                '--cursor-x': `-1000px`,
                '--cursor-y': `-1000px`,
                duration: 0.5
            });
            // El texto vuelve a estar borroso al apartar el ratón
            if (layerTextContent) {
                layerTextContent.classList.remove('is-focused');
            }
        });

        // Navigate to project page on click
        heroSection.addEventListener('click', (e) => {
            // No navegar si hacemos click en los controles de video o en enlaces
            if (e.target.closest('.video-nav-control') || e.target.closest('a')) return;
            if (playlist && playlist[currentVideoIndex] && playlist[currentVideoIndex].page) {
                // Solo redirigimos si realmente estamos en el index con los videos
                if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                    window.location.href = playlist[currentVideoIndex].page;
                }
            }
        });
    }

    /* --- Video Playlist Logic --- */
    const playlist = [
        { src: 'assets/videos/preview/md-badenough-preview.mp4', title: 'BAD ENOUGH', subtitle: 'Locket (Album)', page: 'md-badenough.html' },
        { src: 'assets/videos/preview/md-reckless-preview.mp4', title: 'RECKLESS', subtitle: 'Silence Between Songs (Album)', page: 'md-reckless.html' },
        { src: 'assets/videos/preview/md-goodingoodbye-preview.mp4', title: 'GOOD IN GOODBYE', subtitle: 'Life Support (Album)', page: 'md-goodingoodbye.html' },
        { src: 'assets/videos/preview/md-makeyoumine-preview.mp4', title: 'MAKE YOU MINE', subtitle: 'Locket (Album)', page: 'md-makeyoumine.html' },
        { src: 'assets/videos/preview/md-selfish-preview.mp4', title: 'SELFISH', subtitle: 'Life Support (Album)', page: 'md-selfish.html' },
        { src: 'assets/videos/preview/md-spinnin-preview.mp4', title: 'SPINNIN', subtitle: 'Silence Between Songs (Album)', page: 'md-spinnin.html' }
    ];

    let currentVideoIndex = 0;
    let isTransitioning = false; // Prevents spam clicking the next/prev buttons

    const nextVideoBtn = document.getElementById('nextVideoBtn');
    const prevVideoBtn = document.getElementById('prevVideoBtn');
    const videoElement = document.querySelector('.bg-video');
    const titleElement = document.getElementById('dynamicTitle');
    const subtitleElement = document.getElementById('dynamicSubtitle');
    const counterElementNext = document.getElementById('videoCounterNext');
    const counterElementPrev = document.getElementById('videoCounterPrev');

    if (videoElement) {
        // Aseguramos que el video inicial de la etiqueta coincida con el primero de la playlist
        videoElement.src = playlist[0].src;

        const changeVideo = (direction) => {
            if (isTransitioning) return;
            isTransitioning = true;

            if (direction === 'next') {
                currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
            } else if (direction === 'prev') {
                currentVideoIndex = (currentVideoIndex - 1 + playlist.length) % playlist.length;
            }

            const nextContent = playlist[currentVideoIndex];
            const displayIndex = `${currentVideoIndex + 1}/${playlist.length}`;

            // Animar salida
            gsap.to([titleElement, subtitleElement, videoElement], {
                opacity: 0,
                y: -10,
                duration: 0.4,
                ease: 'power2.in',
                onComplete: () => {
                    // Actualizar contenido
                    titleElement.textContent = nextContent.title;
                    subtitleElement.textContent = nextContent.subtitle;
                    videoElement.src = nextContent.src;

                    if (counterElementNext) counterElementNext.textContent = displayIndex;
                    if (counterElementPrev) counterElementPrev.textContent = displayIndex;

                    // Animar entrada una vez que el video esté listo para reproducirse
                    videoElement.oncanplay = () => {
                        gsap.to([titleElement, subtitleElement], {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: 'power2.out'
                        });
                        // El video de fondo recupera su opacidad inicial (0.6)
                        gsap.to(videoElement, {
                            opacity: 0.6,
                            duration: 0.8,
                            ease: 'power2.out',
                            onComplete: () => {
                                isTransitioning = false;
                            }
                        });
                        videoElement.oncanplay = null; // Limpiar listener
                    };
                }
            });
        };

        if (nextVideoBtn) nextVideoBtn.addEventListener('click', () => changeVideo('next'));
        if (prevVideoBtn) prevVideoBtn.addEventListener('click', () => changeVideo('prev'));
    }


    /* --- GSAP Scroll Animations --- */
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section animation
    gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.5
    });

    gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1.5,
        ease: 'power3.out',
        delay: 0.8
    });



});
