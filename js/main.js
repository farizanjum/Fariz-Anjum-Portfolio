// RSS Feed functionality via serverless proxy
async function loadNewsletterFeed() {
    const feedContainer = document.getElementById('newsletter-feed');
    feedContainer.innerHTML = '<div class="text" style="text-align: center; opacity: 0.7;">Loading newsletter...</div>';

    try {
        const response = await fetch('/api/rss');
        if (!response.ok) throw new Error('RSS fetch failed');
        const xmlText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'application/xml');

        // Support RSS (item) and Atom (entry)
        let nodes = Array.from(xmlDoc.querySelectorAll('item'));
        if (nodes.length === 0) {
            nodes = Array.from(xmlDoc.querySelectorAll('entry'));
        }

        const items = nodes.slice(0, 5).map((node) => {
            const title = node.querySelector('title')?.textContent || 'Untitled';
            const linkEl = node.querySelector('link');
            let link = '#';
            if (linkEl) {
                link = linkEl.getAttribute('href') || linkEl.textContent || '#';
            }
            const pubDate = node.querySelector('pubDate, updated, published')?.textContent || '';
            return { title, link, pubDate };
        });

        displayNewsletterItems(items);
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

    // Screenshot dump functions
    window.showScreenshots = function() {
        const content = document.getElementById('screenshot-content');
        content.style.display = 'block';
        content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Admin access for upload panel (basic auth check - can be enhanced)
    window.showUploadPanel = function() {
        const password = prompt('Enter admin password:');
        if (password === 'admin123') { // Change this to a secure method
            document.getElementById('upload-panel').style.display = 'block';
        } else {
            alert('Access denied');
        }
    };

});
