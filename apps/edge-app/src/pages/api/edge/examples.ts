import { geolocation } from "@vercel/edge";

import getClosestEdgeDatabase from "@crocoderdev/edge-db";

export const config = {
  runtime: "experimental-edge",
};

const examples = async (req: Request) => {
  const { longitude, latitude } = geolocation(req);
  if (!longitude || !latitude)
    return new Response("No geolocation found", { status: 400 });
  const examples = (
    await getClosestEdgeDatabase(parseFloat(latitude), parseFloat(longitude))
  )
    .selectFrom("Example")
    .selectAll();

  return new Response(JSON.stringify({ examples }), {
    status: 200,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      "access-control-allow-origin": "*",
    },
  });
};

export default examples;
