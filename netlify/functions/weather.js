// Docs on event and context https://docs.netlify.com/functions/build/#code-your-function-2
let fetch = require("node-fetch");
let dotenv = require("dotenv");
dotenv.config();
const handler = async (event) => {
  const userIP = event.headers["x-forwarded-for"];
  let name = event.queryStringParameters.visitor_name;
  
  const geolocation = await getGeoLocation(userIP);
  let city = geolocation.city;
  let latitude = geolocation.latitude;
  let longitude = geolocation.longitude;
  
  const weatherDetails = await getWeatherDetails(latitude, longitude);
  let temperature = weatherDetails.main.temp;
  let response = `Hello ${name}, the weather in ${city} is ${temperature} degrees celsius`;
  return {
    statusCode: 200,
    body: JSON.stringify(response),
  };
};

async function getGeoLocation(userIP) {
  const data = await fetch(
    `https://apiip.net/api/check?ip=${userIP}&accessKey=${process.env.geoLocationApiKey}`
  );

  const response = await data.json();
  return response;
}
async function getWeatherDetails(latitude, longitude) {
  const data = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.weatherApiKey}&units=metric`
  );
  const response = await data.json();
  return response;
}
module.exports = { handler };
