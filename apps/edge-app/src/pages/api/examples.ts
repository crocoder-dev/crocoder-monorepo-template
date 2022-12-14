import { geolocation } from "@vercel/edge";
import { type NextApiRequest, type NextApiResponse } from "next";

import getClosestEdgeDatabase from "@crocoderdev/edge-db";

export const config = {
  runtime: "experimental-edge",
};

const examples = async (req: NextApiRequest, res: NextApiResponse) => {
  const { longitude, latitude } = geolocation(req as unknown as Request);
  if (!longitude || !latitude)
    return new Response("No geolocation found", { status: 400 });
  const examples = (
    await getClosestEdgeDatabase(parseFloat(latitude), parseFloat(longitude))
  )
    .selectFrom("Example")
    .selectAll();

  res.status(200).json(examples);
};

export default examples;
