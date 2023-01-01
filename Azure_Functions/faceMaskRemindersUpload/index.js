const CosmosClient = require("@azure/cosmos").CosmosClient;

const config = {
  endpoint: process.env.ENDPOINT,
  key: process.env.KEY,
  databaseId: "EmailStorer",
  containerId: "emails",
  partitionKey: { kind: "Hash", paths: ["/emails"] }
}

module.exports = async function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');

  const email = req.headers.email;
  console.log(email)

  let response = await createDocument({ "email": email })
  context.log(response)
  context.res = {
    // status: 200, /* Defaults to 200 */
    body: {
      response
    }
  };

  // returns null if the email is repeated
  // returns "created successfully"
}


async function create(client, databaseId, containerId) {
  const partitionKey = config.partitionKey;

  /**
   * Create the database if it does not exist
   */
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  });
  console.log(`Created database:\n${database.id}\n`);

  /**
   * Create the container if it does not exist
   */
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    );

  console.log(`Created container:\n${container.id}\n`);
}

async function createDocument(document) {
  var { endpoint, key, databaseId, containerId } = config;
  const client = new CosmosClient({ endpoint, key });
  const database = client.database(databaseId);
  const container = database.container(containerId);
  await create(client, databaseId, containerId);

  // check if already in container

  let repeatEmail = await checkForRepeat(document.email, container);

  if (repeatEmail) {
    console.log("repeat detected")
    return null;
  }
  console.log("no repeat")
  const { resource: createdItem } = await container.items.create(document);
  return "created successfully"
}

async function checkForRepeat(email, container) {
  console.log(email)
  let result;
  const querySpec = {
    query: "SELECT * from c"
  };

  // read all items in the Items container
  const { resources: items } = await container.items
    .query(querySpec)
    .fetchAll();

  items.forEach(item => {
    if (item.email == email) {
      result = true;
    }
  });

  if (result) {
    return result;
  }
  return false;
}