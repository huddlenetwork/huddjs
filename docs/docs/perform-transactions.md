---
sidebar_label: "Performing transactions"
sidebar_position: 2
---

# Performing transactions

## Overview

In order to be able to perform transactions you need to do the following steps:

1. create a  [`Signer`](api/classes/desmoslabs_desmjs.Signer.md) instance
2. create a [`DesmosClient`](api/classes/desmoslabs_desmjs.DesmosClient.md) instance with the
[`connectWithSigner`](api/classes/desmoslabs_desmjs.DesmosClient.md#connectwithsigner) function
3. build the messages that you want to include inside the transaction
4. sign and broadcast the messages with the
[`signAndBroadcast`](api/classes/desmoslabs_desmjs.DesmosClient.md#signandbroadcast) method

Here is an example of code that showcase all the steps:

```js
import { DesmosClient, OfflineSignerAdapter, SigningMode, GasPrice } from "@desmoslabs/desmjs";


// Generate a signer with a random mnmonic. To see the available signer go to the Signers section.
const signer = await OfflineSignerAdapter.generate(SigningMode.DIRECT, 24);

const client = await DesmosClient.connectWithSigner('https://rpc.mainnet.desmos.network', signer, {
  // Common gas price in the Desmos mainnet.
  gasPrice: GasPrice.fromString("0.01udsm"),
});

// Get the signer address from the signer.
const [signerAddress] = await signer.getAccounts();

// Save profile message
const saveProfile: MsgSaveProfileEncodeObject = {
  typeUrl: "/desmos.profiles.v3.MsgSaveProfile",
  value: {
    creator: signerAddress,
    bio: "The price of all saiyans",
    dtag: "vegeta",
    nickname: "Vegeta",
    coverPicture: "https://ipfs.io/ipfs/<CID>",
    profilePicture: "https://ipfs.io/ipfs/<CID>",
  }
};

// Message to create a post inside a subspace
const createPost: MsgCreatePostEncodeObject = {
  typeUrl: "/desmos.posts.v2.MsgCreatePost",
  value: MsgCreatePost.fromPartial({
    subspaceId: Long.fromNumber(1),
    author: signerAddress,
    text: "post content",
    replySettings: ReplySetting.REPLY_SETTING_EVERYONE
  })
};

// Message to be sent to the chain, they will be executed sequentialy from first to last.
const messages: EncodeObject[] = [saveProfile, createPost];

// Fee paid to perform the operations.
const fees: number | StdFee | "auto" = "auto";

// Optional memo that can be attached to the transaction, max lengh 256 characters.
const memo: string | undefined = undefined;

await client.signandbroadcast(signerAddress, messages, fees, memo);
```

### Automatic fees estimation

The `DesmosClient` class can estimate the fees for you before broadcasting the messages.  
To enable this feature you must provide the `gasPrice` through the `options` 
param of [`connectWithSigner`](api/classes/desmoslabs_desmjs.DesmosClient.md#connectwithsigner).  

To compute the fees the `DesmosClient` will first estimate the amount of gas required asking the chain to simulate
an execution with the messages that you want to execute and then will multiply that value for `gasPrice`.
The resulting fees then will be `gasPrice` * estimated gas.

When you enable this feature you can pass one of the following values as a `fee` param of 
[`signandbroadcast`](api/classes/desmoslabs_desmjs.DesmosClient.md#signandbroadcast):
* `"auto"`: To automatically estimated the fees based on the messages that you want to broadcast;
* a `number`: Multiplication factor used to estimate the gas and fees from the provided messages. When using `"auto"` this
value is `1.3` so the gas used to compute the fees is equal to 1.3 \* estimated gas.

## Signers

The `@desmoslabs/desmjs` provides a set of signers that can be used, here you can find the list:

1. [`OfflineSignerAdapter`](api/classes/desmoslabs_desmjs.OfflineSignerAdapter.md): This can be used to create
a signer from a 12/24 words mnemonic or any signer that implements the `@cosmjs/OfflineAminoSigner` or 
`@cosmjs/OfflineDirectSigner`;
2. [`PrivateKeySigner`](api/classes/desmoslabs_desmjs.PrivateKeySigner.md): This can be used to create 
a signer from a private key.

If none of this signer meet your needs you can implement a custom signer by extending the 
[`Signer`](api/classes/desmoslabs_desmjs.Signer.md) class.  
For references on how to implement a custom `Signer` you can take a look inside the demsjs 
[GitHub repo](https://github.com/desmos-labs/desmjs/tree/main/packages).  
Some worth to take a look are:
1. [@desmoslabs/desmjs-walletconnect-v2](https://github.com/desmos-labs/desmjs/tree/main/packages/walletconnect-v2): 
Signer that use WalletConnect to sign transactions;
2. [@desmoslabs/desmjs-web3auth-web](https://github.com/desmos-labs/desmjs/tree/main/packages/web3auth-web): 
Signer that receive a Secp256k1 private key from Web3Auth.

## Messages

Here is the list of messages that can be sent divided by module:

### Profiles

* [MsgSaveProfileEncodeObject](api/interfaces/desmoslabs_desmjs.MsgSaveProfileEncodeObject.md): 
Creates/updates the user's Desmos profile.
* [MsgDeleteProfileEncodeObject](api/interfaces/desmoslabs_desmjs.MsgDeleteProfileEncodeObject.md): 
Deletes the user's Desmos profile.
* [MsgLinkApplicationEncodeObject](api/interfaces/desmoslabs_desmjs.MsgLinkApplicationEncodeObject.md): 
Link a centralized application to the user's Desmos profile
* [MsgUnlinkApplicationEncodeObject](api/interfaces/desmoslabs_desmjs.MsgUnlinkApplicationEncodeObject.md): 
Unlink a centralized application from the user's Desmos profile
* [MsgLinkChainAccountEncodeObject](api/interfaces/desmoslabs_desmjs.MsgLinkChainAccountEncodeObject.md): 
Link an external blockchain address to the user's Desmos profile
* [MsgUnlinkChainAccountEncodeObject](api/interfaces/desmoslabs_desmjs.MsgUnlinkChainAccountEncodeObject.md):
Unlink an external blockchain address from the user's Desmos profile
* [MsgRequestDTagTransferEncodeObject](api/interfaces/desmoslabs_desmjs.MsgRequestDTagTransferEncodeObject.md):
Create a DTag transfer request
* [MsgAcceptDTagTransferRequestEncodeObject](api/interfaces/desmoslabs_desmjs.MsgAcceptDTagTransferRequestEncodeObject.md):
Accept a DTag transfer request
* [MsgRefuseDTagTransferRequestEncodeObject](api/interfaces/desmoslabs_desmjs.MsgRefuseDTagTransferRequestEncodeObject.md):
Refuse a DTag transfer request
* [MsgCancelDTagTransferRequestEncodeObject](api/interfaces/desmoslabs_desmjs.MsgCancelDTagTransferRequestEncodeObject.md):
Cancel a DTag transfer initiate from the user

### Relationships

* [MsgCreateRelationshipEncodeObject](api/interfaces/desmoslabs_desmjs.MsgCreateRelationshipEncodeObject.md):
Create a relationship between two users (A follow B)
* [MsgDeleteRelationshipEncodeObject](api/interfaces/desmoslabs_desmjs.MsgDeleteRelationshipEncodeObject.md):
Delete a relationship between two users (A unfollow B)
* [MsgBlockUserEncodeObject](api/interfaces/desmoslabs_desmjs.MsgBlockUserEncodeObject.md): 
Block a user
* [MsgUnblockUserEncodeObject](api/interfaces/desmoslabs_desmjs.MsgUnblockUserEncodeObject.md):
Unblock a user

### Subspaces

* [MsgCreateSubspaceEncodeObject](api/interfaces/desmoslabs_desmjs.MsgCreateSubspaceEncodeObject.md):
Creates a subspace
* [MsgEditSubspaceEncodeObject](api/interfaces/desmoslabs_desmjs.MsgEditSubspaceEncodeObject.md):
Edit a previously created subspace
* [MsgDeleteSubspaceEncodeObject](api/interfaces/desmoslabs_desmjs.MsgDeleteSubspaceEncodeObject.md):
Delete a subspace
* [MsgCreateSectionEncodeObject](api/interfaces/desmoslabs_desmjs.MsgCreateSectionEncodeObject.md):
Create a new section
* [MsgDeleteSectionEncodeObject](api/interfaces/desmoslabs_desmjs.MsgDeleteSectionEncodeObject.md):
Delete a section
* [MsgEditSectionEncodeObject](api/interfaces/desmoslabs_desmjs.MsgEditSectionEncodeObject.md):
Edit a previously created section
* [MsgMoveSectionEncodeObject](api/interfaces/desmoslabs_desmjs.MsgMoveSectionEncodeObject.md):
Move a section to another section
* [MsgCreateUserGroupEncodeObject](api/interfaces/desmoslabs_desmjs.MsgCreateUserGroupEncodeObject.md):
Create a user group
* [MsgEditUserGroupEncodeObject](api/interfaces/desmoslabs_desmjs.MsgEditUserGroupEncodeObject.md):
Edit a previously created user group
* [MsgDeleteUserGroupEncodeObject](api/interfaces/desmoslabs_desmjs.MsgDeleteUserGroupEncodeObject.md):
Delete a user group
* [MsgMoveUserGroupEncodeObject](api/interfaces/desmoslabs_desmjs.MsgMoveUserGroupEncodeObject.md):
Move a user group to another section
* [MsgAddUserToUserGroupEncodeObject](api/interfaces/desmoslabs_desmjs.MsgAddUserToUserGroupEncodeObject.md): 
Add a user to a user group
* [MsgRemoveUserFromUserGroupEncodeObject](api/interfaces/desmoslabs_desmjs.MsgRemoveUserFromUserGroupEncodeObject.md): 
Remove a user from a user group
* [MsgSetUserPermissionsEncodeObject](api/interfaces/desmoslabs_desmjs.MsgSetUserPermissionsEncodeObject.md):
Set the permissions of a user inside a subspace
* [MsgSetUserGroupPermissionsEncodeObject](api/interfaces/desmoslabs_desmjs.MsgSetUserGroupPermissionsEncodeObject.md):
Set the permissions that all members of a group will inherit

### Posts

* [MsgCreatePostEncodeObject](api/interfaces/desmoslabs_desmjs.MsgCreatePostEncodeObject.md):
Create a new post
* [MsgDeletePostEncodeObject](api/interfaces/desmoslabs_desmjs.MsgDeletePostEncodeObject.md):
Delete a post
* [MsgEditPostEncodeObject](api/interfaces/desmoslabs_desmjs.MsgEditPostEncodeObject.md):
Edit a previously created post
* [MsgAddPostAttachmentEncodeObject](api/interfaces/desmoslabs_desmjs.MsgAddPostAttachmentEncodeObject.md):
Add an attachment to a post
* [MsgRemovePostAttachmentEncodeObject](api/interfaces/desmoslabs_desmjs.MsgRemovePostAttachmentEncodeObject.md):
Remove an attachment from a post
* [MsgAnswerPollEncodeObject](api/interfaces/desmoslabs_desmjs.MsgAnswerPollEncodeObject.md):
Answer a poll

### Reactions

* [MsgAddReactionEncodeObject](api/interfaces/desmoslabs_desmjs.MsgAddReactionEncodeObject.md):
Add a reaction to a post
* [MsgRemoveReactionEncodeObject](api/interfaces/desmoslabs_desmjs.MsgRemoveReactionEncodeObject.md):
Remove a reaction from a post
* [MsgAddRegisteredReactionEncodeObject](api/interfaces/desmoslabs_desmjs.MsgAddRegisteredReactionEncodeObject.md):
Register a new supported reaction for a subspace
* [MsgRemoveRegisteredReactionEncodeObject](api/interfaces/desmoslabs_desmjs.MsgRemoveRegisteredReactionEncodeObject.md):
Remove a registered reaction from a subspace
* [MsgEditRegisteredReactionEncodeObject](api/interfaces/desmoslabs_desmjs.MsgEditRegisteredReactionEncodeObject.md):
Edit a previously registered reaction
* [MsgSetReactionsParamsEncodeObject](api/interfaces/desmoslabs_desmjs.MsgSetReactionsParamsEncodeObject.md):
Set the reactions params for a subspace

### Reports

* [MsgCreateReportEncodeObject](api/interfaces/desmoslabs_desmjs.MsgCreateReportEncodeObject.md):
Create a report inside a subspace
* [MsgDeleteReportEncodeObject](api/interfaces/desmoslabs_desmjs.MsgDeleteReportEncodeObject.md):
Delete a previously created report from a subspace
* [MsgSupportStandardReasonEncodeObject](api/interfaces/desmoslabs_desmjs.MsgSupportStandardReasonEncodeObject.md):
Support one reason from the module params
* [MsgAddReasonEncodeObject](api/interfaces/desmoslabs_desmjs.MsgAddReasonEncodeObject.md):
Add a new supported reason to a subspace
* [MsgRemoveReasonEncodeObject](api/interfaces/desmoslabs_desmjs.MsgRemoveReasonEncodeObject.md):
Remove a previously created reason

## Examples

Here are some examples that showcase how to interact with the various Desmos modules.

### Create a profile

Here an example that showcase how to create a Desmos profile:

```js
import { DesmosClient, GasPrice, MsgSaveProfileEncodeObject } from "@desmoslabs/desmjs";


const signer = ...; // Your signer
const client = await DesmosClient.connectWithSigner('https://rpc.mainnet.desmos.network', signer, {
  // Common gas price in the Desmos mainnet.
  gasPrice: GasPrice.fromString("0.01udsm"),
});

const saveProfile: MsgSaveProfileEncodeObject = {
  typeUrl: "/desmos.profiles.v3.MsgSaveProfile",
  value: {
    creator: "desmos...",
    bio: "The price of all saiyans",
    dtag: "vegeta",
    nickname: "Vegeta",
    coverPicture: "https://ipfs.io/ipfs/<CID>",
    profilePicture: "https://ipfs.io/ipfs/<CID>",
  }
};

await client.signAndBroadcast(saveProfile.value.creator, [saveProfile], "auto");
```

### Create a relationship

Here an example that showcase how to create a relationships:

```js
import Long from "long";
import { DesmosClient, GasPrice, MsgCreateRelationshipEncodeObject } from "@desmoslabs/desmjs";


const signer = ...; // Your signer
const client = await DesmosClient.connectWithSigner('https://rpc.mainnet.desmos.network', signer, {
  // Common gas price in the Desmos mainnet.
  gasPrice: GasPrice.fromString("0.01udsm"),
});

const createRelationship: MsgCreateRelationshipEncodeObject = {
  typeUrl: "/desmos.relationships.v1.MsgCreateRelationship",
  value: {
    signer: "desmos...",
    subspaceId: Long.fromNumber(1),
    counterparty: "desmos..."
  }
};

await client.signAndBroadcast(createRelationship.value.signer, [createRelationship], "auto");
```

### Create a subspace

Here an example that showcase how to create a subspace:

```js
import { DesmosClient, GasPrice, MsgCreateSubspaceEncodeObject } from "@desmoslabs/desmjs";


const signer = ...; // Your signer
const client = await DesmosClient.connectWithSigner('https://rpc.mainnet.desmos.network', signer, {
  // Common gas price in the Desmos mainnet.
  gasPrice: GasPrice.fromString("0.01udsm"),
});

const createSubspace: MsgCreateSubspaceEncodeObject = {
  typeUrl: "/desmos.subspaces.v3.MsgCreateSubspace",
  value: {
    creator: "desmos...",
    name: "Desmos subspace",
    owner: "desmos...",
    treasury: "desmos...",
    description: "Subspace where to store my app contente"
  }
};

await client.signAndBroadcast(createSubspace.value.creator, [createSubspace], "auto");
```


### Create a post

Here an example that showcase how to create a post:

```js
import Long from "long";
import { ReplySetting } from "@desmoslabs/desmjs-types/desmos/posts/v2/models";
import { MsgCreatePost } from "@desmoslabs/desmjs-types/desmos/posts/v2/msgs";
import { DesmosClient, GasPrice, MsgCreatePostEncodeObject } from "@desmoslabs/desmjs";

const signer = ...; // Your signer
const client = await DesmosClient.connectWithSigner('https://rpc.mainnet.desmos.network', signer, {
  // Common gas price in the Desmos mainnet.
  gasPrice: GasPrice.fromString("0.01udsm"),
});

const createPost: MsgCreatePostEncodeObject = {
  typeUrl: "/desmos.posts.v2.MsgCreatePost",
  value: MsgCreatePost.fromPartial({
    subspaceId: Long.fromNumber(1),
    author: "desmos...",
    text: "post content",
    replySettings: ReplySetting.REPLY_SETTING_EVERYONE
  })
};

await client.signAndBroadcast(createPost.value.author, [createPost], "auto");
```

### React to a post with some text

Here an example that showcase how to react to a post:

```js
import Long from "long";
import { FreeTextValue } from "@desmoslabs/desmjs-types/desmos/reactions/v1/models";
import { DesmosClient, GasPrice, MsgAddReactionEncodeObject } from "@desmoslabs/desmjs";

const signer = ...; // Your signer
const client = await DesmosClient.connectWithSigner('https://rpc.mainnet.desmos.network', signer, {
  // Common gas price in the Desmos mainnet.
  gasPrice: GasPrice.fromString("0.01udsm"),
});

const addReaction: MsgAddReactionEncodeObject = {
  typeUrl: "/desmos.reactions.v1.MsgAddReaction",
  value: {
    user: "desmos...",
    postId: Long.fromNumber(1),
    subspaceId: Long.fromNumber(1),
    value: {
      typeUrl: "/desmos.reactions.v1.FreeTextValue",
      value: FreeTextValue.encode({
        text: "nice post",
      }).finish()
    }
  }
};

await client.signAndBroadcast(addReaction.value.user, [addReaction], "auto");
```

### React to a post with a registered reaction

Here an example that showcase how to react to a post:

```js
import Long from "long";
import { RegisteredReactionValue } from "@desmoslabs/desmjs-types/desmos/reactions/v1/models";
import { DesmosClient, GasPrice, MsgAddReactionEncodeObject } from "@desmoslabs/desmjs";

const signer = ...; // Your signer
const client = await DesmosClient.connectWithSigner('https://rpc.mainnet.desmos.network', signer, {
  // Common gas price in the Desmos mainnet.
  gasPrice: GasPrice.fromString("0.01udsm"),
});

const addReaction: MsgAddReactionEncodeObject = {
  typeUrl: "/desmos.reactions.v1.MsgAddReaction",
  value: {
    user: "desmos...",
    postId: Long.fromNumber(1),
    subspaceId: Long.fromNumber(1),
    value: {
      typeUrl: "/desmos.reactions.v1.RegisteredReactionValue",
      value: RegisteredReactionValue.encode({
        registeredReactionId: 1,
      }).finish()
    }
  }
};

await client.signAndBroadcast(addReaction.value.user, [addReaction], "auto");
```

### Report a user

Here an example that showcase how to report a user inside a subspace:

```js
import Long from "long";
import { DesmosClient, GasPrice, MsgCreateReportEncodeObject } from "@desmoslabs/desmjs";
import { UserTarget } from "@desmoslabs/desmjs-types/desmos/reports/v1/models";

const signer =...; // Your signer
const client = await DesmosClient.connectWithSigner("https://rpc.mainnet.desmos.network", signer, {
  // Common gas price in the Desmos mainnet.
  gasPrice: GasPrice.fromString("0.01udsm")
});

const reportUser: MsgCreateReportEncodeObject = {
  typeUrl: "/desmos.reports.v1.MsgCreateReport",
  value: {
    reporter: "desmos...",
    subspaceId: Long.fromNumber(1),
    message: "This user have a bad behaviour",
    reasonsIds: [1],
    target: {
      typeUrl: "/desmos.reports.v1.UserTarget",
      value: UserTarget.encode({
        user: "desmos..."
      }).finish()
    }
  }
};

await client.signAndBroadcast(reportUser.value.reporter, [reportUser], "auto");
```

### Report another user post

Here an example that showcase how to report another user post:

```js
import Long from "long";
import { DesmosClient, GasPrice, MsgCreateReportEncodeObject } from "@desmoslabs/desmjs";
import { PostTarget } from "@desmoslabs/desmjs-types/desmos/reports/v1/models";

const signer =...; // Your signer
const client = await DesmosClient.connectWithSigner("https://rpc.mainnet.desmos.network", signer, {
  // Common gas price in the Desmos mainnet.
  gasPrice: GasPrice.fromString("0.01udsm")
});

const reportPost: MsgCreateReportEncodeObject = {
  typeUrl: "/desmos.reports.v1.MsgCreateReport",
  value: {
    reporter: "desmos...",
    subspaceId: Long.fromNumber(1),
    message: "This user have a bad behaviour",
    reasonsIds: [1],
    target: {
      typeUrl: "/desmos.reports.v1.UserTarget",
      value: PostTarget.encode({
        postId: Long.fromNumber(1)
      }).finish()
    }
  }
};

await client.signAndBroadcast(reportPost.value.reporter, [reportPost], "auto");
```
