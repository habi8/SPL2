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
const layers = document.querySelectorAll('.ocean-layer');

let activeStar = null;
let offsetX = 0;
let offsetY = 0;


function createStars(layer, numStars) {
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('pearl');

        const randomTop = Math.random() * 95;
        const randomLeft = Math.random() * 95;
        const randomSize = Math.random() * 7 + 5;
        const randomDuration = Math.random() * 2 + 1;

        star.style.top = `${randomTop}%`;
        star.style.left = `${randomLeft}%`;
        star.style.width = `${randomSize}px`;
        star.style.height = `${randomSize}px`;
        star.style.animationDuration = `${randomDuration}s`;

        
        star.addEventListener('mousedown', (e) => {
            activeStar = star;
            offsetX = e.clientX - star.getBoundingClientRect().left;
            offsetY = e.clientY - star.getBoundingClientRect().top;
            star.style.transition = 'none'; 
        });

       
        layer.appendChild(star);
    }
}


createStars(document.querySelector('#sunlight-zone'),500);  
createStars(document.querySelector('#twilight-zone'), 600);  
createStars(document.querySelector('#midnight-zone'), 750);  
createStars(document.querySelector('#abyss-zone'), 900);
createStars(document.querySelector('#trenches-zone'), 1000);
  
document.addEventListener('mousemove', (e) => {
    if (activeStar) {
        const skyRect = document.querySelector('.sky').getBoundingClientRect();
        let newLeft = e.clientX - skyRect.left - offsetX;
        let newTop = e.clientY - skyRect.top - offsetY;

        // Keep the stars within the sky container
        newLeft = Math.min(Math.max(newLeft, 0), skyRect.width);
        newTop = Math.min(Math.max(newTop, 0), skyRect.height);

        activeStar.style.left = `${newLeft}px`;
        activeStar.style.top = `${newTop}px`;
    }
});

// Release star when mouse button is released
document.addEventListener('mouseup', () => {
    activeStar = null;
});
const speciesData = {
    "blacktip-reef-shark": {
        name: "Blacktip Reef Shark",
        lifespan: "10-15 years",
        quantity: "Low in Bay of Bengal",
        habitat: "Coral reefs and shallow coastal waters",
        diet: "Fish, rays, and small sharks",
        interestingInfo: "The blacktip reef shark is known for its distinctive black-tipped fins."
    },
    "blue-coral": {
        name: "Blue Coral",
        lifespan: "Unknown (Several years)",
        quantity: "Common in Bay of Bengal",
        habitat: "Shallow coastal waters",
        diet: "Plankton and small invertebrates",
        interestingInfo: "Blue coral is actually a species of soft coral and has a unique blue color."
    },
    "larger-star-coral": {
        name: "Larger Star Coral",
        lifespan: "25-30 years",
        quantity: "Common in the Indo-Pacific",
        habitat: "Coral reefs",
        diet: "Plankton",
        interestingInfo: "Larger star corals have a star-like appearance and are an important reef-building coral."
    },
    "whitecheek-shark": {
        name: "Whitecheek Shark",
        lifespan: "15-20 years",
        quantity: "Moderate in Bay of Bengal",
        habitat: "Shallow coastal waters",
        diet: "Fish and invertebrates",
        interestingInfo: "Whitecheek sharks are easily recognizable by the white markings around their mouths."
    },
    "spot-tail-shark": {
        name: "Spot-tail Shark",
        lifespan: "20-25 years",
        quantity: "Low to moderate",
        habitat: "Shallow coastal waters and reefs",
        diet: "Fish, mollusks, and crustaceans",
        interestingInfo: "Spot-tail sharks are known for their distinct spots on their tail fin."
    },
    "swordfish": {
        name: "Swordfish",
        lifespan: "9-12 years",
        quantity: "Common in the Atlantic Ocean",
        habitat: "Pelagic waters",
        diet: "Fish, cephalopods",
        interestingInfo: "Swordfish have a long, flat bill they use to slash at prey."
    },
    "tiger-shark": {
        name: "Tiger Shark",
        lifespan: "30-50 years",
        quantity: "Low in Bay of Bengal",
        habitat: "Open ocean, coastal areas",
        diet: "Fish, sea turtles, birds, and even garbage",
        interestingInfo: "Tiger sharks are known for their striped pattern and are often called the 'garbage cans of the sea' due to their varied diet."
    },
    "dusky-shark": {
        name: "Dusky Shark",
        lifespan: "20-25 years",
        quantity: "Low in Bay of Bengal",
        habitat: "Shallow coastal waters, continental shelves",
        diet: "Fish, rays, and small sharks",
        interestingInfo: "Dusky sharks are known for their slow growth rate and long lifespan."
    },
    "bigeye-thresher": {
        name: "Bigeye Thresher Shark",
        lifespan: "20-30 years",
        quantity: "Rare",
        habitat: "Pelagic and deep waters",
        diet: "Small fish and squid",
        interestingInfo: "Bigeye thresher sharks are known for their long tails, which they use to stun prey."
    },
    "bigeye-tuna": {
        name: "Bigeye Tuna",
        lifespan: "8-10 years",
        quantity: "Moderate in the Pacific",
        habitat: "Pelagic ocean waters",
        diet: "Small fish, squid",
        interestingInfo: "Bigeye tuna are one of the fastest swimming fish, capable of reaching speeds up to 75 km/h."
    },
    "bignose-shark": {
        name: "Bignose Shark",
        lifespan: "10-15 years",
        quantity: "Low",
        habitat: "Deep waters, continental slopes",
        diet: "Fish and invertebrates",
        interestingInfo: "Bignose sharks are known for their broad, flattened noses."
    },
    "blue-shark": {
        name: "Blue Shark",
        lifespan: "15-20 years",
        quantity: "Moderate in open ocean",
        habitat: "Deep ocean waters",
        diet: "Fish, squid, and other small marine creatures",
        interestingInfo: "Blue sharks are known for their beautiful blue color and slender bodies."
    },
    "longfin-mako-shark": {
        name: "Longfin Mako Shark",
        lifespan: "20-30 years",
        quantity: "Low",
        habitat: "Deep ocean waters",
        diet: "Fish, squid",
        interestingInfo: "Longfin mako sharks are faster swimmers and can leap out of the water."
    },
    "leopard-torpedo": {
        name: "Leopard Torpedo",
        lifespan: "10-15 years",
        quantity: "Low",
        habitat: "Deep ocean waters",
        diet: "Fish, crustaceans",
        interestingInfo: "Leopard torpedo rays are known for their spotted pattern, which helps them blend into the seafloor."
    },
    "narrow-barred-spanish-mackerel": {
        name: "Narrow-barred Spanish Mackerel",
        lifespan: "5-7 years",
        quantity: "Common in Indo-Pacific",
        habitat: "Coastal and open ocean waters",
        diet: "Small fish, shrimp, and cephalopods",
        interestingInfo: "The narrow-barred Spanish mackerel is known for its slim, elongated body and sharp teeth."
    },
    "mushroom-coral": {
        name: "Mushroom Coral",
        lifespan: "Up to 20 years",
        quantity: "Common in Indo-Pacific",
        habitat: "Coral reefs, shallow coastal waters",
        diet: "Plankton, small invertebrates",
        interestingInfo: "Mushroom coral is a type of solitary coral that has a distinct cap-like shape."
    },
    "octopus-coral": {
        name: "Octopus Coral",
        lifespan: "Up to 50 years",
        quantity: "Low",
        habitat: "Deep ocean waters, coral reefs",
        diet: "Plankton, small fish, invertebrates",
        interestingInfo: "Octopus coral is named for its unique resemblance to an octopus with its long tentacle-like branches."
    },
    "open-brain-coral": {
        name: "Open Brain Coral",
        lifespan: "Up to 20 years",
        quantity: "Common in Indo-Pacific",
        habitat: "Coral reefs",
        diet: "Plankton, small invertebrates",
        interestingInfo: "Open brain coral has a unique structure resembling a human brain."
    },
    "torch-coral": {
        name: "Torch Coral",
        lifespan: "10-20 years",
        quantity: "Common in Indo-Pacific",
        habitat: "Coral reefs",
        diet: "Plankton, small fish, invertebrates",
        interestingInfo: "Torch corals have long, slender polyps that resemble torches, giving them their name."
    }
};
