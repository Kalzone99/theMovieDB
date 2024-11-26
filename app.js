//token variables and base url to TMDB

const API_token =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWU1OTg3YmNlNmNmMmZkZWUzMWY4MzRkZGIwNTQ1ZiIsIm5iZiI6MTczMDcyODc5MC40MDIzNTQyLCJzdWIiOiI2NzI4YzlmNmMwOTAxMDk1ODBmYTA3YzciLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.yghDxCFESVUKXASCsVvrcUB172vYqD_H0xzzA8KMQ5g";
const API_URL = "https://api.themoviedb.org/3";

const headers = {
  Authorization: `Bearer ${API_token}`,
};

//3 swipers w/ unique ids
// Initialize Swiper sliders
const swiper_a = new Swiper("#swiper_a", {
  // Default parameters
  slidesPerView: 1,
  spaceBetween: 10,
  // Responsive breakpoints
  breakpoints: {
    590: {
      // when window width is >= 590px
      slidesPerView: 2,
      spaceBetween: 20,
    },
    835: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1100: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    2000: {
      slidesPerView: 6,
      spaceBetween: 40,
    },
    3000: {
      slidesPerView: 9,
      spaceBetween: 50,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const swiper_b = new Swiper("#swiper_b", {
  // Default parameters
  slidesPerView: 1,
  spaceBetween: 10,
  // Responsive breakpoints
  breakpoints: {
    590: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    835: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1100: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    2000: {
      slidesPerView: 6,
      spaceBetween: 40,
    },
    3000: {
      slidesPerView: 9,
      spaceBetween: 50,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

const swiper_c = new Swiper("#swiper_c", {
  // Default parameters
  slidesPerView: 1,
  spaceBetween: 10,
  // Responsive breakpoints
  breakpoints: {
    590: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    835: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1100: {
      slidesPerView: 4,
      spaceBetween: 40,
    },
    2000: {
      slidesPerView: 6,
      spaceBetween: 40,
    },
    3000: {
      slidesPerView: 9,
      spaceBetween: 50,
    },
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

//library of genres by id (less troublesome to create a collection)
function getGenreName(id) {
  const genres = {
    35: "Comedy",
    18: "Drama",
    28: "Action",
    10749: "Romance",
    14: "Fantasy",
    16: "Animation",
    12: "Adventure",
    80: "Crime",
    99: "Documentary",
    10751: "Family",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };
  return genres[id] || "Unknown Genre"; //listed genre or in case its not in the list ; "unknown"
}
// Function to fetch popular (second choice after release date gave me errors) movies (swiper_b)
const fetchPopularMovies = async () => {
  const response = await fetch(
    `${API_URL}/movie/popular?&language=en-US&page=1&include_adult=falsesort_by=popularity.desc`, //from postman
    { headers }
  );
  if (!response.ok) {
    console.error("Failed to fetch movies by popularity:", response.statusText);
    return;
  }
  const data = await response.json();
  populateSwiper(swiper_b, data.results);
};

// Function to fetch movies by genre (swiper_c)
const fetchMoviesByGenre = async (genreId) => {
  const response = await fetch(
    `${API_URL}/discover/movie?with_genres=${genreId}&language=en-US&page=1&include_adult=false&sort_by=popularity.desc`,
    { headers }
  );

  if (!response.ok) {
    console.error("Failed to fetch movies by genre:", response.statusText);
    return;
  }

  const data = await response.json();
  populateSwiper(swiper_c, data.results); // Use your swiper population function
};

// Function to fetch movies by search query
const fetchMoviesBySearch = async (query) => {
  const response = await fetch(
    `${API_URL}/search/movie?query=${query}&language=en-US&page=1&include_adult=falsesort_by=popularity.desc`,
    { headers }
  );
  if (!response.ok) {
    console.error(
      `Failed to fetch movies by Search = ${query}:`,
      response.statusText
    );
    return;
  }

  const data = await response.json();
  populateSwiper(swiper_a, data.results);
  // Show swiper_a after search
  document.getElementById("swiper_a").style.display = "block";

  // Update the #searchInfo text with the search results info
  document.getElementById("searchInfo").textContent = `Results for "${query}"`;
  document.getElementById("searchInfo").style.display = "block";
};

// Populate Swiper with movie posters and overlays, with click event to open modal
const populateSwiper = (swiper, movies) => {
  const swiperWrapper = swiper.el.querySelector(".swiper-wrapper");
  swiperWrapper.innerHTML = ""; // Clear existing slides

  movies.forEach((movie) => {
    //create a slide per movie
    const slide = document.createElement("div");
    slide.classList.add("swiper-slide");

    // Extract year from release date
    const releaseYear = movie.release_date
      ? new Date(movie.release_date).getFullYear() // release year in format YYYYMMDD just need the year
      : "Unknown";

    // Retrieve all genres for the movie
    const genreNames =
      movie.genre_ids.length > 0 //get all ids for genre per movie
        ? movie.genre_ids.map((id) => getGenreName(id)).join(" / ") // if several genres, get the genre related to the id in an array, then join them with " / " in between
        : "Unknown Genre"; //if no genre

    // Get rating
    const rating = movie.vote_average
      ? `${movie.vote_average.toFixed(1)}` // rating was giving 3 or 4 numbers after comma so toFixed to show only 1
      : "N/A"; // if no rating
    //create an overlayer on top of the images
    slide.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      <div class="overlay">
        <h2 class="overlayTitle">${movie.title}</h2>
        <h3 class="overlayReleaseYear">${releaseYear}</h3>
        <h4 class="overlayGenres">${genreNames}</h4>
        <div class="redStar"></div>
        <p id="overlayRating">${rating}</p>
      </div>
    `;

    // Add click event to open modal with movie details
    slide.addEventListener("click", () => {
      fetchMovieDetails(movie.id);
    });

    swiperWrapper.appendChild(slide);
  });

  swiper.update(); // Refresh the swiper after adding slides
};

// Close the modal when the close button is clicked
document.getElementById("close").addEventListener("click", () => {
  document.getElementById("modal_info").style.display = "none";
});

// Handle search button click
document.getElementById("go").addEventListener("click", () => {
  const inputElement = document.getElementById("input");
  const query = inputElement.value;

  if (query) {
    fetchMoviesBySearch(query);
  }
  inputElement.value = ""; //after the query, clears the input area
});

// On page load, fetch popular movies and comedy genre to have it populated
window.onload = () => {
  fetchPopularMovies();
  fetchMoviesByGenre(35); // Genre ID for Comedy
};
const comedy = document.querySelector("#comedy");
const drama = document.querySelector("#drama");
const action = document.querySelector("#action");
const romance = document.querySelector("#romance");
const fantasy = document.querySelector("#fantasy");
const animation = document.querySelector("#animation");
const optionChoice = document.querySelector("#optionChoice");

comedy.addEventListener("click", () => {
  fetchMoviesByGenre(35);
  optionChoice.textContent = "Comedy"; // add text to specific clicked genre
});
drama.addEventListener("click", () => {
  fetchMoviesByGenre(18);
  optionChoice.textContent = "Drama";
});
action.addEventListener("click", () => {
  fetchMoviesByGenre(28);
  optionChoice.textContent = "Action";
});
romance.addEventListener("click", () => {
  fetchMoviesByGenre(10749);
  optionChoice.textContent = "Romance";
});
fantasy.addEventListener("click", () => {
  fetchMoviesByGenre(14);
  optionChoice.textContent = "Fantasy";
});
animation.addEventListener("click", () => {
  fetchMoviesByGenre(16);
  optionChoice.textContent = "Animation";
});
const modal_login = document.querySelector("#modal_login");
const registerButtons = document.querySelectorAll(".register");
const signinButtons = document.querySelectorAll(".sign_in");
const close = document.querySelector("#close");
const close_2 = document.querySelector("#close_2");

registerButtons.forEach((register) => {
  //header and footer registers
  register.addEventListener("click", () => {
    modal_login.style.display = "flex";
  });
});
signinButtons.forEach((sign_in) => {
  //header and footer also
  sign_in.addEventListener("click", () => {
    modal_login.style.display = "flex";
  });
});
close.addEventListener("click", () => {
  modal_login.style.display = "none"; //close login with the cross logo
});
close_2.addEventListener("click", () => {
  modal_info.style.display = "none";
});

// Function to fetch movie details and display them in the modal
const fetchMovieDetails = async (movieId) => {
  const response = await fetch(`${API_URL}/movie/${movieId}&language=en-US`, {
    headers,
  });
  if (!response.ok) {
    console.error("Failed to fetch movies to display:", response.statusText);
    return;
  }
  const data = await response.json();

  // Populate modal with movie details, while the modal itself is already fully constructed
  document.getElementById(
    "imgInfoPoster"
  ).src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  document.getElementById("modalInfoTitle").textContent = data.title;
  document.getElementById("modalInfoRelease").textContent = new Date(
    data.release_date
  ).getFullYear(); // only the year
  document.getElementById("rateModal").textContent =
    data.vote_average.toFixed(1); //rating with 1 decimal
  document.getElementById("modalGenre").textContent = data.genres
    .map((genre) => genre.name) //from genre id get the name
    .join(", ");
  document.getElementById("synopsis").textContent = data.overview;

  fetchMovieCast(movieId);

  document.getElementById("modal_info").style.display = "flex";
};

const fetchMovieCast = async (movieId) => {
  //fetching cast by movie id
  const response = await fetch(
    `${API_URL}/movie/${movieId}/credits?&language=en-US`, //credits being the cast language has been given by postman, i kept only english spoken movies or subs
    { headers }
  );
  if (!response.ok) {
    console.error("Failed to fetch movie's cast:", response.statusText);
    return;
  }
  const data = await response.json();

  const cast = data.cast
    .slice(0, 5) // get the first 5 indexes, goes by main actors
    .map((actor) => actor.name) // map in array
    .join(", "); // join them to display in target pop up modal
  document.getElementById("castFetchResult").textContent =
    cast || "Cast information not available.";
};
