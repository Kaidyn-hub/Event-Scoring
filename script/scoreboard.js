function loadScoreboard(filterCategory = "all") {
    fetch("fetch_scores.php")
        .then(response => response.json())
        .then(data => {
            let container = document.getElementById("scoreboard-container");
            container.innerHTML = ""; 

            let categoryFilter = document.getElementById("categoryFilter");
            categoryFilter.innerHTML = `
                <option value="all" selected>Choose a Category</option>
                <option value="categories">All Category Scoreboards</option>
                <option value="overall">Overall Scoreboard</option>
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

                    categoryContent += `<h4 class="category-title">${category}</h4>`;
                    categoryContent += `
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
                            <tr>
                                <td>${total > 0 ? index + 1 : "-"}</td>
                                <td>${row.participant || "Unknown"}</td>
                                <td>${row.gold}</td>
                                <td>${row.silver}</td>
                                <td>${row.bronze}</td>
                                <td>${total}</td>
                            </tr>
                        `;
                    });

                    categoryContent += `</tbody></table>`;
                }
            }

            allCategories.forEach(category => {
                categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
            });

            if (filterCategory === "all") {
                overallContent = displayOverallScores(overallScores);
                container.innerHTML = eventTitle + overallContent + categoryContent;
                hasDisplayedContent = true;
            } else if (filterCategory === "categories") {
                overallContent = displayOverallScores(overallScores);
                container.innerHTML = eventTitle + overallContent + categoryContent;
                hasDisplayedContent = true;
            } else if (filterCategory === "overall") {
                overallContent = displayOverallScores(overallScores);
                container.innerHTML = eventTitle + overallContent;
                hasDisplayedContent = true;
            } else {
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

    let sortedScores = Object.entries(overallScores).sort((a, b) => b[1].total - a[1].total);

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

    overallContent += `</tbody></table>`;
    return overallContent;
}

document.addEventListener("DOMContentLoaded", function () {
    loadScoreboard(); 
});

document.getElementById("categoryFilter").addEventListener("change", function () {
    loadScoreboard(this.value);
});
