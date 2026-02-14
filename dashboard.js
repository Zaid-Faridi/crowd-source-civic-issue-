// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
    fetchUserReports();
});

async function fetchUserReports() {
    const list = document.getElementById("dashboardIssueList");

    // User check
    const user = JSON.parse(localStorage.getItem("nagarMitrUser") || "{}");
    // For demo/dev purposes, if no user logged in, we might want to fetch ALL or show empty
    // But sticking to logic: fetch by userId. If anon, use the anon ID stored.
    // If absolutely no ID, maybe show all for demo? Let's show all for now if no specific logic

    // Wait for firebase
    if (!window._FM || !window._FM.firestore) {
        setTimeout(fetchUserReports, 500);
        return;
    }

    try {
        // Use onSnapshot for Real-Time Updates
        window._FM.firestore.collection("issues")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                if (snapshot.empty) {
                    list.innerHTML = `<div style="text-align:center; padding: 40px; color: #888;">No reports found. <br><a href="report.html" style="color:#7f4cfc; font-weight:600;">Report your first issue</a></div>`;
                    updateStats([]);
                    return;
                }

                const reports = [];
                snapshot.forEach(doc => {
                    reports.push({ id: doc.id, ...doc.data() });
                });

                renderReportsList(reports, list);
                updateStats(reports);
                renderCharts(reports);
            }, error => {
                console.error("Error receiving dashboard updates:", error);
            });

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        list.innerHTML = `<p style="color:red; text-align:center;">Error loading reports.</p>`;
    }
}

function renderReportsList(reports, container) {
    container.innerHTML = "";
    reports.forEach(report => {
        const dateStr = report.timestamp ? new Date(report.timestamp.toDate()).toLocaleDateString() : "Just now";

        let statusTag = '';
        if (report.status === 'Resolved') statusTag = '<span class="tag tag--green">Resolved</span>';
        else if (report.status === 'In Progress') statusTag = '<span class="tag tag--blue">In Progress</span>';
        else statusTag = '<span class="tag tag--amber">Pending</span>';

        // Tag color based on category logic could be improved, mostly cosmetic

        const row = document.createElement("article");
        row.className = "issue-row pop-interactive";
        row.innerHTML = `
            <div class="issue-row-tags">
              <span class="tag tag--gray">${report.category}</span>
              ${statusTag}
              <span class="tag tag--pink">${report.priority}</span>
            </div>
            <h3>${report.title}</h3>
            <p>${report.description}</p>
            <div class="issue-row-meta">
              <span><span class="material-symbol">location_on</span>${report.location || "Unknown"}</span>
              <span><span class="material-symbol">event</span>${dateStr}</span>
            </div>
            <div class="issue-row-stats">
              <span><span class="material-symbol">whatshot</span>${report.upvotes || 0}</span>
              <span><span class="material-symbol">chat</span>${report.comments || 0}</span>
              <button class="text-link">View Details</button>
            </div>
        `;
        container.appendChild(row);
    });
}

function updateStats(reports) {
    document.getElementById("totalReports").textContent = reports.length;
    document.getElementById("pendingReports").textContent = reports.filter(r => r.status === 'Pending').length;
    document.getElementById("progressReports").textContent = reports.filter(r => r.status === 'In Progress').length;
    document.getElementById("resolvedReports").textContent = reports.filter(r => r.status === 'Resolved').length;
}

function renderCharts(reports) {
    // 1. Weekly Trend (Mock logic: group by date)
    const ctxTrend = document.getElementById('weeklyTrendChart').getContext('2d');
    const ctxCategory = document.getElementById('categoryChart').getContext('2d');

    // Aggregate Categories
    const categories = {};
    reports.forEach(r => {
        categories[r.category] = (categories[r.category] || 0) + 1;
    });

    // Render Category Chart
    new Chart(ctxCategory, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#f472b6', '#fb923c', '#38bdf8', '#facc15', '#a78bfa', '#34d399'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'right' }
            }
        }
    });

    // Render Weekly Trend (Simplified: just counts per status for now, or arbitrary trend)
    // For a real weekly trend we need to bucket timestamps.
    // Let's do a simple Status Distribution Bar Chart instead effectively or bucket by day if data exists
    // Since data might be all "today", let's show Status vs Category or something visual

    // Better: Timeline (Last 7 days)
    const dates = {};
    reports.forEach(r => {
        if (r.timestamp) {
            const d = new Date(r.timestamp.toDate()).toLocaleDateString('en-US', { weekday: 'short' });
            dates[d] = (dates[d] || 0) + 1;
        }
    });

    // If only one day, maybe add some mock previous days? No, stick to real data.

    new Chart(ctxTrend, {
        type: 'bar',
        data: {
            labels: Object.keys(dates).length ? Object.keys(dates) : ['Today'],
            datasets: [{
                label: 'Issues Raised',
                data: Object.keys(dates).length ? Object.values(dates) : [reports.length],
                backgroundColor: '#7f4cfc',
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, ticks: { precision: 0 } },
                x: { grid: { display: false } }
            }
        }
    });
}
