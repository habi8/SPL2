document.addEventListener("DOMContentLoaded", () => {
    const infoData = {
        "sunlight-zone": "Sunlight Zone:\n- pH: 8.1\n- Temperature: 25°C\n- Salinity: 35 PSU\n- Creatures: 5000+",
        "twilight-zone": "Twilight Zone:\n- pH: 7.8\n- Temperature: 10°C\n- Salinity: 34 PSU\n- Creatures: 2000+",
        "midnight-zone": "Midnight Zone:\n- pH: 7.5\n- Temperature: 4°C\n- Salinity: 34 PSU\n- Creatures: 1000+",
        "abyss-zone": "Abyss Zone:\n- pH: 7.2\n- Temperature: 2°C\n- Salinity: 35 PSU\n- Creatures: 500+",
        "trenches-zone": "Trenches:\n- pH: 7.0\n- Temperature: 1°C\n- Salinity: 35 PSU\n- Creatures: 100+"
    };

    const infoBox = document.getElementById('info-box');

    document.querySelectorAll(".info-icon").forEach((icon) => {
        icon.addEventListener("mouseenter", (event) => {
            const zone = event.target.getAttribute("data-zone");

            infoBox.textContent = infoData[zone] || "No data available.";

           
            const rect = event.target.getBoundingClientRect();
            infoBox.style.left = `${rect.left + window.scrollX + 50}px`;
            infoBox.style.top = `${rect.top + window.scrollY - 30}px`;

            infoBox.style.display = "block";
        });

        icon.addEventListener("mouseleave", () => {
            infoBox.style.display = "none"; 
        });
    });
    setTimeout(() => {
        document.getElementById('movingText').style.display = 'none';
    }, 5000);
});
