/* =====================================================
   MOVIE ROULETTE
   script.js
   PART 1 - FOUNDATION
=====================================================*/

// ===============================
// Global Variables
// ===============================

let currentMovie = null;
let previousMovie = null;

let watchedMovies = [];
let favoriteMovies = [];

let currentTheme = "dark";

let isSpinning = false;

// ===============================
// Movie Database
// ===============================

// movies[] comes from movies.js

if (typeof movies === "undefined") {
    alert("movies.js failed to load!");
    throw new Error("movies.js not found.");
}

// ===============================
// DOM Elements
// ===============================

const movieCard = document.getElementById("movieCard");

const moviePoster = document.getElementById("moviePoster");
const movieTitle = document.getElementById("movieTitle");
const movieRank = document.getElementById("movieRank");
const movieYear = document.getElementById("movieYear");
const movieRuntime = document.getElementById("movieRuntime");
const movieRating = document.getElementById("movieRating");
const movieGenres = document.getElementById("movieGenres");
const movieOverview = document.getElementById("movieOverview");

const spinButton = document.getElementById("spinButton");
const spinAgain = document.getElementById("spinAgain");

const favoriteButton = document.getElementById("favoriteButton");
const watchedButton = document.getElementById("watchedButton");
const trailerButton = document.getElementById("trailerButton");

const progressFill = document.getElementById("progressFill");

const watchedCount = document.getElementById("watchedCount");
const favoriteCount = document.getElementById("favoriteCount");
const remainingCount = document.getElementById("remainingCount");

const dashboardWatched = document.getElementById("dashboardWatched");
const dashboardFavorites = document.getElementById("dashboardFavorites");
const dashboardRemaining = document.getElementById("dashboardRemaining");
const dashboardPercent = document.getElementById("dashboardPercent");

const rouletteTrack = document.getElementById("rouletteTrack");

const loadingScreen = document.getElementById("loadingScreen");

// ===============================
// Local Storage
// ===============================

function loadStorage() {

    watchedMovies =
        JSON.parse(localStorage.getItem("watchedMovies")) || [];

    favoriteMovies =
        JSON.parse(localStorage.getItem("favoriteMovies")) || [];

    currentTheme =
        localStorage.getItem("theme") || "dark";

}

function saveStorage() {

    localStorage.setItem(
        "watchedMovies",
        JSON.stringify(watchedMovies)
    );

    localStorage.setItem(
        "favoriteMovies",
        JSON.stringify(favoriteMovies)
    );

    localStorage.setItem(
        "theme",
        currentTheme
    );

}

// ===============================
// Utility Functions
// ===============================

function getMovieByRank(rank){

    return movies.find(movie => movie.rank === rank);

}

function randomNumber(min,max){

    return Math.floor(
        Math.random() * (max-min+1)
    ) + min;

}

function randomMovie(){

    let movie;

    do{

        movie = movies[randomNumber(0,movies.length-1)];

    }while(
        previousMovie &&
        movie.rank === previousMovie.rank
    );

    previousMovie = movie;

    return movie;

}

function isFavorite(rank){

    return favoriteMovies.includes(rank);

}

function isWatched(rank){

    return watchedMovies.includes(rank);

}

function addFavorite(rank){

    if(!favoriteMovies.includes(rank)){

        favoriteMovies.push(rank);

        saveStorage();

    }

}

function removeFavorite(rank){

    favoriteMovies =
        favoriteMovies.filter(
            item => item !== rank
        );

    saveStorage();

}

function addWatched(rank){

    if(!watchedMovies.includes(rank)){

        watchedMovies.push(rank);

        saveStorage();

    }

}

function removeWatched(rank){

    watchedMovies =
        watchedMovies.filter(
            item => item !== rank
        );

    saveStorage();

}

// ===============================
// Loading Screen
// ===============================

function hideLoader(){

    setTimeout(()=>{

        loadingScreen.style.display="none";

    },800);

}

// ===============================
// Initialize
// ===============================

loadStorage();

hideLoader();

console.log(
    "🎬 Movie Roulette Initialized"
);

console.log(
    "Movies Loaded:",
    movies.length
);
/* =====================================================
   PART 2 - MOVIE DISPLAY SYSTEM
=====================================================*/

// ===============================
// Genre Badges
// ===============================

function renderGenres(genres){

    movieGenres.innerHTML = "";

    if(!genres || genres.length===0){

        const badge = document.createElement("span");
        badge.textContent = "Unknown";
        movieGenres.appendChild(badge);
        return;

    }

    genres.forEach(genre=>{

        const badge = document.createElement("span");

        badge.textContent = genre;

        movieGenres.appendChild(badge);

    });

}

// ===============================
// Update Buttons
// ===============================

function updateButtons(movie){

    if(isFavorite(movie.rank)){

        favoriteButton.innerHTML =
        `<i class="fa-solid fa-heart"></i> Remove Favorite`;

    }

    else{

        favoriteButton.innerHTML =
        `<i class="fa-regular fa-heart"></i> Favorite`;

    }

    if(isWatched(movie.rank)){

        watchedButton.innerHTML =
        `<i class="fa-solid fa-check"></i> Watched`;

    }

    else{

        watchedButton.innerHTML =
        `<i class="fa-solid fa-check"></i> Mark Watched`;

    }

}

// ===============================
// Display Movie
// ===============================

function displayMovie(movie){

    currentMovie = movie;

   getPoster(movie.title, movie.year)
    .then(url => {
        moviePoster.src = url;
    });

    moviePoster.alt = movie.title;

    movieTitle.textContent = movie.title;

    movieRank.textContent = `IMDb #${movie.rank}`;

    movieYear.textContent = movie.year;

    movieRuntime.textContent =
        `${movie.runtime} min`;

    movieRating.textContent =
        `⭐ ${movie.rating}`;

    movieOverview.textContent =
        movie.overview;

    renderGenres(movie.genres);

    updateButtons(movie);

    movieCard.classList.remove("hidden");

    movieCard.classList.add("fade-in");

    updateProgress();

}

// ===============================
// Progress
// ===============================

function updateProgress(){

    const watched = watchedMovies.length;

    const favorites = favoriteMovies.length;

    const total = movies.length;

    const remaining = total - watched;

    const percent =
        (watched/total)*100;

    progressFill.style.width =
        `${percent}%`;

    watchedCount.textContent =
        watched;

    favoriteCount.textContent =
        favorites;

    remainingCount.textContent =
        remaining;

    updateDashboard();

}

// ===============================
// Dashboard
// ===============================

function updateDashboard(){

    const watched = watchedMovies.length;

    const favorites = favoriteMovies.length;

    const total = movies.length;

    const remaining = total-watched;

    const percent =
        ((watched/total)*100)
        .toFixed(1);

    dashboardWatched.textContent =
        watched;

    dashboardFavorites.textContent =
        favorites;

    dashboardRemaining.textContent =
        remaining;

    dashboardPercent.textContent =
        `${percent}%`;

}

// ===============================
// Open Trailer
// ===============================

function openTrailer(){

    if(
        currentMovie &&
        currentMovie.trailer
    ){

        window.open(
            currentMovie.trailer,
            "_blank"
        );

    }

}

// ===============================
// Favorite Toggle
// ===============================

function toggleFavorite(){

    if(!currentMovie) return;

    if(isFavorite(currentMovie.rank)){

        removeFavorite(currentMovie.rank);

    }

    else{

        addFavorite(currentMovie.rank);

    }

    updateButtons(currentMovie);

    updateProgress();

}

// ===============================
// Watched Toggle
// ===============================

function toggleWatched(){

    if(!currentMovie) return;

    if(isWatched(currentMovie.rank)){

        removeWatched(currentMovie.rank);

    }

    else{

        addWatched(currentMovie.rank);

    }

    updateButtons(currentMovie);

    updateProgress();

}
/* =====================================================
   PART 3 - ROULETTE ENGINE
=====================================================*/

// ===============================
// Build Roulette Strip
// ===============================

function buildRoulette(){

    rouletteTrack.innerHTML = "";

    // Repeat posters to make the strip long
    for(let round=0; round<4; round++){

        movies.forEach(movie=>{

            const img = document.createElement("img");

           getPoster(movie.title, movie.year)
    .then(url => {
        img.src = url;
    });

            img.alt = movie.title;

            img.className = "roulette-poster";

            rouletteTrack.appendChild(img);

        });

    }

}

// ===============================
// Spin Roulette
// ===============================

function spinRoulette(){

    if(isSpinning) return;

    isSpinning = true;

    spinButton.disabled = true;

    spinAgain.disabled = true;

    spinButton.innerHTML =
    `<i class="fa-solid fa-spinner fa-spin"></i>
     Finding Tonight's Movie...`;

    const winner = randomMovie();

    const posterWidth = 180;

    const winnerIndex =
        movies.findIndex(
            movie=>movie.rank===winner.rank
        );

    const loops = 2;

    const finalIndex =
        loops*movies.length + winnerIndex;

    const translate =
        (finalIndex*posterWidth)-450;

    rouletteTrack.style.transition =
        "transform 3.5s cubic-bezier(.15,.84,.19,1)";

    rouletteTrack.style.transform =
        `translateX(-${translate}px)`;

    setTimeout(()=>{

        displayMovie(winner);

        spinButton.disabled = false;

        spinAgain.disabled = false;

        spinButton.innerHTML =
        `<i class="fa-solid fa-dice"></i>
         SPIN THE ROULETTE`;

        isSpinning = false;

    },3600);

}

// ===============================
// Reset Roulette Position
// ===============================

function resetRoulette(){

    rouletteTrack.style.transition = "none";

    rouletteTrack.style.transform = "translateX(0px)";

}

// ===============================
// Start Roulette
// ===============================

function startSpin(){

    resetRoulette();

    setTimeout(()=>{

        spinRoulette();

    },50);

}

// ===============================
// Initial Build
// ===============================

buildRoulette();
/* =====================================================
   PART 4 - SEARCH ENGINE
=====================================================*/

// ===============================
// DOM
// ===============================

const searchOverlay =
    document.getElementById("searchOverlay");

const searchInput =
    document.getElementById("searchInput");

const searchResults =
    document.getElementById("searchResults");

const searchOpen =
    document.getElementById("searchOpen");

const closeSearch =
    document.getElementById("closeSearch");

// ===============================
// Open Search
// ===============================

function openSearch(){

    searchOverlay.classList.remove("hidden");

    searchOverlay.classList.add("show");

    searchInput.value="";

    searchInput.focus();

    searchResults.innerHTML="";

}

// ===============================
// Close Search
// ===============================

function closeSearchPanel(){

    searchOverlay.classList.remove("show");

    searchOverlay.classList.add("hidden");

}

// ===============================
// Search Movies
// ===============================

function searchMovies(query){

    query=query.toLowerCase().trim();

    searchResults.innerHTML="";

    if(query==="") return;

    const results=movies.filter(movie=>{

        const title=
            movie.title.toLowerCase();

        const genres=
            movie.genres.join(" ").toLowerCase();

        const year=
            String(movie.year);

        return(

            title.includes(query)

            ||

            genres.includes(query)

            ||

            year.includes(query)

        );

    });

    if(results.length===0){

        searchResults.innerHTML=

        `<p>No movies found.</p>`;

        return;

    }

    results.forEach(movie=>{

        const card=document.createElement("div");

        card.className="favorite-item fade-in";

        card.innerHTML=`

        <img class="searchPoster">
        <h4>${movie.title}</h4>

        `;
        getPoster(movie.title, movie.year)
    .then(url => {
        card.querySelector(".searchPoster").src = url;
    });


        card.addEventListener(

            "click",

            ()=>{

                displayMovie(movie);

                closeSearchPanel();

            }

        );

        searchResults.appendChild(card);

    });

}

// ===============================
// Live Search
// ===============================

searchInput.addEventListener(

    "input",

    ()=>{

        searchMovies(

            searchInput.value

        );

    }

);

// ===============================
// Buttons
// ===============================

searchOpen.addEventListener(

    "click",

    openSearch

);

closeSearch.addEventListener(

    "click",

    closeSearchPanel

);

// ===============================
// ESC Key
// ===============================

document.addEventListener(

    "keydown",

    e=>{

        if(

            e.key==="Escape"

        ){

            closeSearchPanel();

        }

    }

);
/* =====================================================
   PART 5 - FAVORITES
=====================================================*/

// ===============================
// DOM
// ===============================

const favoritesOverlay =
    document.getElementById("favoritesOverlay");

const favoriteGrid =
    document.getElementById("favoriteGrid");

const favoritesOpen =
    document.getElementById("favoritesOpen");

const closeFavorites =
    document.getElementById("closeFavorites");

const randomFavorite =
    document.getElementById("randomFavorite");

// ===============================
// Open Favorites
// ===============================

function openFavorites(){

    renderFavorites();

    favoritesOverlay.classList.remove("hidden");

    favoritesOverlay.classList.add("show");

}

// ===============================
// Close Favorites
// ===============================

function closeFavoritesPanel(){

    favoritesOverlay.classList.remove("show");

    favoritesOverlay.classList.add("hidden");

}

// ===============================
// Render Favorites
// ===============================

function renderFavorites(){

    favoriteGrid.innerHTML = "";

    if(favoriteMovies.length===0){

        favoriteGrid.innerHTML =

        `<p style="text-align:center;width:100%;">
        ❤️ No favorite movies yet.
        </p>`;

        return;

    }

    favoriteMovies.forEach(rank=>{

        const movie = getMovieByRank(rank);

        if(!movie) return;

        const card = document.createElement("div");

        card.className = "favorite-item fade-in";

        card.innerHTML = `

           <img class="favoritePoster" alt="${movie.title}">

            <h4>${movie.title}</h4>

        `;
        getPoster(movie.title, movie.year)
    .then(url => {
        card.querySelector(".favoritePoster").src = url;
    });

        card.addEventListener("click",()=>{

            displayMovie(movie);

            closeFavoritesPanel();

        });

        favoriteGrid.appendChild(card);

    });

}

// ===============================
// Random Favorite
// ===============================

function spinFavoriteMovie(){

    if(favoriteMovies.length===0){

        alert("You haven't added any favorite movies yet!");

        return;

    }

    const randomRank =

        favoriteMovies[
            randomNumber(
                0,
                favoriteMovies.length-1
            )
        ];

    const movie =

        getMovieByRank(randomRank);

    if(movie){

        displayMovie(movie);

    }

}

// ===============================
// Remove All Favorites
// ===============================

function clearFavorites(){

    if(

        !confirm(
            "Remove all favorite movies?"
        )

    ) return;

    favoriteMovies = [];

    saveStorage();

    renderFavorites();

    updateProgress();

}

// ===============================
// Favorite Button Update
// ===============================

function refreshFavoriteScreen(){

    if(

        favoritesOverlay.classList.contains("show")

    ){

        renderFavorites();

    }

}

// ===============================
// Override Favorite Toggle
// ===============================

const oldToggleFavorite = toggleFavorite;

toggleFavorite = function(){

    oldToggleFavorite();

    renderFavorites();

};

// ===============================
// Events
// ===============================

favoritesOpen.addEventListener(

    "click",

    openFavorites

);

closeFavorites.addEventListener(

    "click",

    closeFavoritesPanel

);

randomFavorite.addEventListener(

    "click",

    spinFavoriteMovie

);

// Double-click overlay background to close

favoritesOverlay.addEventListener(

    "dblclick",

    function(e){

        if(e.target===favoritesOverlay){

            closeFavoritesPanel();

        }

    }

);
/* =====================================================
   PART 6 - WATCHED SYSTEM
=====================================================*/

// ===============================
// Recent Watched
// ===============================

let recentlyWatched = JSON.parse(
    localStorage.getItem("recentlyWatched")
) || [];

// ===============================
// Save Recent
// ===============================

function saveRecentWatched(rank){

    recentlyWatched =
        recentlyWatched.filter(
            item => item !== rank
        );

    recentlyWatched.unshift(rank);

    if(recentlyWatched.length > 20){

        recentlyWatched.pop();

    }

    localStorage.setItem(
        "recentlyWatched",
        JSON.stringify(recentlyWatched)
    );

}

// ===============================
// Update Watched
// ===============================

function toggleWatched(){

    if(!currentMovie) return;

    const rank = currentMovie.rank;

    if(isWatched(rank)){

        removeWatched(rank);

    }

    else{

        addWatched(rank);

        saveRecentWatched(rank);

        checkAchievements();

    }

    updateButtons(currentMovie);

    updateProgress();

}

// ===============================
// Achievement Popup
// ===============================

function showAchievement(text){

    const popup =
        document.getElementById(
            "achievementPopup"
        );

    const achievementText =
        document.getElementById(
            "achievementText"
        );

    achievementText.textContent = text;

    popup.classList.remove("hidden");

    popup.classList.add("fade-in");

    setTimeout(()=>{

        popup.classList.add("hidden");

    },3500);

}

// ===============================
// Achievement Checker
// ===============================

function checkAchievements(){

    const count = watchedMovies.length;

    switch(count){

        case 1:

            showAchievement(
                "🎉 First Movie Watched!"
            );

            break;

        case 25:

            showAchievement(
                "🍿 Movie Fan - 25 Movies!"
            );

            break;

        case 50:

            showAchievement(
                "🎬 Cinephile - 50 Movies!"
            );

            break;

        case 100:

            showAchievement(
                "🏆 Master Collector - 100 Movies!"
            );

            break;

        case 150:

            showAchievement(
                "🔥 Movie Expert - 150 Movies!"
            );

            break;

        case 200:

            showAchievement(
                "🌟 Movie Legend - 200 Movies!"
            );

            break;

        case 250:

            showAchievement(
                "👑 You Completed IMDb Top 250!"
            );

            launchConfetti();

            break;

    }

}

// ===============================
// Confetti
// ===============================

function launchConfetti(){

    if(typeof confetti !== "undefined"){

        confetti({

            particleCount:250,

            spread:180,

            origin:{
                y:0.6
            }

        });

    }

}

// ===============================
// Reset Progress
// ===============================

function resetProgress(){

    const confirmReset = confirm(

        "This will remove watched movies, favorites and progress.\n\nContinue?"

    );

    if(!confirmReset) return;

    watchedMovies = [];

    favoriteMovies = [];

    recentlyWatched = [];

    saveStorage();

    localStorage.removeItem("recentlyWatched");

    updateProgress();

    renderFavorites();

    if(currentMovie){

        updateButtons(currentMovie);

    }

    alert("Progress Reset Successfully!");

}

// ===============================
// Recent Movie
// ===============================

function getLastWatchedMovie(){

    if(recentlyWatched.length===0){

        return null;

    }

    return getMovieByRank(

        recentlyWatched[0]

    );

}

// ===============================
// Completion
// ===============================

function getCompletionPercentage(){

    return (

        watchedMovies.length /

        movies.length

    ) * 100;

}
/* =====================================================
   PART 7 - THEME SYSTEM
=====================================================*/

// ===============================
// DOM
// ===============================

const themeToggle =
    document.getElementById("themeToggle");

// ===============================
// Themes
// ===============================

const DARK_THEME = {

    background:"#0E1117",
    card:"#1A1F2B",
    text:"#FFFFFF",
    secondary:"#A1A1AA"

};

const LIGHT_THEME = {

    background:"#F5F5F5",
    card:"#FFFFFF",
    text:"#111111",
    secondary:"#555555"

};

// ===============================
// Apply Theme
// ===============================

function applyTheme(theme){

    const root =
        document.documentElement;

    if(theme==="dark"){

        root.style.setProperty(
            "--bg",
            DARK_THEME.background
        );

        root.style.setProperty(
            "--card",
            DARK_THEME.card
        );

        root.style.setProperty(
            "--white",
            DARK_THEME.text
        );

        root.style.setProperty(
            "--text",
            DARK_THEME.text
        );

        root.style.setProperty(
            "--secondary",
            DARK_THEME.secondary
        );

        themeToggle.innerHTML =
        `<i class="fa-solid fa-moon"></i>`;

    }

    else{

        root.style.setProperty(
            "--bg",
            LIGHT_THEME.background
        );

        root.style.setProperty(
            "--card",
            LIGHT_THEME.card
        );

        root.style.setProperty(
            "--white",
            LIGHT_THEME.text
        );

        root.style.setProperty(
            "--text",
            LIGHT_THEME.text
        );

        root.style.setProperty(
            "--secondary",
            LIGHT_THEME.secondary
        );

        themeToggle.innerHTML =
        `<i class="fa-solid fa-sun"></i>`;

    }

}

// ===============================
// Toggle Theme
// ===============================

function toggleTheme(){

    if(currentTheme==="dark"){

        currentTheme="light";

    }

    else{

        currentTheme="dark";

    }

    applyTheme(currentTheme);

    saveStorage();

}

// ===============================
// Load Theme
// ===============================

function loadTheme(){

    currentTheme =
        localStorage.getItem("theme")
        || "dark";

    applyTheme(currentTheme);

}

// ===============================
// Smooth Transition
// ===============================

function enableTransitions(){

    document.body.style.transition =
    "background .35s ease,color .35s ease";

    document.querySelectorAll("*")

    .forEach(element=>{

        element.style.transition +=
        ", background .35s ease,color .35s ease,border-color .35s ease";

    });

}

// ===============================
// Keyboard Shortcut
// ===============================

document.addEventListener(

    "keydown",

    function(e){

        if(

            e.key.toLowerCase()==="t"

        ){

            toggleTheme();

        }

    }

);

// ===============================
// Theme Button
// ===============================

themeToggle.addEventListener(

    "click",

    toggleTheme

);

// ===============================
// Startup
// ===============================

enableTransitions();

loadTheme();
/* =====================================================
   PART 8 - APPLICATION INTEGRATION
=====================================================*/

// ===============================
// Dashboard
// ===============================

const dashboardOverlay =
    document.getElementById("dashboardOverlay");

const dashboardOpen =
    document.getElementById("dashboardOpen");

const closeDashboard =
    document.getElementById("closeDashboard");

// ===============================
// Dashboard
// ===============================

function openDashboard(){

    updateDashboard();

    dashboardOverlay.classList.remove("hidden");

    dashboardOverlay.classList.add("show");

}

function closeDashboardPanel(){

    dashboardOverlay.classList.remove("show");

    dashboardOverlay.classList.add("hidden");

}

// ===============================
// Footer Button
// ===============================

const resetProgressButton =
    document.getElementById("resetProgress");

// ===============================
// Spin Buttons
// ===============================

spinButton.addEventListener(

    "click",

    startSpin

);

spinAgain.addEventListener(

    "click",

    startSpin

);

// ===============================
// Favorite
// ===============================

favoriteButton.addEventListener(

    "click",

    toggleFavorite

);

// ===============================
// Watched
// ===============================

watchedButton.addEventListener(

    "click",

    toggleWatched

);

// ===============================
// Trailer
// ===============================

trailerButton.addEventListener(

    "click",

    openTrailer

);

// ===============================
// Dashboard
// ===============================

dashboardOpen.addEventListener(

    "click",

    openDashboard

);

closeDashboard.addEventListener(

    "click",

    closeDashboardPanel

);

// ===============================
// Reset
// ===============================

resetProgressButton.addEventListener(

    "click",

    resetProgress

);

// ===============================
// Keyboard
// ===============================

document.addEventListener(

    "keydown",

    function(e){

        if(e.code==="Space"){

            e.preventDefault();

            startSpin();

        }

        if(

            e.key.toLowerCase()==="f"

        ){

            toggleFavorite();

        }

        if(

            e.key.toLowerCase()==="w"

        ){

            toggleWatched();

        }

    }

);

// ===============================
// Overlay Close
// ===============================

window.addEventListener(

    "click",

    function(e){

        if(e.target===searchOverlay)

            closeSearchPanel();

        if(e.target===favoritesOverlay)

            closeFavoritesPanel();

        if(e.target===dashboardOverlay)

            closeDashboardPanel();

    }

);

// ===============================
// Startup
// ===============================

function initializeApp(){

    loadStorage();

    loadTheme();

    updateProgress();

    buildRoulette();

    hideLoader();

    movieCard.classList.add("hidden");

    console.log("🎬 Movie Roulette Ready!");

}

initializeApp();
/* =====================================================
   PART 9 - ROULETTE IMPROVEMENTS
=====================================================*/

// =====================================
// Smart Random (avoid recent repeats)
// =====================================

let recentPicks = [];

function getSmartRandomMovie(){

    let movie;

    let attempts = 0;

    do{

        movie = movies[randomNumber(0,movies.length-1)];

        attempts++;

    }

    while(

        recentPicks.includes(movie.rank)

        &&

        attempts < 100

    );

    recentPicks.push(movie.rank);

    if(recentPicks.length > 15){

        recentPicks.shift();

    }

    return movie;

}

// =====================================
// Smooth Scroll To Card
// =====================================

function scrollToMovie(){

    movieCard.scrollIntoView({

        behavior:"smooth",

        block:"start"

    });

}

// =====================================
// Poster Preload
// =====================================

function preloadPosters(){

    movies.forEach(movie=>{

        const img = new Image();

        img.src = movie.poster;

    });

}

// =====================================
// Better Spin
// =====================================

function spinRoulette(){

    if(isSpinning) return;

    isSpinning = true;

    spinButton.disabled = true;

    spinAgain.disabled = true;

    spinButton.innerHTML =

    `<i class="fa-solid fa-spinner fa-spin"></i>
    Choosing Movie...`;

    const winner = getSmartRandomMovie();

    const winnerIndex =

        movies.findIndex(

            m=>m.rank===winner.rank

        );

    const loops = 5;

    const posterWidth = 180;

    const finalOffset =

        ((loops * movies.length)

        + winnerIndex)

        * posterWidth;

    rouletteTrack.style.transition =

        "transform 4.5s cubic-bezier(.08,.82,.17,1)";

    rouletteTrack.style.transform =

        `translateX(-${finalOffset}px)`;

    setTimeout(()=>{

        displayMovie(winner);

        scrollToMovie();

        spinButton.disabled = false;

        spinAgain.disabled = false;

        spinButton.innerHTML =

        `<i class="fa-solid fa-dice"></i>
        SPIN THE ROULETTE`;

        isSpinning = false;

    },4600);

}

// =====================================
// Random Favorite Spin
// =====================================

function randomFavoriteMovie(){

    if(favoriteMovies.length===0){

        alert(

            "No favorite movies yet."

        );

        return;

    }

    const randomRank =

        favoriteMovies[

            randomNumber(

                0,

                favoriteMovies.length-1

            )

        ];

    const movie =

        getMovieByRank(randomRank);

    displayMovie(movie);

    scrollToMovie();

}

// =====================================
// Random Watched Movie
// =====================================

function randomWatchedMovie(){

    if(watchedMovies.length===0){

        return;

    }

    const randomRank =

        watchedMovies[

            randomNumber(

                0,

                watchedMovies.length-1

            )

        ];

    displayMovie(

        getMovieByRank(randomRank)

    );

}

// =====================================
// Keyboard Shortcuts
// =====================================

document.addEventListener(

    "keydown",

    function(e){

        if(

            e.target.tagName==="INPUT"

        ) return;

        switch(e.key.toLowerCase()){

            case "r":

                startSpin();

                break;

            case "f":

                toggleFavorite();

                break;

            case "w":

                toggleWatched();

                break;

            case "d":

                openDashboard();

                break;

            case "s":

                openSearch();

                break;

        }

    }

);

// =====================================
// Startup Optimizations
// =====================================

preloadPosters();

console.log(

    "✅ Roulette Engine Optimized"

);
/* =====================================================
   PART 10 - ADVANCED DASHBOARD
=====================================================*/

// =====================================
// Total Runtime Watched
// =====================================

function getTotalRuntime(){

    let total = 0;

    watchedMovies.forEach(rank=>{

        const movie = getMovieByRank(rank);

        if(movie){

            total += Number(movie.runtime) || 0;

        }

    });

    return total;

}

// =====================================
// Average IMDb Rating
// =====================================

function getAverageRating(){

    if(watchedMovies.length===0)

        return "0.0";

    let total = 0;

    watchedMovies.forEach(rank=>{

        const movie = getMovieByRank(rank);

        if(movie){

            total += Number(movie.rating);

        }

    });

    return (

        total /

        watchedMovies.length

    ).toFixed(1);

}

// =====================================
// Favorite Genre
// =====================================

function getFavoriteGenre(){

    const genreCount = {};

    watchedMovies.forEach(rank=>{

        const movie = getMovieByRank(rank);

        if(!movie) return;

        movie.genres.forEach(genre=>{

            if(!genreCount[genre])

                genreCount[genre]=0;

            genreCount[genre]++;

        });

    });

    let favorite="None";

    let max=0;

    Object.keys(genreCount).forEach(genre=>{

        if(

            genreCount[genre]>max

        ){

            max=genreCount[genre];

            favorite=genre;

        }

    });

    return favorite;

}

// =====================================
// Recently Watched
// =====================================

function renderRecentMovies(){

    const container=

        document.getElementById(

            "recentMovies"

        );

    if(!container) return;

    container.innerHTML="";

    recentlyWatched.forEach(rank=>{

        const movie=

            getMovieByRank(rank);

        if(!movie) return;

        const card=

            document.createElement("div");

        card.className="favorite-item";

        card.innerHTML=`

        <img src="${movie.poster}">

        <h4>${movie.title}</h4>

        `;

        card.onclick=()=>{

            displayMovie(movie);

            closeDashboardPanel();

        };

        container.appendChild(card);

    });

}

// =====================================
// Update Statistics
// =====================================

function updateStatistics(){

    const runtimeElement=

        document.getElementById(

            "totalRuntime"

        );

    const averageElement=

        document.getElementById(

            "averageRating"

        );

    const genreElement=

        document.getElementById(

            "favoriteGenre"

        );

    if(runtimeElement)

        runtimeElement.textContent=

        getTotalRuntime()+" min";

    if(averageElement)

        averageElement.textContent=

        "⭐ "+getAverageRating();

    if(genreElement)

        genreElement.textContent=

        getFavoriteGenre();

}

// =====================================
// Dashboard Refresh
// =====================================

const originalDashboard=

    updateDashboard;

updateDashboard=function(){

    originalDashboard();

    updateStatistics();

    renderRecentMovies();

};

// =====================================
// Completion Message
// =====================================

function getCompletionMessage(){

    const percent=

        getCompletionPercentage();

    if(percent===100)

        return "🏆 Completed!";

    if(percent>=75)

        return "🔥 Almost There!";

    if(percent>=50)

        return "🎬 Great Progress!";

    if(percent>=25)

        return "🍿 Keep Watching!";

    return "🎲 Let's Start!";

}

// =====================================
// Welcome Back
// =====================================

function welcomeBack(){

    const last=

        getLastWatchedMovie();

    if(last){

        console.log(

            "Welcome back!"

        );

        console.log(

            "Last Watched:",

            last.title

        );

    }

}

// =====================================
// App Statistics
// =====================================

console.table({

    Movies:movies.length,

    Watched:watchedMovies.length,

    Favorites:favoriteMovies.length,

    Runtime:getTotalRuntime(),

    Average:getAverageRating(),

    Genre:getFavoriteGenre()

});

// =====================================
// Startup
// =====================================

welcomeBack();

updateStatistics();

console.log(

    "📊 Dashboard Ready"

);
