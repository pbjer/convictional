CREATE OR REPLACE FUNCTION add_product(
  given_id bigint,
  given_title text,
  given_vendor text,
  given_body_html text
)
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO product
    (id, title, vendor, body_html)
  VALUES
    (given_id, given_title, given_vendor, given_body_html);

  RETURN cast(given_id as text);

END $$
;

CREATE OR REPLACE FUNCTION add_variant(
  given_id bigint,
  given_product_id bigint,
  given_title text,
  given_sku text,
  given_inventory_quantity bigint,
  given_weight_value bigint,
  given_weight_unit text
)
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO variant
    (
      id,
      product_id,
      title,
      sku,
      inventory_quantity,
      weight_value,
      weight_unit
    )
  VALUES
    (
      given_id,
      given_product_id,
      given_title,
      given_sku,
      given_inventory_quantity,
      given_weight_value,
      given_weight_unit
    );

  RETURN cast (given_id as text);

END $$
;

CREATE OR REPLACE FUNCTION add_image(
  given_variant_id bigint,
  given_source text
)
  RETURNS text
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
DECLARE
  return_value text;
BEGIN
  INSERT INTO image
    (variant_id, source)
  VALUES
    (given_variant_id, given_source)
  RETURNING cast (id as text) INTO return_value;

  RETURN return_value;

END $$
;