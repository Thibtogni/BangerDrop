import { useQuery } from "@tanstack/react-query";
import MusicPost from "@/components/music-post";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post, User } from "@shared/schema";

type PostWithUser = Post & { user: User };

export default function ExplorePage() {
  const { data: trending, isLoading } = useQuery<PostWithUser[]>({
    queryKey: ["/api/posts/trending"],
  });

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Trending Tracks</h1>
      
      {isLoading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {trending?.map((post) => (
            <MusicPost
              key={post.id}
              post={post}
              onLike={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}
