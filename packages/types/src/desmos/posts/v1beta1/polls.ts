/* eslint-disable */
import Long from "long";
import * as _m0 from "protobufjs/minimal";
import { Timestamp } from "../../../google/protobuf/timestamp";

/**
 * ProvidedAnswer contains the data of a single poll answer inserted by the
 * creator
 */
export interface ProvidedAnswer {
  id: string;
  text: string;
}

/** Poll contains all the data of a desmos post's poll */
export interface Poll {
  question: string;
  providedAnswers: ProvidedAnswer[];
  endDate?: Date;
  allowsMultipleAnswers: boolean;
  allowsAnswerEdits: boolean;
}

/** UserAnswer contains the data of a user's answer to a poll */
export interface UserAnswer {
  postId: string;
  user: string;
  answers: string[];
}

function createBaseProvidedAnswer(): ProvidedAnswer {
  return { id: "", text: "" };
}

export const ProvidedAnswer = {
  encode(
    message: ProvidedAnswer,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.text !== "") {
      writer.uint32(18).string(message.text);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ProvidedAnswer {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseProvidedAnswer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.text = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ProvidedAnswer {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      text: isSet(object.text) ? String(object.text) : "",
    };
  },

  toJSON(message: ProvidedAnswer): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.text !== undefined && (obj.text = message.text);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ProvidedAnswer>, I>>(
    object: I
  ): ProvidedAnswer {
    const message = createBaseProvidedAnswer();
    message.id = object.id ?? "";
    message.text = object.text ?? "";
    return message;
  },
};

function createBasePoll(): Poll {
  return {
    question: "",
    providedAnswers: [],
    endDate: undefined,
    allowsMultipleAnswers: false,
    allowsAnswerEdits: false,
  };
}

export const Poll = {
  encode(message: Poll, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.question !== "") {
      writer.uint32(10).string(message.question);
    }
    for (const v of message.providedAnswers) {
      ProvidedAnswer.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.endDate !== undefined) {
      Timestamp.encode(
        toTimestamp(message.endDate),
        writer.uint32(26).fork()
      ).ldelim();
    }
    if (message.allowsMultipleAnswers === true) {
      writer.uint32(32).bool(message.allowsMultipleAnswers);
    }
    if (message.allowsAnswerEdits === true) {
      writer.uint32(40).bool(message.allowsAnswerEdits);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Poll {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePoll();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.question = reader.string();
          break;
        case 2:
          message.providedAnswers.push(
            ProvidedAnswer.decode(reader, reader.uint32())
          );
          break;
        case 3:
          message.endDate = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 4:
          message.allowsMultipleAnswers = reader.bool();
          break;
        case 5:
          message.allowsAnswerEdits = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Poll {
    return {
      question: isSet(object.question) ? String(object.question) : "",
      providedAnswers: Array.isArray(object?.providedAnswers)
        ? object.providedAnswers.map((e: any) => ProvidedAnswer.fromJSON(e))
        : [],
      endDate: isSet(object.endDate)
        ? fromJsonTimestamp(object.endDate)
        : undefined,
      allowsMultipleAnswers: isSet(object.allowsMultipleAnswers)
        ? Boolean(object.allowsMultipleAnswers)
        : false,
      allowsAnswerEdits: isSet(object.allowsAnswerEdits)
        ? Boolean(object.allowsAnswerEdits)
        : false,
    };
  },

  toJSON(message: Poll): unknown {
    const obj: any = {};
    message.question !== undefined && (obj.question = message.question);
    if (message.providedAnswers) {
      obj.providedAnswers = message.providedAnswers.map((e) =>
        e ? ProvidedAnswer.toJSON(e) : undefined
      );
    } else {
      obj.providedAnswers = [];
    }
    message.endDate !== undefined &&
      (obj.endDate = message.endDate.toISOString());
    message.allowsMultipleAnswers !== undefined &&
      (obj.allowsMultipleAnswers = message.allowsMultipleAnswers);
    message.allowsAnswerEdits !== undefined &&
      (obj.allowsAnswerEdits = message.allowsAnswerEdits);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Poll>, I>>(object: I): Poll {
    const message = createBasePoll();
    message.question = object.question ?? "";
    message.providedAnswers =
      object.providedAnswers?.map((e) => ProvidedAnswer.fromPartial(e)) || [];
    message.endDate = object.endDate ?? undefined;
    message.allowsMultipleAnswers = object.allowsMultipleAnswers ?? false;
    message.allowsAnswerEdits = object.allowsAnswerEdits ?? false;
    return message;
  },
};

function createBaseUserAnswer(): UserAnswer {
  return { postId: "", user: "", answers: [] };
}

export const UserAnswer = {
  encode(
    message: UserAnswer,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.postId !== "") {
      writer.uint32(10).string(message.postId);
    }
    if (message.user !== "") {
      writer.uint32(18).string(message.user);
    }
    for (const v of message.answers) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserAnswer {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserAnswer();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.postId = reader.string();
          break;
        case 2:
          message.user = reader.string();
          break;
        case 3:
          message.answers.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserAnswer {
    return {
      postId: isSet(object.postId) ? String(object.postId) : "",
      user: isSet(object.user) ? String(object.user) : "",
      answers: Array.isArray(object?.answers)
        ? object.answers.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: UserAnswer): unknown {
    const obj: any = {};
    message.postId !== undefined && (obj.postId = message.postId);
    message.user !== undefined && (obj.user = message.user);
    if (message.answers) {
      obj.answers = message.answers.map((e) => e);
    } else {
      obj.answers = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserAnswer>, I>>(
    object: I
  ): UserAnswer {
    const message = createBaseUserAnswer();
    message.postId = object.postId ?? "";
    message.user = object.user ?? "";
    message.answers = object.answers?.map((e) => e) || [];
    return message;
  },
};

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function toTimestamp(date: Date): Timestamp {
  const seconds = numberToLong(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds.toNumber() * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function numberToLong(number: number) {
  return Long.fromNumber(number);
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}