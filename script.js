// ===== 設定 =====
const CONFIG = {
    // Google Apps Script のウェブアプリURL（デプロイ後に設定）
    GAS_URL: 'https://script.google.com/macros/s/AKfycbx3HESpS9Us_1rBg09ZlchMm3JrCqcFkt5WmkPLOHUiJmdFSv8QlA8FzFEZ00qsUuk1/exec'
};

// Modal functionality
document.addEventListener('DOMContentLoaded', async function () {
    // Ensure course modal template and CSS are present. If not, load them dynamically.
    async function ensureCourseModalTemplate() {
        if (!document.getElementById('courseModal')) {
            // load modal CSS if not already present
            if (!document.querySelector('link[href="css/modal.css"]')) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'css/modal.css';
                document.head.appendChild(link);
            }
            try {
                const resp = await fetch('modal/course-modal.html');
                if (resp.ok) {
                    const html = await resp.text();
                    const temp = document.createElement('div');
                    temp.innerHTML = html;
                    // Append the template root to body
                    if (temp.firstElementChild) {
                        document.body.appendChild(temp.firstElementChild);
                        // Apply inline styles to ensure modal sizing overrides other CSS when needed
                        const modalEl = document.getElementById('courseModal');
                        if (modalEl) {
                            const content = modalEl.querySelector('.course-modal-content');
                            const bodyEl = modalEl.querySelector('.course-modal-body');
                            if (content) {
                                content.style.width = '90vw';
                                content.style.maxWidth = '1100px';
                                content.style.boxSizing = 'border-box';
                            }
                            if (bodyEl) {
                                bodyEl.style.padding = '48px';
                            }
                        }
                    }
                } else {
                    console.warn('Could not fetch modal template:', resp.status);
                    // Fallback: create minimal modal structure so site still works when fetch isn't available
                                        const fallback = document.createElement('div');
                                        fallback.id = 'courseModal';
                                        fallback.className = 'course-modal';
                                        fallback.innerHTML = `
                                                <div class="course-modal-content">
                                                    <button class="course-modal-close" aria-label="閉じる">×</button>
                                                    <div class="course-modal-body" id="courseModalBody"></div>
                                                </div>`;
                                        document.body.appendChild(fallback);
                                        // inline styles for fallback modal
                                        const contentFb = fallback.querySelector('.course-modal-content');
                                        const bodyFb = fallback.querySelector('.course-modal-body');
                                        if (contentFb) {
                                                contentFb.style.width = '90vw';
                                                contentFb.style.maxWidth = '1100px';
                                                contentFb.style.boxSizing = 'border-box';
                                        }
                                        if (bodyFb) bodyFb.style.padding = '48px';
                }
            } catch (e) {
                console.error('Failed to load modal template:', e);
                // Create fallback modal if network fetch fails (e.g., file:// or blocked)
                const fallback = document.createElement('div');
                fallback.id = 'courseModal';
                fallback.className = 'course-modal';
                fallback.innerHTML = `
                    <div class="course-modal-content">
                      <button class="course-modal-close" aria-label="閉じる">×</button>
                      <div class="course-modal-body" id="courseModalBody"></div>
                    </div>`;
                document.body.appendChild(fallback);
                // inline styles for fallback modal
                const contentFb2 = fallback.querySelector('.course-modal-content');
                const bodyFb2 = fallback.querySelector('.course-modal-body');
                if (contentFb2) {
                    contentFb2.style.width = '90vw';
                    contentFb2.style.maxWidth = '1100px';
                    contentFb2.style.boxSizing = 'border-box';
                }
                if (bodyFb2) bodyFb2.style.padding = '48px';
            }
        }
    }
    await ensureCourseModalTemplate();
    // Ensure inline styles are applied even if template was present before script ran
    (function applyInlineModalStyles(){
        const modalEl = document.getElementById('courseModal');
        if (modalEl) {
            const content = modalEl.querySelector('.course-modal-content');
            const bodyEl = modalEl.querySelector('.course-modal-body');
            if (content) {
                content.style.width = '90vw';
                content.style.maxWidth = '1100px';
                content.style.boxSizing = 'border-box';
            }
            if (bodyEl) bodyEl.style.padding = '48px';
        }
    })();
    // コース紹介モーダル（存在しない場合は何もしない）
    const courseModal = document.getElementById('courseModal');
    const courseModalBody = document.getElementById('courseModalBody');
    const courseModalClose = document.querySelector('.course-modal-close');
    const courseBtns = document.querySelectorAll('.course-modal-btn, .course-modal-link');
    if (courseModal && courseModalBody && courseModalClose && courseBtns.length > 0) {
        // Load per-course HTML files on demand (cached after first load)
        const courseTemplateCache = {};
        // Track injected stylesheet URLs / inline style fingerprints to avoid duplicates
        const injectedStyles = new Set();
        // Embedded fallback content for environments where fetch from file:// is blocked
        const embeddedCourseTemplates = {
            hiyoko: `<h2>ひよこコース（基礎技術習得コース）</h2>
<p>ひよこコースは、リペア未経験の方から中級者の方までを対象とした基礎技術習得コースです。RBS研修施設にて、計4日間の実技講習を通じて、現場で活用できるリペア技術の基礎を学びます。</p>
<p>研修期間を最大限有効に活用するため、受講前にRBS技術講師が監修した「5つの技法」解説動画をご視聴いただきます。事前に技術の考え方や作業の流れを理解しておくことで、講習当日は実践に集中しながら技術の習得を進めることができます。</p>
<p>講習では、実際の補修を想定した課題に取り組みながら、道具の扱い方、補修工程、仕上げの精度などを段階的に習得していきます。限られた期間の中で、技術の基礎を確実に身につけることを目的としたカリキュラムです。</p>
<p>また、講習終了後も技術向上を継続していただけるよう、アフターフォローとして作業添削サポートをご用意しています。ご自宅に補修用サンプルをお送りし、作業後に返送いただいた内容をもとに、講師が添削とアドバイスを行います。</p>
<p>予習・実技・復習のサイクルを通じて、技術を確実に身につけていくための環境を整えています。本気でリペア技術を習得したい方に向けて設計されたコースです。</p>`,
            cocco: `<h2>コッココース（応用技術習得コース）</h2>
<p>コッココースは、基礎技術を習得された方や、より高度なリペア技術の習得を目指す方に向けた応用技術習得コースです。講習は6日間と2日間の計8日間に分けて実施し、実践を重ねながら対応できる補修領域を広げていきます。</p>
<p>本コースでは、一般的な補修に加えて、建材シートの張り替え、建具の陥没補修、石材の補修など、より専門性の高い技術についても学びます。さまざまな補修技術と知識を体系的に習得することで、現場ごとに適切な対応ができる実践力を身につけることを目的としています。</p>
<p>また、講習終了後の技術定着をサポートするため、添削キットによる作業添削を計5回実施します。反復練習と講師からのフィードバックを通じて、補修精度の向上と技術の定着を図ります。</p>
<p>カリキュラムには、各受講者の習熟度に応じた弱点克服トレーニングも含まれており、それぞれの成長段階に合わせて技術を伸ばしていくことができます。受講者一人ひとりが確実に技術を習得できるよう、講習は少人数制で実施しています。より幅広い補修に対応できる技術力を身につけ、現場での対応力を高めたい方に向けたコースです。</p>`,
            phoenix: `<h2>フェニックスコース（事業成長支援コンサルティング）</h2>
<p>フェニックスコースは、リペア技術の習得に加えて、事業としての成長と安定した運営を目指す方に向けたコンサルティング型コースです。リペア業界で20年以上の実績を持つ講師が、マンツーマンで事業戦略の構築と実行をサポートします。</p>
<p>本コースでは、受講者の活動エリアや経験、現在の受注状況などをもとに、個別に最適化された事業戦略を設計し、継続的な成長を支援します。</p>
<p><strong>サポート内容</strong></p>
<p><strong>STEP1｜市場調査・現状分析（対面）</strong><br>活動エリアにおける市場環境（人口動向、住宅価格、補修単価など）を調査し、現状の課題と今後の方向性を整理します。分析結果をもとに、目標達成に向けた具体的な改善ポイントと対策を明確化します。</p>
<p><strong>STEP2｜戦略プログラムの設計</strong><br>地域特性、経験値、受注内容などを踏まえ、事業の強みを活かした戦略プログラムを作成します。継続的に受注できる体制の構築を目的とした事業設計を行います。</p>
<p><strong>STEP3｜定期ミーティング・進捗確認</strong><br>月2回（各30分）のオンラインミーティングを実施し、進捗の確認と課題への対策を検討します。状況に応じて追加の相談にも対応し、実行段階でのサポートを行います。</p>
<p><strong>STEP4｜繁忙期・閑散期対策の策定（年間）</strong><br>売上推移や取引状況を分析し、年間を通じて安定した事業運営ができるよう、繁忙期・閑散期それぞれに向けた対策を計画します。</p>
<p><strong>STEP5｜次年度に向けた改善計画の策定</strong><br>年間の実績とKPI（業績評価指標）をもとに、次年度に向けた改善計画を策定し、継続的な事業成長を支援します。</p>
<p><strong>コース特典</strong></p>
<ul>
    <li>RBS動画コンテンツの全開放</li>
    <li>実際の現場での実習機会の提供</li>
</ul>
<p>フェニックスコースは、技術の習得にとどまらず、事業としての基盤を整え、継続的な成長を目指す方に向けて設計されたコースです。受講者一人ひとりに合わせたサポートを行うため、対応可能な人数には限りがあります。</p>`
        };
        courseBtns.forEach(btn => {
            btn.addEventListener('click', async function(e) {
                // Allow modifier keys/new-tab
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                const course = btn.getAttribute('data-course');
                // show loading indicator
                courseModalBody.innerHTML = '<p class="modal-loading">読み込み中…</p>';

                // If this is an anchor with an href, prefer fetching the full course page and extracting #courseContent
                if (btn.tagName === 'A' && btn.getAttribute('href')) {
                    const href = btn.getAttribute('href');
                    // Use cached if available
                    if (courseTemplateCache[course]) {
                        courseModalBody.innerHTML = courseTemplateCache[course];
                    } else {
                        try {
                                // If running from file://, use iframe fallback so local assets load correctly
                                if (location.protocol === 'file:') {
                                    console.info('Running from file:// — embedding course page in iframe for', href);
                                    courseModalBody.innerHTML = '';
                                    const iframe = document.createElement('iframe');
                                    iframe.src = href;
                                    iframe.style.width = '100%';
                                    iframe.style.height = '70vh';
                                    iframe.style.border = '0';
                                    iframe.setAttribute('aria-label', `Course page: ${course}`);
                                    courseModalBody.appendChild(iframe);
                                    courseTemplateCache[course] = iframe.outerHTML;
                                } else {
                                const resp = await fetch(href);
                                if (resp.ok) {
                                    const text = await resp.text();
                                    const parser = new DOMParser();
                                    const doc = parser.parseFromString(text, 'text/html');
                                    // Rewrite relative URLs (src/href) inside the fetched document to absolute URLs
                                    try {
                                        const baseUrl = resp.url;
                                        // src attributes (images, scripts)
                                        doc.querySelectorAll('[src]').forEach(el => {
                                            const v = el.getAttribute('src');
                                            if (v) {
                                                try { el.setAttribute('src', new URL(v, baseUrl).href); } catch(e) {}
                                            }
                                        });
                                        // href attributes for link/a (stylesheets won't be executed but preserve absolute URLs)
                                        doc.querySelectorAll('[href]').forEach(el => {
                                            const v = el.getAttribute('href');
                                            if (v && !v.startsWith('#') && !v.startsWith('mailto:') && !v.startsWith('tel:')) {
                                                try { el.setAttribute('href', new URL(v, baseUrl).href); } catch(e) {}
                                            }
                                        });
                                        // Inject stylesheet links and inline <style> from fetched doc into the modal body
                                        try {
                                            // Stylesheet links in head
                                            doc.querySelectorAll('link[rel="stylesheet"]').forEach(l => {
                                                const href = l.getAttribute('href');
                                                if (!href) return;
                                                try {
                                                    const abs = new URL(href, resp.url).href;
                                                    if (!injectedStyles.has(abs)) {
                                                        injectedStyles.add(abs);
                                                        const nl = document.createElement('link');
                                                        nl.rel = 'stylesheet';
                                                        nl.href = abs;
                                                        // Insert at top of modal body so content below can use it
                                                        courseModalBody.insertBefore(nl, courseModalBody.firstChild);
                                                    }
                                                } catch(e) { /* ignore malformed URLs */ }
                                            });
                                            // Inline <style> tags
                                            doc.querySelectorAll('style').forEach(s => {
                                                const content = s.textContent || '';
                                                const fingerprint = 'inline:' + content.slice(0,200);
                                                if (!injectedStyles.has(fingerprint) && content.trim()) {
                                                    injectedStyles.add(fingerprint);
                                                    const ns = document.createElement('style');
                                                    ns.textContent = content;
                                                    courseModalBody.insertBefore(ns, courseModalBody.firstChild);
                                                }
                                            });
                                        } catch(e) {
                                            console.warn('Failed to inject styles from fetched course page', e);
                                        }
                                    } catch (e) {
                                        console.warn('Could not rewrite relative URLs for fetched course page', e);
                                    }
                                    const contentEl = doc.getElementById('courseContent') || doc.querySelector('.course-page-content') || doc.body;
                                    const html = contentEl ? contentEl.innerHTML : text;
                                    // If extracted content is empty or looks wrong, fallback to iframe embedding
                                    if (!html || html.trim().length < 10) {
                                        console.warn('Extracted course content is empty — using iframe fallback for', href || resp.url);
                                        courseModalBody.innerHTML = '';
                                        const iframe = document.createElement('iframe');
                                        iframe.src = href || resp.url;
                                        iframe.style.width = '100%';
                                        iframe.style.height = '70vh';
                                        iframe.style.border = '0';
                                        iframe.setAttribute('aria-label', `Course page: ${course}`);
                                        courseModalBody.appendChild(iframe);
                                        courseTemplateCache[course] = iframe.outerHTML; // cache marker
                                    } else {
                                        courseTemplateCache[course] = html;
                                        courseModalBody.innerHTML = html;
                                    }
                                } else {
                                    console.warn('Failed to fetch course page', href, resp.status);
                                    if (embeddedCourseTemplates[course]) {
                                        courseTemplateCache[course] = embeddedCourseTemplates[course];
                                        courseModalBody.innerHTML = embeddedCourseTemplates[course];
                                    } else {
                                        courseModalBody.innerHTML = '<p class="modal-error">コンテンツの読み込みに失敗しました。</p>';
                                    }
                                }
                            }
                        } catch (err) {
                            console.error('Failed to load course page:', err);
                            if (embeddedCourseTemplates[course]) {
                                courseTemplateCache[course] = embeddedCourseTemplates[course];
                                courseModalBody.innerHTML = embeddedCourseTemplates[course];
                            } else {
                                courseModalBody.innerHTML = '<p class="modal-error">ネットワークエラーのため読み込めませんでした。</p>';
                            }
                        }
                    }
                } else {
                    // Fallback: existing behavior (fetch modal/course-<name>.html or use embedded)
                    if (courseTemplateCache[course]) {
                        courseModalBody.innerHTML = courseTemplateCache[course];
                    } else if (location.protocol === 'file:' && embeddedCourseTemplates[course]) {
                        courseTemplateCache[course] = embeddedCourseTemplates[course];
                        courseModalBody.innerHTML = embeddedCourseTemplates[course];
                    } else {
                        try {
                            const resp = await fetch(`modal/course-${course}.html`);
                            if (resp.ok) {
                                const html = await resp.text();
                                courseTemplateCache[course] = html;
                                courseModalBody.innerHTML = html;
                            } else {
                                console.warn('Course content not found for', course, resp.status);
                                if (embeddedCourseTemplates[course]) {
                                    courseTemplateCache[course] = embeddedCourseTemplates[course];
                                    courseModalBody.innerHTML = embeddedCourseTemplates[course];
                                } else {
                                    courseModalBody.innerHTML = '<p class="modal-error">コンテンツの読み込みに失敗しました。</p>';
                                }
                            }
                        } catch (err) {
                            console.error('Failed to load course content:', err);
                            if (embeddedCourseTemplates[course]) {
                                courseTemplateCache[course] = embeddedCourseTemplates[course];
                                courseModalBody.innerHTML = embeddedCourseTemplates[course];
                            } else {
                                courseModalBody.innerHTML = '<p class="modal-error">ネットワークエラーのため読み込めませんでした。</p>';
                            }
                        }
                    }
                }

                courseModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
        courseModalClose.addEventListener('click', function() {
            courseModal.classList.remove('active');
            document.body.style.overflow = '';
        });
        // モーダル外クリックで閉じる
        courseModal.addEventListener('click', function(e) {
            if (e.target === courseModal) {
                courseModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        // ESCキーで閉じる
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && courseModal.classList.contains('active')) {
                courseModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
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
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close modal when X is clicked
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function (e) {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
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
