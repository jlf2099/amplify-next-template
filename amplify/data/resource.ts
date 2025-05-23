import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
//import { type ClientSchema, a, defineData,defineModel } from "@aws-amplify/backend";

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rule below
specifies that any user authenticated via an API key can "create", "read",
"update", and "delete" any "Todo" records.
=========================================================================*/
const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
    UserTest: a.model({
      name: a.string(),
      email: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]), // You can add different authorization rules here
    client: a.model({
      name: a.string(),
      email: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]), // You can add different authorization rules here
  
  User: a.model({
    name: a.string(),
    email: a.string(),
    isVerified: a.boolean().default(false),
    role: a.string().default('GUEST'),
  })  .authorization((allow) => [allow.publicApiKey()]), // 👈 これが必要！

  Room: a.model({
    title: a.string(),
    description: a.string(),
  }).authorization((allow) => [allow.publicApiKey()]), 
  Message: a.model({
    content: a.string(),
    messageType: a.string().default('TEXT'),
    userId: a.id(),
    roomId: a.id(),
  }).authorization((allow) => [allow.publicApiKey()]), 
});


export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
