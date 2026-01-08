import requests
import json
import time
from typing import List, Dict, Optional

# Configuration
TMDB_API_KEY = "0d78ba5147c37c7b960cb5c3665019f7"  # Replace with your actual API key
BASE_URL = "https://api.themoviedb.org/3"
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"

# All 509 movies data
movies_data = [
    {"imdb_id": "tt0068646", "title": "The Godfather"},
    {"imdb_id": "tt0110912", "title": "Pulp Fiction"},
    {"imdb_id": "tt0111161", "title": "The Shawshank Redemption"},
    {"imdb_id": "tt0108052", "title": "Schindler's List"},
    {"imdb_id": "tt0050083", "title": "12 Angry Men"},
    {"imdb_id": "tt0468569", "title": "The Dark Knight"},
    {"imdb_id": "tt1375666", "title": "Inception"},
    {"imdb_id": "tt0047478", "title": "Seven Samurai"},
    {"imdb_id": "tt6751668", "title": "Parasite"},
    {"imdb_id": "tt0317248", "title": "City of God"},
    {"imdb_id": "tt0245429", "title": "Spirited Away"},
    {"imdb_id": "tt0167260", "title": "The Lord of the Rings: The Return of the King"},
    {"imdb_id": "tt1386697", "title": "Suicide Squad"},
    {"imdb_id": "tt5697572", "title": "Cats"},
    {"imdb_id": "tt0054215", "title": "Psycho"},
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
    {"imdb_id": "tt0046912", "title": "Dial M for Murder"},
    {"imdb_id": "tt0109506", "title": "Speed"},
    {"imdb_id": "tt0087332", "title": "Ghostbusters"},
    {"imdb_id": "tt0105236", "title": "Reservoir Dogs"},
    {"imdb_id": "tt0112864", "title": "Die Hard with a Vengeance"},
    {"imdb_id": "tt0095016", "title": "Die Hard"},
    {"imdb_id": "tt0078723", "title": "Apocalypse Now"},
    {"imdb_id": "tt0074156", "title": "Taxi Driver"},
    {"imdb_id": "tt0097576", "title": "Indiana Jones and the Last Crusade"},
    {"imdb_id": "tt0101414", "title": "Beauty and the Beast"},
    {"imdb_id": "tt0110357", "title": "The Lion King"},
    {"imdb_id": "tt0114709", "title": "Toy Story"},
    {"imdb_id": "tt0120363", "title": "Toy Story 2"},
    {"imdb_id": "tt0435761", "title": "Toy Story 3"},
    {"imdb_id": "tt1979376", "title": "Toy Story 4"},
    {"imdb_id": "tt0109128", "title": "The Mask"},
    {"imdb_id": "tt0033467", "title": "Citizen Kane"},
    {"imdb_id": "tt0052357", "title": "Vertigo"},
    {"imdb_id": "tt0089881", "title": "The Color Purple"},
    {"imdb_id": "tt0062622", "title": "2001: A Space Odyssey"},
    {"imdb_id": "tt0093779", "title": "The Princess Bride"},
    {"imdb_id": "tt0084726", "title": "Star Trek II: The Wrath of Khan"},
    {"imdb_id": "tt0092007", "title": "Star Trek IV: The Voyage Home"},
    {"imdb_id": "tt0106519", "title": "The Nightmare Before Christmas"},
    {"imdb_id": "tt0118661", "title": "The Big Lebowski"},
    {"imdb_id": "tt0119177", "title": "Gattaca"},
    {"imdb_id": "tt0120915", "title": "Star Wars: Episode I - The Phantom Menace"},
    {"imdb_id": "tt0121766", "title": "Star Wars: Episode III - Revenge of the Sith"},
    {"imdb_id": "tt0121765", "title": "Star Wars: Episode II - Attack of the Clones"},
    {"imdb_id": "tt2488496", "title": "Star Wars: The Force Awakens"},
    {"imdb_id": "tt2527336", "title": "Star Wars: The Last Jedi"},
    {"imdb_id": "tt2527338", "title": "Star Wars: The Rise of Skywalker"},
    {"imdb_id": "tt0082096", "title": "Das Boot"},
    {"imdb_id": "tt0065392", "title": "Butch Cassidy and the Sundance Kid"},
    {"imdb_id": "tt0068300", "title": "A Fistful of Dynamite"},
    {"imdb_id": "tt0059243", "title": "For a Few Dollars More"},
    {"imdb_id": "tt0058150", "title": "A Fistful of Dollars"},
    {"imdb_id": "tt0332280", "title": "The Notebook"},
    {"imdb_id": "tt0162222", "title": "A Walk to Remember"},
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
    {"imdb_id": "tt0169547", "title": "American Beauty"},
    {"imdb_id": "tt0209144", "title": "Memento"},
    {"imdb_id": "tt0211915", "title": "Amélie"},
    {"imdb_id": "tt0241527", "title": "Harry Potter and the Sorcerer's Stone"},
    {"imdb_id": "tt0253686", "title": "A Beautiful Mind"},
    {"imdb_id": "tt0266543", "title": "The Others"},
    {"imdb_id": "tt0266697", "title": "Kill Bill: Vol. 1"},
    {"imdb_id": "tt0378194", "title": "Kill Bill: Vol. 2"},
    {"imdb_id": "tt0292506", "title": "The Bourne Identity"},
    {"imdb_id": "tt0372183", "title": "The Bourne Supremacy"},
    {"imdb_id": "tt0440963", "title": "The Bourne Ultimatum"},
    {"imdb_id": "tt0304141", "title": "Harry Potter and the Prisoner of Azkaban"},
    {"imdb_id": "tt0317705", "title": "The Incredibles"},
    {"imdb_id": "tt0361748", "title": "Inglourious Basterds"},
    {"imdb_id": "tt0363771", "title": "The Chronicles of Narnia: The Lion, the Witch and the Wardrobe"},
    {"imdb_id": "tt0364569", "title": "Oldboy"},
    {"imdb_id": "tt0367594", "title": "Charlie and the Chocolate Factory"},
    {"imdb_id": "tt0371746", "title": "Iron Man"},
    {"imdb_id": "tt0372784", "title": "Batman Begins"},
    {"imdb_id": "tt0386064", "title": "The Hunger Games"},
    {"imdb_id": "tt0398286", "title": "Tangled"},
    {"imdb_id": "tt0405094", "title": "The Lives of Others"},
    {"imdb_id": "tt0405159", "title": "Million Dollar Baby"},
    {"imdb_id": "tt0405296", "title": "A Scanner Darkly"},
    {"imdb_id": "tt0413267", "title": "Up"},
    {"imdb_id": "tt0413300", "title": "Spider-Man 2"},
    {"imdb_id": "tt0145487", "title": "Spider-Man"},
    {"imdb_id": "tt0414387", "title": "Pride & Prejudice"},
    {"imdb_id": "tt0434409", "title": "V for Vendetta"},
    {"imdb_id": "tt0443453", "title": "Borat"},
    {"imdb_id": "tt0446029", "title": "Scott Pilgrim vs. the World"},
    {"imdb_id": "tt0448115", "title": "Shazam!"},
    {"imdb_id": "tt0451279", "title": "Wonder Woman"},
    {"imdb_id": "tt0452694", "title": "Superbad"},
    {"imdb_id": "tt0453562", "title": "No Country for Old Men"},
    {"imdb_id": "tt0454876", "title": "Life of Pi"},
    {"imdb_id": "tt0457430", "title": "Pan's Labyrinth"},
    {"imdb_id": "tt0458339", "title": "Captain America: The First Avenger"},
    {"imdb_id": "tt0463998", "title": "The Social Network"},
    {"imdb_id": "tt0469494", "title": "There Will Be Blood"},
    {"imdb_id": "tt0475290", "title": "WALL·E"},
    {"imdb_id": "tt0478970", "title": "Ant-Man"},
    {"imdb_id": "tt0480249", "title": "I Am Legend"},
    {"imdb_id": "tt0490215", "title": "The Girl with the Dragon Tattoo"},
    {"imdb_id": "tt0499549", "title": "Avatar"},
    {"imdb_id": "tt0758758", "title": "Into the Wild"},
    {"imdb_id": "tt0770828", "title": "Man of Steel"},
    {"imdb_id": "tt0780653", "title": "The Dragon Pearl"},
    {"imdb_id": "tt0790636", "title": "Dallas Buyers Club"},
    {"imdb_id": "tt0790736", "title": "Wall Street: Money Never Sleeps"},
    {"imdb_id": "tt0800080", "title": "The Incredible Hulk"},
    {"imdb_id": "tt0800369", "title": "Thor"},
    {"imdb_id": "tt0803096", "title": "The Warlords"},
    {"imdb_id": "tt0816711", "title": "World War Z"},
    {"imdb_id": "tt0848228", "title": "The Avengers"},
    {"imdb_id": "tt0870984", "title": "Ex Machina"},
    {"imdb_id": "tt0892791", "title": "The Hangover"},
    {"imdb_id": "tt0898266", "title": "The Big Bang Theory (Film version if exists/Series Pilot)"},
    {"imdb_id": "tt0903747", "title": "Breaking Bad (Series Pilot/Film)"},
    {"imdb_id": "tt0910936", "title": "Frozen"},
    {"imdb_id": "tt0910970", "title": "WALL-E"},
    {"imdb_id": "tt0944835", "title": "Salt"},
    {"imdb_id": "tt0944947", "title": "Game of Thrones (Pilot)"},
    {"imdb_id": "tt0947798", "title": "Black Swan"},
    {"imdb_id": "tt0970416", "title": "The Day the Earth Stood Still"},
    {"imdb_id": "tt0974015", "title": "Justice League"},
    {"imdb_id": "tt0978764", "title": "Sucker Punch"},
    {"imdb_id": "tt0993840", "title": "The Army of Crime"},
    {"imdb_id": "tt0993846", "title": "The Wolf of Wall Street"},
    {"imdb_id": "tt1028576", "title": "Great Teacher Onizuka"},
    {"imdb_id": "tt1045772", "title": "I Love You Phillip Morris"},
    {"imdb_id": "tt1049413", "title": "Up in the Air"},
    {"imdb_id": "tt1055369", "title": "Transformers: Revenge of the Fallen"},
    {"imdb_id": "tt1119646", "title": "Brooklyn's Finest"},
    {"imdb_id": "tt1130884", "title": "Shutter Island"},
    {"imdb_id": "tt1133985", "title": "Green Lantern"},
    {"imdb_id": "tt1136608", "title": "District 9"},
    {"imdb_id": "tt1170358", "title": "The Hobbit: The Desolation of Smaug"},
    {"imdb_id": "tt1179933", "title": "10 Cloverfield Lane"},
    {"imdb_id": "tt1182345", "title": "Moon"},
    {"imdb_id": "tt1187043", "title": "3 Idiots"},
    {"imdb_id": "tt1190539", "title": "X-Men: First Class"},
    {"imdb_id": "tt1201607", "title": "Harry Potter and the Deathly Hallows: Part 2"},
    {"imdb_id": "tt1210166", "title": "Moneyball"},
    {"imdb_id": "tt1211837", "title": "Source Code"},
    {"imdb_id": "tt1216475", "title": "Cars 2"},
    {"imdb_id": "tt1216491", "title": "Monsters University"},
    {"imdb_id": "tt1228705", "title": "Iron Man 2"},
    {"imdb_id": "tt1229340", "title": "Anchorman 2: The Legend Continues"},
    {"imdb_id": "tt1232829", "title": "21 Jump Street"},
    {"imdb_id": "tt1242460", "title": "We Need to Talk About Kevin"},
    {"imdb_id": "tt1245526", "title": "Red"},
    {"imdb_id": "tt1253863", "title": "300: Rise of an Empire"},
    {"imdb_id": "tt1255953", "title": "Incendies"},
    {"imdb_id": "tt1258197", "title": "The Town"},
    {"imdb_id": "tt1259528", "title": "The King's Speech"},
    {"imdb_id": "tt1270797", "title": "Venome"},
    {"imdb_id": "tt1270798", "title": "Venom"},
    {"imdb_id": "tt1272878", "title": "2012"},
    {"imdb_id": "tt1276104", "title": "Looper"},
    {"imdb_id": "tt1285016", "title": "The Social Network"},
    {"imdb_id": "tt1289401", "title": "Ghost Rider: Spirit of Vengeance"},
    {"imdb_id": "tt1291584", "title": "Warrior"},
    {"imdb_id": "tt1293847", "title": "The Expendables"},
    {"imdb_id": "tt1300854", "title": "Iron Man 3"},
    {"imdb_id": "tt1302006", "title": "The Irishman"},
    {"imdb_id": "tt1302011", "title": "The Hobbit: An Unexpected Journey"},
    {"imdb_id": "tt1305591", "title": "Hercules"},
    {"imdb_id": "tt1316695", "title": "The Twilight Saga: New Moon"},
    {"imdb_id": "tt1320253", "title": "The Expendables 2"},
    {"imdb_id": "tt1324999", "title": "The Twilight Saga: Breaking Dawn - Part 1"},
    {"imdb_id": "tt1325004", "title": "The Twilight Saga: Eclipse"},
    {"imdb_id": "tt1333125", "title": "The Great Gatsby"},
    {"imdb_id": "tt1335975", "title": "Gravity"},
    {"imdb_id": "tt1340138", "title": "Star Trek"},
    {"imdb_id": "tt1341325", "title": "The Hangover Part II"},
    {"imdb_id": "tt1343092", "title": "The Great Gatsby"},
    {"imdb_id": "tt1343727", "title": "The Queen's Gambit"},
    {"imdb_id": "tt1344203", "title": "Man on a Ledge"},
    {"imdb_id": "tt1355644", "title": "Prisoners"},
    {"imdb_id": "tt1361056", "title": "The Hunger Games: Catching Fire"},
    {"imdb_id": "tt1365519", "title": "The Hobbit: The Battle of the Five Armies"},
    {"imdb_id": "tt1371111", "title": "Cloud Atlas"},
    {"imdb_id": "tt1374989", "title": "The Lego Movie"},
    {"imdb_id": "tt1390411", "title": "The Girl Who Played with Fire"},
    {"imdb_id": "tt1392170", "title": "The Hunger Games"},
    {"imdb_id": "tt1392190", "title": "Mad Max: Fury Road"},
    {"imdb_id": "tt1392214", "title": "Prisoners"},
    {"imdb_id": "tt1396484", "title": "It"},
    {"imdb_id": "tt1403865", "title": "Now You See Me"},
    {"imdb_id": "tt1408101", "title": "Star Trek Into Darkness"},
    {"imdb_id": "tt1409024", "title": "The Rental"},
    {"imdb_id": "tt1411238", "title": "The Avengers: Age of Ultron"},
    {"imdb_id": "tt1411697", "title": "Kick-Ass"},
    {"imdb_id": "tt1420622", "title": "The Hunger Games: Mockingjay - Part 1"},
    {"imdb_id": "tt1430132", "title": "The Wolverine"},
    {"imdb_id": "tt1430626", "title": "Pirates of the Caribbean: Dead Men Tell No Tales"},
    {"imdb_id": "tt1431045", "title": "Deadpool"},
    {"imdb_id": "tt1438259", "title": "Moonrise Kingdom"},
    {"imdb_id": "tt1440129", "title": "The Twilight Saga: Breaking Dawn - Part 2"},
    {"imdb_id": "tt1441953", "title": "American Hustle"},
    {"imdb_id": "tt1442449", "title": "The Smurfs"},
    {"imdb_id": "tt1454029", "title": "The Paperboy"},
    {"imdb_id": "tt1454468", "title": "Gravity"},
    {"imdb_id": "tt1464335", "title": "X-Men: Days of Future Past"},
    {"imdb_id": "tt1465522", "title": "The Jungle Book"},
    {"imdb_id": "tt1469304", "title": "Baywatch"},
    {"imdb_id": "tt1473832", "title": "The Dictator"},
    {"imdb_id": "tt1475582", "title": "Sherlock Holmes: A Game of Shadows"},
    {"imdb_id": "tt1477855", "title": "The Amazing Spider-Man"},
    {"imdb_id": "tt1482459", "title": "The Secret Life of Walter Mitty"},
    {"imdb_id": "tt1483013", "title": "Oblivion"},
    {"imdb_id": "tt1485796", "title": "Big Hero 6"},
    {"imdb_id": "tt1486217", "title": "The Girl with the Dragon Tattoo (US)"},
    {"imdb_id": "tt1488606", "title": "The Three Musketeers"},
    {"imdb_id": "tt1490017", "title": "The Lego Movie"},
    {"imdb_id": "tt1494859", "title": "The Perks of Being a Wallflower"},
    {"imdb_id": "tt1502397", "title": "Bad Teacher"},
    {"imdb_id": "tt1502712", "title": "Fantastic Four"},
    {"imdb_id": "tt1504320", "title": "The King's Speech"},
    {"imdb_id": "tt1515091", "title": "Sherlock Holmes"},
    {"imdb_id": "tt1517268", "title": "Barbie"},
    {"imdb_id": "tt1527186", "title": "Melancholia"},
    {"imdb_id": "tt1528100", "title": "Tower Heist"},
    {"imdb_id": "tt1535108", "title": "Elysium"},
    {"imdb_id": "tt1535109", "title": "Captain Phillips"},
    {"imdb_id": "tt1540133", "title": "The Lorax"},
    {"imdb_id": "tt1542344", "title": "12 Years a Slave"},
    {"imdb_id": "tt1549572", "title": "Real Steel"},
    {"imdb_id": "tt1559547", "title": "Ex Machina"},
    {"imdb_id": "tt1560139", "title": "The Impossible"},
    {"imdb_id": "tt1560220", "title": "Drive"},
    {"imdb_id": "tt1563738", "title": "One Day"},
    {"imdb_id": "tt1564349", "title": "Rise of the Planet of the Apes"},
    {"imdb_id": "tt1568346", "title": "The Hangover Part II"},
    {"imdb_id": "tt1569923", "title": "Her"},
    {"imdb_id": "tt1570728", "title": "Crazy, Stupid, Love."},
    {"imdb_id": "tt1571249", "title": "A Separation"},
    {"imdb_id": "tt1583421", "title": "The Artist"},
    {"imdb_id": "tt1587310", "title": "The Avengers"},
    {"imdb_id": "tt1588173", "title": "Warm Bodies"},
    {"imdb_id": "tt1591095", "title": "Insidious"},
    {"imdb_id": "tt1596343", "title": "Fast Five"},
    {"imdb_id": "tt1596363", "title": "The Big Short"},
    {"imdb_id": "tt1598778", "title": "Contagion"},
    {"imdb_id": "tt1600196", "title": "Pitch Perfect"},
    {"imdb_id": "tt1601913", "title": "Top Gun: Maverick"},
    {"imdb_id": "tt1602620", "title": "The Intouchables"},
    {"imdb_id": "tt1605783", "title": "Lawless"},
    {"imdb_id": "tt1606375", "title": "Argo"},
    {"imdb_id": "tt1606378", "title": "Parkland"},
    {"imdb_id": "tt1611224", "title": "Abraham Lincoln: Vampire Hunter"},
    {"imdb_id": "tt1612774", "title": "Jack the Giant Slayer"},
    {"imdb_id": "tt1616195", "title": "The Great Wall"},
    {"imdb_id": "tt1617661", "title": "Trouble with the Curve"},
    {"imdb_id": "tt1621039", "title": "Horrible Bosses"},
    {"imdb_id": "tt1622979", "title": "Prometheus"},
    {"imdb_id": "tt1625346", "title": "Focus"},
    {"imdb_id": "tt1631867", "title": "Edge of Tomorrow"},
    {"imdb_id": "tt1632547", "title": "The Purge"},
    {"imdb_id": "tt1634122", "title": "The Woman in Black"},
    {"imdb_id": "tt1637688", "title": "In Time"},
    {"imdb_id": "tt1638355", "title": "The Man from U.N.C.L.E."},
    {"imdb_id": "tt1640718", "title": "Percy Jackson: Sea of Monsters"},
    {"imdb_id": "tt1646971", "title": "The Dictator"},
    {"imdb_id": "tt1648190", "title": "Dark Shadows"},
    {"imdb_id": "tt1650062", "title": "Super 8"},
    {"imdb_id": "tt1655442", "title": "The Grey"},
    {"imdb_id": "tt1657507", "title": "Godzilla"},
    {"imdb_id": "tt1659337", "title": "The Imitation Game"},
    {"imdb_id": "tt1661199", "title": "Cinderella"},
    {"imdb_id": "tt1663202", "title": "The Revenant"},
    {"imdb_id": "tt1663662", "title": "Pacific Rim"},
    {"imdb_id": "tt1670345", "title": "Now You See Me"},
    {"imdb_id": "tt1673434", "title": "The Vow"},
    {"imdb_id": "tt1674771", "title": "Room"},
    {"imdb_id": "tt1677720", "title": "Ready Player One"},
    {"imdb_id": "tt1682180", "title": "The Conjuring"},
    {"imdb_id": "tt1690953", "title": "Creep"},
    {"imdb_id": "tt1690984", "title": "Despicable Me 2"},
    {"imdb_id": "tt1691920", "title": "The Hobbit: An Unexpected Journey"},
    {"imdb_id": "tt1692489", "title": "The Grand Budapest Hotel"},
    {"imdb_id": "tt1692861", "title": "A Good Day to Die Hard"},
    {"imdb_id": "tt1695360", "title": "Ted"},
    {"imdb_id": "tt1700841", "title": "Coco"},
    {"imdb_id": "tt1703199", "title": "Taken 2"},
    {"imdb_id": "tt1707386", "title": "Les Misérables"},
    {"imdb_id": "tt1711425", "title": "21 Jump Street"},
    {"imdb_id": "tt1714275", "title": "The Hunger Games: Mockingjay - Part 2"},
    {"imdb_id": "tt1723121", "title": "The Croods"},
    {"imdb_id": "tt1723811", "title": "Snow White and the Huntsman"},
    {"imdb_id": "tt1726831", "title": "Lucy"},
    {"imdb_id": "tt1731141", "title": "End of Watch"},
    {"imdb_id": "tt1745960", "title": "Top Gun: Maverick"},
    {"imdb_id": "tt1748122", "title": "Moonrise Kingdom"},
    {"imdb_id": "tt1756545", "title": "The Conjuring 2"},
    {"imdb_id": "tt1764651", "title": "The Expendables 2"},
    {"imdb_id": "tt1790809", "title": "Snowpiercer"},
    {"imdb_id": "tt1790864", "title": "The Maze Runner"},
    {"imdb_id": "tt1790885", "title": "Flight"},
    {"imdb_id": "tt1791528", "title": "Incredibles 2"},
    {"imdb_id": "tt1798632", "title": "Birdman"},
    {"imdb_id": "tt1798709", "title": "Her"},
    {"imdb_id": "tt1800241", "title": "American Hustle"},
    {"imdb_id": "tt1800376", "title": "Spotlight"},
    {"imdb_id": "tt1825683", "title": "Black Panther"},
    {"imdb_id": "tt1837562", "title": "Inside Out"},
    {"imdb_id": "tt1837703", "title": "Elysium"},
    {"imdb_id": "tt1838556", "title": "Inside Llewyn Davis"},
    {"imdb_id": "tt1839578", "title": "Person of Interest (Pilot)"},
    {"imdb_id": "tt1840309", "title": "Silicon Valley (Pilot)"},
    {"imdb_id": "tt1843866", "title": "Captain America: The Winter Soldier"},
    {"imdb_id": "tt1844624", "title": "American Horror Story (Pilot)"},
    {"imdb_id": "tt1846960", "title": "Zootopia"},
    {"imdb_id": "tt1853728", "title": "Django Unchained"},
    {"imdb_id": "tt1854564", "title": "The Cabin in the Woods"},
    {"imdb_id": "tt1855199", "title": "Bloodshot"},
    {"imdb_id": "tt1856010", "title": "House of Cards (Pilot)"},
    {"imdb_id": "tt1856101", "title": "Blade Runner 2049"},
    {"imdb_id": "tt1860213", "title": "Frozen"},
    {"imdb_id": "tt1865505", "title": "Free Guy"},
    {"imdb_id": "tt1872181", "title": "The Amazing Spider-Man 2"},
    {"imdb_id": "tt1877830", "title": "The Batman"},
    {"imdb_id": "tt1895587", "title": "Spotlight"},
    {"imdb_id": "tt1905041", "title": "Fast & Furious 6"},
    {"imdb_id": "tt1924429", "title": "The Secret Life of Pets"},
    {"imdb_id": "tt1935156", "title": "The Croods"},
    {"imdb_id": "tt1951261", "title": "Minions"},
    {"imdb_id": "tt1951264", "title": "The Hunger Games: Catching Fire"},
    {"imdb_id": "tt1951265", "title": "The Hunger Games: Mockingjay - Part 1"},
    {"imdb_id": "tt1951266", "title": "The Hunger Games: Mockingjay - Part 2"},
    {"imdb_id": "tt1959490", "title": "Noah"},
    {"imdb_id": "tt1972591", "title": "Ted"},
    {"imdb_id": "tt1974419", "title": "About Time"},
    {"imdb_id": "tt1979320", "title": "Rush"},
    {"imdb_id": "tt1981115", "title": "Thor: The Dark World"},
    {"imdb_id": "tt1985949", "title": "Spectre"},
    {"imdb_id": "tt2002718", "title": "Shadow and Bone (Pilot)"},
    {"imdb_id": "tt2005374", "title": "The Fault in Our Stars"},
    {"imdb_id": "tt2015381", "title": "Guardians of the Galaxy"},
    {"imdb_id": "tt2017038", "title": "Furious 7"},
    {"imdb_id": "tt2024544", "title": "12 Years a Slave"},
    {"imdb_id": "tt2034800", "title": "The Great Wall"},
    {"imdb_id": "tt2044801", "title": "Arrival"},
    {"imdb_id": "tt2062566", "title": "Ted 2"},
    {"imdb_id": "tt2071491", "title": "The Transporter Refueled"},
    {"imdb_id": "tt2072230", "title": "47 Ronin"},
    {"imdb_id": "tt2076298", "title": "The Jungle Book"},
    {"imdb_id": "tt2080374", "title": "Jack the Giant Slayer"},
    {"imdb_id": "tt2084970", "title": "The Imitation Game"},
    {"imdb_id": "tt2085059", "title": "Black Mirror: Bandersnatch"},
    {"imdb_id": "tt2091478", "title": "The Lego Movie"},
    {"imdb_id": "tt2094766", "title": "White House Down"},
    {"imdb_id": "tt2096673", "title": "Inside Out"},
    {"imdb_id": "tt2103281", "title": "Turbo"},
    {"imdb_id": "tt2106476", "title": "The Hunt"},
    {"imdb_id": "tt2119532", "title": "Hacksaw Ridge"},
    {"imdb_id": "tt2120120", "title": "Maleficent"},
    {"imdb_id": "tt2126355", "title": "The Best of Me"},
    {"imdb_id": "tt2140507", "title": "Kingsman: The Secret Service"},
    {"imdb_id": "tt2170439", "title": "The Maze Runner"},
    {"imdb_id": "tt2179136", "title": "American Sniper"},
    {"imdb_id": "tt2180411", "title": "A Star Is Born"},
    {"imdb_id": "tt2184339", "title": "Passengers"},
    {"imdb_id": "tt2193021", "title": "Arrow (Pilot)"},
    {"imdb_id": "tt2194499", "title": "About Time"},
    {"imdb_id": "tt2199571", "title": "The Runaways"},
    {"imdb_id": "tt2202245", "title": "The Circle"},
    {"imdb_id": "tt2221387", "title": "Hansel & Gretel: Witch Hunters"},
    {"imdb_id": "tt2224026", "title": "Big Hero 6"},
    {"imdb_id": "tt2231461", "title": "Godzilla"},
    {"imdb_id": "tt2234155", "title": "Room"},
    {"imdb_id": "tt2245084", "title": "Big Eyes"},
    {"imdb_id": "tt2250912", "title": "Spider-Man: Homecoming"},
    {"imdb_id": "tt2258858", "title": "The Giver"},
    {"imdb_id": "tt2267998", "title": "Gone Girl"},
    {"imdb_id": "tt2278388", "title": "The Grand Budapest Hotel"},
    {"imdb_id": "tt2278871", "title": "Mr. Robot (Pilot)"},
    {"imdb_id": "tt2283748", "title": "Doctor Strange"},
    {"imdb_id": "tt2293640", "title": "Minions"},
    {"imdb_id": "tt2294629", "title": "Frozen"},
    {"imdb_id": "tt2301451", "title": "Avengers: Age of Ultron"},
    {"imdb_id": "tt2306299", "title": "Vikings (Pilot)"},
    {"imdb_id": "tt2310332", "title": "The Monuments Men"},
    {"imdb_id": "tt2316204", "title": "Interstellar"},
    {"imdb_id": "tt2322441", "title": "Fifty Shades of Grey"},
    {"imdb_id": "tt2333784", "title": "Divergent"},
    {"imdb_id": "tt2338151", "title": "PK"},
    {"imdb_id": "tt2345759", "title": "The Penny Dreadful"},
    {"imdb_id": "tt2358891", "title": "Peaky Blinders (Pilot)"},
    {"imdb_id": "tt2369135", "title": "Need for Speed"},
    {"imdb_id": "tt2379713", "title": "Spectre"},
    {"imdb_id": "tt2380307", "title": "Coco"},
    {"imdb_id": "tt2381249", "title": "Mission: Impossible - Rogue Nation"},
    {"imdb_id": "tt2381941", "title": "Rampage"},
    {"imdb_id": "tt2381991", "title": "Eternity"},
    {"imdb_id": "tt2382320", "title": "No Time to Die"},
    {"imdb_id": "tt2386490", "title": "How to Train Your Dragon 2"},
    {"imdb_id": "tt2387499", "title": "The Witch"},
    {"imdb_id": "tt2395427", "title": "Avengers: Age of Ultron"},
    {"imdb_id": "tt2395429", "title": "The Jungle Book"},
    {"imdb_id": "tt2401256", "title": "The 5th Wave"},
    {"imdb_id": "tt2402101", "title": "The Divergent Series: Insurgent"},
    {"imdb_id": "tt2404435", "title": "The Magnificent Seven"},
    {"imdb_id": "tt2406566", "title": "Transformers: Age of Extinction"},
    {"imdb_id": "tt2446042", "title": "Arrival"},
    {"imdb_id": "tt2452200", "title": "Aloha"},
    {"imdb_id": "tt2463208", "title": "The Giver"},
    {"imdb_id": "tt2473476", "title": "San Andreas"},
    {"imdb_id": "tt2527336", "title": "Star Wars: The Last Jedi"},
]

# Genre mapping
genre_mapping = {
    1: {"genre_id": 1, "genre_name": "Comedy"},
    2: {"genre_id": 2, "genre_name": "Drama"},
    3: {"genre_id": 3, "genre_name": "Western"},
    4: {"genre_id": 4, "genre_name": "Fantasy"},
    5: {"genre_id": 5, "genre_name": "Thriller"},
    6: {"genre_id": 6, "genre_name": "Sci-Fi"},
    7: {"genre_id": 7, "genre_name": "Action"},
    8: {"genre_id": 8, "genre_name": "Mystery"},
    9: {"genre_id": 9, "genre_name": "Crime"},
    10: {"genre_id": 10, "genre_name": "Horror"},
    11: {"genre_id": 11, "genre_name": "Romance"},
    12: {"genre_id": 12, "genre_name": "Family"},
    13: {"genre_id": 13, "genre_name": "Adventure"},
    14: {"genre_id": 14, "genre_name": "Historical"},
    16: {"genre_id": 16, "genre_name": "Musical"},
    17: {"genre_id": 17, "genre_name": "Animation"},
    18: {"genre_id": 18, "genre_name": "War"},
    19: {"genre_id": 19, "genre_name": "Sports"},
    20: {"genre_id": 20, "genre_name": "Biography"},
}

def get_ranking(vote_average: float) -> Dict:
    """Determine ranking based on TMDB vote average"""
    if vote_average >= 8.0:
        return {"ranking_value": 1, "ranking_name": "Excellent"}
    elif vote_average >= 7.0:
        return {"ranking_value": 2, "ranking_name": "Good"}
    elif vote_average >= 6.0:
        return {"ranking_value": 3, "ranking_name": "Okay"}
    elif vote_average >= 5.0:
        return {"ranking_value": 4, "ranking_name": "Bad"}
    else:
        return {"ranking_value": 5, "ranking_name": "Terrible"}

def search_movie_by_imdb_id(imdb_id: str) -> Optional[Dict]:
    """Search for a movie using IMDb ID"""
    url = f"{BASE_URL}/find/{imdb_id}"
    params = {
        "api_key": TMDB_API_KEY,
        "external_source": "imdb_id"
    }
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        if data.get("movie_results"):
            return data["movie_results"][0]
        return None
    except requests.exceptions.RequestException as e:
        return None

def get_movie_details(movie_id: int) -> Optional[Dict]:
    """Get detailed movie information from TMDB"""
    url = f"{BASE_URL}/movie/{movie_id}"
    params = {"api_key": TMDB_API_KEY}
    
    try:
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        return None

def build_complete_movie_data(movie_info: Dict) -> Optional[Dict]:
    """Build complete movie data with all required fields"""
    if not movie_info:
        return None
    
    poster_path = movie_info.get("poster_path")
    full_poster_url = f"{IMAGE_BASE_URL}{poster_path}" if poster_path else None
    
    # Map genres
    genres = []
    seen_ids = set()
    for tmdb_genre in movie_info.get("genres", []):
        tmdb_genre_id = tmdb_genre.get("id")
        if tmdb_genre_id in genre_mapping and tmdb_genre_id not in seen_ids:
            genres.append(genre_mapping[tmdb_genre_id])
            seen_ids.add(tmdb_genre_id)
    
    # Get ranking based on vote average
    ranking = get_ranking(movie_info.get("vote_average", 0))
    
    return {
        "imdb_id": movie_info.get("imdb_id", ""),
        "title": movie_info.get("title", ""),
        "poster_path": full_poster_url,
        "genre": genres if genres else [{"genre_id": 0, "genre_name": "Unknown"}],
        "ranking": ranking
    }

def fetch_all_movies() -> tuple:
    """Fetch all 509 movies data"""
    complete_movies = []
    total = len(movies_data)
    failed_movies = []
    
    print(f"\n{'='*80}")
    print(f"🎬 TMDB Movie Data Fetcher - 509 MOVIES")
    print(f"{'='*80}\n")
    
    for index, movie in enumerate(movies_data, 1):
        imdb_id = movie['imdb_id']
        title = movie['title']
        
        progress = f"[{index:4d}/{total}]"
        print(f"{progress} {title:<55}", end=" ", flush=True)
        
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
                    print("✗ (build)")
                    failed_movies.append({"title": title, "reason": "Build failed"})
            else:
                print("✗ (details)")
                failed_movies.append({"title": title, "reason": "Get details failed"})
        else:
            print("✗ (search)")
            failed_movies.append({"title": title, "reason": "Movie not found"})
        
        # Rate limiting
        time.sleep(0.25)
    
    return complete_movies, failed_movies

def save_to_json(movies: List[Dict], filename: str = "movies_509_complete.json") -> None:
    """Save the complete movie data to JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(movies, f, indent=4, ensure_ascii=False)
    print(f"\n✓ Successfully saved {len(movies)} movies to '{filename}'")

def main():
    print("\n" + "="*80)
    print("🎬 TMDB MEGA Movie Data Fetcher for 509 MOVIES")
    print("="*80)
    
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
    estimated_time = (len(movies_data) * 0.25) / 60
    print(f"\n⏳ This will take approximately {estimated_time:.1f} minutes...")
    print("-" * 80)
    
    # Fetch all movies
    movies, failed = fetch_all_movies()
    
    print("\n" + "="*80)
    print(f"✓ FETCHED {len(movies)} out of {len(movies_data)} MOVIES")
    
    if failed:
        print(f"\n⚠️  FAILED TO FETCH {len(failed)} movies:")
        for fail in failed[:20]:  # Show first 20
            print(f"   - {fail['title']}: {fail['reason']}")
        if len(failed) > 20:
            print(f"   ... and {len(failed) - 20} more")
    
    print("="*80)
    
    # Save to JSON
    if movies:
        save_to_json(movies)
        print(f"\n✅ YOUR JSON FILE IS READY WITH REAL TMDB POSTER URLS!")
        print(f"📁 File location: movies_509_complete.json")
        print(f"📊 Total movies with data: {len(movies)}")
        print(f"✓ Success rate: {(len(movies)/len(movies_data)*100):.1f}%")
    else:
        print(f"\n❌ No movies were fetched. Please check your API key and internet connection.")

if __name__ == "__main__":
    main()
