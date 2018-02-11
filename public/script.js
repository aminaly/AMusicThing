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
    button.addEventListener("click", function(playlisturl) {
      return function() {
        $.ajax({
          url: playlisturl,
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
        }).done(function(data) {
          console.log(data);
          var tracklist = gettracklists(data);
          var playlistName = data.name;
          var userId = document.getElementById("userid").innerText;
          getrichfeatures(tracklist, access_token, playlistName, userId);
        })
      }
    }(result.href));
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
function getrichfeatures(tracklist, access_token, playlistName, userId) {
  $.ajax({
    url: "https://api.spotify.com/v1/audio-features?ids=" + tracklist.toString(),
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
  }).done(function(data) {
    console.log(data.audio_features);
    var sortedTracks = mergesort(data.audio_features);
    console.log("SORTED BY TEMPO:");
    console.log(sortedTracks);
    var updatedSorting = danceabilityCheck(sortedTracks);
    console.log("TUNED BY DANCEABILITY:");
    console.log(updatedSorting);
    var energySorting = energyCheck(updatedSorting);
    console.log("TUNED BY ENERGY:");
    console.log(energySorting);
    var trackuris = getTrackUris(energySorting);
    console.log(trackuris);
    makePlaylist(trackuris, access_token, playlistName, userId);
  });
}

// Separating track data from rich features JSON
function getTrackUris(sortedfeatures) {
  uris = [];
  for (idx = 0; idx < sortedfeatures.length; idx++) {
    uris.push(sortedfeatures[idx].uri);
  }
  return uris;
}

//make a playlist
function makePlaylist(tracklist, access_token, playlist_name, uid) {
  var newName = "Partify: " + playlist_name;
  var endPt = "https://api.spotify.com/v1/users/" + uid + "/playlists";
  var playlistData = JSON.stringify({
  "description": "Your partified playlist of " + playlist_name,
  "name": newName
})
  //first create the playlist
  $.ajax({
    type: "post",
    data: playlistData,
    dataType: "json",
    url: endPt,
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
  }).done(function(data) {
    console.log("Made Playlist" + data);
    var playlistId = data.id;
    // now populate it with the right tracks
    $.ajax({
      type: "post",
      dataType: "json",
      url: endPt + "/" + playlistId + "/tracks?uris=" + tracklist.toString(),
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
    }).done(function(data) {
      console.log("Populated playlist" + data);
    });
  });

}

// Sorting by increasing danceability.
// TODO: Change the sorting criteria
function merge(l, r) {
  var result = [];
  var idxl = 0;
  var idxr = 0;

  while (idxl < l.length && idxr < r.length) {
    if (l[idxl]['tempo'] > r[idxr]['tempo']) {
      result.push(l[idxl]);
      idxl++;
    } else {
      result.push(r[idxr]);
      idxr++;
    }
  }

  return result.concat(l.slice(idxl)).concat(r.slice(idxr))
}

// Sort the playlist via mergesort
function mergesort(tracks) {
  if (tracks.length == 0 || tracks.length == 1) {
    return tracks;
  } else {
    var middle = Math.floor(tracks.length / 2);
    var left = mergesort(tracks.slice(0,middle));
    var right = mergesort(tracks.slice(middle));
    return merge(left, right);
  }
}

function danceabilityCheck(tracks) {
  for (idx = 1; idx < tracks.length; idx++) {
    var prevTrack = tracks[idx-1];
    var currentTrack = tracks[idx];
    if ((prevTrack['tempo'] - currentTrack['tempo'] <= 5) &&
    (prevTrack['danceability'] < currentTrack ['danceability'])) {
      tracks[idx-1] = currentTrack;
      tracks[idx] = prevTrack;
    }
  }
  return tracks
}

function energyCheck(tracks) {
  for (idx = 1; idx < tracks.length; idx++) {
    var prevTrack = tracks[idx-1];
    var currentTrack = tracks[idx];
    if ((currentTrack['energy'] - prevTrack['energy'] >= 0.2)) {
      tracks[idx-1] = currentTrack;
      tracks[idx] = prevTrack;
    }
  }
  return tracks
}
