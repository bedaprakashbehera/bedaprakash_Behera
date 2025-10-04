import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Welcome to Social</h1>
      <p className="text-gray-600">A simple social app with posts and profiles.</p>
      {session?.user ? (
        <div className="space-x-3">
          <Link href="/feed" className="px-3 py-2 border rounded">Go to feed</Link>
          <Link href="/profile" className="px-3 py-2 border rounded">Your profile</Link>
        </div>
      ) : (
        <div className="space-x-3">
          <Link href="/login" className="px-3 py-2 border rounded">Login</Link>
          <Link href="/register" className="px-3 py-2 border rounded">Sign up</Link>
        </div>
      )}
    </div>
  );
}
