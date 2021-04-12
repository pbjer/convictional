CREATE TABLE IF NOT EXISTS product (
  id bigint primary key,
  title text NOT NULL,
  vendor text NOT NULL,
  body_html text NOT NULL
);

CREATE TABLE IF NOT EXISTS variant (
  id bigint PRIMARY KEY,
  product_id bigint NOT NULL,
  title text DEFAULT NULL,
  sku text DEFAULT NULL,
  inventory_quantity integer NOT NULL,
  weight_value bigint DEFAULT NULL,
  weight_unit text DEFAULT NULL,
  CONSTRAINT variant_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id)
);

CREATE TABLE IF NOT EXISTS image (
  id uuid primary key default uuid_generate_v4(),
  variant_id bigint NOT NULL,
  source text NOT NULL,
  CONSTRAINT image_source_fkey FOREIGN KEY (variant_id) REFERENCES variant(id),
  UNIQUE (variant_id, source)
);