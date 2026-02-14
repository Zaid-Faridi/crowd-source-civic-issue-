// home.js - Handles dynamic content for index.html

document.addEventListener("DOMContentLoaded", () => {
    fetchTrendingIssues();
    setupRealTimeMetrics();
});

async function fetchTrendingIssues() {
    const grid = document.querySelector(".issue-grid");
    if (!grid) return;

    if (!window._FM || !window._FM.firestore) {
        setTimeout(fetchTrendingIssues, 500);
        return;
    }

    try {
        // Fetch top 3 latest issues
        const snapshot = await window._FM.firestore
            .collection("issues")
            .orderBy("timestamp", "desc")
            .limit(3)
            .get();

        if (snapshot.empty) {
            grid.innerHTML = "<p>No issues reported yet.</p>";
            return;
        }

        grid.innerHTML = ""; // Clear placeholders

        snapshot.forEach(doc => {
            const data = doc.data();
            const card = createIssueCard(data, doc.id);
            grid.appendChild(card);
        });

    } catch (error) {
        console.error("Error fetching trending issues:", error);
    }
}

function createIssueCard(data, id) {
    const article = document.createElement("article");
    article.className = "issue-card pop-interactive";

    // Format Date
    let dateStr = "Just now";
    if (data.timestamp) {
        dateStr = new Date(data.timestamp.toDate()).toLocaleDateString();
    }

    // Determine Status Class
    let statusClass = "issue-status--pending";
    if (data.status === "Resolved") statusClass = "issue-status--resolved";
    else if (data.status === "In Progress") statusClass = "issue-status--progress";

    // Determine Category Chip Color
    let chipClass = "issue-chip--water"; // default
    if (data.category === "Pothole") chipClass = "issue-chip--pothole";
    else if (data.category === "Garbage") chipClass = "issue-chip--garbage";
    else if (data.category === "Streetlight") chipClass = "issue-chip--streetlight";

    article.innerHTML = `
        <div class="issue-chip ${chipClass}">${data.category}</div>
        <span class="issue-status ${statusClass}">${data.status}</span>
        <p class="issue-title">${data.title}</p>
        <p class="issue-desc">${data.description}</p>
        <p class="issue-location">
            <span class="material-symbol">location_on</span>
            ${data.location || "Unknown Location"}
        </p>
        <div class="issue-meta">
            <span class="meta-item">
                <span class="material-symbol">thumb_up</span>${data.upvotes || 0}
            </span>
            <span class="meta-item">
                <span class="material-symbol">chat</span>${data.comments || 0}
            </span>
            <span class="meta-item">
                <span class="material-symbol">event</span>${dateStr}
            </span>
        </div>
    `;
    return article;
}

function setupRealTimeMetrics() {
    if (!window._FM || !window._FM.firestore) {
        setTimeout(setupRealTimeMetrics, 1000);
        return;
    }

    const activeEl = document.querySelector(".metric-card:nth-child(1) .metric-value");
    const resolvedEl = document.querySelector(".metric-card:nth-child(2) .metric-value");

    // Listen for real-time updates
    window._FM.firestore.collection("issues").onSnapshot(snapshot => {
        let activeCount = 0;
        let resolvedCount = 0;

        snapshot.forEach(doc => {
            const status = doc.data().status;
            if (status === "Resolved") {
                resolvedCount++;
            } else {
                activeCount++;
            }
        });

        // Update DOM
        if (activeEl) activeEl.textContent = activeCount.toLocaleString();
        if (resolvedEl) resolvedEl.textContent = resolvedCount.toLocaleString();
    });
}
