import { auth } from "@/auth";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { prisma } from "@/lib/db";
import Link from "next/link";

async function getPosts() {
  return prisma.post.findMany({
    include: { author: true, likes: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}

export default async function FeedPage() {
  const session = await auth();
  if (!session?.user) {
    return (
      <div>
        <p>Please login to view the feed.</p>
        <Link href="/login" className="underline">Go to login</Link>
      </div>
    );
  }

  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Feed</h1>
      <CreatePostForm />
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.id} className="border rounded p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>@{p.author.username}</span>
              <span>{new Date(p.createdAt).toLocaleString()}</span>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{p.content}</p>
            <div className="mt-2 text-sm text-gray-600">{p.likes.length} likes</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CreatePostForm() {
  return (
    <form action={createPost} className="space-y-3">
      <textarea
        name="content"
        className="w-full border rounded p-2"
        placeholder="What's happening?"
        rows={3}
        required
      />
      <button className="px-3 py-2 bg-black text-white rounded" type="submit">
        Post
      </button>
    </form>
  );
}

async function createPost(formData: FormData) {
  "use server";
  const session = await auth();
  if (!session?.user?.id) return;
  const content = String(formData.get("content") ?? "").trim();
  if (!content) return;
  await prisma.post.create({ data: { content, authorId: session.user.id } });
}
