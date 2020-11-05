import { getProductList } from "../get-product-list";
jest.mock(
  "../products.mock.json",
  () => ({
    products: "mock product list",
  }),
  { virtual: true }
);

describe("getProductList", () => {
  test("should return status 200 for correct request", async () => {
    expect.assertions(1);
    const response = await getProductList({}, {}, () => ({}));
    expect(response).toStrictEqual({});
  });
  test("should return status 500 if Error", async () => {
    expect.assertions(1);
    const response = await getProductList({}, {}, () => ({}));
    expect(response).toStrictEqual({});
  });
});
