const http = require("http");

const data = JSON.stringify({
  customerName: "Ananya",
  title: "Internet not working",
  description: "Customer cannot access the internet.",
  priority: "High",
  status: "Open"
});

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/tickets",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(data)
  }
};

const request = http.request(options, (response) => {
  let result = "";

  response.on("data", (chunk) => {
    result += chunk;
  });

  response.on("end", () => {
    console.log(result);
  });
});

request.on("error", (error) => {
  console.error(error);
});

request.write(data);
request.end();