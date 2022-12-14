import databaseInfos from "./databaseInfos";
import DB from "./db";
import { Kysely } from "kysely";
import { PlanetScaleDialect } from "kysely-planetscale";
import databases from "./databaseInfos";

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/* hav = haversine
 * d = distance
 */
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const hav =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) ** 2;
  const d = 2 * R * Math.atan2(Math.sqrt(hav), Math.sqrt(1 - hav));
  return d;
};

export const getClosestDatabaseURL = (lat: number, long: number) => {
  let closestDistance = Infinity;
  let closestDatabase = databases[0]?.DB_URL;
  let closestDatacenter = null;
  let closestGeolocation = null;

  for (const database of databaseInfos) {
    const distance = calculateDistance(
      lat,
      long,
      database.geoLocation.lat,
      database.geoLocation.long,
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestDatabase = database.DB_URL;
      closestDatacenter = database.datacenter;
      closestGeolocation = database.geoLocation;
    }
  }
  console.log(
    `Closest database from ${lat},${long} is ${closestDatacenter} (${closestDistance}km ${closestGeolocation?.lat},${closestGeolocation.long} )`,
  );
  return closestDatabase;
};

export const getClosestEdgeDatabase = async (lat: number, long: number) => {
  return new Kysely<DB>({
    dialect: new PlanetScaleDialect({
      url: getClosestDatabaseURL(lat, long),
    }),
  });
};
