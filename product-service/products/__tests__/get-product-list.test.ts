import { CORS_HEADERS } from "../../cors-headers";

describe("getProductList", () => {
  beforeEach(() => jest.resetModules());

  test("should return status 200 for correct request", async () => {
    jest.mock("../products.mock.json", () => ({
      products: "mock product list",
    }));
    const { getProductList } = require("../get-product-list.ts");
    const response = await getProductList({});

    expect(response).toMatchObject({
      statusCode: 200,
      body: '"mock product list"',
      headers: CORS_HEADERS,
    });
  });

  test("should return status 500 if Error", async () => {
    jest.mock("../products.mock.json", () => {});
    const { getProductList } = require("../get-product-list.ts");
    const response = await getProductList({});

    expect(response).toMatchObject({
      statusCode: 500,
      error: "{}",
      headers: CORS_HEADERS,
    });
  });
});
