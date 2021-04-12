CREATE OR REPLACE FUNCTION get_product_by_id(given_product_id bigint)
  RETURNS json
  LANGUAGE plpgsql
  SECURITY DEFINER
AS $$
DECLARE
  return_value json;
BEGIN
  SELECT json_build_object(
    'code', cast(p.id as text),
    'title', p.title,
    'vendor', p.vendor,
    'bodyHtml', p.body_html,
    'variants', (
      SELECT array_agg(
        json_build_object(
          'id', cast(v.id as text),
          'title', v.title,
          'sku', v.sku,
          'available', (
            case when v.inventory_quantity > 0
              then true
              else false
            end
          ),
          'inventory_quantity', v.inventory_quantity,
          'weight', json_build_object(
            'value', v.weight_value,
            'unit', v.weight_unit
          )
        )
      ) FROM variant v WHERE v.product_id = p.id
    ),
    'images', (
      SELECT coalesce(json_agg(
          json_build_object(
            'source', i.source,
            'variantId', cast(i.variant_id as text)
          )
        ), '[]'::json) FROM image i
        JOIN variant v ON v.product_id = p.id
        WHERE i.variant_id = v.id
    )
  ) INTO return_value
  FROM product p WHERE p.id = given_product_id;

  RETURN return_value;

END $$
;