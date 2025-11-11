import Link from "next/link";
import { getAllProducts } from "@/actions/product";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/productCard";

export const revalidate = 0;

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="relative">
      {/* ... same background and header ... */}
      
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Products</h1>
          <Link href="/products/new">
            <Button>Create</Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-md border border-gray-200 bg-white p-6 text-center text-gray-600">
            No products yet. Create your first one.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}