let refreshInterval; // Variable to hold the refresh interval
let currentCategory = "all"; // Default category for scoreboard

// Function to load the scoreboard with optional category filter
function loadScoreboard(filterCategory = currentCategory) {
    // Fetch scores from the server
    fetch("fetch_scores.php")
        .then(response => response.json())
        .then(data => {
            let container = document.getElementById("scoreboard-container");
            container.innerHTML = ""; // Clear the scoreboard container

            let categoryFilter = document.getElementById("categoryFilter");
            // Populate the category filter options
            categoryFilter.innerHTML = `
                <option value="all" ${filterCategory === "all" ? "selected" : ""}>Choose a Category</option>
                <option value="categories" ${filterCategory === "categories" ? "selected" : ""}>All Category Scoreboards</option>
                <option value="overall" ${filterCategory === "overall" ? "selected" : ""}>Overall Scoreboard</option>
            `;

            let allCategories = new Set(); // Set to hold unique categories
            let overallScores = {}; // Object to hold overall scores
            let eventTitle = ""; // Variable to hold event title
            let overallContent = ""; // Variable to hold overall content
            let categoryContent = ""; // Variable to hold category content
            let hasDisplayedContent = false; // Flag to check if content is displayed

            // Loop through the fetched data to build the scoreboard
            for (const event in data) {
                let eventInfo = data[event].event_info;
                let participants = data[event].participants || [];

                let eventParts = event.split(" - ");
                let eventName = eventParts[0];
                let eventYear = eventParts.length > 1 ? eventParts[1] : "";

                if (!eventTitle) {
                    eventTitle = `<h3 class="event-title">${eventName} - ${eventYear}</h3>`;
                }

                let categories = {}; // Object to hold participants by category

                // Loop through participants to categorize and calculate scores
                participants.forEach(row => {
                    let categoryName = row.category || "Uncategorized";
                    allCategories.add(categoryName); // Add category to the set

                    if (!categories[categoryName]) {
                        categories[categoryName] = [];
                    }
                    categories[categoryName].push(row); // Add participant to the category

                    // Calculate total score based on medals
                    let total = (parseInt(row.gold || 0) * 5) + (parseInt(row.silver || 0) * 3) + (parseInt(row.bronze || 0) * 1);

                    // Initialize overall scores for the participant
                    if (!overallScores[row.participant]) {
                        overallScores[row.participant] = { total: 0, gold: 0, silver: 0, bronze: 0 };
                    }
                    overallScores[row.participant].total += total; // Update total score
                    overallScores[row.participant].gold += parseInt(row.gold || 0); // Update gold count
                    overallScores[row.participant].silver += parseInt(row.silver || 0); // Update silver count
                    overallScores[row.participant].bronze += parseInt(row.bronze || 0); // Update bronze count
                });

                // Loop through categories to build category content
                for (const category in categories) {
                    // Check if the category matches the filter
                    if (filterCategory !== "all" && filterCategory !== "overall" && filterCategory !== "categories" && category !== filterCategory) continue;
                    hasDisplayedContent = true; // Set flag to true

                    // Sort participants by medals
                    categories[category].sort((a, b) => {
                        if (b.gold !== a.gold) return b.gold - a.gold; 
                        if (b.silver !== a.silver) return b.silver - a.silver; 
                        if (b.bronze !== a.bronze) return b.bronze - a.bronze; 
                
                        let totalA = (parseInt(a.gold || 0) * 5) + (parseInt(a.silver || 0) * 3) + (parseInt(a.bronze || 0) * 1);
                        let totalB = (parseInt(b.gold || 0) * 5) + (parseInt(b.silver || 0) * 3) + (parseInt(b.bronze || 0) * 1);
                
                        if (totalB !== totalA) return totalB - totalA; // Sort by total score
                
                        return new Date(a.timestamp) - new Date(b.timestamp); // Sort by timestamp
                    });

                    // Build category content
                    categoryContent += `
                        <h4 class="category-title">${category}</h4>`;
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

                    // Loop through participants in the category to build table rows
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

                    categoryContent += `</tbody></table></div>`; // Close the table
                }
            }

            // Populate the category filter with unique categories
            allCategories.forEach(category => {
                categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
            });

            // Display the content based on the selected filter
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

            // Display a message if no content was found
            if (!hasDisplayedContent) {
                container.innerHTML = `<p class="text-muted">No results found for this category.</p>`;
            }
        })
        .catch(error => console.error('Error loading scoreboard:', error)); // Log any errors
}

// Function to display overall scores
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

    // Sort overall scores for display
    let sortedScores = Object.entries(overallScores).sort((a, b) => {
        if (b[1].gold !== a[1].gold) return b[1].gold - a[1].gold;
        if (b[1].silver !== a[1].silver) return b[1].silver - a[1].silver; 
        if (b[1].bronze !== a[1].bronze) return b[1].bronze - a[1].bronze; 
        if (b[1].total !== a[1].total) return b[1].total - a[1].total;
    
        return new Date(a[1].timestamp) - new Date(b[1].timestamp);
    });

    // Loop through sorted scores to build the overall scoreboard
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

    overallContent += `</tbody></table></div>`; // Close the table
    return overallContent; // Return the overall content
}

// Event listener for DOM content loaded
document.addEventListener("DOMContentLoaded", function () {
    loadScoreboard(); // Load the scoreboard on page load
});

// Event listener for category filter change
document.getElementById("categoryFilter").addEventListener("change", function () {
    currentCategory = this.value; // Update the current category
    loadScoreboard(currentCategory); // Load scoreboard based on selected category
});