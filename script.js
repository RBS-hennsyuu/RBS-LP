// ===== 設定 =====
const CONFIG = {
    // Google Apps Script のウェブアプリURL（デプロイ後に設定）
    GAS_URL: 'https://script.google.com/macros/s/AKfycbx3HESpS9Us_1rBg09ZlchMm3JrCqcFkt5WmkPLOHUiJmdFSv8QlA8FzFEZ00qsUuk1/exec'
};

// Modal functionality
document.addEventListener('DOMContentLoaded', async function () {
    // Course modal feature removed — course links open dedicated pages.
    // (Course modal removed — no inline modal styles to apply)
    // Body scroll lock for mobile (works on iOS by using fixed positioning)
    let _bodyScrollPos = 0;
    function lockBodyScroll() {
        _bodyScrollPos = window.scrollY || document.documentElement.scrollTop || 0;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${_bodyScrollPos}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
    }
    function unlockBodyScroll() {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.width = '';
        window.scrollTo(0, _bodyScrollPos || 0);
    }
    // Course modal disabled: course links navigate to dedicated pages instead.
    // (Index/contact modal behavior is preserved below.)
    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    let mobileMenu = document.getElementById('mobileMenu');

    if (hamburger) {
        // If the page doesn't have a #mobileMenu (like documents.html), create a simple temporary one
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.id = 'mobileMenu';
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = `
                <ul class="mobile-menu-list">
                    <li><a href="index.html">トップページへ戻る</a></li>
                </ul>`;
            const nav = document.querySelector('nav.nav-header');
            if (nav && nav.parentNode) nav.parentNode.insertBefore(mobileMenu, nav.nextSibling);
            else document.body.appendChild(mobileMenu);
        }

        hamburger.addEventListener('click', function (e) {
            e.stopPropagation();
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            }
        });
    }

    // Modal functionality
    const modal = document.getElementById('contactModal');
    const ctaButtons = document.querySelectorAll('#ctaButton1, #ctaButton2, #ctaButton3');
    const closeBtn = document.querySelector('.modal-close');
    const contactForm = document.getElementById('contactForm');

    // Open modal when CTA buttons are clicked
    ctaButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            modal.classList.add('active');
            lockBodyScroll(); // Prevent background scrolling (mobile-safe)
        });
    });

    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            modal.classList.remove('active');
            unlockBodyScroll(); // Restore scrolling
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            unlockBodyScroll();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            unlockBodyScroll();
        }
    });

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Get form data
            const formData = {
                email: document.getElementById('email').value,
                age_range: document.getElementById('age_range').value,
                prefecture: document.getElementById('prefecture').value,
                source: document.getElementById('source').value,
                experience_years: document.getElementById('experience_years').value,
                timestamp: new Date().toISOString()
            };

            // ボタンを無効化して送信中表示
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="cta-inner">送信中...</span>';

            try {
                // GASにデータを送信
                if (CONFIG.GAS_URL && CONFIG.GAS_URL !== 'YOUR_GAS_WEB_APP_URL_HERE') {
                    const response = await fetch(CONFIG.GAS_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(formData)
                    });
                    console.log('Form submitted to GAS');
                } else {
                    console.log('GAS URL not configured. Form data:', formData);
                }

                // 成功時：フォームを非表示にして、成功メッセージを表示
                contactForm.style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';

                // フォームをリセット（次回使用時のため）
                contactForm.reset();

            } catch (error) {
                console.error('Error submitting form:', error);
                alert('送信に失敗しました。時間をおいて再度お試しください。');

                // ボタンを元に戻す
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }

    // 成功メッセージの「閉じる」ボタン
    const successCloseButton = document.getElementById('successCloseButton');
    if (successCloseButton) {
        successCloseButton.addEventListener('click', function () {
            // モーダルを閉じる
            modal.classList.remove('active');
            document.body.style.overflow = '';

            // フォームと成功メッセージの表示を元に戻す
            contactForm.style.display = 'block';
            document.getElementById('successMessage').style.display = 'none';

            // 送信ボタンを元に戻す
            const submitButton = contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.innerHTML = '<span class="cta-inner">資料を申し込む</span>';
        });
    }
});
