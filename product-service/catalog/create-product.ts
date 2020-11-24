import { Client } from "pg";
import { dbOptions } from "../products/helper/db-config";

export const createProduct = async (product) => {
  const client = new Client(dbOptions);
  await client.connect();
  const { title, description, price, count } = product;
  try {
    if (isProductInValid(product)) {
      const {
        rows: [{ id }],
      } = await client.query(`insert into products (title, description, price) values ($1, $2, $3) returning id`, [
        title,
        description,
        price,
      ]);

      await client.query(`insert into stocks (product_id, count) values ($1, $2)`, [id, count]);
      await client.query("INSERT");

      return { id, ...product };
    } else {
      throw new Error("InvalidParameters");
    }
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.end();
  }
};

export const isProductInValid = ({ title, description, price, count }) => {
  if (
    !!price &&
    !!count &&
    !!title &&
    typeof price === "number" &&
    price > 0 &&
    typeof count === "number" &&
    count > 0 &&
    typeof title === "string" &&
    title.length > 0 &&
    typeof description === "string"
  ) {
    return true;
  }
  return false;
};
