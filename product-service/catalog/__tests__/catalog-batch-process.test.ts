/**
 * @jest-environment node
 */

import AWSMock from "aws-sdk-mock";
import { catalogBatchProcess } from "../catalog-batch-process";

jest.mock("../create-product", () => ({
  createProduct: (product) => ({ ...product, id: "test-id" }),
}));

const validProduct = {
  count: 1,
  description: "Test description",
  price: 10,
  title: "Test title",
};

const invalidProduct = {
  description: "Only description",
};

AWSMock.mock("SNS", "publish", "New product was added");

describe("catalogBatchProcess", () => {
  test("should console.log error for invalid product ", async () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    await catalogBatchProcess({ Records: [{ body: JSON.stringify(invalidProduct) }] });
    expect(consoleLogSpy).toHaveBeenCalledWith("SOMETHING GOES WRONG: ", "Missing required key 'Message' in params");
  });

  test("should console.log success message for valid product", async () => {
    const consoleLogSpy = jest.spyOn(console, "log");
    await catalogBatchProcess({ Records: [{ body: JSON.stringify(validProduct) }] });

    expect(consoleLogSpy).toHaveBeenCalledWith("Send update email");
  });
});
