// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "AC6af3ab49f0bc00d7e720d294fc75424f";
const authToken = "ba6ef5d4923fce9c9486712f631804fd";
const verifySid = "VA5f9511f0e19dd3919476d61e049fa342";
const client = require("twilio")(accountSid, authToken);
const message = "KINGURA | This is a test code: 324-456";

client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+233502960485", channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("KINGURA | This is a test code:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+233502960485", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
  });