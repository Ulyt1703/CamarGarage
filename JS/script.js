if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
} 
else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };
}
window.onload = function () {
    setTimeout(function () {
        window.scrollTo(0, 0);
    }, 10);
};

document.addEventListener("DOMContentLoaded", () => {
    let projectSliderContainer = document.getElementById("projects-slider");

    async function loadProjects() {
        if (!projectSliderContainer) return;
        if (typeof API_CONFIG === "undefined") return;

        try {
            const res = await fetch(
                `https://api.github.com/gists/${API_CONFIG.GIST_ID}`,
            );
            let data = await res.json();
            let rawUrl = data.files["projects.json"].raw_url;
            let rawRes = await fetch(rawUrl);
            let projects = await rawRes.json();

            renderProjectsSlider(projects);
        } catch (error) {
            console.error("Fout bij laden:", error);
            projectSliderContainer.innerHTML =
                '<p style="padding:20px; text-align:center">Laden mislukt.</p>';
        }
    }

    function renderProjectsSlider(projects) {
        let prevBtn = document.getElementById("prev-btn");
        let nextBtn = document.getElementById("next-btn");

        if (!projects || projects.length === 0) {
            projectSliderContainer.style.transform = "translateX(0)";
            projectSliderContainer.innerHTML = `
                <div style="width: 100vw; display: flex; justify-content: center; align-items: center; min-height: 200px; color: #888; font-size: 16px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                    Nog geen projecten beschikbaar.
                </div>
            `;
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
            projectSliderContainer.style.cursor = "default";
            return;
        }

        let isFewCards = projects.length < 4;

        if (isFewCards) {
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
            projectSliderContainer.style.transform = "translateX(0)";
            projectSliderContainer.style.justifyContent = "center";
            projectSliderContainer.style.cursor = "default";
        } else {
            if (prevBtn) prevBtn.style.display = "flex";
            if (nextBtn) nextBtn.style.display = "flex";
            projectSliderContainer.style.justifyContent = "flex-start";
            projectSliderContainer.style.cursor = "grab";
        }

        projectSliderContainer.innerHTML = "";

        let renderList = isFewCards
            ? projects
            : [...projects, ...projects, ...projects];

        renderList.forEach((p) => {
            let mediaUrl = p.image || "";
            let isVideo = mediaUrl.match(/\.(mp4|webm|mov|mkv)$/i);

            let mediaHTML = "";

            if (isVideo) {
                let videoSrc = mediaUrl.includes("#")
                    ? mediaUrl
                    : mediaUrl + "#t=0.001";

                mediaHTML = `
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;">
                        <video class="project-video" src="${videoSrc}" playsinline preload="metadata" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;"></video>
                        
                        <div class="custom-play-btn" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 70px; height: 70px; background: rgba(200, 0, 0, 0.85); backdrop-filter: blur(5px); border: 2px solid rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 20; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); pointer-events: auto; transition: transform 0.3s ease, background 0.3s ease;">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="#FFF" style="transform: translateX(-1px);"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                `;
            } else {
                mediaHTML = `<div class="project-image" style="background-image: url('${mediaUrl}');"></div>`;
            }

            const card = `
                <div class="project-card">
                    ${mediaHTML}
                    <div class="project-overlay" style="pointer-events: none; z-index: 10;">
                        <div class="project-info" style="pointer-events: auto;">
                            <span class="project-category">${p.category}</span>
                            <h3 class="project-name">${p.name}</h3>
                            <p class="project-desc">${p.desc}</p>
                        </div>
                    </div>
                </div>
            `;
            projectSliderContainer.innerHTML += card;
        });

        let playButtons =
            projectSliderContainer.querySelectorAll(".custom-play-btn");
        playButtons.forEach((btn) => {
            btn.addEventListener("mouseenter", function () {
                this.style.transform = "translate(-50%, -50%) scale(1.1)";
                this.style.background = "rgba(255, 0, 0, 1)";
            });
            btn.addEventListener("mouseleave", function () {
                this.style.transform = "translate(-50%, -50%) scale(1)";
                this.style.background = "rgba(200, 0, 0, 0.85)";
            });
            btn.addEventListener("click", function () {
                let video = this.previousElementSibling;
                if (video) {
                    if (video.requestFullscreen) {
                        video.requestFullscreen();
                    } else if (video.webkitEnterFullscreen) {
                        video.webkitEnterFullscreen();
                    }

                    video.controls = true;
                    video.play();
                }
            });
        });

        document.addEventListener("fullscreenchange", handleExitFullscreen);
        document.addEventListener("webkitfullscreenchange", handleExitFullscreen);

        function handleExitFullscreen() {
            if (!document.fullscreenElement && !document.webkitFullscreenElement) {
                let videos =
                    projectSliderContainer.querySelectorAll(".project-video");
                videos.forEach((vid) => {
                    vid.pause();
                    vid.controls = false;
                });
            }
        }

        if (!isFewCards) {
            initCarousel("projects-slider", "prev-btn", "next-btn");
        }
    }

    loadProjects();

    function initCarousel(sliderId, prevBtnId, nextBtnId) {
        let track = document.getElementById(sliderId);
        let prevBtn = document.getElementById(prevBtnId);
        let nextBtn = document.getElementById(nextBtnId);
        if (!track || track.children.length === 0) return;

        let isAnimating = false;
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        let getCardWidth = () => {
            let card = track.children[0];
            let gap = parseFloat(window.getComputedStyle(track).gap) || 0;
            return card.offsetWidth + gap;
        };

        track.prepend(track.lastElementChild);

        let resetPosition = () => {
            track.style.transition = "none";
            track.style.transform = `translateX(-${getCardWidth()}px)`;
        };

        setTimeout(resetPosition, 50);

        let moveNext = () => {
            if (isAnimating) return;
            isAnimating = true;
            track.style.transition = "transform 0.5s ease";
            track.style.transform = `translateX(-${getCardWidth() * 2}px)`;

            track.addEventListener("transitionend", function handler() {
                track.removeEventListener("transitionend", handler);
                track.appendChild(track.firstElementChild);
                resetPosition();
                isAnimating = false;
            });
        };

        let movePrev = () => {
            if (isAnimating) return;
            isAnimating = true;
            track.style.transition = "transform 0.5s ease";
            track.style.transform = `translateX(0px)`;

            track.addEventListener("transitionend", function handler() {
                track.removeEventListener("transitionend", handler);
                track.prepend(track.lastElementChild);
                resetPosition();
                isAnimating = false;
            });
        };

        if (nextBtn) nextBtn.addEventListener("click", moveNext);
        if (prevBtn) prevBtn.addEventListener("click", movePrev);

        let dragStart = (e) => {
            if (isAnimating) return;
            isDragging = true;
            track.style.transition = "none";
            startX = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
        };

        let dragMove = (e) => {
            if (!isDragging) return;
            let x = e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
            currentX = x - startX;
            track.style.transform = `translateX(calc(-${getCardWidth()}px + ${currentX}px))`;
        };

        let dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            if (currentX <= -50) moveNext();
            else if (currentX >= 50) movePrev();
            else {
                track.style.transition = "transform 0.3s ease";
                resetPosition();
            }
            currentX = 0;
        };

        track.addEventListener("mousedown", dragStart);
        window.addEventListener("mousemove", dragMove);
        window.addEventListener("mouseup", dragEnd);
        window.addEventListener("mouseleave", dragEnd);
        track.addEventListener("touchstart", dragStart, { passive: true });
        track.addEventListener("touchmove", dragMove, { passive: true });
        track.addEventListener("touchend", dragEnd);
    }

    let preloader = document.getElementById("preloader");
    window.addEventListener("load", () => {
        if (preloader) preloader.classList.add("hide-preloader");
    });

    let header = document.querySelector(".top-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) header.classList.add("scrolled");
        else header.classList.remove("scrolled");
    });

    let menuWrapper = document.querySelector(".menu-wrapper");
    let hamburger = document.querySelector(".hamburger");
    let mobileNav = document.querySelector(".mobile-nav");
    let hideServices = document.getElementById("h-services");
    let hideContact = document.getElementById("h-contact");

    if (menuWrapper) {
        menuWrapper.addEventListener("click", () => {
            hamburger.classList.toggle("is-active");
            mobileNav.classList.toggle("is-open");
            document.body.classList.toggle("no-scroll");
            if (hideServices) hideServices.classList.toggle("nav-hidden");
            if (hideContact) hideContact.classList.toggle("nav-hidden");
        });
    }

    let mobileLinks = document.querySelectorAll(".mobile-nav a");
    mobileLinks.forEach((link) => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("is-active");
            mobileNav.classList.remove("is-open");
            document.body.classList.remove("no-scroll");
            if (hideServices) hideServices.classList.remove("nav-hidden");
            if (hideContact) hideContact.classList.remove("nav-hidden");
        });
    });

    let stats = document.querySelectorAll(".stat-num-light");
    let observer = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    let el = entry.target;
                    let target = parseInt(el.innerText);
                    let count = 0;
                    let update = () => {
                        if (count < target) {
                            count += Math.ceil(target / 40);
                            if (count > target) count = target;
                            el.innerText = count + "+";
                            setTimeout(update, 30);
                        }
                    };
                    update();
                    obs.unobserve(el);
                }
            });
        },
        { threshold: 0.5 },
    );
    stats.forEach((s) => observer.observe(s));

    let baRange = document.getElementById("ba-range");
    let baSlider = document.getElementById("ba-slider");
    if (baRange && baSlider) {
        baRange.addEventListener("input", (e) => {
            baSlider.style.setProperty("--pos", e.target.value + "%");
        });
    }
});

const servicesData = [
    {
        title: "Ambient Light",
        img: "./img/ambient-light.jpg",
        time: "1 Dag",
        price: "Op aanvraag",
        desc: "Creëer de perfecte sfeer met premium LED verlichting.",
    },
    {
        title: "Chip Tuning",
        img: "./img/chip-tuning.jpg",
        time: "Verschilt per project",
        price: "Op aanvraag",
        desc: "Software optimalisatie voor maximale prestaties en efficiëntie.",
    },
    {
        title: "Starroof",
        img: "./img/starroof.jpg",
        time: "4 Dagen",
        price: "Op aanvraag",
        desc: "Een sterrenhemel in uw auto.",
    },
    {
        title: "Rim Painting",
        img: "./img/rim-painting.jpg",
        time: "1-2 Dagen",
        price: "Op aanvraag",
        desc: "Professionele renovatie en poedercoaten van uw velgen.",
    },
    {
        title: "Bodykits",
        img: "./img/bodykits.jpg",
        time: "Verschilt per project",
        price: "Op aanvraag",
        desc: "Transformeer de look van uw auto met sportieve bumpers en spoilers.",
    },
    {
        title: "Vehicle Wraps",
        img: "./img/wraps.jpg",
        time: "3-5 Dagen",
        price: "Op aanvraag",
        desc: "Volledige kleurverandering, chrome delete of lakbescherming (PPF).",
    },
    {
        title: "Custom Seatbelts",
        img: "./img/seatbelts.jpg",
        time: "1 Dag",
        price: "Op aanvraag",
        desc: "Gekleurde veiligheidsgordels voor een uniek accent in uw interieur.",
    },
    {
        title: "Interior Upholstery",
        img: "./img/interior-upholstery.jpg",
        time: "1-3 Weken",
        price: "Op aanvraag",
        desc: "Herbekleding van sturen en stoelen met premium Nappa of Alcantara.",
    },
    {
        title: "Brake Calipers",
        img: "./img/brake-calipers.jpg",
        time: "1-2 Dagen",
        price: "Op aanvraag",
        desc: "Sportieve look met hittebestendige lak en nieuwe logo's.",
    },
    {
        title: "Steering Wheels",
        img: "./img/steering-wheels.jpg",
        time: "Verschilt per project",
        price: "Op aanvraag",
        desc: "Custom carbon en LED sturen voor de ultieme rijervaring.",
    },
    {
        title: "Parts Installation",
        img: "./img/parts-installation.jpg",
        time: "Verschilt per project",
        price: "Op aanvraag",
        desc: "Professionele montage van uitlaten, spoilers en diffusers.",
    },
];

function initServicesSlider() {
    let slider = document.getElementById("services-slider");
    let prevBtn = document.getElementById("srv-prev");
    let nextBtn = document.getElementById("srv-next");
    if (!slider) return;

    const createCard = (s) => `
        <div class="service-card">
            <div class="srv-bg" style="background-image: url('${s.img}');"></div>
            <div class="srv-top-info"><div class="srv-duration">⏱ ${s.time}</div></div>
            <div class="srv-overlay">
                <h3 class="srv-title">${s.title}</h3>
                <p class="srv-desc">${s.desc}</p>
                <span class="srv-price">${s.price}</span>
                <a href="booking.html" class="srv-btn">Boek Nu</a>
                <span class="srv-subtext">Directe bevestiging</span>
            </div>
        </div>`;

    if (window.innerWidth <= 768) {
        slider.innerHTML = "";
        servicesData.forEach((s) => (slider.innerHTML += createCard(s)));
        return;
    }

    const infiniteServices = [
        ...servicesData,
        ...servicesData,
        ...servicesData,
        ...servicesData,
        ...servicesData,
    ];
    slider.innerHTML = "";
    infiniteServices.forEach((s) => (slider.innerHTML += createCard(s)));

    setTimeout(() => {
        const totalWidth = slider.scrollWidth;
        const oneSetWidth = totalWidth / 5;
        slider.scrollLeft = oneSetWidth * 2;

        const getCardWidth = () => {
            const card = slider.querySelector(".service-card");
            return card ? card.offsetWidth + 20 : 350;
        };

        if (nextBtn) {
            nextBtn.onclick = () => {
                const w = getCardWidth();
                if (slider.scrollLeft >= oneSetWidth * 4 - 50)
                    slider.scrollLeft = oneSetWidth * 2 - 50;
                slider.scrollBy({ left: w, behavior: "smooth" });
            };
        }
        if (prevBtn) {
            prevBtn.onclick = () => {
                const w = getCardWidth();
                if (slider.scrollLeft <= oneSetWidth + 50)
                    slider.scrollLeft = oneSetWidth * 3 + 50;
                slider.scrollBy({ left: -w, behavior: "smooth" });
            };
        }
        slider.addEventListener("scroll", () => {
            const current = slider.scrollLeft;
            if (current < oneSetWidth - 500)
                slider.scrollLeft = current + oneSetWidth;
            else if (current > oneSetWidth * 4 + 500)
                slider.scrollLeft = current - oneSetWidth;
        });

        let isDown = false;
        let startX, scrollLeft;
        slider.addEventListener("mousedown", (e) => {
            isDown = true;
            slider.style.cursor = "grabbing";
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener("mouseleave", () => {
            isDown = false;
            slider.style.cursor = "grab";
        });
        slider.addEventListener("mouseup", () => {
            isDown = false;
            slider.style.cursor = "grab";
        });
        slider.addEventListener("mousemove", (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            slider.scrollLeft = scrollLeft - (x - startX) * 2;
        });
    }, 300);
}
initServicesSlider();

const backToTopBtn = document.getElementById("backToTop");
if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    let progressBar = document.getElementById("scroll-progress");
    if (!progressBar) {
        progressBar = document.createElement("div");
        progressBar.id = "scroll-progress";
        document.body.prepend(progressBar);
    }
    window.addEventListener("scroll", () => {
        const scrollTop =
            document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
        const scrolled = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        progressBar.style.width = scrolled + "%";
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const modalDataDB = {
        ambient: {
            title: "Ambient Light",
            price: "€299 - €599",
            badge: "Instant Booking",
            img: "./img/ambient-light.jpg",
            desc: "Creëer de perfecte sfeer in uw auto met onze premium LED-verlichting. Kies uit 64 kleuren en bedien alles eenvoudig via uw smartphone of de originele knoppen van uw auto.",
            features: [
                "64 Kleuren (RGB)",
                "App Bediening",
                "OEM Look & Feel",
                "Verborgen Installatie",
                "1 Jaar Garantie",
            ],
        },
        tuning: {
            title: "Chip Tuning",
            price: "€599 - €899",
            badge: "Populair",
            img: "./img/chip-tuning.jpg",
            desc: "Optimaliseer de software van uw motor voor meer vermogen (PK), meer trekkracht (Nm) en een efficiënter brandstofverbruik. Haal het maximale uit uw voertuig.",
            features: [
                "Meer PK & Nm",
                "Zuiniger Brandstofverbruik",
                "Software op Maat",
                "Veilig & Betrouwbaar",
                "Testrit Inbegrepen",
            ],
        },
        bodykits: {
            title: "Bodykits",
            price: "Op aanvraag",
            badge: "Custom",
            img: "./img/bodykits.jpg",
            desc: "Transformeer de look van uw auto met sportieve voorbumpers, achterdiffusers, side skirts en spoilers. Wij installeren premium merken voor de perfecte pasvorm.",
            features: [
                "Agressieve, Sportieve Look",
                "Premium Merken (Maxton, Brabus, etc.)",
                "Professionele Montage",
                "Perfecte Pasvorm",
            ],
        },
        starroof: {
            title: "Starroof",
            price: "€1299 - €2499",
            badge: "Exclusive",
            img: "./img/starroof.jpg",
            desc: "Breng de sterrenhemel naar uw eigen auto, vergelijkbaar met de beroemde Rolls-Royce starroof. Honderden fonkelende lichtjes zorgen voor een magische ervaring 's nachts.",
            features: [
                "Tot 1000+ Sterren",
                "Vallende Sterren Effect",
                "Verschillende Kleuren Instelbaar",
                "Onzichtbare Installatie in Dakhemel",
            ],
        },
        rims: {
            title: "Rim Painting",
            price: "€700",
            badge: "Instant Booking",
            img: "./img/rim-painting.jpg",
            desc: "Geef uw velgen een compleet nieuwe, agressieve look of herstel vervelende stoeprandschade met onze professionele poedercoating of spuitdiensten.",
            features: [
                "Kras- en Stoeprandschade Herstel",
                "Professioneel Poedercoaten",
                "Alle Kleuren en Finishes (Mat/Glans)",
                "Duurzame en Slijtvaste Afwerking",
            ],
        },
        wraps: {
            title: "Vehicle Wraps",
            price: "Op aanvraag",
            badge: "Styling",
            img: "./img/wraps.jpg",
            desc: "Verander de volledige kleur van uw auto, ontchromen (chrome delete), of bescherm de originele lak met hoogwaardige PPF (Paint Protection Film).",
            features: [
                "Volledige Kleurverandering",
                "Chrome Delete (Zwarte Accenten)",
                "Lakbescherming (PPF)",
                "Makkelijk Verwijderbaar",
                "Premium Folies (3M, Avery)",
            ],
        },
        seatbelts: {
            title: "Custom Seatbelts",
            price: "€399 - €699",
            badge: "Interior",
            img: "./img/seatbelts.jpg",
            desc: "Voeg een subtiel of opvallend kleuraccent toe aan uw interieur met op maat gemaakte veiligheidsgordels. Verkrijgbaar in kleuren zoals Porsche Rood, AMG Geel en M-Blauw.",
            features: [
                "Keuze uit 50+ Kleuren",
                "Voldoet aan Originele Veiligheidsnormen",
                "Snelle Installatie",
                "Perfect en Uniek Interieurdetail",
            ],
        },
        upholstery: {
            title: "Interior Upholstery",
            price: "Op aanvraag",
            badge: "Luxury",
            img: "./img/interior-upholstery.jpg",
            desc: "Geef uw interieur de ultieme luxe upgrade met premium herbekleding. Van stoelen en stuurwielen tot complete deurpanelen, bekleed met hoogwaardig Nappa leer of Alcantara.",
            features: [
                "Premium origineel Alcantara",
                "Hoogwaardig Nappa Leer",
                "Custom Stiksels & Patronen",
                "Volledig Op Maat Gemaakt",
            ],
        },
        calipers: {
            title: "Brake Calipers",
            price: "€499 - €899",
            badge: "Detailing",
            img: "./img/brake-calipers.jpg",
            desc: "Laat uw remklauwen opvallen achter uw velgen. Wij spuiten ze in een sportieve kleur (zoals AMG Rood of Porsche Geel) met hoogwaardige, hittebestendige lak.",
            features: [
                "Hittebestendige Premium Lak",
                "Custom Logo's (AMG, M, Porsche, etc.)",
                "Sportieve Look",
                "Lange Levensduur & Makkelijk Schoon te maken",
            ],
        },
        steering: {
            title: "Steering Wheels",
            price: "Op aanvraag",
            badge: "Performance",
            img: "./img/steering-wheels.jpg",
            desc: "Upgrade uw rijervaring met een compleet custom stuurwiel. Kies voor echt carbon fiber, alcantara, LED-shift lights en een agressieve, ergonomische vormgeving.",
            features: [
                "Echt Carbon Fiber Accenten",
                "Ingebouwde LED Shift Lights",
                "Bekleed met Alcantara of Geperforeerd Leer",
                "Ergonomische en Dikke Grip",
            ],
        },
        parts: {
            title: "Parts Installation",
            price: "Op aanvraag",
            badge: "Workshop",
            img: "./img/parts-installation.jpg",
            desc: "Heeft u eigen onderdelen gekocht of wilt u premium uitlaten, vering en spoilers door ons laten leveren en monteren? Onze specialisten zorgen voor een perfecte installatie.",
            features: [
                "Montage van Uitlaten & Downpipes",
                "Luchtinlaatsystemen (Intakes)",
                "Ophanging & Verlagingsveren",
                "Professioneel en Veilig Gemonteerd",
            ],
        },
    };

    const modal = document.getElementById("service-modal");
    const closeBtn = document.querySelector(".modal-close-btn");
    const backBtn = document.getElementById("close-modal-btn");
    const serviceCards = document.querySelectorAll(".srv-grid-card");

    if (modal && serviceCards.length > 0) {
        serviceCards.forEach((card) => {
            card.addEventListener("click", function (e) {
                e.preventDefault();

                const serviceKey = this.getAttribute("data-service");
                const data = modalDataDB[serviceKey];

                if (data) {
                    document.getElementById("modal-img").style.backgroundImage =
                        `url('${data.img}')`;
                    document.getElementById("modal-title").innerText = data.title;
                    document.getElementById("modal-price").innerText = data.price;
                    document.getElementById("modal-desc").innerText = data.desc;
                    document.getElementById("modal-badge").innerText = data.badge;

                    const featuresList = document.getElementById("modal-features");
                    featuresList.innerHTML = "";
                    data.features.forEach((feat) => {
                        featuresList.innerHTML += `<li>${feat}</li>`;
                    });

                    modal.classList.add("is-visible");
                    document.body.classList.add("no-scroll");
                }
            });
        });

        const closeModal = () => {
            modal.classList.remove("is-visible");
            document.body.classList.remove("no-scroll");
        };

        if (closeBtn) closeBtn.addEventListener("click", closeModal);

        if (backBtn) backBtn.addEventListener("click", closeModal);

        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });
    }
});
