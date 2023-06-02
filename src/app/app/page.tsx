import { getAgent } from "../agent";

export default async function AppPage() {
  const agent = await getAgent();
  const response = await agent.getProfile({
    actor: agent.session?.did!,
  });
  const {
    data: { feed },
  } = await agent.getTimeline();

  agent.getPost;

  return (
    <>
      <img src={response.data.avatar} width="100" height="100" />
      <h1>{response.data.displayName}</h1>
      <ul>
        {feed.map((item) => (
          <li key={item.post.cid}>
            <p>{item.post.author.displayName}</p>
            <p>{item.post.record.text}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
