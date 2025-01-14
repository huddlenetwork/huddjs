import {
  Account,
  AminoTypes,
  DeliverTxResponse,
  MsgTransferEncodeObject,
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupIbcExtension,
  setupStakingExtension,
  setupTxExtension,
  SignerData,
  SigningStargateClientOptions,
  StdFee,
} from "@cosmjs/stargate";
import { Any } from "cosmjs-types/google/protobuf/any";
import {
  EncodeObject,
  encodePubkey,
  makeSignDoc,
  Registry,
  TxBodyEncodeObject,
} from "@cosmjs/proto-signing";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import {
  AccountData,
  AminoMsg,
  encodeSecp256k1Pubkey,
  makeSignDoc as makeSignDocAmino,
} from "@cosmjs/amino";
import { AuthInfo, SignerInfo, TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { fromBase64 } from "@cosmjs/encoding";
import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import Long from "long";
import { Int53, Uint53, Uint64 } from "@cosmjs/math";
import { Profile } from "@desmoslabs/desmjs-types/desmos/profiles/v3/models_profile";
import {
  setupWasmExtension,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";
import { MsgTransfer } from "cosmjs-types/ibc/applications/transfer/v1/tx";
import { Height } from "@desmoslabs/desmjs-types/ibc/core/client/v1/client";
import { assertDefined } from "@cosmjs/utils";
import { Secp256k1Pubkey } from "@cosmjs/amino/build/pubkeys";
import { NoOpSigner, Signer, SigningMode } from "./signers";
import {
  DesmosQueryClient,
  profileFromAny,
  setupAuthzExtension,
  setupFeesExtension,
  setupPostsExtension,
  setupProfilesExtension,
  setupReactionsExtension,
  setupRelationshipsExtension,
  setupReportsExtension,
  setupSubspacesExtension,
  setupSupplyExtension,
} from "./queries";
import { createDesmosTypes, desmosRegistryTypes } from "./aminomessages";
import { SignatureResult } from "./signatureresult";
import { PublicKey } from "./types/pubkey";

export interface SimulateOptions {
  publicKey?: PublicKey;
  memo?: string;
}

export interface SignTxOptions {
  /**
   * Transaction fees, if undefined will be considered to be "auto".
   */
  fee?: StdFee | "auto";
  /**
   * Transaction memo.
   */
  memo?: string;
  /**
   * Optional transaction fee granter.
   */
  feeGranter?: string;
  /**
   * Signer data that will be used instead of querying them from the chain.
   * This field is required when signing a transaction in offline mode.
   */
  signerData?: SignerData;
}

function createDefaultRegistry(): Registry {
  return new Registry(desmosRegistryTypes);
}

/**
 * Creates a SignerInfo instance from the data given.
 * @param signers - List of accounts that have signed a transaction.
 * @param signMode - Signing mode used while signing the transaction
 */
function makeSignerInfos(
  signers: ReadonlyArray<{ readonly pubkey: Any; readonly sequence: number }>,
  signMode: SignMode
): SignerInfo[] {
  return signers.map(
    ({ pubkey, sequence }): SignerInfo => ({
      publicKey: pubkey,
      modeInfo: {
        single: { mode: signMode },
      },
      sequence: Long.fromNumber(sequence),
    })
  );
}

/**
 * Creates and serializes an AuthInfo document.
 * This implementation does not support different signing modes for the different signers.
 */
export function makeAuthInfoBytes(
  signers: ReadonlyArray<{ readonly pubkey: Any; readonly sequence: number }>,
  feeAmount: readonly Coin[],
  gasLimit: number,
  signMode = SignMode.SIGN_MODE_DIRECT,
  granter?: string
): Uint8Array {
  return AuthInfo.encode(
    AuthInfo.fromPartial({
      signerInfos: makeSignerInfos(signers, signMode),
      fee: {
        amount: [...feeAmount],
        gasLimit: Long.fromNumber(gasLimit),
        granter,
      },
    })
  ).finish();
}

interface Options extends SigningStargateClientOptions {
  readonly gasAdjustment?: number;
}

/**
 * Client to interact with the Desmos chain.
 */
export class DesmosClient extends SigningCosmWasmClient {
  private txSigner: Signer;

  private typesRegistry: Registry;

  private types: AminoTypes;

  private readonly options: Options;

  public static override async connect(
    endpoint: string,
    options: Options = {}
  ): Promise<DesmosClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new DesmosClient(tmClient, options, undefined);
  }

  public static override async connectWithSigner(
    endpoint: string,
    signer: Signer,
    options: Options = {}
  ): Promise<DesmosClient> {
    const tmClient = await Tendermint34Client.connect(endpoint);
    return new DesmosClient(tmClient, options, signer);
  }

  /**
   * Creates a client in offline mode.
   *
   * When you try to use online functionality with such client, an
   * exception will be raised.
   */
  public static override async offline(
    signer: Signer,
    options: Options = {}
  ): Promise<DesmosClient> {
    return new DesmosClient(undefined, options, signer);
  }

  protected constructor(
    client: Tendermint34Client | undefined,
    options: Options,
    signer: Signer = new NoOpSigner()
  ) {
    const prefix = options?.prefix ?? "desmos";
    const {
      registry = createDefaultRegistry(),
      aminoTypes = new AminoTypes(createDesmosTypes(prefix)),
    } = options;

    super(client, signer, {
      registry,
      aminoTypes,
      prefix: "desmos",
      accountParser: profileFromAny,
      ...options,
    });

    this.txSigner = signer;
    this.typesRegistry = registry;
    this.types = aminoTypes;
    this.options = options;
  }

  /**
   * Updates the signer used to sign the transaction.
   * @param signer - The new signer that will be used.
   */
  setSigner(signer: Signer) {
    this.txSigner = signer;
  }

  /**
   * Gets the account associated to the provided address, or `null` if no account is found.
   * This function has been overridden to correctly parse a Desmos profile.
   */
  override async getAccount(searchAddress: string): Promise<Account | null> {
    const account = await this.forceGetQueryClient().auth.account(
      searchAddress
    );
    if (!account) {
      return null;
    }

    return profileFromAny(account);
  }

  /**
   * Gets the profile associated to the provided address, or `null` if no profile is found.
   */
  public async getProfile(searchAddress: string): Promise<Profile | null> {
    const queryClient = this.forceGetQueryClient();
    return queryClient.profiles.profile(searchAddress);
  }

  /**
   * Implements SigningStargateClient.
   * @protected
   */
  protected override getQueryClient(): DesmosQueryClient | undefined {
    const client = super.getTmClient();
    return client
      ? QueryClient.withExtensions(
          client,
          setupAuthzExtension,
          setupAuthExtension,
          setupBankExtension,
          setupStakingExtension,
          setupTxExtension,
          setupProfilesExtension,
          setupRelationshipsExtension,
          setupSubspacesExtension,
          setupPostsExtension,
          setupReactionsExtension,
          setupReportsExtension,
          setupFeesExtension,
          setupSupplyExtension,
          setupWasmExtension,
          setupIbcExtension
        )
      : undefined;
  }

  /**
   * Implements SigningStargateClient.
   * @protected
   */
  protected override forceGetQueryClient(): DesmosQueryClient {
    const client = this.getQueryClient();
    if (!client) {
      throw new Error(
        "Query client not available. You cannot use online functionality in offline mode."
      );
    }

    return client;
  }

  /**
   * Returns the SignerData for the user having the given address, querying them from the chain.
   */
  private async getSignerData(signerAddress: string): Promise<SignerData> {
    const { accountNumber, sequence } = await this.getSequence(signerAddress);
    const chainId = await this.getChainId();
    return {
      accountNumber,
      sequence,
      chainId,
    };
  }

  /**
   * Signs a transaction using the provided data.
   * Note that an error will be thrown if the signer is not set (i.e. the client has been built
   * without using the `withSigner` builder).
   *
   * The sign mode (SIGN_MODE_DIRECT or SIGN_MODE_LEGACY_AMINO_JSON) is determined by this client's signer.
   *
   * You can pass signer data (account number, sequence and chain id) explicitly instead of querying them
   * from the chain. This is needed when signing for a multisig account, but it also allows for offline signing
   * (See the SigningStargateClient.offline constructor).
   *
   * <b>NOTE</b>: It's recommend to use the signTx method instead of this.
   */
  override async sign(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee | "auto",
    memo: string,
    explicitSignerData?: SignerData
  ): Promise<TxRaw> {
    const result = await this.signTx(signerAddress, messages, {
      fee,
      memo,
      signerData: explicitSignerData,
    });
    return result.txRaw;
  }

  /**
   * Returns the account having the given address reading them from the signer.
   * @param address - Address of the account to be searched for.
   * @private
   */
  private async getAccountFromSigner(address: string): Promise<AccountData> {
    const accounts = await this.txSigner.getAccounts();
    const accountFromSigner = accounts.find(
      (account) => account.address === address
    );
    if (!accountFromSigner) {
      throw new Error("Failed to retrieve account from signer");
    }
    return accountFromSigner;
  }

  /**
   * Signs a transaction using the provided data.
   * Note that an error will be thrown if the signer is not set (i.e. the client has been built
   * without using the `withSigner` builder).
   *
   * The sign mode (SIGN_MODE_DIRECT or SIGN_MODE_LEGACY_AMINO_JSON) is determined by this client's signer.
   *
   * You can pass signer data (account number, sequence and chain id) explicitly instead of querying them
   * from the chain. This is needed when signing for a multisig account, but it also allows for offline signing
   * (See the SigningStargateClient.offline constructor).
   */
  public async signTx(
    signerAddress: string,
    messages: readonly EncodeObject[],
    options?: SignTxOptions
  ): Promise<SignatureResult> {
    const fee = options?.fee ?? "auto";
    if (this.getQueryClient() === undefined) {
      if (fee === "auto") {
        throw new Error(
          "can't sign transaction in offline mode with fee === auto"
        );
      } else if (options?.signerData === undefined) {
        throw new Error(
          "can't sign transaction in offline mode without explicitSignerData"
        );
      }
    }

    // Get the transaction fees based on the given value
    const txFee =
      fee !== "auto"
        ? fee
        : await this.estimateTxFee(signerAddress, messages, {
            memo: options?.memo,
          });

    // Build the signer data
    const signerData =
      options?.signerData ?? (await this.getSignerData(signerAddress));

    // Sign the data using the proper mode
    return this.txSigner.signingMode === SigningMode.DIRECT
      ? this.signTxDirect(
          signerAddress,
          messages,
          txFee,
          options?.memo,
          signerData,
          options?.feeGranter
        )
      : this.signTxAmino(
          signerAddress,
          messages,
          txFee,
          options?.memo,
          signerData,
          options?.feeGranter
        );
  }

  /**
   * Function to estimate the required gas to perform a transaction.
   * @param signerAddress - Address of who is performing the transaction.
   * @param messages - Messages of the transaction to simulate.
   * @param options - Extra transaction simulation options.
   */
  public async estimateTxGas(
    signerAddress: string,
    messages: readonly EncodeObject[],
    options?: SimulateOptions
  ): Promise<number> {
    const anyMsgs = messages.map((m) => this.registry.encodeAsAny(m));

    let pubKey: Secp256k1Pubkey;
    if (options?.publicKey === undefined) {
      const accountFromSigner = (await this.txSigner.getAccounts()).find(
        (account) => account.address === signerAddress
      );
      if (!accountFromSigner) {
        throw new Error("Failed to retrieve account from signer");
      }
      pubKey = encodeSecp256k1Pubkey(accountFromSigner.pubkey);
    } else {
      pubKey = encodeSecp256k1Pubkey(options.publicKey.bytes);
    }

    const { sequence } = await this.getSequence(signerAddress);
    const { gasInfo } = await this.forceGetQueryClient().tx.simulate(
      anyMsgs,
      options?.memo,
      pubKey,
      sequence
    );
    assertDefined(gasInfo);
    return Uint53.fromString(gasInfo.gasUsed.toString()).toNumber();
  }

  /**
   * Function to estimate the fees required to perform a transaction.
   * @param signerAddress - Address of who is performing the transaction.
   * @param messages - Messages of the transaction to simulate.
   * @param options - Extra transaction simulation options.
   */
  public async estimateTxFee(
    signerAddress: string,
    messages: readonly EncodeObject[],
    options?: SimulateOptions
  ): Promise<StdFee> {
    const { gasPrice } = this.options;
    if (!gasPrice) {
      throw new Error(
        "Cannot estimate transaction fees and gas without a gas price"
      );
    }

    const estimated = await this.estimateTxGas(
      signerAddress,
      messages,
      options
    );
    const gasAdjustment = this.options.gasAdjustment || 1.5;
    const gas = Math.ceil(estimated * gasAdjustment);
    return {
      gas: gas.toString(),
      amount: [
        {
          amount: gasPrice.amount
            .multiply(Uint64.fromNumber(gas))
            .ceil()
            .toString(),
          denom: gasPrice.denom,
        },
      ],
    };
  }

  /**
   * Encode the given message objects into Amino messages.
   * @param msgs - Messages to be encoded.
   */
  public encodeToAmino(msgs: readonly EncodeObject[]): AminoMsg[] {
    return msgs.map((msg) => this.types.toAmino(msg));
  }

  private async signTxAmino(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string | undefined,
    { accountNumber, sequence, chainId }: SignerData,
    feeGranter?: string
  ): Promise<SignatureResult> {
    // Get the signer account
    const signerAccount = await this.getAccountFromSigner(signerAddress);

    // Build the SignDoc
    const msgs = this.encodeToAmino(messages);
    const signDoc = makeSignDocAmino(
      msgs,
      fee,
      chainId,
      memo,
      accountNumber,
      sequence
    );

    // Sign the data using Amino
    const { signature, signed } = await this.txSigner.signAmino(
      signerAddress,
      signDoc
    );

    // Build the signed tx object
    const signedTxBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: "/cosmos.tx.v1beta1.TxBody",
      value: {
        messages: signed.msgs.map((msg) => this.types.fromAmino(msg)),
        memo: signed.memo,
      },
    };

    // Get everything that is needed to build the AuthInfoBytes
    const pubkey = encodePubkey(encodeSecp256k1Pubkey(signerAccount.pubkey));
    const signedGasLimit = Int53.fromString(signed.fee.gas).toNumber();
    const signedSequence = Int53.fromString(signed.sequence).toNumber();
    const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject);

    // Build the AuthInfoBytes
    const signedAuthInfoBytes = makeAuthInfoBytes(
      [
        {
          pubkey,
          sequence: signedSequence,
        },
      ],
      signed.fee.amount,
      signedGasLimit,
      SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
      feeGranter
    );

    return {
      signerData: { accountNumber, sequence, chainId },
      pubKey: pubkey,
      signDoc,
      txRaw: TxRaw.fromPartial({
        bodyBytes: signedTxBodyBytes,
        authInfoBytes: signedAuthInfoBytes,
        signatures: [fromBase64(signature.signature)],
      }),
    };
  }

  private async signTxDirect(
    signerAddress: string,
    messages: readonly EncodeObject[],
    fee: StdFee,
    memo: string | undefined,
    { accountNumber, sequence, chainId }: SignerData,
    feeGranter?: string
  ): Promise<SignatureResult> {
    // Get the signer account
    const signerAccount = await this.getAccountFromSigner(signerAddress);

    // Build the tx object to be signed
    const txBodyEncodeObject: TxBodyEncodeObject = {
      typeUrl: "/cosmos.tx.v1beta1.TxBody",
      value: {
        messages,
        memo,
      },
    };

    // Build the signed tx object
    const txBodyBytes = this.registry.encode(txBodyEncodeObject);
    const gasLimit = Int53.fromString(fee.gas).toNumber();

    // Get everything that is needed to build the AuthInfoBytes
    const pubkey = encodePubkey(encodeSecp256k1Pubkey(signerAccount.pubkey));

    // Build the AuthInfoBytes
    const authInfoBytes = makeAuthInfoBytes(
      [{ pubkey, sequence }],
      fee.amount,
      gasLimit,
      SignMode.SIGN_MODE_DIRECT,
      feeGranter
    );

    // Build the SignDoc
    const signDoc = makeSignDoc(
      txBodyBytes,
      authInfoBytes,
      chainId,
      accountNumber
    );

    // Sign using direct
    const { signature, signed } = await this.txSigner.signDirect(
      signerAddress,
      signDoc
    );

    return {
      signerData: { accountNumber, sequence, chainId },
      pubKey: pubkey,
      signDoc,
      txRaw: TxRaw.fromPartial({
        bodyBytes: signed.bodyBytes,
        authInfoBytes: signed.authInfoBytes,
        signatures: [fromBase64(signature.signature)],
      }),
    };
  }

  /**
   * This has been re-implemented to support backward compatibility with the SigningStargateClient type.
   */
  public async sendIbcTokens(
    senderAddress: string,
    recipientAddress: string,
    transferAmount: Coin,
    sourcePort: string,
    sourceChannel: string,
    timeoutHeight: Height | undefined,
    /** timeout in seconds */
    timeoutTimestamp: number | undefined,
    fee: StdFee | "auto" | number,
    memo = ""
  ): Promise<DeliverTxResponse> {
    const timeoutTimestampNanoseconds = timeoutTimestamp
      ? Long.fromNumber(timeoutTimestamp).multiply(1_000_000_000)
      : undefined;
    const transferMsg: MsgTransferEncodeObject = {
      typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
      value: MsgTransfer.fromPartial({
        sourcePort,
        sourceChannel,
        sender: senderAddress,
        receiver: recipientAddress,
        token: transferAmount,
        timeoutHeight,
        timeoutTimestamp: timeoutTimestampNanoseconds,
      }),
    };
    return this.signAndBroadcast(senderAddress, [transferMsg], fee, memo);
  }

  /**
   * Gets a DesmosQueryClient that can be used to query the data from the chain.
   * NOTE: This method will throw an Error if the Client is not connected.
   */
  public get querier(): DesmosQueryClient {
    return this.forceGetQueryClient();
  }
}
