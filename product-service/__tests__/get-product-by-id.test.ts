import { getProductByID } from "../get-product-by-id";
jest.mock(
  "../products.mock.json",
  () => ({
    products: [{ id: "test", description: "mock product list" }],
  }),
  { virtual: true }
);

describe("getProductByID", () => {
  beforeEach(() => {
    expect.assertions(1);
  });
  test("should return status 200 for correct request", async () => {
    const response = await getProductByID({ pathParameters: { productId: "test" } }, {}, () => ({}));
    expect(response).toStrictEqual({});
  });
  test("should return status 404 if no product by id found", async () => {
    const response = await getProductByID({ pathParameters: { productId: "test 2" } }, {}, () => {});
    expect(response).toStrictEqual({ error: '"Product with id test 2 not found"', statusCode: 500 });
  });
  test("should return status 500 if Error", async () => {
    const response = await getProductByID({ pathParameters: { id: null } }, {}, () => ({}));
    expect(response).toStrictEqual({ error: '"Product with id undefined not found"', statusCode: 500 });
  });
});
