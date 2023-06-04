import type { AppBskyFeedDefs } from "@atproto/api";
import { getAgent } from "../agent";

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

function TimelineItem({ item }: { item: AppBskyFeedDefs.FeedViewPost }) {
  return (
    <div>
      <strong>{item.post.author.displayName}</strong>
      <p>{(item.post.record as any).text}</p>
    </div>
  );
}

function renderFeed(feed: AppBskyFeedDefs.FeedViewPost[]) {
  return feed.map((item) => <TimelineItem key={item.post.cid} item={item} />);
}
