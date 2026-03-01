import { config } from "./config.js";

const baseUrl = () => `https://${config.shopify.store}/admin/api/2024-10`;

function headers() {
  return {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": config.shopify.accessToken,
  };
}

/**
 * Fetch product by ID (numeric or gid).
 */
export async function getProduct(productId) {
  const id = String(productId).replace(/\D/g, "");
  const url = `${baseUrl()}/products/${id}.json`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Shopify getProduct failed: ${res.status} ${err}`);
  }
  const json = await res.json();
  return json.product;
}

/**
 * List products (first page).
 */
export async function listProducts(limit = 10) {
  const url = `${baseUrl()}/products.json?limit=${limit}`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Shopify listProducts failed: ${res.status} ${err}`);
  }
  const json = await res.json();
  return json.products;
}

/**
 * Get image URL for a product (first image) or by image index.
 */
export function getProductImageUrl(product, imageIndex = 0) {
  const images = product?.images ?? [];
  const img = images[imageIndex];
  return img?.src ?? null;
}

/**
 * Update product image alt text via GraphQL (recommended for 2024+).
 * Requires write_products scope.
 */
export async function updateProductImageAlt(productId, imageId, alt) {
  const url = `${baseUrl()}/graphql.json`;
  const gid = imageId.startsWith("gid://")
    ? imageId
    : `gid://shopify/ProductImage/${imageId}`;
  const mutation = `
    mutation productImageUpdate($input: ProductImageUpdateInput!) {
      productImageUpdate(input: $input) {
        image { id altText }
        userErrors { field message }
      }
    }
  `;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      query: mutation,
      variables: {
        input: {
          id: gid,
          altText: alt,
        },
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Shopify productImageUpdate failed: ${res.status} ${err}`);
  }
  const json = await res.json();
  const errors = json?.data?.productImageUpdate?.userErrors ?? [];
  if (errors.length) {
    throw new Error(errors.map((e) => e.message).join("; "));
  }
  return json?.data?.productImageUpdate?.image;
}

/**
 * Fetch image bytes from a URL (e.g. Shopify CDN).
 */
export async function fetchImageBytes(imageUrl) {
  const res = await fetch(imageUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch image: ${res.status} ${imageUrl}`);
  }
  return Buffer.from(await res.arrayBuffer());
}
