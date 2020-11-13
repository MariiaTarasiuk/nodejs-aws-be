create table products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
)

drop table products;

insert into products (title, description, price) values
('Tomato, Roma','Roma tomatoes are also known as Italian tomatoes or Italian plum tomatoes. Roma tomatoes are grown in the United States, Mexico. Used both for canning and producing tomato paste',3.5),
('Tomato, Green','Green tomatoes are under ripe tomatoes which are firm, sour and unpleasant taste. In cooked form, it becomes delightful, moist and adds bright flavor to sauces and other dishes. Generally, in Southern dish, green tomatoes are fried and coated in cornmeal and fried. Green tomatoes are light to dark lime green in color with firm skin. It is round or plumper with broad shoulders and its size varies from 4 to 10 centimeters in diameter. It has bright chartreuse flesh and firm center with tiny and underdeveloped seeds. It has crisp and mildly juicy texture and sharp or astringent flavor with slight sweetness. It does not look vibrant as red tomatoes but offers similar nutrients. In order to reap maximum benefits, choose green tomatoes with firm and smooth skin.',3.2),
('Apple, Granny Smith','The Granny Smith apple is tangy and tart. This is THE baking apple of choice as it has a deep dense texture that allows for longer cooking. It is a great choice for pies and cobblers and even baked on its own. The general rule is, tart apples are great for baking, whereas sweet apples make great hand fruit. Granny Smith apples are the gold standard for baking, and Fuji or Gala apples are more for eating out of hand. Golden Delicious or Red Delicious are not suitable for baking, what you are looking for are apples that have some tartness to them to stand up to the sugar in the recipe. The three major apple-growing regions in the U.S. are the States of Washington, New York, and Michigan.',2.5)

create table stocks (
	id uuid primary key default uuid_generate_v4(),
	product_id uuid,
	count integer,
	foreign key ("product_id") references "products" ("id")
)

insert into stocks (product_id, count) values
('a66b4cc6-c4e5-491d-af35-0e30ba4557b8', 54),
('48a8dcb9-53dd-4a71-b30e-a3a1bcbc6ddc', 42),
('6b78ae8f-5f4e-46ef-bf9f-88c965a8601c', 63)

drop table stocks;

CREATE EXTENSION if not exists "uuid-ossp";
