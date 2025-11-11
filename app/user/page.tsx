// app/user/page.tsx
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function UserPage() {
  const session = await auth();

  // 🚫 Redirect if not logged in
  if (!session?.user) {
    redirect("/auth/login");
  }

  const { user } = session;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="flex flex-col items-center">
          <CardTitle className="text-xl font-semibold text-gray-900">
            Welcome, {user.name || "User"} 👋
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <Image
              src={user.image || "/assets/avatar-placeholder.png"}
              alt="User avatar"
              width={80}
              height={80}
              className="rounded-full object-cover border border-gray-200"
            />
            <p className="text-gray-700 text-sm">
              <strong>Email:</strong> {user.email || "Not provided"}
            </p>
            {user.role && (
              <p className="text-gray-700 text-sm">
                <strong>Role:</strong> {user.role}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-2">
            <Link href="/profile/edit">
              <Button variant="default" className="w-full">
                Edit Profile
              </Button>
            </Link>
            <Link href="/user/orders">
              <Button variant="outline" className="w-full">
                View Orders
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="w-full">
                View Cart
              </Button>
            </Link>
            {/* Logout */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="destructive" className="w-full" type="submit">
                Log Out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}