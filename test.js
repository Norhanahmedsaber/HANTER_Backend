const dns = require("dns");
const url = require("url");

// Function to verify the IP address of a URL
function verifyUrl(urlString) {
  const parsedUrl = url.parse(urlString);
  console.log(parsedUrl)

  // Check if the URL has a valid hostname
  if (!parsedUrl.hostname) {
    console.error("Invalid URL");
    return;
  }

  // Lookup the IP address of the hostname
  dns.lookup(parsedUrl.hostname, (error, address, family) => {
    if (error) {
      console.error(error);
    } else {
      console.log(
        `The IP address of ${parsedUrl.hostname} is ${address} and the IP version is ${family}`
      );
    }
  });
}

// Example: Verify the URL of a repository
const repositoryUrl = "https://github.com/example/repo";
verifyUrl(repositoryUrl);
