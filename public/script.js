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
        getrichfeatures(gettracklists(data), access_token);
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
function makePlaylist(tracklist, access_token) {
  $.ajax({
    url: "https://api.spotify.com/v1/audio-features?ids=" + tracklist.toString(),
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
  }).done(function(data) {
    console.log(data);
  });
}
