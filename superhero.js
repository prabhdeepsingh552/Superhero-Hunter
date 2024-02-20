document.addEventListener("DOMContentLoaded", function () {
  // Function to extract superhero id from URL query parameter
  function getSuperheroIdFromUrl() {
    const queryParams = new URLSearchParams(window.location.search);
    return queryParams.get("id");
  }

  // Function to fetch superhero details from Marvel API
  function fetchSuperheroDetails(superheroId) {
    const publicKey = "04d99140b38ad73889e01a50938c0f18";
    const privateKey = "08f4557998244b48e43989f71b9a0ea86ade9588";
    const baseUrl = `https://gateway.marvel.com:443/v1/public/characters/${superheroId}`;
    const ts = new Date().getTime().toString();
    const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    const url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        displaySuperheroDetails(data.data.results[0]);
      })
      .catch((error) =>
        console.error("Error fetching superhero details:", error)
      );
  }

  // Function to display superhero details on the page
  function displaySuperheroDetails(superhero) {
    const superheroDetailsContainer =
      document.getElementById("superheroDetails");

    const img = document.createElement("img");
    img.src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
    img.alt = superhero.name;
    img.classList.add("dimensions");

    const heading = document.createElement("h2");
    heading.textContent = superhero.name;

    const bio = document.createElement("p");
    bio.textContent = superhero.description || "No description available.";

    superheroDetailsContainer.appendChild(img);
    superheroDetailsContainer.appendChild(heading);
    superheroDetailsContainer.appendChild(bio);
  }

  // Retrieve superhero id from URL query parameter and fetch superhero details
  const superheroId = getSuperheroIdFromUrl();
  if (superheroId) {
    fetchSuperheroDetails(superheroId);
  } else {
    console.error("Superhero id not found in URL.");
  }
});
