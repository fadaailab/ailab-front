(function () {
    window.addEventListener("load", () => {
        // Preload
        const preloader = document.querySelector(".ai-preloader");
        preloader.classList.add("hide");

        setTimeout(() => {
            preloader.style.display = "none";
        }, 500);

        // Start the typing effect
        const dynamicText = document.querySelector(".ai-typed__text--dynamic");
        const words = dynamicText && dynamicText.dataset.text.split(',');
        dynamicText && typeEffect(dynamicText, words);

    });

    // Get the header element and its offset height
    const header = document.querySelector('.header');
    const offset = header.offsetHeight;

    // Function to handle scroll events
    const handleScroll = () => {
        const scrollTop = window.scrollY;

        // Check for scroll position to add/remove the 'fixed' class
        if (scrollTop > offset / 2) {
            header.classList.add('fixed');
            // document.body.style.paddingTop = offset + 'px';
        } else {
            header.classList.remove('fixed');
            // document.body.style.paddingTop = 0 + 'px';
        }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check on page load
    if (window.scrollY > offset) {
        header.classList.add('fixed');
    }

    // Video controls
    const video = document.getElementById("aiVideo");

    if (video) {
        const playPauseBtn = document.getElementById("aiVideoPlayPause");
        const volumeBtn = document.getElementById("aiVideoVolume");

        const [playIcon, pauseIcon] = playPauseBtn.querySelectorAll("svg");
        const [muteIcon, volumeIcon] = volumeBtn.querySelectorAll("svg");

        const togglePlayPauseIcons = () => {
            playIcon.classList.toggle("d-none", !video.paused);
            pauseIcon.classList.toggle("d-none", video.paused);
        };

        const toggleVolumeIcons = () => {
            muteIcon.classList.toggle("d-none", !video.muted);
            volumeIcon.classList.toggle("d-none", video.muted);
        };

        playPauseBtn.addEventListener("click", () => {
            video.paused ? video.play() : video.pause();
            togglePlayPauseIcons();
        });

        volumeBtn.addEventListener("click", () => {
            video.muted = !video.muted;
            toggleVolumeIcons();
        });

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play();
                } else {
                    video.pause();
                }
                togglePlayPauseIcons();
            },
            { threshold: 0.5 }
        );

        observer.observe(video);

        // Initialize icon state on load
        togglePlayPauseIcons();
        toggleVolumeIcons();
    }

    // Counter animation
    const counters = document.querySelectorAll(".ai-stats__item__count");

    if (counters.length) {
        let hasCounted = false;

        const counterUp = (el, target, suffix = "", duration = 1000) => {
            let start = 0;
            const increment = target / (duration / 16); // approx 60fps
            const isInt = Number.isInteger(target);

            const update = () => {
                start += increment;
                if (start < target) {
                    el.textContent = `${isInt ? Math.floor(start) : start.toFixed(0)}${suffix}`;
                    requestAnimationFrame(update);
                } else {
                    el.textContent = `${isInt ? target : target.toFixed(0)}${suffix}`;
                }
            };

            requestAnimationFrame(update);
        };

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasCounted) {
                    hasCounted = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute("data-target"));
                        const suffix = counter.getAttribute("data-suffix") || "";
                        counterUp(counter, target, suffix, 1200);
                    });
                }
            },
            { threshold: 0.4 }
        );

        const statsSection = document.querySelector(".section--stats");
        observer.observe(statsSection);
    }

    // Application form
    const form = document.getElementById("applicationForm");
    const steps = document.querySelectorAll(".ai-form__step");
    const nextBtns = document.querySelectorAll(".ai-form__step__btn-next");
    const prevBtns = document.querySelectorAll(".ai-form__step__btn-prev");
    const submitBtn = document.querySelector(".ai-form__step__btn-submit");

    let currentStep = 0;

    function showStep(index) {
        steps.forEach((step, i) => {
            step.classList.toggle("active", i === index);
        });
    }

    nextBtns?.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    prevBtns?.forEach(btn => {
        btn.addEventListener("click", function (e) {
            e.preventDefault();
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    submitBtn?.addEventListener("click", function (e) {
        // e.preventDefault();
        // if (currentStep === steps.length - 1) {
        //     form.submit();
        // } else {
        //     alert("Please complete all steps before submitting.");
        // }
    })

    // Typing effect for the dynamic text
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // Initialize Typing effect
    const typeEffect = (dynamicText, words) => {
        const currentWord = words[wordIndex];
        const currentChar = currentWord.substring(0, charIndex);
        dynamicText.textContent = currentChar;

        // Determine typing or deleting behavior
        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(() => typeEffect(dynamicText, words), 200)
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(() => typeEffect(dynamicText, words), 100)
        } else {
            // Switch between typing and deleting mode
            isDeleting = !isDeleting;
            wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
            setTimeout(() => typeEffect(dynamicText, words), 800)
        }
    };

    // File input handling
    const fileInputs = document.querySelectorAll('input[type="file"]')
    fileInputs && fileInputs.forEach((input) => {
        input.addEventListener('change', function (event) {
            const file = event.target.files[0];
            const fileNameDisplay = input.nextElementSibling.querySelector('.ai-form__control__label__text');

            if (file && fileNameDisplay) {
                fileNameDisplay.textContent = file.name;
            } else if (fileNameDisplay) {
                fileNameDisplay.textContent = 'Fayl seçilmədi';
            }
        });
    });

    // Quick search regex
    let qsRegex;
    let buttonFilters = {};
    let buttonFilter;

    // Init Isotope
    const grid = document.querySelector('.ai-vacancies');
    const iso = grid && new Isotope(grid, {
        itemSelector: '.ai-vacancies__item',
        layoutMode: 'fitRows',
        fitRows: {
            columnWidth: 304,
            gutter: 16,
            equalheight: true
        },
        filter: function (item) {
            let searchResult = qsRegex ? item.textContent.match(qsRegex) : true
            let buttonResult = buttonFilter ? item.matches(buttonFilter) : true;
            return searchResult && buttonResult
        }
    });

    const filterTabs = document.querySelectorAll('.ai-tabs__item')
    filterTabs?.forEach(filterTab => {
        filterTab.addEventListener('click', () => {
            if (!filterTab.classList.contains('ai-tabs__item--active')) {
                document.querySelector('.ai-tabs__item--active').classList.remove('ai-tabs__item--active')
                filterTab.classList.add('ai-tabs__item--active')
                let filterGroup = filterTab.closest('.ai-tabs').getAttribute('data-filter-group')
                buttonFilters[filterGroup] = filterTab.getAttribute('data-filter')
                buttonFilter = concatValues(buttonFilters);
                iso.arrange()
            }
        });
    })

    // Use value of search field to filter
    const quicksearch = document.querySelector('#searchVacancies');
    quicksearch?.addEventListener('input', debounce(() => {
        qsRegex = new RegExp(quicksearch.value, 'gi');
        const activeTags = document.querySelectorAll('.ai-tags__item--selected')
        activeTags?.forEach(activeTag => {
            activeTag.classList.remove('ai-tags__item--selected')
        })
        iso.arrange();
    }, 200));

    // Initialize Fancybox
    if (typeof Fancybox !== "undefined") {
        Fancybox.bind('[data-fancybox="gallery"]', {});
    }

    // Initialize Swiper
    const swiperPartners = new Swiper(".swiper--partners", {
        slidesPerView: "auto",
        spaceBetween: 56,
        autoplay: {
            delay: 2000,
            disableOnInteraction: true,
        },
    });

    const swiperBlogs = new Swiper(".swiper--blogs", {
        slidesPerView: 4,
        spaceBetween: 24,
        autoplay: {
            delay: 3000,
            disableOnInteraction: true,
        },
    });

    const swiperExternals = new Swiper(".swiper--externals", {
        slidesPerView: 4,
        spaceBetween: 24,
        autoplay: {
            delay: 2000,
            disableOnInteraction: true,
        },
    });

    // Initialize Tilt.js
    const tiltElements = document.querySelectorAll('.ai-tilt');
    tiltElements.length > 0 && VanillaTilt.init(tiltElements, {
        max: 25,
        speed: 400
    });

    // Handle modal background click to close
    document.querySelectorAll('.ai-modal--closeable').forEach(modal => {
        modal.addEventListener('click', function (e) {
            const modalContent = this.querySelector('.ai-modal__content');
            if (!modalContent.contains(e.target)) {
                window.modal(this, 'hide');
            }
        });
    });

    // Handle opening modal
    document.querySelectorAll('[data-toggle="modal"]').forEach(trigger => {
        trigger.addEventListener('click', function () {
            const modalSelector = this.getAttribute('data-target');
            modalSelector && window.modal(modalSelector, 'show');
        });
    });

    // Handle closing modal with button
    document.querySelectorAll('[data-close="modal"]').forEach(closeBtn => {
        closeBtn.addEventListener('click', function () {
            const modal = this.closest('.ai-modal');
            modal && window.modal(modal, 'hide');
        });
    });

    window.modal = function (selectorOrElement, action, url) {
        const showDelay = 150;
        const modalEl = typeof selectorOrElement === 'string'
            ? document.querySelector(selectorOrElement)
            : selectorOrElement;

        if (!modalEl) return;

        switch (action) {
            case 'show':
                modalEl.style.display = 'block';
                document.body.classList.add('overflow-hidden');

                if (modalEl.classList.contains('ai-modal--multi-content')) {
                    const step1Content = modalEl.querySelector('.ai-modal__content[data-step="1"]');
                    if (step1Content) window.modalContent(step1Content, 'show');
                }

                setTimeout(() => {
                    modalEl.classList.add('ai-modal--show');
                }, showDelay);
                break;

            case 'hide':
                modalEl.classList.remove('ai-modal--show');

                setTimeout(() => {
                    modalEl.style.display = 'none';
                    document.body.classList.remove('overflow-hidden');

                    if (modalEl.classList.contains('ai-modal--multi-content')) {
                        modalEl.querySelectorAll('.ai-modal__content').forEach(content =>
                            window.modalContent(content, 'hide')
                        );
                    }

                    if (url) {
                        window.location.replace(url);
                    }
                }, showDelay);
                break;

            default:
                console.error('Unsupported action for modal:', action);
        }
    };

    window.modalContent = function (selectorOrElement, action) {
        const contentEl = typeof selectorOrElement === 'string'
            ? document.querySelector(selectorOrElement)
            : selectorOrElement;

        if (!contentEl) return;

        switch (action) {
            case 'show':
                contentEl.classList.add('ai-modal__content--show');
                break;
            case 'hide':
                contentEl.classList.remove('ai-modal__content--show');
                break;
            default:
                console.error('Unsupported action for modalContent:', action);
        }
    };

    // Concat object values
    function concatValues(obj) {
        let value = ''; for (let prop in obj) { value += obj[prop]; }
        return value;
    }

    // Debounce function using modern syntax
    function debounce(fn, delay = 100) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    // Toaster function
    function showToast(message, type) {
        const toast = document.querySelector('.ai-toaster');
        toast.textContent = message;
        toast.className = `ai-toaster show ${type}`;

        setTimeout(() => {
            toast.className = 'ai-toaster';
        }, 2500);
    }

    // Slide animation functions
    function slideUp(target, duration = 500) {

        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.boxSizing = 'border-box';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.style.display = 'none';
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            //alert("!");
        }, duration);
    }

    function slideDown(target, duration = 500) {
        target.style.removeProperty('display');
        let display = window.getComputedStyle(target).display;
        if (display === 'none') display = 'block';
        target.style.display = display;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.boxSizing = 'border-box';
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
        }, duration);
    }

    function slideToggle(target, duration = 500) {
        if (window.getComputedStyle(target).display === 'none') {
            return slideDown(target, duration);
        } else {
            return slideUp(target, duration);
        }
    }

    // Lazy load
    function lazyLoad() {
        if ("IntersectionObserver" in window) {
            let lazyImgObserver = new IntersectionObserver((entries, lazyImgObserver) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0.0) {
                        let img = entry.target;
                        if (!img.hasAttribute('src')) {
                            img.setAttribute('src', img.dataset.src);
                            img.classList.remove('lazy-load')
                        }
                    }
                });
            });
            let lazyImages = document.querySelectorAll('.lazy-load');
            for (let img of lazyImages) {
                lazyImgObserver.observe(img);
            }

            // let lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
            //     entries.forEach(function (video) {
            //         if (video.isIntersecting) {
            //             for (let source in video.target.children) {
            //                 let videoSource = video.target.children[source];
            //                 if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE" && !videoSource.hasAttribute('src')) {
            //                     videoSource.src = videoSource.dataset.src;
            //                 }
            //             }
            //             video.target.load();
            //             video.target.classList.remove("lazy-load");
            //             lazyVideoObserver.unobserve(video.target);
            //         }
            //     });
            // });

            // let lazyVideos = document.querySelectorAll("video");
            // for (let lazyVideo of lazyVideos) {
            //     lazyVideoObserver.observe(lazyVideo);
            // }
        }
    }
})();

