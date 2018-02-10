// Script that houses all of the api calls

// populate the list of playlists on the screen
// handles all steps between here and sorting
function populatelist(jsonlist, access_token) {
  var ls = document.getElementById("result-list");
  ls.innerHTML = "";
  var jl = jsonlist;
  for (idx = 0; idx < jsonlist.items.length; idx++) {
    result = jsonlist.items[idx];
    var myh1 = document.createElement("h1");
    myh1.innerHTML = result.name + " - " + result.owner.display_name;
    ls.appendChild(myh1);
    var button = document.createElement("button");
    // button.name = result.href;
    button.innerHTML = "submit";
    button.addEventListener("click", function() {
      $.ajax({
        url: result.href,
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
      }).done(function(data) {
        console.log(data);
        var tracklist = gettracklists(data);
        var playlistName = data.name;
        var features = getrichfeatures(tracklist, access_token);
        //TODO add a "new playlist" tracklist function call
        makePlaylist(tracklist, access_token, playlistName);
      })
    });
    ls.appendChild(button);

  }
}

// get list of tracks given playlist
function gettracklists(data) {
  ls = [];
  for (idx = 0; idx < data.tracks.items.length; idx++) {
    result = data.tracks.items[idx];
    ls.push(result.track.id);
  }
  return ls;
}

// get features
function getrichfeatures(tracklist, access_token) {
  $.ajax({
    url: "https://api.spotify.com/v1/audio-features?ids=" + tracklist.toString(),
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
  }).done(function(data) {
    console.log(data);
  });
}

//make a playlist
function makePlaylist(tracklist, access_token, playlist_name) {

  var playlistData = {
  "description": "Your partified playlist of " + playlist_name,
  "public": true,
  "name": "Partify: " + playlist_name
}
  //first create the playlist
  $.ajax({
    type: "post",
    data: playlistData,
    dataType: "json",
    url: "https://api.spotify.com/v1/users/amina626/playlists", // TODO: CHANGE THIS TO BE GENERALIZES
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
  }).done(function(data) {
    console.log("Made Playlist" + data);
  });

  //now populate the playlist
}

function mergesort(tracksAndFeatures) {
  tracks = tracksAndFeatures['audio_features'];
  if (tracks.length == 0 || tracks.length == 1) {
    return tracks;
  } else {
    middle = tracks.length / 2;
    left = mergesort()
  }
}
