# Opdracht IT Topics 3

Music Library is een applicatie waar je artiesten met hun liedjes via een API kan beheren.

## Installatie

Dependencies kunnen als volgt geinstalleerd worden.

```sh
npm ci
```

Het project bevat twee scripts die uitegevoerd kunnen worden:

- Tests

```sh
npm run test
```

- Development server

```sh
npm run start
```

_API is vervolgens beschikbaar op http://localhost_

## Oefening

Het is uw taak als developer om deze API verder te vervoledigen. De API bevat verschillende E2E tests die momenteel falen en verder geimplementeerd moeten worden.

De API bestaat uit twee delen:

- `/api/artists/*`: verantwoordelijk voor het beheren van artiesten. Alle relevante code voor het beheren van artiesten wordt geplaatst in `./src/artists.js`
- `/api/artists/:artistId/songs/*`: verantwoordelijk voor het beheren van liedjes van bepaalde artiesten. Alle relevante code voor het beheren van liedjes wordt geplaatst in `./src/songs.js`

Er wordt gebruik gemaakt van een `in-memory` database. Alle operaties doe je rechtstreeks op het `db` object. Bijvoorbeeld, als je een artiest wilt toevoegen kan je deze pushen op de bestaande `artists` array in `./src/db/index.js`

```js
const db = require("./db");

db.artists.push({
  id: "1",
  name: "Bon Scott",
});
```

> Interessante operaties
>
> ```js
> // Find artist by id
> const singleArtist = db.artists.find((artist) => artist.id === id);
>
> // Filter out artist (delete by ID)
> db.artists = db.artists.filter((artist) => artist !== id);
> ```

## Artists

Je kan stap voor stap controleren of je feature werkt. Elke test kan independent getriggered worden om te valideren of uw implementatie klopt. Run na elke implementatie de nodige tests.

![running-tests](https://user-images.githubusercontent.com/1385245/144660555-4352e88d-7ead-46d1-a813-6547fa18c9ac.gif)

Je kan met `.only` aanduiden welke test je wil runnen. Zo hoef je niet telkens te wachten op alle falende tests.

**Test 1**

```
GET http://localhost:3000/api/artists
```

- Lijst van alle artiesten

**Test 2**

```
GET http://localhost:3000/api/artists/1
```

- Stuurt 1 artiest terug voor het opgegeven ID
- Stuurt een error "Artist not found" als deze niet gevonden kan worden

**Test 3**

```
POST http://localhost:3000/api/artists
{
  "name": "Bon Scott",
  "id": "1"
}
```

- Artiest aangemaakt met naam Bon Scott
- Stuurt een error "Artist already exists" wanneer 2x hetzelfde ID opgegeven wordt

**Test 4**

```
PUT http://localhost:3000/api/artists/1
{
  "name": "Bon Scott"
}
```

- Artiest met ID 1 wordt aangepast naar naam Bon Scott
- Stuurt een error "Artist not found" als deze niet gevonden kan worden

**Test 5**

```
DELETE http://localhost:3000/api/artists/1
```

- Artiest met ID 1 wordt verwijderd
- Stuurt een error "Artist not found" als deze niet gevonden kan worden

## Songs

In tegenstelling is er voor songs nog niets geimplementeerd buiten de tests. Er bestaan nog geen routes, deze dien je zelf aan te maken. Denk er aan dat er verschillende manieren zijn om routes te definieren.

```js
router.get("/api/my-route", (req, res) => {
  res.send("Hello World");
});

// vs

router.get("/api/my-route", helloWorld);

function helloWorld(req, res) {
  res.send("Hello World");
}
```

Het is aan jouw de keuze om te kiezen voor inline vs function. Het is belangrijk dat je beide methodes beheerst.
De nodige test cases vind je terug in `./tests/songs.test.js`.

![image](https://user-images.githubusercontent.com/1385245/144661193-f3fdf166-8333-4c94-92eb-f49779003282.png)

Belangrijk om weten is dat deze test cases strictere geimplementeerd zijn dan voor artists, zo worden niet gekende properties bijvoorbeeld genegeerd zoals beschreven in test **should map only valid properties**.

**Test 1**

```
GET http://localhost:3000/api/artists/:artistId/songs
```

- Geeft een overzicht van alle songs voor de opgegeven artiest
- Stuurt een error "Artist not found" als de artiest niet gevonden kan worden

**Test 2**

```
POST http://localhost:3000/api/artists/:artistId/songs
{
  name: "My Song"
}
```

- Voegt een nieuwe song toe voor opgegeven artiest
- Stuurt een error "Artist not found" als de artiest niet gevonden kan worden
- Een song kan slechts 1x aangemaakt worden (duplicate name is niet geldig)
- Een song moet een valid "name" property bevatten of er wordt een error gethrowed

```
DELETE http://localhost:3000/api/artists/:artistId/songs/:songId
```

- Song wordt verwijderd
- Stuurt een error "Artist not found" als de artiest niet gevonden kan worden
- Stuurt een error "Song not found" als het lied niet gevonden kan worden
- Stuurt een error "Song does not belong to provided artist" als het lied niet matched met de auteur

## Summary

- Je mag enkel aanpassingen doen in `./src/artists.js` en `./src/songs.js`. Het is niet de bedoeling om tests te gaan aanpassen/toevoegen. Deze zijn voor u toegevoegd om te controleren of uw implementatie werkt.
- De opdracht is geslaagd als alle tests groen zijn

```

```
