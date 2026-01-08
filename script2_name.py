import requests
import json
import time

# Configuration
TMDB_API_KEY = "0d78ba5147c37c7b960cb5c3665019f7"  # Replace with your actual API key
BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

# Movie data with IMDb IDs (All 150 movies)
movies_data = [
    {"imdb_id": "tt0137523", "title": "Fight Club"},
    {"imdb_id": "tt0109830", "title": "Forrest Gump"},
    {"imdb_id": "tt0076759", "title": "Star Wars: A New Hope"},
    {"imdb_id": "tt0080684", "title": "The Empire Strikes Back"},
    {"imdb_id": "tt0133093", "title": "The Matrix"},
    {"imdb_id": "tt0099685", "title": "Goodfellas"},
    {"imdb_id": "tt0114369", "title": "Se7en"},
    {"imdb_id": "tt0167261", "title": "The Lord of the Rings: The Two Towers"},
    {"imdb_id": "tt0120737", "title": "The Lord of the Rings: The Fellowship of the Ring"},
    {"imdb_id": "tt0066921", "title": "A Clockwork Orange"},
    {"imdb_id": "tt0102926", "title": "The Silence of the Lambs"},
    {"imdb_id": "tt0114814", "title": "The Usual Suspects"},
    {"imdb_id": "tt0120689", "title": "The Green Mile"},
    {"imdb_id": "tt0081505", "title": "The Shining"},
    {"imdb_id": "tt0060196", "title": "The Good, the Bad and the Ugly"},
    {"imdb_id": "tt0118799", "title": "Life Is Beautiful"},
    {"imdb_id": "tt0110413", "title": "Léon: The Professional"},
    {"imdb_id": "tt0253474", "title": "The Pianist"},
    {"imdb_id": "tt0816692", "title": "Interstellar"},
    {"imdb_id": "tt0034583", "title": "Casablanca"},
    {"imdb_id": "tt0103064", "title": "Terminator 2: Judgment Day"},
    {"imdb_id": "tt0021749", "title": "City Lights"},
    {"imdb_id": "tt0054215", "title": "Psycho"},
    {"imdb_id": "tt0027977", "title": "Modern Times"},
    {"imdb_id": "tt1675434", "title": "The Intouchables"},
    {"imdb_id": "tt2582802", "title": "Whiplash"},
    {"imdb_id": "tt0172495", "title": "Gladiator"},
    {"imdb_id": "tt0407887", "title": "The Departed"},
    {"imdb_id": "tt0088763", "title": "Back to the Future"},
    {"imdb_id": "tt0052520", "title": "Ben-Hur"},
    {"imdb_id": "tt0082971", "title": "Raiders of the Lost Ark"},
    {"imdb_id": "tt0032976", "title": "The Great Dictator"},
    {"imdb_id": "tt0482571", "title": "The Prestige"},
    {"imdb_id": "tt0047396", "title": "Rear Window"},
    {"imdb_id": "tt0090605", "title": "Aliens"},
    {"imdb_id": "tt0078748", "title": "Alien"},
    {"imdb_id": "tt0086190", "title": "Star Wars: Return of the Jedi"},
    {"imdb_id": "tt0120815", "title": "Saving Private Ryan"},
    {"imdb_id": "tt0032553", "title": "The Great Escape"},
    {"imdb_id": "tt0107048", "title": "Groundhog Day"},
    {"imdb_id": "tt0032138", "title": "The Wizard of Oz"},
    {"imdb_id": "tt0021814", "title": "Frankenstein"},
    {"imdb_id": "tt0056592", "title": "To Kill a Mockingbird"},
    {"imdb_id": "tt0064116", "title": "Once Upon a Time in the West"},
    {"imdb_id": "tt0053125", "title": "North by Northwest"},
    {"imdb_id": "tt0050212", "title": "The Bridge on the River Kwai"},
    {"imdb_id": "tt0059243", "title": "For a Few Dollars More"},
    {"imdb_id": "tt0058150", "title": "A Fistful of Dollars"},
    {"imdb_id": "tt0332280", "title": "The Notebook"},
    {"imdb_id": "tt0162222", "title": "A Walk to Remember"},
    {"imdb_id": "tt1253863", "title": "300 Rise of an Empire"},
    {"imdb_id": "tt1535108", "title": "Elysium"},
    {"imdb_id": "tt0770828", "title": "Man Of Steel"},
    {"imdb_id": "tt1981115", "title": "Thor: The Dark World"},
    {"imdb_id": "tt1430132", "title": "The Wolverine"},
    {"imdb_id": "tt2334879", "title": "White House Down"},
    {"imdb_id": "tt1930294", "title": "Black Rock"},
    {"imdb_id": "tt1408101", "title": "Star Trek Into Darkness"},
    {"imdb_id": "tt0816711", "title": "World War Z"},
    {"imdb_id": "tt0796366", "title": "Star Trek"},
    {"imdb_id": "tt2320388", "title": "Hidden in the Woods"},
    {"imdb_id": "tt1790809", "title": "Pirates of the Caribbean: Dead Men Tell No Tales"},
    {"imdb_id": "tt2446980", "title": "Joy"},
    {"imdb_id": "tt1691916", "title": "Before I Fall"},
    {"imdb_id": "tt0451279", "title": "Wonder Woman"},
    {"imdb_id": "tt1496025", "title": "Underworld Awakening"},
    {"imdb_id": "tt1211837", "title": "Doctor Strange"},
    {"imdb_id": "tt0993846", "title": "Hanna"},
    {"imdb_id": "tt4172430", "title": "Teenage Mutant Ninja Turtles: Out of the Shadows"},
    {"imdb_id": "tt2315152", "title": "Wolves"},
    {"imdb_id": "tt1620986", "title": "The Host"},
    {"imdb_id": "tt1259521", "title": "Conan the Barbarian"},
    {"imdb_id": "tt3893856", "title": "Untitled Horror Film"},
    {"imdb_id": "tt4003204", "title": "Abattoir"},
    {"imdb_id": "tt1667729", "title": "The Mortal Instruments: City of Bones"},
    {"imdb_id": "tt0111161", "title": "The Shawshank Redemption"},
    {"imdb_id": "tt0068646", "title": "The Godfather"},
    {"imdb_id": "tt0071562", "title": "The Godfather Part II"},
    {"imdb_id": "tt0110912", "title": "Pulp Fiction"},
    {"imdb_id": "tt1375666", "title": "Inception"},
    {"imdb_id": "tt1345836", "title": "The Dark Knight"},
    {"imdb_id": "tt0468569", "title": "The Dark Knight Rises"},
    {"imdb_id": "tt0816342", "title": "The Wolf of Wall Street"},
    {"imdb_id": "tt1979320", "title": "Mad Max: Fury Road"},
    {"imdb_id": "tt0167260", "title": "The Lord of the Rings: The Return of the King"},
    {"imdb_id": "tt0848228", "title": "The Avengers"},
    {"imdb_id": "tt0316654", "title": "Memento"},
    {"imdb_id": "tt1631867", "title": "Dunkirk"},
    {"imdb_id": "tt2488496", "title": "Star Wars: The Force Awakens"},
    {"imdb_id": "tt3748528", "title": "Captain America: Civil War"},
    {"imdb_id": "tt1596220", "title": "John Wick"},
    {"imdb_id": "tt1825683", "title": "Deadpool"},
    {"imdb_id": "tt3783958", "title": "Logan"},
    {"imdb_id": "tt5013056", "title": "Avengers: Infinity War"},
    {"imdb_id": "tt4154756", "title": "Avengers: Endgame"},
    {"imdb_id": "tt2911666", "title": "Aquaman"},
    {"imdb_id": "tt7957496", "title": "Joker"},
    {"imdb_id": "tt1302006", "title": "The Irishman"},
    {"imdb_id": "tt0038650", "title": "It's a Wonderful Life"},
    {"imdb_id": "tt0047296", "title": "Singin' in the Rain"},
    {"imdb_id": "tt0045152", "title": "12 Angry Men"},
    {"imdb_id": "tt0169547", "title": "American Beauty"},
    {"imdb_id": "tt0111495", "title": "Schindler's List"},
    {"imdb_id": "tt0051201", "title": "7 Samurai"},
    {"imdb_id": "tt0050083", "title": "Sunset Boulevard"},
    {"imdb_id": "tt0055630", "title": "Lawrence of Arabia"},
    {"imdb_id": "tt0047018", "title": "Some Like It Hot"},
    {"imdb_id": "tt0062622", "title": "2001: A Space Odyssey"},
    {"imdb_id": "tt0070047", "title": "Jaws"},
    {"imdb_id": "tt0086331", "title": "The Breakfast Club"},
    {"imdb_id": "tt0108122", "title": "Braveheart"},
    {"imdb_id": "tt0944947", "title": "Game of Thrones"},
    {"imdb_id": "tt0903747", "title": "Breaking Bad"},
    {"imdb_id": "tt1405406", "title": "Sherlock"},
    {"imdb_id": "tt0898266", "title": "The Office"},
    {"imdb_id": "tt0386676", "title": "The Office (UK)"},
    {"imdb_id": "tt0944361", "title": "True Detective"},
    {"imdb_id": "tt2371591", "title": "Westworld"},
    {"imdb_id": "tt4574334", "title": "The Crown"},
    {"imdb_id": "tt3749900", "title": "Stranger Things"},
    {"imdb_id": "tt5180504", "title": "The Witcher"},
    {"imdb_id": "tt7016936", "title": "Chernobyl"},
    {"imdb_id": "tt12325282", "title": "The Last of Us"},
    {"imdb_id": "tt0072890", "title": "Dog Day Afternoon"},
    {"imdb_id": "tt0091251", "title": "The Fly"},
    {"imdb_id": "tt0111257", "title": "Speed"},
    {"imdb_id": "tt0325980", "title": "Pirates of the Caribbean: The Curse of the Black Pearl"},
    {"imdb_id": "tt0383574", "title": "Pirates of the Caribbean: Dead Man's Chest"},
    {"imdb_id": "tt0449088", "title": "Pirates of the Caribbean: At World's End"},
    {"imdb_id": "tt1298650", "title": "Pirates of the Caribbean: On Stranger Tides"},
    {"imdb_id": "tt0088247", "title": "The Terminator"},
    {"imdb_id": "tt0100405", "title": "Total Recall"},
    {"imdb_id": "tt0093870", "title": "RoboCop"},
    {"imdb_id": "tt0031381", "title": "Gone with the Wind"},
    {"imdb_id": "tt0042192", "title": "All About Eve"},
    {"imdb_id": "tt0043014", "title": "Sunset Blvd."},
    {"imdb_id": "tt0053604", "title": "The Apartment"},
    {"imdb_id": "tt0056172", "title": "Lawrence of Arabia"},
    {"imdb_id": "tt0057012", "title": "Dr. Strangelove"},
    {"imdb_id": "tt0058331", "title": "The Sound of Music"},
    {"imdb_id": "tt0061512", "title": "The Graduate"},
    {"imdb_id": "tt0067672", "title": "The French Connection"},
    {"imdb_id": "tt0070608", "title": "The Exorcist"},
    {"imdb_id": "tt0071615", "title": "The Sting"},
    {"imdb_id": "tt0073486", "title": "One Flew Over the Cuckoo's Nest"},
    {"imdb_id": "tt0075148", "title": "Rocky"},
    {"imdb_id": "tt0075686", "title": "Annie Hall"},
    {"imdb_id": "tt0077416", "title": "The Deer Hunter"},
    {"imdb_id": "tt0079470", "title": "Kramer vs. Kramer"},
    {"imdb_id": "tt0080339", "title": "Airplane!"},
    {"imdb_id": "tt0081398", "title": "Raging Bull"},
    {"imdb_id": "tt0082340", "title": "E.T. the Extra-Terrestrial"},
    {"imdb_id": "tt0083987", "title": "Gandhi"},
    {"imdb_id": "tt0086879", "title": "Amadeus"},
    {"imdb_id": "tt0091763", "title": "Platoon"},
    {"imdb_id": "tt0093177", "title": "The Last Emperor"},
    {"imdb_id": "tt0095953", "title": "Rain Man"},
    {"imdb_id": "tt0099348", "title": "Dances with Wolves"},
    {"imdb_id": "tt0102536", "title": "Unforgiven"},
    {"imdb_id": "tt0109040", "title": "Ace Ventura: Pet Detective"},
    {"imdb_id": "tt0112462", "title": "Braveheart"},
    {"imdb_id": "tt0116282", "title": "Fargo"},
    {"imdb_id": "tt0116922", "title": "The English Patient"},
    {"imdb_id": "tt0120338", "title": "Titanic"},
    {"imdb_id": "tt0120601", "title": "Shakespeare in Love"},
    {"imdb_id": "tt0209144", "title": "Memento"},
    {"imdb_id": "tt0211915", "title": "Amélie"},
    {"imdb_id": "tt0241527", "title": "Harry Potter and the Sorcerer's Stone"},
    {"imdb_id": "tt0253686", "title": "A Beautiful Mind"},
    {"imdb_id": "tt0266543", "title": "The Others"},
]

# Genre mapping (TMDB genres to your custom genres)
genre_mapping = {
    28: {"genre_id": 7, "genre_name": "Action"},
    12: {"genre_id": 13, "genre_name": "Adventure"},
    16: {"genre_id": 1, "genre_name": "Comedy"},
    18: {"genre_id": 2, "genre_name": "Drama"},
    27: {"genre_id": 10, "genre_name": "Horror"},
    35: {"genre_id": 1, "genre_name": "Comedy"},
    80: {"genre_id": 9, "genre_name": "Crime"},
    99: {"genre_id": 20, "genre_name": "Biography"},
    878: {"genre_id": 6, "genre_name": "Sci-Fi"},
    10749: {"genre_id": 11, "genre_name": "Romance"},
    53: {"genre_id": 5, "genre_name": "Thriller"},
    37: {"genre_id": 3, "genre_name": "Western"},
    9648: {"genre_id": 8, "genre_name": "Mystery"},
    14: {"genre_id": 4, "genre_name": "Fantasy"},
    36: {"genre_id": 14, "genre_name": "Historical"},
    10752: {"genre_id": 18, "genre_name": "War"},
    10751: {"genre_id": 12, "genre_name": "Family"},
    10402: {"genre_id": 19, "genre_name": "Musical"},
}

def get_ranking(vote_average):
    """Determine ranking based on TMDB vote average"""
    if vote_average >= 8.0:
        return {"ranking_value": 1, "ranking_name": "Excellent"}
    elif vote_average >= 7.0:
        return {"ranking_value": 2, "ranking_name": "Good"}
    elif vote_average >= 6.0:
        return {"ranking_value": 3, "ranking_name": "Okay"}
    else:
        return {"ranking_value": 4, "ranking_name": "Bad"}

def search_movie_by_imdb_id(imdb_id):
    """Search for a movie using IMDb ID"""
    url = f"{BASE_URL}/find/{imdb_id}"
    params = {
        "api_key": TMDB_API_KEY,
        "external_source": "imdb_id"
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if data.get("movie_results"):
            return data["movie_results"][0]
        return None
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Error searching: {e}")
        return None

def get_movie_details(movie_id):
    """Get detailed movie information from TMDB"""
    url = f"{BASE_URL}/movie/{movie_id}"
    params = {"api_key": TMDB_API_KEY}
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Error getting details: {e}")
        return None

def build_complete_movie_data(movie_info):
    """Build complete movie data with all required fields"""
    if not movie_info:
        return None
    
    poster_path = movie_info.get("poster_path")
    full_poster_url = f"{IMAGE_BASE_URL}{poster_path}" if poster_path else None
    
    # Map genres
    genres = []
    for genre in movie_info.get("genres", []):
        tmdb_genre_id = genre.get("id")
        if tmdb_genre_id in genre_mapping:
            genre_obj = genre_mapping[tmdb_genre_id]
            # Add if not already in list
            if not any(g["genre_id"] == genre_obj["genre_id"] for g in genres):
                genres.append(genre_obj)
    
    # Add additional genres based on custom rules
    vote_avg = movie_info.get("vote_average", 0)
    overview = movie_info.get("overview", "").lower()
    title = movie_info.get("title", "").lower()
    
    # Get ranking based on vote average
    ranking = get_ranking(vote_avg)
    
    return {
        "imdb_id": movie_info.get("imdb_id", ""),
        "title": movie_info.get("title", ""),
        "poster_path": full_poster_url,
        "genre": genres if genres else [{"genre_id": 0, "genre_name": "Unknown"}],
        "ranking": ranking
    }

def fetch_all_movies():
    """Fetch all 150 movies data"""
    complete_movies = []
    total = len(movies_data)
    failed_movies = []
    
    print(f"\n{'='*70}")
    print(f"🎬 TMDB Movie Data Fetcher - 150 Movies")
    print(f"{'='*70}\n")
    
    for index, movie in enumerate(movies_data, 1):
        imdb_id = movie['imdb_id']
        title = movie['title']
        
        progress = f"[{index:3d}/{total}]"
        print(f"{progress} Fetching: {title:<50}", end=" ", flush=True)
        
        # Search by IMDb ID
        movie_result = search_movie_by_imdb_id(imdb_id)
        
        if movie_result:
            movie_id = movie_result.get("id")
            # Get full details
            details = get_movie_details(movie_id)
            
            if details:
                complete_data = build_complete_movie_data(details)
                
                if complete_data:
                    complete_movies.append(complete_data)
                    print("✓")
                else:
                    print("✗ Build failed")
                    failed_movies.append({"title": title, "reason": "Build failed"})
            else:
                print("✗ Details failed")
                failed_movies.append({"title": title, "reason": "Get details failed"})
        else:
            print("✗ Not found")
            failed_movies.append({"title": title, "reason": "Movie not found"})
        
        # Rate limiting - be respectful to TMDB API
        time.sleep(0.25)
    
    return complete_movies, failed_movies

def save_to_json(movies, filename="movies_150_complete.json"):
    """Save the complete movie data to JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(movies, f, indent=4, ensure_ascii=False)
    print(f"\n✓ Successfully saved {len(movies)} movies to '{filename}'")

def main():
    print("\n" + "="*70)
    print("🎬 TMDB Movie Data Fetcher for 150 Movies")
    print("="*70)
    
    # Verify API key
    if TMDB_API_KEY == "YOUR_TMDB_API_KEY_HERE":
        print("\n❌ ERROR: Please replace 'YOUR_TMDB_API_KEY_HERE' with your actual TMDB API key")
        print("\n📌 How to get your API key:")
        print("   1. Go to: https://www.themoviedb.org/settings/api")
        print("   2. Sign up for a free account (if you don't have one)")
        print("   3. Accept the terms")
        print("   4. Generate your API key")
        print("   5. Replace 'YOUR_TMDB_API_KEY_HERE' with your actual key")
        return
    
    print(f"\n✓ API Key configured")
    print(f"✓ Total movies to fetch: {len(movies_data)}")
    print(f"\n⏳ This may take a few minutes... (approx. {len(movies_data) * 0.25 / 60:.1f} minutes)")
    print("-" * 70)
    
    # Fetch all movies
    movies, failed = fetch_all_movies()
    
    print("\n" + "="*70)
    print(f"✓ Fetched {len(movies)} out of {len(movies_data)} movies")
    
    if failed:
        print(f"\n⚠️  Failed to fetch {len(failed)} movies:")
        for fail in failed[:10]:  # Show first 10
            print(f"   - {fail['title']}: {fail['reason']}")
        if len(failed) > 10:
            print(f"   ... and {len(failed) - 10} more")
    
    print("="*70)
    
    # Save to JSON
    if movies:
        save_to_json(movies)
        print(f"\n✅ Your JSON file is ready with real TMDB poster URLs!")
        print(f"📁 File location: movies_150_complete.json")
        print(f"📊 Total movies with data: {len(movies)}")
    else:
        print(f"\n❌ No movies were fetched. Please check your API key and internet connection.")

if __name__ == "__main__":
    main()
