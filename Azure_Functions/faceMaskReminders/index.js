const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
const CosmosClient = require("@azure/cosmos").CosmosClient;
// function has not been deployed yet

const config = {
  endpoint: process.env.ENDPOINT,
  key: process.env.KEY,
  databaseId: "EmailStorer",
  containerId: "emails",
  partitionKey: { kind: "Hash", paths: ["/emails"] },
};

module.exports = async function (context, myTimer) {
  try {
    await getEmails();
  } catch (e) {
    console.log(e);
  }

  return {
    body: "emails have been sent",
  };
};

async function getEmails() {
  let emails = [];
  var { endpoint, key, databaseId, containerId } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);

  const querySpec = {
    query: "SELECT * from c",
  };

  // read all items in the Items container
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  items.forEach((item) => {
    emails.push(item.email);
  });
  await sendMail("Time to wash your hands!", emails);
}

async function sendMail(message, emails) {
  console.log(emails);
  console.log(emails.length);

  for (var i = 0; i < emails.length; i++) {
    const receiveNumber = convertNum(emails[i]);
    console.log(receiveNumber);
    client.messages
      .create({
        body: message,
        from: "<PHONE NUMBER>",
        to: receiveNumber,
      })
      .then((message) => console.log(message.sid));
  }
}

function convertNum(origNum) {
  return "+1" + origNum;
}
