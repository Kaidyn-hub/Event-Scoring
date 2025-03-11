let refreshInterval;
let currentCategory = "all";

function loadScoreboard(filterCategory = currentCategory) {
    fetch("fetch_scores.php")
        .then(response => response.json())
        .then(data => {
            let container = document.getElementById("scoreboard-container");
            container.innerHTML = "";

            let categoryFilter = document.getElementById("categoryFilter");
            categoryFilter.innerHTML = `
                <option value="all" ${filterCategory === "all" ? "selected" : ""}>Choose a Category</option>
                <option value="categories" ${filterCategory === "categories" ? "selected" : ""}>All Category Scoreboards</option>
                <option value="overall" ${filterCategory === "overall" ? "selected" : ""}>Overall Scoreboard</option>
            `;

            let allCategories = new Set();
            let overallScores = {};
            let eventTitle = "";
            let overallContent = "";
            let categoryContent = "";
            let hasDisplayedContent = false;

            for (const event in data) {
                let eventInfo = data[event].event_info;
                let participants = data[event].participants || [];

                let eventParts = event.split(" - ");
                let eventName = eventParts[0];
                let eventYear = eventParts.length > 1 ? eventParts[1] : "";

                if (!eventTitle) {
                    eventTitle = `<h3 class="event-title">${eventName} - ${eventYear}</h3>`;
                }

                let categories = {};

                participants.forEach(row => {
                    let categoryName = row.category || "Uncategorized";
                    allCategories.add(categoryName);

                    if (!categories[categoryName]) {
                        categories[categoryName] = [];
                    }
                    categories[categoryName].push(row);

                    let total = (parseInt(row.gold || 0) * 5) + (parseInt(row.silver || 0) * 3) + (parseInt(row.bronze || 0) * 1);

                    if (!overallScores[row.participant]) {
                        overallScores[row.participant] = { total: 0, gold: 0, silver: 0, bronze: 0 };
                    }
                    overallScores[row.participant].total += total;
                    overallScores[row.participant].gold += parseInt(row.gold || 0);
                    overallScores[row.participant].silver += parseInt(row.silver || 0);
                    overallScores[row.participant].bronze += parseInt(row.bronze || 0);
                });

                for (const category in categories) {
                    if (filterCategory !== "all" && filterCategory !== "overall" && filterCategory !== "categories" && category !== filterCategory) continue;
                    hasDisplayedContent = true;
                
                    categories[category].sort((a, b) => {
                        if (b.gold !== a.gold) return b.gold - a.gold; 
                        if (b.silver !== a.silver) return b.silver - a.silver; 
                        if (b.bronze !== a.bronze) return b.bronze - a.bronze; 
                
                        let totalA = (parseInt(a.gold || 0) * 5) + (parseInt(a.silver || 0) * 3) + (parseInt(a.bronze || 0) * 1);
                        let totalB = (parseInt(b.gold || 0) * 5) + (parseInt(b.silver || 0) * 3) + (parseInt(b.bronze || 0) * 1);
                
                        if (totalB !== totalA) return totalB - totalA;
                
                        return new Date(a.timestamp) - new Date(b.timestamp);
                    });

                    categoryContent += `<h4 class="category-title">${category}</h4>`;
                    categoryContent += `
                    <div class="table-responsive">
                        <table class="table table-bordered text-center">
                            <thead>
                                <tr>
                                    <th>Rank</th>
                                    <th>Participant</th>
                                    <th>Gold</th>
                                    <th>Silver</th>
                                    <th>Bronze</th>
                                    <th>Total Score</th>
                                </tr>
                            </thead>
                            <tbody>
                    `;

                    categories[category].forEach((row, index) => {
                        let total = (parseInt(row.gold || 0) * 5) + (parseInt(row.silver || 0) * 3) + (parseInt(row.bronze || 0) * 1);
                        categoryContent += `
                            <tr data-id="${row.id}">
                                <td>${total > 0 ? index + 1 : "-"}</td>
                                <td>${row.participant || "Unknown"}</td>
                                <td>${row.gold || 0}</td>
                                <td>${row.silver || 0}</td>
                                <td>${row.bronze || 0}</td>
                                <td class="total">${total}</td>
                            </tr>
                        `;
                    });

                    categoryContent += `</tbody></table></div>`;
                }
            }

            allCategories.forEach(category => {
                categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
            });

            if (filterCategory === "all") {
                overallContent = displayOverallScores(overallScores);
                container.innerHTML = eventTitle + overallContent + categoryContent;
                hasDisplayedContent = true;
            }
            else if (filterCategory === "categories") {
                overallContent = displayOverallScores(overallScores);
                container.innerHTML = eventTitle + overallContent + categoryContent;
                hasDisplayedContent = true;
            }
            else if (filterCategory === "overall") {
                overallContent = displayOverallScores(overallScores);
                container.innerHTML = eventTitle + overallContent;
                hasDisplayedContent = true;
            }
            else {
                container.innerHTML = eventTitle + categoryContent;
            }

            if (!hasDisplayedContent) {
                container.innerHTML = `<p class="text-muted">No results found for this category.</p>`;
            }
        })
        .catch(error => console.error('Error loading scoreboard:', error));
}

function displayOverallScores(overallScores) {
    let overallContent = `<h4 class="category-title">Overall Scoreboard</h4>`;
    overallContent += `
    <div class="table-responsive">
        <table class="table table-bordered text-center">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Participant</th>
                    <th>Gold</th>
                    <th>Silver</th>
                    <th>Bronze</th>
                    <th>Total Score</th>
                </tr>
            </thead>
            <tbody>
    `;

    let sortedScores = Object.entries(overallScores).sort((a, b) => {
        if (b[1].gold !== a[1].gold) return b[1].gold - a[1].gold;
        if (b[1].silver !== a[1].silver) return b[1].silver - a[1].silver; 
        if (b[1].bronze !== a[1].bronze) return b[1].bronze - a[1].bronze; 
        if (b[1].total !== a[1].total) return b[1].total - a[1].total;
    
        return new Date(a[1].timestamp) - new Date(b[1].timestamp);
    });

    sortedScores.forEach(([participant, stats], index) => {
        overallContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${participant}</td>
                <td>${stats.gold}</td>
                <td>${stats.silver}</td>
                <td>${stats.bronze}</td>
                <td>${stats.total}</td>
            </tr>
        `;
    });

    overallContent += `</tbody></table></div>`;
    return overallContent;
}

function startAutoRefresh(interval) {
    clearInterval(refreshInterval);
    refreshInterval = setInterval(() => {
        loadScoreboard();
    }, interval);
}

document.addEventListener("DOMContentLoaded", function () {
    loadScoreboard();
    startAutoRefresh(10000);
});

document.getElementById("categoryFilter").addEventListener("change", function () {
    currentCategory = this.value;
    loadScoreboard(currentCategory);
    // current
});
