document.addEventListener("DOMContentLoaded", function () {
    const map = L.map("map").setView([10, 10], 2); // Default map center
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    const locationInput = document.getElementById("locationInput");
    const addLocationButton = document.getElementById("addLocationButton");
    const locationsList = document.getElementById("locationsList");

    addLocationButton.addEventListener("click", function () {
        const location = locationInput.value.trim();
        if (location) {
            fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${location}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        const lat = data[0].lat;
                        const lon = data[0].lon;
                        const country = data[0].display_name.split(",").pop().trim(); // Extract country name

                        L.marker([lat, lon]).addTo(map)
                            .bindPopup(`<strong>${location}</strong>`)
                            .openPopup();
                        map.setView([lat, lon], 8);

                        // Fetch the country flag
                        fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true`)
                            .then(response => response.json())
                            .then(countryData => {
                                if (countryData && countryData.length > 0) {
                                    const flagUrl = countryData[0].flags.svg;
                                    addLocationToList(location, flagUrl);
                                } else {
                                    addLocationToList(location, "globe");
                                }
                            })
                            .catch(() => addLocationToList(location, "globe"));
                    } else {
                        alert("Location not found!");
                    }
                })
                .catch(error => console.error("Error fetching location:", error));
        }
    });

    function addLocationToList(location, flagUrl) {
        const li = document.createElement("li");
        li.innerHTML = `
            ${flagUrl === "globe" 
                ? `<img src="https://cdn-icons-png.flaticon.com/128/484/484611.png" class="flag-icon">` 
                : `<img src="${flagUrl}" class="flag-icon">`}
            <span>${location}</span>
        `;
        locationsList.appendChild(li);
    }
});
