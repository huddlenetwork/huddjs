/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

/** MsgAuthenticate represents the message used to authenticate a user */
export interface MsgAuthenticate {
  /** Address of the user to authenticate */
  user: string;
  /** Nonce to avoid double spending attacks */
  nonce: Uint8Array;
}

function createBaseMsgAuthenticate(): MsgAuthenticate {
  return { user: "", nonce: new Uint8Array() };
}

export const MsgAuthenticate = {
  encode(message: MsgAuthenticate, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.user !== "") {
      writer.uint32(10).string(message.user);
    }
    if (message.nonce.length !== 0) {
      writer.uint32(18).bytes(message.nonce);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgAuthenticate {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgAuthenticate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.user = reader.string();
          break;
        case 2:
          message.nonce = reader.bytes();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgAuthenticate {
    return {
      user: isSet(object.user) ? String(object.user) : "",
      nonce: isSet(object.nonce) ? bytesFromBase64(object.nonce) : new Uint8Array(),
    };
  },

  toJSON(message: MsgAuthenticate): unknown {
    const obj: any = {};
    message.user !== undefined && (obj.user = message.user);
    message.nonce !== undefined &&
      (obj.nonce = base64FromBytes(message.nonce !== undefined ? message.nonce : new Uint8Array()));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgAuthenticate>, I>>(object: I): MsgAuthenticate {
    const message = createBaseMsgAuthenticate();
    message.user = object.user ?? "";
    message.nonce = object.nonce ?? new Uint8Array();
    return message;
  },
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var tsProtoGlobalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (tsProtoGlobalThis.Buffer) {
    return Uint8Array.from(tsProtoGlobalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = tsProtoGlobalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (tsProtoGlobalThis.Buffer) {
    return tsProtoGlobalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return tsProtoGlobalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

type DeepPartial<T> = T extends Builtin ? T
  : T extends Long ? string | number | Long : T extends Array<infer U> ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
