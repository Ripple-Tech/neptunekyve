"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: { image: string }[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const user = useCurrentUser();
  const router = useRouter();
  const baseURl = process.env.NEXT_PUBLIC_APP_URL;

  const handleBuyWithEscrow = async () => {
    // Check if user is logged in
    if (!user) {
      console.log('User not logged in, redirecting to login page');
      router.push('/auth/login');
      return;
    }

    // Check if user has email (required for escrow)
    if (!user.email) {
      alert('User email is required to create an escrow. Please update your profile.');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating escrow with data:', {
        productName: product.name,
        amount: product.price,
        currency: "USD",
        description: product.description,
        buyerEmail: user.email,
      });

      const response = await fetch('/api/escrow/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: product.name,
          amount: product.price,
          currency: "USD",
          description: product.description,
          buyerEmail: user.email, // Now guaranteed to exist
        }),
      });

      const result = await response.json();
      
      console.log('API Response:', {
        status: response.status,
        statusText: response.statusText,
        result: result
      });

      if (result.success) {
        console.log('Escrow created successfully:', result.data);
        window.open(result.data.escrowUrl, '_blank');
      } else {
        // Log the complete error for debugging
        console.error('Complete error details:', result.error);
        
        // Show detailed error message to user
        if (result.error.details) {
          // If there are validation details, show them
          const errorDetails = Array.isArray(result.error.details) 
            ? result.error.details.map((detail: any) => `${detail.field}: ${detail.message}`).join('\n')
            : JSON.stringify(result.error.details, null, 2);
          
          alert(`Failed to create escrow:\n${result.error.message}\n\nDetails:\n${errorDetails}`);
        } else {
          alert(`Failed to create escrow: ${result.error.message}`);
        }
      }
    } catch (error) {
      console.error('Network or unexpected error:', error);
      alert('Network error creating escrow. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <Card className="border-none shadow-none">
        {product.images.length > 0 ? (
          <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
            <Image
              src={product.images[0].image}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 20vw"
            />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-t-xl bg-gray-100 text-gray-400">
            No image
          </div>
        )}
        <CardHeader>
          <CardTitle className="truncate">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 line-clamp-2 text-sm text-gray-600">
            {product.description || "No description"}
          </p>
          <div className="mb-3 text-base font-semibold">${product.price}</div>
          <Button 
            onClick={handleBuyWithEscrow}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating Escrow..." : "Buy with Escrow"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}