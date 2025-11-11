import { getProductById } from "@/actions/product";
import { ProductDetail } from "./_component/product-detail";

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id);
  if (!product) {
    return (
      <div className="p-12 text-center text-gray-600">
        Product not found or has been removed.
      </div>
    );
  }

  // Convert nulls to undefined for vendor, brand, category
  const safeProduct = {
    ...product,
    vendor: product.vendor ?? undefined,
    brand: product.brand ?? undefined,
    category: product.category ?? undefined,
  };

  return (
    <div className="relative">
      {/* subtle background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 mx-auto h-64 max-w-5xl bg-gradient-to-r from-rose-100 via-indigo-100 to-teal-100 blur-2xl opacity-70"
      />
      <ProductDetail product={safeProduct} />
    </div>
  );
}