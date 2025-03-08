function loadScoreboard() {
    fetch("fetch_scores.php")
        .then(response => response.json())
        .then(data => {
            let container = document.getElementById("scoreboard-container");
            container.innerHTML = "";

            for (const event in data) {
                let eventInfo = data[event].event_info;
                let participants = data[event].participants || [];

                let eventParts = event.split(" - ");
                let eventName = eventParts[0];
                let eventYear = eventParts.length > 1 ? eventParts[1] : "";

                let eventContent = `<h3 class="event-title">${eventName} - ${eventYear}</h3>`;

                let categories = {};
                participants.forEach(row => {
                    let categoryName = row.category || "Uncategorized";
                    if (!categories[categoryName]) {
                        categories[categoryName] = [];
                    }
                    categories[categoryName].push(row);
                });

                if (Object.keys(categories).length === 0) {
                    eventContent += `<p class="text-muted">No categories available.</p>`;
                }

                for (const category in categories) {
                    eventContent += `<h4 class="category-title">${category}</h4>`;
                    eventContent += `
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
                        eventContent += `
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

                    eventContent += `</tbody></table>`;
                }

                container.innerHTML += eventContent;
            }
        })
        .catch(error => console.error('Error loading scoreboard:', error));
}

document.addEventListener("DOMContentLoaded", () => {
    loadScoreboard();
    setInterval(loadScoreboard, 1000);
});
// current