const db = {
  artists: [],
  songs: [],

  setArtists(newArtists) {
    this.artists = newArtists;
  },
  setSongs(songs) {
    this.songs = songs;
  },
  clear() {
    this.artists = [];
    this.songs = [];
  },
};

module.exports = db;
