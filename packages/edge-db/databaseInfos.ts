const databases = [
  {
    datacenter: "eu-central-1",
    geoLocation: { lat: 50.0992094, long: 8.682127 },
    DB_URL: process.env.EU_CENTRAL_1_DATABASE_URL,
  },
  {
    datacenter: "eu-west-2",
    geoLocation: { lat: 51.5085036, long: -0.060926 },
    DB_URL: process.env.EU_WEST_2_DATABASE_URL,
  },
  {
    datacenter: "us-east-1",
    geoLocation: { lat: 38.9940541, long: -77.4524237 },
    DB_URL: process.env.US_EAST_1_DATABASE_URL,
  },
  {
    datacenter: "us-west-2",
    geoLocation: { lat: 45.9174667, long: -119.2684488 },
    DB_URL: process.env.US_WEST_2_DATABASE_URL,
  },
  /*{
    datacenter: "ap-southeast-1",
    geoLocation: { lat: 1.3218269, long: 103.6930643 },
    DB_URL: process.env.AP_SOUTHEAST_1_DATABASE_URL,
  },
  {
    datacenter: "ap-southeast-2",
    geoLocation: { lat: -33.9117717, long: 151.1907535 },
    DB_URL: process.env.AP_SOUTHEAST_2_DATABASE_URL,
  },
  {
    datacenter: "ap-northeast-1",
    geoLocation: { lat: 35.617436, long: 139.7459176 },
    DB_URL: process.env.AP_NORTHEAST_1_DATABASE_URL,
  },
  {
    datacenter: "ap-south-1",
    geoLocation: { lat: 19.2425503, long: 72.9667878 },
    DB_URL: process.env.AP_SOUTH_1_DATABASE_URL,
  },*/
];

export default databases;
