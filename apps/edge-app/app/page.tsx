import { headers } from "next/headers";
import getClosestEdgeDatabase from "@crocoderdev/edge-db";
import { trpc } from "../src/utils/trpc";

async function getData() {
  const longitude = headers().get("x-vercel-ip-longitude") ?? "0";
  const latitude = headers().get("x-vercel-ip-latitude") ?? "0";

  const examples = await (
    await getClosestEdgeDatabase(Number(longitude), Number(latitude))
  )
    .selectFrom("Example")
    .selectAll()
    .execute();

  return examples;
}

export default async function Page() {
  const examples = await getData();
  return (
    <div>
      hello
      {examples.map((example) => (
        <div key={example.id}>{JSON.stringify(example)}</div>
      ))}
    </div>
  );
}
