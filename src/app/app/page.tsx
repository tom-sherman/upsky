import { Suspense } from "react";
import { getAgent } from "../agent";
import { Timeline } from "./Timeline";
import { loadMore } from "./timeline-server";

export default async function AppPage() {
  const agent = await getAgent();
  const response = await agent.getProfile({
    actor: agent.session?.did!,
  });

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div>
        <img src={response.data.avatar} width="100" height="100" />
        <h1
          style={{
            textOverflow: "clip",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {response.data.displayName}
        </h1>
      </div>
      <div style={{ flexGrow: 1 }}>
        <Suspense>
          <InitialTimeline />
        </Suspense>
      </div>
    </div>
  );
}

async function InitialTimeline() {
  const { chunk, cursor } = await loadMore();

  return (
    <Timeline
      initialChunk={chunk}
      initialCursor={cursor}
      loadMoreAction={loadMore}
    />
  );
}
