// Map Initialization and Logic

let map;
let markers = [];
let allIssues = [];

// Initialize Map
function initMap() {
    // Default to New Delhi if location access fails
    const defaultPos = { lat: 28.6139, lng: 77.2090 };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: defaultPos,
        mapId: "DEMO_MAP_ID", // Modern map style
        disableDefaultUI: true, // We have custom controls
        zoomControl: false,
    });

    // Try HTML5 geolocation
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(pos);
                new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "You are here",
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 7,
                        fillColor: "#4285F4",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "white",
                    }
                });
            },
            () => {
                console.log("Geolocation failed or denied.");
            }
        );
    }

    // Fetch Issues from Firebase
    fetchIssues();

    // Bind My Location Button
    const locationBtn = document.getElementById("myLocationBtn");
    if (locationBtn) {
        locationBtn.addEventListener("click", () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    map.setCenter(pos);
                    map.setZoom(14);
                });
            }
        });
    }
}

// Fetch Issues
async function fetchIssues() {
    try {
        // Assuming 'db' is exported from firebase-init.js (made global or imported)
        // For this implementation, we'll assume global 'db' availability or use window.db
        // If not, we might need to adjust based on how main script initializes firebase
        // Fallback if db not ready:
        // Use window._FM.firestore as defined in firebase-init.js
        if (!window._FM || !window._FM.firestore) {
            console.warn("Firebase not ready, retrying in 1s...");
            setTimeout(fetchIssues, 1000);
            return;
        }

        const snapshot = await window._FM.firestore.collection("issues").get();
        allIssues = [];
        snapshot.forEach((doc) => {
            allIssues.push({ id: doc.id, ...doc.data() });
        });

        renderMarkers(allIssues);

    } catch (error) {
        console.error("Error fetching issues:", error);
    }
}

// Render Markers
function renderMarkers(issues) {
    // Clear existing
    markers.forEach(m => m.setMap(null));
    markers = [];

    issues.forEach((issue) => {
        if (!issue.lat || !issue.lng) return;

        const color = getCategoryColor(issue.category);

        // Create custom marker icon (SVG pin)
        const svgIcon = {
            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z",
            fillColor: color,
            fillOpacity: 1,
            strokeWeight: 1,
            strokeColor: "#ffffff",
            rotation: 0,
            scale: 2,
            anchor: new google.maps.Point(12, 22),
        };

        const marker = new google.maps.Marker({
            position: { lat: issue.lat, lng: issue.lng },
            map: map,
            title: issue.category,
            icon: svgIcon
        });

        // Info Window
        const infoWindow = new google.maps.InfoWindow({
            content: `
            <div style="padding: 8px; max-width: 200px;">
                <h3 style="margin: 0; font-size: 16px;">${issue.category}</h3>
                <p style="margin: 4px 0 8px; color: #555;">${issue.description || 'No description'}</p>
                <span style="font-size: 12px; padding: 2px 6px; border-radius: 4px; background: #eee;">${issue.status || 'Pending'}</span>
            </div>
        `
        });

        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });

        markers.push({ marker, category: issue.category });
    });
}

// Filter Function
function filterMap(category) {
    markers.forEach(item => {
        if (category === 'All' || item.category === category) {
            item.marker.setMap(map);
        } else {
            item.marker.setMap(null);
        }
    });
}

// Helper: Get Color by Category
function getCategoryColor(category) {
    switch (category) {
        case 'Pothole': return '#f472b6'; // Pink
        case 'Garbage': return '#fb923c'; // Orange
        case 'Water': return '#38bdf8'; // Blue
        case 'Streetlight': return '#facc15'; // Yellow
        default: return '#9ca3af'; // Grey
    }
}
