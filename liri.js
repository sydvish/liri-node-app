// LIRI will search Spotify for songs, Bands in Town for concerts, and OMDB for movies
require("dotenv").config();
const keys = require("./keys");
const Spotify = require("node-spotify-api");
const spotify = new Spotify(keys.spotify);
const omdb = require('omdb');
const axios = require("axios");
console.log(process.argv);


// OMBD

const fs = require("fs");
const request = require("request");
var userInput = process.argv[2];
process.argv.splice(0, 3);
var userQuery = process.argv.join(" ");


// Switches for commands
function userCommand(userInput, userQuery) {
    switch (userInput) {
        case "movie-this":
            movieThis();
            break;
        case "concert-this":
            concertThis();
            break;
        case "spotify-this-song":
            spotifyThisSong(userQuery);
            break;
        case "do-what-it-says":
            doThis(userQuery);
            break;
        default:
            console.log("Please enter one of the following commands after node liri.js followed by your query: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says");
            break;
    }
}
userCommand(userInput, userQuery);

// If the "movieThis" function is called...
function movieThis() {

    // We have a variable set for the OMDB api
    var queryUrl = "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=trilogy";

    // Request is sent for info from the api and displayed to the console based on search parameters
    axios.get(queryUrl).then(
        function (response) {
            if (userQuery) {
                console.log("Title: " + response.data.Title);
                console.log("Year the movie came out: " + response.data.Year);
                console.log("IMDB Rating of the movie: " + response.data.imdbRating);
                console.log("Rotten Tomatoes Rating of the movie: " + response.data.Ratings[1].Value);
                console.log("Origin Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            }
            else {
                console.log("If you haven't watched Mr. Nobody, then you should " + "http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
        }
    )

};
// BANDS IN TOWN

// If "concert-this" function is called
function concertThis() {

    // Request is sent for concert info from api & displaed to the console based on searc paramenters
    var queryURL = "https://rest.bandsintown.com/artists/" + userQuery + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function (response) {
            fs.writeFile("log/concert.json", JSON.stringify(response.data, null, 2), function (err) {
                if (err) console.log(err);
            });
            console.log(response.data[0].venue.name);
            // console.log("Name of the venue: " + response.data.Venue);
            console.log(response.data[0].venue.city + " " + response.data[0].venue.region);
            console.log(response.data[0].datetime);

        }
    );
}


// SPOTIFY

function spotifyThisSong(song) {


    spotify.search({ type: 'track', query: song}, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        fs.writeFile("log/spotify.json", JSON.stringify(data, null, 2), function (err) {
            if (err) console.log(err);
        });

        // artists
        console.log("Artist: " + data.tracks.items[0].album.artists[0].name);

        // song name
        console.log("Song Name: " + data.tracks.items[0].name);
        // preview link
        if (data.tracks.items[0].preview_url === null) {
            console.log("Link: " + data.tracks.items[0].external_urls.spotify);
        } else {
            console.log("Preview: " + data.tracks.items[0].preview_url);
            console.log("Album: " + data.tracks.items[0].album.name);
        }

    });

}

// DO THIS 

// If the "do-this" function is called...
function doThis() {

    // we'll read the random text file and print it to the console
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) { return console.log(error); }
        var args = data.split(", ");

        userCommand(args[0], args[1]);
    });

}
