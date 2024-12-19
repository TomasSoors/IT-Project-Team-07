import data from '../data';

describe("data.js API calls", () => {
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("getTrees fetches trees successfully", async () => {
    fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: "Oak" }, { id: 2, name: "Pine" }]));

    const trees = await data.getTrees();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/trees$/),
      { method: "GET" }
    );
    expect(trees).toEqual([{ id: 1, name: "Oak" }, { id: 2, name: "Pine" }]);
  });

  test("getTrees handles fetch errors", async () => {
    fetch.mockResponseOnce("", { status: 500 });
  
    const trees = await data.getTrees();
  
    expect(console.error).toHaveBeenCalledWith("Error fetching trees:", expect.any(Error));
  
    expect(trees).toEqual([]);
  });
  test("addTree sends tree data correctly", async () => {
    const tree = { name: "Maple", description: "A maple tree", latitude: 50, longitude: 4 };
    const token = "mockToken";
    sessionStorage.setItem("token", token);

    fetch.mockResponseOnce(JSON.stringify({ success: true }));

    await data.addTree(tree);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/trees$/),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(tree),
      }
    );
    expect(console.log).toHaveBeenCalledWith("Tree added successfully.");
  });

  test("addTree handles server-side errors", async () => {
    fetch.mockResponseOnce(JSON.stringify({ error: "Invalid data" }), { status: 400 });

    const tree = { name: "Maple", description: "A maple tree", latitude: 50, longitude: 4 };

    await expect(data.addTree(tree)).rejects.toThrow("Failed to add tree.");
    expect(console.error).toHaveBeenCalledWith(
      "Error adding tree:",
      expect.any(Object)
    );
  });

  test("deleteTree sends DELETE request with correct URL", async () => {
    const treeId = 123;
    const token = "mockToken";
    sessionStorage.setItem("token", token);

    fetch.mockResponseOnce(JSON.stringify({ success: true }));

    await data.deleteTree(treeId);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/trees/${treeId}$`)),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      }
    );
    expect(console.log).toHaveBeenCalledWith("Tree removed successfully.");
  });

  test("deleteTree handles server-side errors", async () => {
    const treeId = 123;
    fetch.mockResponseOnce(JSON.stringify({ error: "Not found" }), { status: 404 });

    await expect(data.deleteTree(treeId)).rejects.toThrow("Failed to remove tree.");
    expect(console.error).toHaveBeenCalledWith(
      "Error removing tree:",
      expect.any(Object)
    );
  });

  test("updateTree sends PUT request with correct data", async () => {
    const tree = { id: 123, height: 15, diameter: 30 };
    const token = "mockToken";

    fetch.mockResponseOnce(JSON.stringify({ success: true }));

    await data.updateTree(tree, token);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(new RegExp(`/trees/${tree.id}$`)),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          height: tree.height,
          diameter: tree.diameter,
        }),
      }
    );
  });

  test("updateTree handles server-side errors", async () => {
    const tree = { id: 123, height: 15, diameter: 30 };
    const token = "mockToken";

    fetch.mockResponseOnce(JSON.stringify({ error: "Invalid data" }), { status: 400 });

    await expect(data.updateTree(tree, token)).rejects.toThrow("Failed to update tree.");
    expect(console.error).toHaveBeenCalledWith(
      "Error updating tree:",
      expect.any(Object)
    );
  });

  test("updateTree handles fetch errors", async () => {
    const tree = { id: 123, height: 15, diameter: 30 };
    const token = "mockToken";
  
    fetch.mockReject(new Error("Failed to update tree."));
  
    await expect(data.updateTree(tree, token)).rejects.toThrow("Failed to update tree.");
    expect(console.error).toHaveBeenCalledWith("Error in updateTree:", expect.any(Error));
  });
});
