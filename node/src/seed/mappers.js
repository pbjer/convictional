function mapperA(product) {
  let mappedProduct = {
    id: product.id,
    title: product.title,
    vendor: product.vendor,
    bodyHtml: product.body_html,
  };

  let mappedVariants = [];
  let mappedImages = [];

  product.variants.forEach((v) => {
    mappedVariants.push({
      id: v.id,
      productId: v.product_id,
      title: v.title,
      sku: v.sku,
      inventoryQuantity: 0,
      weightValue: v.weight,
      weightUnit: v.weight_unit,
    });

    v.images.forEach((i) => {
      mappedImages.push({
        variantId: v.id,
        source: i.src,
      });
    });
  });

  return {
    product: mappedProduct,
    variants: mappedVariants,
    images: mappedImages,
  };
}

module.exports = { mapperA };
