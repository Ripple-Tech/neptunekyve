import Image from "next/image";
import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex flex-col gap-y-4 items-center justify-center">
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/assets/logo.png"
          alt="NeptuneTech Logo"
          width={50}
          height={50}
          className="rounded-full object-contain"
        />
        <h1
          className={cn(
            "text-3xl font-semibold text-gray-900 tracking-tight",
            font.className
          )}
        >
          
        </h1>
      </Link>

      <p className="text-muted-foreground text-sm text-center">{label}</p>
    </div>
  );
};