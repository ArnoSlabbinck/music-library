const { json } = require("body-parser");
const express = require("express");
const { restart } = require("nodemon");
const { songs } = require("./db");
const router = express.Router();
const db = require("./db");

router.get("/api/artists", artists);
router.post("/api/artists", addArtist);
router.put("/api/artists/:id", updateArtist);
router.get("/api/artists/:id", artist);
router.delete("/api/artists/:id", deleteArtist);

function artists(req, res) {
  res.json(db.artists);
}



function artist(req, res) {
  const id = req.params.id;
  const found = db.artists.find(element => element.id === id);
  if(found === undefined) {
    res.status(404);
    res.json({
      error: "Artist not found",
    });
  }else{
    
    res.json(found);
    
  }
  
  
}

function addArtist(req, res) {
  const artist = req.body;
  for (let i = 0; i < db.artists.length; i++) {
    if(db.artists[i].id === artist.id){
      res.status(400);
      res.json( {
          error: "Artist already exists",
        });
      
      return 
    }
    
  }
  const newArtist = db.artists.push(artist); 
  console.log(artist); 
  res.status(201);
  res.json(artist);
  return ;
}

function updateArtist(req, res) {
  const artist = req.body;

  const foundArtist = db.artists.find(element => element.id === artist.id);
  if(foundArtist) {
     // Update the artist 
     for (var key in foundArtist) { 
       foundArtist[key] = artist[key]; 
      }
      res.status(200);
      res.json(foundArtist);

  }else {
    res.status(404);
    res.json({
      error: "Artist not found",
    });
  }
 
}

function deleteArtist(req, res) {
  const id = req.params.id;
  for(var i = 0; i < db.artists.length; i++) {
    if(db.artists[i].id === id) {
          const newSongs = db.songs.filter(element => element.artistId !== id);
          db.songs = newSongs;
          db.artists.splice(i, 1);
          res.status(204).end();
          return;
        }
  }
  
  res.status(404);
  res.json({
    error: "Artist not found",
  });

 
}



module.exports = router;
