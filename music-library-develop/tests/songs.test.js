const {
  successfulDelete,
  successfullGet,
  successfullPost,
  badRequestPost,
  notFoundDelete,
  notFoundGet,
  notFoundPost,
  badRequestDelete,
} = require("./util");
const { db } = require("../src");

describe("SongsController", () => {
  beforeEach(() => {
    db.clear();
    db.setArtists(getArtists());
  });

  describe("and when fetch", () => {
    it("should return all songs for given artist", async () => {
      const artistId = getArtists()[0].id;
      const scottSongs = [
        { artistId, id: "1", name: "Dirty Deeds Done Dirt Cheap" },
        { artistId, id: "2", name: "Whole Lotta Rosie" },
        { artistId, id: "3", name: "T.N.T." },
      ];
      const axlSongs = [
        { artistId: "666", id: "4", name: "Knocking on heavens door" },
      ];

      db.setSongs([...scottSongs, ...axlSongs]);

      const response = await successfullGet(`/api/artists/${artistId}/songs`);
      expect(response).toStrictEqual(scottSongs);
    });

    it("should throw not found (404) if artist cannot be found", async () => {
      const artistId = "666";
      const songs = [{ artistId, name: "Highway to hell" }];

      db.setSongs(songs);

      const response = await notFoundGet(`/api/artists/${artistId}/songs`);
      expect(response).toStrictEqual({
        error: "Artist not found",
      });
    });
  });

  describe("and when add", () => {
    it("should be possible to add a song", async () => {
      const artistId = getArtists()[0].id;

      const response = await successfullPost(`/api/artists/${artistId}/songs`, {
        name: "Long way to the top",
      });

      expect(response).toStrictEqual({
        artistId,
        id: "1",
        name: "Long way to the top",
      });

      const getResponse = await successfullGet(
        `/api/artists/${artistId}/songs`
      );

      expect(getResponse).toStrictEqual([
        { artistId, id: "1", name: "Long way to the top" },
      ]);
    });

    it("should map only valid properties", async () => {
      const artistId = getArtists()[0].id;

      const response = await successfullPost(`/api/artists/${artistId}/songs`, {
        name: "Long way to the top",
        invalid: "foo",
        artistId: "bar",
      });

      expect(response).toStrictEqual({
        artistId,
        id: "1",
        name: "Long way to the top",
      });
    });

    it("should throw not found (404) if artist cannot be found", async () => {
      const artistId = "666";
      const response = await notFoundPost(`/api/artists/${artistId}/songs`, {
        name: "Long way to the top",
      });

      expect(response).toStrictEqual({
        error: "Artist not found",
      });
    });

    it("should throw bad request (400) on duplicate name", async () => {
      const artistId = getArtists()[0].id;

      const response = await successfullPost(`/api/artists/${artistId}/songs`, {
        name: "Long way to the top",
      });

      expect(response).toStrictEqual({
        artistId,
        id: "1",
        name: "Long way to the top",
      });

      const duplicateNameResponse = await badRequestPost(
        `/api/artists/${artistId}/songs`,
        {
          name: "Long way to the top",
        }
      );

      expect(duplicateNameResponse).toStrictEqual({
        error: "Song already exists",
      });
    });

    it("should throw bad request (400) on invalid form body", async () => {
      const artistId = getArtists()[0].id;

      const invalidFormBody = await badRequestPost(
        `/api/artists/${artistId}/songs`,
        {
          invalid: "body",
        }
      );

      expect(invalidFormBody).toStrictEqual({
        error: "Invalid body provided, missing property: name",
      });
    });
  });

  describe("and when delete", () => {
    it("should delete the song", async () => {
      const artistId = getArtists()[0].id;
      const songId = "1";

      db.setSongs([{ artistId, id: songId, name: "Woah!" }]);

      const result = await successfulDelete(
        `/api/artists/${artistId}/songs/${songId}`
      );

      expect(result).toBe("no-content");
    });

    it("should throw not found (404) if artist cannot be found", async () => {
      const artistId = "666";
      const songId = "1";

      db.setSongs([{ artistId, id: songId, name: "Woah!" }]);

      const result = await notFoundDelete(
        `/api/artists/${artistId}/songs/${songId}`
      );

      expect(result).toStrictEqual({
        error: "Artist not found",
      });
    });

    it("should throw not found (404) if song cannot be found", async () => {
      const artistId = getArtists()[0].id;
      const songId = "666";

      db.setSongs([{ artistId, id: "1", name: "Woah!" }]);

      const result = await notFoundDelete(
        `/api/artists/${artistId}/songs/${songId}`
      );

      expect(result).toStrictEqual({
        error: "Song not found",
      });
    });

    it("should throw bad request (400) when trying to delete song from invalid author", async () => {
      const artistId = getArtists()[0].id;
      const songId = "1";

      db.setSongs([{ artistId: "666", id: songId, name: "Woah!" }]);

      const result = await badRequestDelete(
        `/api/artists/${artistId}/songs/${songId}`
      );

      expect(result).toStrictEqual({
        error: "Song does not belong to provided artist",
      });
    });
  });
});

function getArtists() {
  return [{ id: "1", name: "Bon Scott" }];
}
