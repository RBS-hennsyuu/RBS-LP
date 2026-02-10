// ===== 設定 =====
const CONFIG = {
    // Google Apps Script のウェブアプリURL（デプロイ後に設定）
    GAS_URL: 'https://script.google.com/macros/s/AKfycbx3HESpS9Us_1rBg09ZlchMm3JrCqcFkt5WmkPLOHUiJmdFSv8QlA8FzFEZ00qsUuk1/exec'
};

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
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
        button.addEventListener('click', function(e) {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Handle form submission
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                source: document.getElementById('source').value,
                message: document.getElementById('message').value,
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

                // 成功時：モーダルを閉じてサンクスページへ遷移
                modal.classList.remove('active');
                document.body.style.overflow = '';
                window.location.href = 'thanks.html';

            } catch (error) {
                console.error('Error submitting form:', error);
                alert('送信に失敗しました。時間をおいて再度お試しください。');
                
                // ボタンを元に戻す
                submitButton.disabled = false;
                submitButton.innerHTML = originalText;
            }
        });
    }
});
