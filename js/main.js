// RSS Feed functionality for newsletter (no RSS URL exposed in DOM)
async function loadNewsletterFeed() {
    const feedContainer = document.getElementById('newsletter-feed');
    const rssUrl = 'https://rss.beehiiv.com/feeds/DbPIw9AbTv.xml';

    try {
        // Using a CORS proxy to fetch RSS feed
        const proxyUrl = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(rssUrl);
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (data.status === 'ok') {
            displayNewsletterItems(data.items.slice(0, 5)); // Show latest 5 newsletters
        } else {
            throw new Error('Failed to load RSS feed');
        }
    } catch (error) {
        console.error('Error loading newsletter feed:', error);
        feedContainer.innerHTML = '<div class="text" style="text-align: center; opacity: 0.7;">Unable to load newsletter feed.</div>';
    }
}

function displayNewsletterItems(items) {
    const feedContainer = document.getElementById('newsletter-feed');

    if (items.length === 0) {
        feedContainer.innerHTML = '<div class="text" style="text-align: center; opacity: 0.7;">No newsletters available yet.</div>';
        return;
    }

    const newsletterHtml = items.map(item => {
        const publishDate = new Date(item.pubDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <div class="blog-item">
                <div class="blog-title"><a href="${item.link}" target="_blank">${item.title}</a></div>
                <div class="blog-date">${publishDate}</div>
            </div>
        `;
    }).join('');

    feedContainer.innerHTML = newsletterHtml;
}

// Mobile menu toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load newsletter RSS feed
    loadNewsletterFeed();

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.add('hidden');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navigation
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            nav.classList.add('shadow-lg');
        } else {
            nav.classList.remove('shadow-lg');
        }
    });

    // Add animation to project cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Initially hide project cards and observe them
    const projectCards = document.querySelectorAll('#projects .bg-white');
    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add hover effects to skill cards
    const skillCards = document.querySelectorAll('#skills .bg-white');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});
