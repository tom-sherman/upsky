import type { BskyAgent } from "@atproto/api";
import { getAgent } from "../agent";

// Gotta do this because @atproto/api doesn't export this type
type FeedViewPost = Awaited<
  ReturnType<BskyAgent["getTimeline"]>
>["data"]["feed"][number];

export async function loadMore(cursor?: string) {
  "use server";
  const { feed, cursor: nextCursor } = await getTimeline(cursor);

  return {
    cursor: nextCursor,
    chunk: renderFeed(feed),
  };
}

async function getTimeline(cursor?: string, limit?: number) {
  const agent = await getAgent();
  const { data } = await agent.getTimeline({
    cursor,
    limit,
  });

  return data;
}

interface TimelineItemsProps {
  cursor?: string;
  limit?: number;
}

export async function TimelineItems({ cursor, limit }: TimelineItemsProps) {
  const { feed } = await getTimeline(cursor, limit);

  return renderFeed(feed);
}

function renderFeed(feed: FeedViewPost[]) {
  return feed.map((item) => (
    <div key={item.post.cid}>
      <strong>{item.post.author.displayName}</strong>
      <p>{item.post.record.text}</p>
    </div>
  ));
}
