import { database } from "../../scripts/firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

document.addEventListener("DOMContentLoaded", function () {
    fetchClubStats();
});

// Function to fetch club statistics and update the graph
function fetchClubStats() {
    const membersRef = ref(database, "users");
    get(membersRef).then(snapshot => {
        let clubCounts = { PCC: 0, NCC: 0, Sports: 0, Photography: 0 };

        snapshot.forEach(childSnapshot => {
            const userData = childSnapshot.val();
            if (userData.role === "user" && userData.club in clubCounts) {
                clubCounts[userData.club]++;
            }
        });

        // Update the chart with retrieved data
        updateGraph(clubCounts);
    }).catch(error => console.error("Error fetching members:", error));
}

// Function to create/update the Chart.js graph
function updateGraph(clubCounts) {
    const ctx = document.getElementById('membersChart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['PCC', 'NCC', 'Sports', 'Photography'],
            datasets: [{
                label: 'Number of Members',
                data: [clubCounts.PCC, clubCounts.NCC, clubCounts.Sports, clubCounts.Photography],
                backgroundColor: ['#3498db', '#e74c3c', '#2ecc71', '#f39c12'],
                borderColor: ['#2980b9', '#c0392b', '#27ae60', '#d68910'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 1
                }
            }
        }
    });
}
