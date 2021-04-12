CREATE OR REPLACE FUNCTION get_inventory()
  RETURNS json[]
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
DECLARE
  return_value json[];
BEGIN
  SELECT array_agg(
    json_build_object(
      'productId', cast(v.product_id as text),
      'variantId', cast(v.id as text),
      'stock', v.inventory_quantity
    )
  ) INTO return_value
  FROM variant v;

  RETURN return_value;

END $$
;