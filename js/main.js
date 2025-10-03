// RSS Feed functionality for newsletter (no RSS URL exposed in DOM)
async function loadNewsletterFeed() {
    const feedContainer = document.getElementById('newsletter-feed');

    // Show loading state
    feedContainer.innerHTML = '<div class="text" style="text-align: center; opacity: 0.7;">Loading newsletter...</div>';

    const rssUrl = 'https://rss.beehiiv.com/feeds/DbPIw9AbTv.xml';

    try {
        // Try multiple CORS proxies in case one fails
        const proxies = [
            'https://api.rss2json.com/v1/api.json?rss_url=',
            'https://cors-anywhere.herokuapp.com/https://api.rss2json.com/v1/api.json?rss_url='
        ];

        let data = null;
        let lastError = null;

        for (const proxyBase of proxies) {
            try {
                const proxyUrl = proxyBase + encodeURIComponent(rssUrl);
                const response = await fetch(proxyUrl, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                data = await response.json();

                if (data && data.status === 'ok') {
                    displayNewsletterItems(data.items.slice(0, 5)); // Show latest 5 newsletters
                    return;
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                lastError = error;
                console.warn(`Proxy ${proxyBase} failed:`, error);
                continue;
            }
        }

        // If all proxies failed, show error
        throw lastError || new Error('All proxies failed');

    } catch (error) {
        console.error('Error loading newsletter feed:', error);
        feedContainer.innerHTML = '<div class="text" style="text-align: center; opacity: 0.7;">Unable to load newsletter feed at this time.</div>';
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

document.addEventListener('DOMContentLoaded', function() {
    // Load newsletter RSS feed
    loadNewsletterFeed();

    // Smooth scrolling for anchor links (including navigation)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 20; // Add small offset
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

});
