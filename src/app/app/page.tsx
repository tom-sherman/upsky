import { getAgent } from "../agent";
import { Timeline } from "./Timeline";
import { TimelineItems, loadMore } from "./timeline-server";

export default async function AppPage() {
  const agent = await getAgent();
  const response = await agent.getProfile({
    actor: agent.session?.did!,
  });
  const { chunk, cursor } = await loadMore();

  return (
    <>
      <img src={response.data.avatar} width="100" height="100" />
      <h1>{response.data.displayName}</h1>
      <Timeline
        initialChunk={chunk}
        initialCursor={cursor}
        loadMoreAction={loadMore}
      />
    </>
  );
}
