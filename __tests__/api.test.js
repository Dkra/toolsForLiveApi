const request = require("supertest");
const app = require("../server.js");

describe("GET /api/helloworld Endpoints", () => {
  const agent = request.agent(app);
  it("should return 200 ok", async () => {
    const res = await agent.get("/api/helloworld");

    expect(res.statusCode).toEqual(200);
  });
});
