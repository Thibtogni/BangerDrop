import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle } from "lucide-react";
import type { Post, User } from "@shared/schema";

type MusicPostProps = {
  post: Post & { user: User };
  onLike: () => void;
};

export default function MusicPost({ post, onLike }: MusicPostProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          {post.user.avatarUrl && <AvatarImage src={post.user.avatarUrl} />}
          <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{post.user.username}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{post.caption}</p>
        <iframe
          src={`https://open.spotify.com/embed/track/${post.spotifyUrl.split('/').pop()}`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="encrypted-media"
        />
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={onLike}
        >
          <Heart className="h-4 w-4" />
          {post.likes}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" />
          Comment
        </Button>
      </CardFooter>
    </Card>
  );
}