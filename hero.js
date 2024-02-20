document.addEventListener("DOMContentLoaded", function () {
  const publicKey = "04d99140b38ad73889e01a50938c0f18";
  const privateKey = "08f4557998244b48e43989f71b9a0ea86ade9588";

  const baseUrl = "https://gateway.marvel.com:443/v1/public/characters";
  const ts = new Date().getTime().toString();
  const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

  const searchInput = document.getElementById("searchInput");
  const superheroesContainer = document.getElementById("superheroesContainer");
  const favoritesContainer = document.getElementById("favoritesContainer");

  // Function to fetch superheroes from the Marvel API
  function fetchSuperheroes(query) {
    let url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&limit=50`;
    if (query.length > 0) {
      console.log("inside query", query);
      url = `${baseUrl}?ts=${ts}&apikey=${publicKey}&hash=${hash}&nameStartsWith=${query}&limit=50`;
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        superheroesContainer.innerHTML = "";
        data.data.results.forEach((superhero) => {
          // console.log(superhero);
          const superheroCard = createSuperheroCard(superhero);
          superheroesContainer.appendChild(superheroCard);
        });
      })
      .catch((error) => console.error("Error fetching superheroes:", error));
  }

  // Function to create a superhero card
  function createSuperheroCard(superhero) {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
    img.alt = superhero.name;

    const heading = document.createElement("h3");
    heading.textContent = superhero.name;

    const button = document.createElement("button");
    button.textContent = "Add to Favorites";
    button.addEventListener("click", function () {
      addToFavorites(superhero.id, superhero.name);
    });

    img.addEventListener("click", function() {
        // Route to the superhero details page with the superhero's id as a query parameter
        window.open(`superhero.html?id=${superhero.id}`, "_blank");
      });

    card.appendChild(img);
    card.appendChild(heading);
    card.appendChild(button);

    return card;
  }

  // Function to add a superhero to favorites
  function addToFavorites(id, name) {
    console.log("I m clicked", id, name);
    const favorite = document.createElement("div");
    favorite.classList.add("favorite");
    favorite.textContent = name;

    const button = document.createElement("button");
    button.textContent = "Remove";
    button.addEventListener("click", function () {
      removeFromFavorites(button, id);
    });

    favorite.appendChild(button);

    favoritesContainer.appendChild(favorite);
    saveFavorite(id);
  }

  // Function to remove a superhero from favorites
  function removeFromFavorites(button, id) {
    button.parentElement.remove();
    removeFavorite(id);
  }

  // Function to save a superhero as favorite
  function saveFavorite(id) {
    let favorites = localStorage.getItem("favorites");
    favorites = favorites ? JSON.parse(favorites) : [];
    favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  // Function to remove a superhero from favorites
  function removeFavorite(id) {
    let favorites = localStorage.getItem("favorites");
    if (favorites) {
      favorites = JSON.parse(favorites);
      const index = favorites.indexOf(id);
      if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
      }
    }
  }

  // Event listener for search input
  searchInput.addEventListener("input", function () {
    const query = this.value.trim();
    if (query) {
      fetchSuperheroes(query);
    }
  });

  // Initial fetch to load superheroes when the page loads
  fetchSuperheroes("");
});
