const TMDB_API_KEY = "7eab7187df6b106237b4293acdf5367a";

const posterCache = {};

async function getPoster(title, year) {

    const key = `${title}-${year}`;

    if (posterCache[key]) {
        return posterCache[key];
    }

    const url =
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}` +
        `&query=${encodeURIComponent(title)}&year=${year}`;

    try {

        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {

            const poster = data.results[0].poster_path;

            if (poster) {

                const fullPoster =
                    `https://image.tmdb.org/t/p/w500${poster}`;

                posterCache[key] = fullPoster;

                return fullPoster;

            }

        }

    } catch (err) {

        console.error("TMDb Error:", err);

    }

    return "https://placehold.co/500x750?text=No+Poster";

}