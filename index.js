// use fs-extra and remove util.promisify
const fs = require("fs-extra");
// // avoid to write the same boilerplate code
const { error, call } = require("./call");
const rawFile = "./raw_tracks.json";
const formattedFile = "./formatted_tracks2.json";

const readFile = async () => {
    const rawJsonData = await call(fs.readFile(rawFile));

    if (rawJsonData.error) {
        return error(rawJsonData, "Error while reading the file!");
    }

    const rawJson = JSON.parse(rawJsonData);

    return rawJson;
}

const writeFile = async (formattedFile, content) => {
    const writeToFile = await call(fs.writeFile(formattedFile, content));

    if (writeToFile.error) {
        return error(writeToFile, "Error while reading the file!");
    }

    return writeToFile;
}
// assign value to a new object. tried mpa+reduce...didn't work
const getItem = items => items.map(
    item => {
        return {
            id: item.id,
            album: item.album.name,
            album_id: item.album.id,
            release_date: item.album.release_date,
            album_img: item.album.images[0].url,
            album_uri: item.album.uri,
            artists: item.artists.map(
                artist => ({
                    name: artist.name,
                    id: artist.id,
                    uri: artist.uri
                })
            ),
            type: item.type,
            name: item.name,
            popularity: item.popularity,
            track_number: item.track_number,
            uri: item.uri
        }
    }
);

readFile()
    .then(rawJson => {
        if (rawJson.error) {
            return console.log(
                "An error occurred, recover here. Details: ", rawJson);
        }
        // sort arrays by popularity
        let convertedJson = getItem(rawJson.tracks.items).sort((a, b) => b.popularity - a.popularity);
        // write into a file
        return writeFile(formattedFile, JSON.stringify(convertedJson, null, 2))
    })
    .catch(err => console.log("An error occurred: ", err));