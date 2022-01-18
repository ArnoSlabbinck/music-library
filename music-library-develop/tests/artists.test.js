const {
  successfulDelete,
  successfullGet,
  successfullPost,
  successfullPut,
  badRequestPost,
  notFoundDelete,
  notFoundGet,
  notFoundPut,
} = require("./util");
const { db } = require("../src");

describe("ArtistController", () => {
  afterEach(() => {
    db.clear();
  });

  describe("and when fetch", () => {
    it("should get the artists", async () => {
      const scott = {
        id: "1",
        name: "Bon Scott",
      };

      const cobain = {
        id: "2",
        name: "Kurt Cobain",
      };

      db.setArtists([scott, cobain]);

      const body = await successfullGet("/api/artists");
      expect(body).toMatchInlineSnapshot(`
Array [
  Object {
    "id": "1",
    "name": "Bon Scott",
  },
  Object {
    "id": "2",
    "name": "Kurt Cobain",
  },
]
`);
    });

    it("should get a single artist", async () => {
      const scott = {
        id: "1",
        name: "Bon Scott",
      };

      db.setArtists([scott]);

      const scottResponse = await successfullGet("/api/artists/1");
      expect(scottResponse).toStrictEqual(scott);
    });

    it("should throw not found error (404) when artist not found", async () => {
      const scottResponse = await notFoundGet("/api/artists/1");
      expect(scottResponse).toStrictEqual({
        error: "Artist not found",
      });
    });
  });

  describe("and when create", () => {
    it("should be possible to create an artist", async () => {
      const scott = {
        id: "1",
        name: "Bon Scott",
      };

      const emptyResponse = await successfullGet("/api/artists");
      expect(emptyResponse).toStrictEqual([]);

      const createdResponse = await successfullPost("/api/artists", scott);
      expect(createdResponse).toStrictEqual(scott);

      const responseWithScott = await successfullGet("/api/artists");
      expect(responseWithScott).toStrictEqual([scott]);
    });

    it("should throw bad request error (400) when trying to create multiple artists with same ID", async () => {
      const scott = {
        id: "1",
        name: "Bon Scott",
      };

      const scottId2 = {
        id: "2",
        name: "Bon Scott",
      };

      const emptyResponse = await successfullGet("/api/artists");
      expect(emptyResponse).toStrictEqual([]);

      const createdResponse = await successfullPost("/api/artists", scott);
      expect(createdResponse).toStrictEqual(scott);

      const createdResponseId2 = await successfullPost(
        "/api/artists",
        scottId2
      );
      expect(createdResponseId2).toStrictEqual(scottId2);

      const badRequestResponse = await badRequestPost("/api/artists", scott);
      expect(badRequestResponse).toStrictEqual({
        error: "Artist already exists",
      });

      const artists = await successfullGet("/api/artists");
      expect(artists).toStrictEqual([scott, scottId2]);
    });
  });

  describe("and when update", () => {
    it("should be possible to update an artists name", async () => {
      const scott = {
        id: "1",
        name: "Bon Scott",
      };

      db.setArtists([scott]);

      const updateResponse = await successfullPut("/api/artists/1", {
        id: "1",
        name: "Bon",
      });
      expect(updateResponse).toStrictEqual({ id: "1", name: "Bon" });

      const getResponse = await successfullGet("/api/artists");
      expect(getResponse).toStrictEqual([{ id: "1", name: "Bon" }]);
    });

    it("should throw not found error (404) when artist ID does not exist", async () => {
      const updateResponse = await notFoundPut("/api/artists/1", {
        id: "1",
        name: "Bon",
      });

      expect(updateResponse).toStrictEqual({
        error: "Artist not found",
      });
    });
  });

  describe("and when delete", () => {
    it("should be possible to delete an artist with his songs", async () => {
      const scott = {
        id: "1",
        name: "Bon Scott",
      };

      db.setArtists([scott]);
      db.setSongs([
        { artistId: "1", name: "Woah!" },
        { artistId: "2", name: "Yeah!" },
      ]);

      const noContent = await successfulDelete("/api/artists/1");
      expect(noContent).toBe("no-content");
      expect(db.songs).toStrictEqual([{ artistId: "2", name: "Yeah!" }]);
    });

    it("should throw not found error when arist ID does not exist", async () => {
      const notFound = await notFoundDelete("/api/artists/1");
      expect(notFound).toStrictEqual({
        error: "Artist not found",
      });
    });
  });
});
