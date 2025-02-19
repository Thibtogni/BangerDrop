import { useQuery, useMutation } from "@tanstack/react-query";
import ShareMusic from "@/components/share-music";
import MusicPost from "@/components/music-post";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";
import type { Post, User } from "@shared/schema";

type PostWithUser = Post & { user: User };

export default function HomePage() {
  const { data: posts, isLoading } = useQuery<PostWithUser[]>({
    queryKey: ["/api/posts"],
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: number) => {
      await apiRequest("POST", `/api/posts/${postId}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <ShareMusic />
      
      {isLoading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {posts?.map((post) => (
            <MusicPost
              key={post.id}
              post={post}
              onLike={() => likeMutation.mutate(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
