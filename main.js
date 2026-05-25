// Mobile Menu behaviors
(function () {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
})();

// Main page behaviors (moved from inline script)
(function () {
    const teaseBtn = document.getElementById('teaseBtn');
    const moreBtn = document.getElementById('moreBtn');
    const message = document.getElementById('message');

    const teasers = [
        'เธอทำให้บัญชีดูหวานขึ้นเหมือนกราฟที่ขึ้นพรวดพราดทุกไตรมาส',
        'ยิ่งเห็นเธอจัดสมุดบัญชี ยิ่งรู้สึกว่าโลกนี้มีระเบียบแบบน่ารักมากขึ้น',
        'แค่เธอยิ้มก็เหมือนเติมสีฟ้า-ชมพูให้กับวันธรรมดา',
        'คนเรียนบัญชีอย่างเธอน่ารักจนอยากจะเป็นคนช่วยปิดงบทุกเดือน',
        'สายตาเธอทำให้เลขทุกตัวในหัวใจมีความหมายและสีสันขึ้นทันที',
        '<span class="highlight-phrase">"คุณน่ารักเกินไปแล้วนิสา"</span>',
        '<span class="highlight-phrase">"I love you Nisa"</span>',
    ];

    let teaserIndex = 0;

    teaseBtn && teaseBtn.addEventListener('click', () => {
        message.innerHTML = `<p>${teasers[0]}</p><p class="small-note"></p>`;
        teaserIndex = 1;
    });

    moreBtn && moreBtn.addEventListener('click', () => {
        if (teaserIndex < teasers.length) {
            message.innerHTML = `<p>${teasers[teaserIndex]}</p><p class="small-note">กดอีกครั้งถ้ายังอยากได้อีก</p>`;
            teaserIndex += 1;
            return;
        }

        message.innerHTML = `<p>หมดแล้วจ้า... อยากได้อีกไปถามคนทำเพิ่มสิ 😘</p>`;
        moreBtn.disabled = true;
        moreBtn.style.cursor = 'default';
    });
})();

// Slider behavior merged into main.js
(function () {
    const slidesContainer = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.arrow-outside.left');
    const nextBtn = document.querySelector('.arrow-outside.right');
    const sliderEl = document.querySelector('.slider');
    let currentSlide = 0;

    if (!slidesContainer || slides.length === 0) return;

    function updateSlider() {
        const offset = currentSlide * 100; // each slide is 100% of container width
        slidesContainer.style.transform = `translateX(-${offset}%)`;
        slides.forEach((s, i) => s.setAttribute('aria-hidden', i !== currentSlide));
    }

    prevBtn && prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        updateSlider();
        restartAutoplay();
    });

    nextBtn && nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        updateSlider();
        restartAutoplay();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prevBtn && prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn && nextBtn.click();
    });

    // Autoplay
    const AUTOPLAY_INTERVAL = 4000; // 4 seconds
    let autoplayId = null;

    function startAutoplay() {
        if (autoplayId) return;
        autoplayId = setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateSlider();
        }, AUTOPLAY_INTERVAL);
    }

    function stopAutoplay() {
        if (!autoplayId) return;
        clearInterval(autoplayId);
        autoplayId = null;
    }

    function restartAutoplay() {
        stopAutoplay();
        // small delay before restarting to give user time after manual nav
        setTimeout(startAutoplay, 1200);
    }

    // Pause on hover/focus
    sliderEl && sliderEl.addEventListener('mouseenter', stopAutoplay);
    sliderEl && sliderEl.addEventListener('mouseleave', startAutoplay);
    sliderEl && sliderEl.addEventListener('focusin', stopAutoplay);
    sliderEl && sliderEl.addEventListener('focusout', startAutoplay);

    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAutoplay(); else startAutoplay();
    });

    // expose for potential external control
    window.nisaSlider = {
        goTo(index) { currentSlide = ((index % slides.length) + slides.length) % slides.length; updateSlider(); restartAutoplay(); },
        next() { nextBtn && nextBtn.click(); },
        prev() { prevBtn && prevBtn.click(); }
    };

    updateSlider();
    startAutoplay();
})();
