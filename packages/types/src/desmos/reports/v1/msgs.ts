/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";
import { Any } from "../../../google/protobuf/any";
import { Timestamp } from "../../../google/protobuf/timestamp";

/** MsgCreateReport represents the message to be used to create a report */
export interface MsgCreateReport {
  /** Id of the subspace for which the report should be stored */
  subspaceId: Long;
  /** Id of the reason this report has been created for */
  reasonsIds: number[];
  /** (optional) Message attached to this report */
  message: string;
  /** Address of the reporter */
  reporter: string;
  /** Target of the report */
  target?: Any;
}

/** MsgCreateReportResponse represents the Msg/CreateReport response type */
export interface MsgCreateReportResponse {
  /** Id of the newly created report */
  reportId: Long;
  /** Time in which the report was created */
  creationDate?: Date;
}

/** MsgDeleteReport represents the message to be used when deleting a report */
export interface MsgDeleteReport {
  /** Id of the subspace that contains the report to be deleted */
  subspaceId: Long;
  /** Id of the report to be deleted */
  reportId: Long;
  /** Address of the user deleting the report */
  signer: string;
}

/** MsgDeleteReportResponse represents the Msg/DeleteReport response type */
export interface MsgDeleteReportResponse {
}

/**
 * MsgSupportStandardReason represents the message to be used when wanting to
 * support one reason from the module params
 */
export interface MsgSupportStandardReason {
  /** Id of the subspace for which to support the reason */
  subspaceId: Long;
  /** Id of the reason that should be supported */
  standardReasonId: number;
  /** Address of the user signing the message */
  signer: string;
}

/**
 * MsgSupportStandardReasonResponse represents the Msg/SupportStandardReason
 * response type
 */
export interface MsgSupportStandardReasonResponse {
  /** Id of the newly added reason */
  reasonsIds: number;
}

/**
 * MsgAddReason represents the message to be used when adding a new supported
 * reason
 */
export interface MsgAddReason {
  /** Id of the subspace for which to add the reason */
  subspaceId: Long;
  /** Title of the reason */
  title: string;
  /** (optional) Extended description of the reason and the cases it applies to */
  description: string;
  /** Address of the user adding the supported reason */
  signer: string;
}

/** MsgAddReasonResponse represents the Msg/AddReason response type */
export interface MsgAddReasonResponse {
  /** Id of the newly supported reason */
  reasonId: number;
}

/**
 * MsgRemoveReason represents the message to be used when removing an exiting
 * reporting reason
 */
export interface MsgRemoveReason {
  /** Id of the subspace from which to remove the reason */
  subspaceId: Long;
  /** Id of the reason to be deleted */
  reasonId: number;
  /** Address of the user adding the supported reason */
  signer: string;
}

/** MsgRemoveReasonResponse represents the Msg/RemoveReason response type */
export interface MsgRemoveReasonResponse {
}

function createBaseMsgCreateReport(): MsgCreateReport {
  return { subspaceId: Long.UZERO, reasonsIds: [], message: "", reporter: "", target: undefined };
}

export const MsgCreateReport = {
  encode(message: MsgCreateReport, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.subspaceId.isZero()) {
      writer.uint32(8).uint64(message.subspaceId);
    }
    writer.uint32(18).fork();
    for (const v of message.reasonsIds) {
      writer.uint32(v);
    }
    writer.ldelim();
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    if (message.reporter !== "") {
      writer.uint32(34).string(message.reporter);
    }
    if (message.target !== undefined) {
      Any.encode(message.target, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateReport {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateReport();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subspaceId = reader.uint64() as Long;
          break;
        case 2:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.reasonsIds.push(reader.uint32());
            }
          } else {
            message.reasonsIds.push(reader.uint32());
          }
          break;
        case 3:
          message.message = reader.string();
          break;
        case 4:
          message.reporter = reader.string();
          break;
        case 5:
          message.target = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateReport {
    return {
      subspaceId: isSet(object.subspaceId) ? Long.fromValue(object.subspaceId) : Long.UZERO,
      reasonsIds: Array.isArray(object?.reasonsIds) ? object.reasonsIds.map((e: any) => Number(e)) : [],
      message: isSet(object.message) ? String(object.message) : "",
      reporter: isSet(object.reporter) ? String(object.reporter) : "",
      target: isSet(object.target) ? Any.fromJSON(object.target) : undefined,
    };
  },

  toJSON(message: MsgCreateReport): unknown {
    const obj: any = {};
    message.subspaceId !== undefined && (obj.subspaceId = (message.subspaceId || Long.UZERO).toString());
    if (message.reasonsIds) {
      obj.reasonsIds = message.reasonsIds.map((e) => Math.round(e));
    } else {
      obj.reasonsIds = [];
    }
    message.message !== undefined && (obj.message = message.message);
    message.reporter !== undefined && (obj.reporter = message.reporter);
    message.target !== undefined && (obj.target = message.target ? Any.toJSON(message.target) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreateReport>, I>>(object: I): MsgCreateReport {
    const message = createBaseMsgCreateReport();
    message.subspaceId = (object.subspaceId !== undefined && object.subspaceId !== null)
      ? Long.fromValue(object.subspaceId)
      : Long.UZERO;
    message.reasonsIds = object.reasonsIds?.map((e) => e) || [];
    message.message = object.message ?? "";
    message.reporter = object.reporter ?? "";
    message.target = (object.target !== undefined && object.target !== null)
      ? Any.fromPartial(object.target)
      : undefined;
    return message;
  },
};

function createBaseMsgCreateReportResponse(): MsgCreateReportResponse {
  return { reportId: Long.UZERO, creationDate: undefined };
}

export const MsgCreateReportResponse = {
  encode(message: MsgCreateReportResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.reportId.isZero()) {
      writer.uint32(8).uint64(message.reportId);
    }
    if (message.creationDate !== undefined) {
      Timestamp.encode(toTimestamp(message.creationDate), writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgCreateReportResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateReportResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reportId = reader.uint64() as Long;
          break;
        case 2:
          message.creationDate = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgCreateReportResponse {
    return {
      reportId: isSet(object.reportId) ? Long.fromValue(object.reportId) : Long.UZERO,
      creationDate: isSet(object.creationDate) ? fromJsonTimestamp(object.creationDate) : undefined,
    };
  },

  toJSON(message: MsgCreateReportResponse): unknown {
    const obj: any = {};
    message.reportId !== undefined && (obj.reportId = (message.reportId || Long.UZERO).toString());
    message.creationDate !== undefined && (obj.creationDate = message.creationDate.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgCreateReportResponse>, I>>(object: I): MsgCreateReportResponse {
    const message = createBaseMsgCreateReportResponse();
    message.reportId = (object.reportId !== undefined && object.reportId !== null)
      ? Long.fromValue(object.reportId)
      : Long.UZERO;
    message.creationDate = object.creationDate ?? undefined;
    return message;
  },
};

function createBaseMsgDeleteReport(): MsgDeleteReport {
  return { subspaceId: Long.UZERO, reportId: Long.UZERO, signer: "" };
}

export const MsgDeleteReport = {
  encode(message: MsgDeleteReport, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.subspaceId.isZero()) {
      writer.uint32(8).uint64(message.subspaceId);
    }
    if (!message.reportId.isZero()) {
      writer.uint32(16).uint64(message.reportId);
    }
    if (message.signer !== "") {
      writer.uint32(26).string(message.signer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeleteReport {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeleteReport();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subspaceId = reader.uint64() as Long;
          break;
        case 2:
          message.reportId = reader.uint64() as Long;
          break;
        case 3:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgDeleteReport {
    return {
      subspaceId: isSet(object.subspaceId) ? Long.fromValue(object.subspaceId) : Long.UZERO,
      reportId: isSet(object.reportId) ? Long.fromValue(object.reportId) : Long.UZERO,
      signer: isSet(object.signer) ? String(object.signer) : "",
    };
  },

  toJSON(message: MsgDeleteReport): unknown {
    const obj: any = {};
    message.subspaceId !== undefined && (obj.subspaceId = (message.subspaceId || Long.UZERO).toString());
    message.reportId !== undefined && (obj.reportId = (message.reportId || Long.UZERO).toString());
    message.signer !== undefined && (obj.signer = message.signer);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgDeleteReport>, I>>(object: I): MsgDeleteReport {
    const message = createBaseMsgDeleteReport();
    message.subspaceId = (object.subspaceId !== undefined && object.subspaceId !== null)
      ? Long.fromValue(object.subspaceId)
      : Long.UZERO;
    message.reportId = (object.reportId !== undefined && object.reportId !== null)
      ? Long.fromValue(object.reportId)
      : Long.UZERO;
    message.signer = object.signer ?? "";
    return message;
  },
};

function createBaseMsgDeleteReportResponse(): MsgDeleteReportResponse {
  return {};
}

export const MsgDeleteReportResponse = {
  encode(_: MsgDeleteReportResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgDeleteReportResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgDeleteReportResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgDeleteReportResponse {
    return {};
  },

  toJSON(_: MsgDeleteReportResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgDeleteReportResponse>, I>>(_: I): MsgDeleteReportResponse {
    const message = createBaseMsgDeleteReportResponse();
    return message;
  },
};

function createBaseMsgSupportStandardReason(): MsgSupportStandardReason {
  return { subspaceId: Long.UZERO, standardReasonId: 0, signer: "" };
}

export const MsgSupportStandardReason = {
  encode(message: MsgSupportStandardReason, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.subspaceId.isZero()) {
      writer.uint32(8).uint64(message.subspaceId);
    }
    if (message.standardReasonId !== 0) {
      writer.uint32(16).uint32(message.standardReasonId);
    }
    if (message.signer !== "") {
      writer.uint32(26).string(message.signer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSupportStandardReason {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSupportStandardReason();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subspaceId = reader.uint64() as Long;
          break;
        case 2:
          message.standardReasonId = reader.uint32();
          break;
        case 3:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSupportStandardReason {
    return {
      subspaceId: isSet(object.subspaceId) ? Long.fromValue(object.subspaceId) : Long.UZERO,
      standardReasonId: isSet(object.standardReasonId) ? Number(object.standardReasonId) : 0,
      signer: isSet(object.signer) ? String(object.signer) : "",
    };
  },

  toJSON(message: MsgSupportStandardReason): unknown {
    const obj: any = {};
    message.subspaceId !== undefined && (obj.subspaceId = (message.subspaceId || Long.UZERO).toString());
    message.standardReasonId !== undefined && (obj.standardReasonId = Math.round(message.standardReasonId));
    message.signer !== undefined && (obj.signer = message.signer);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSupportStandardReason>, I>>(object: I): MsgSupportStandardReason {
    const message = createBaseMsgSupportStandardReason();
    message.subspaceId = (object.subspaceId !== undefined && object.subspaceId !== null)
      ? Long.fromValue(object.subspaceId)
      : Long.UZERO;
    message.standardReasonId = object.standardReasonId ?? 0;
    message.signer = object.signer ?? "";
    return message;
  },
};

function createBaseMsgSupportStandardReasonResponse(): MsgSupportStandardReasonResponse {
  return { reasonsIds: 0 };
}

export const MsgSupportStandardReasonResponse = {
  encode(message: MsgSupportStandardReasonResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reasonsIds !== 0) {
      writer.uint32(8).uint32(message.reasonsIds);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgSupportStandardReasonResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgSupportStandardReasonResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reasonsIds = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgSupportStandardReasonResponse {
    return { reasonsIds: isSet(object.reasonsIds) ? Number(object.reasonsIds) : 0 };
  },

  toJSON(message: MsgSupportStandardReasonResponse): unknown {
    const obj: any = {};
    message.reasonsIds !== undefined && (obj.reasonsIds = Math.round(message.reasonsIds));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgSupportStandardReasonResponse>, I>>(
    object: I,
  ): MsgSupportStandardReasonResponse {
    const message = createBaseMsgSupportStandardReasonResponse();
    message.reasonsIds = object.reasonsIds ?? 0;
    return message;
  },
};

function createBaseMsgAddReason(): MsgAddReason {
  return { subspaceId: Long.UZERO, title: "", description: "", signer: "" };
}

export const MsgAddReason = {
  encode(message: MsgAddReason, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.subspaceId.isZero()) {
      writer.uint32(8).uint64(message.subspaceId);
    }
    if (message.title !== "") {
      writer.uint32(18).string(message.title);
    }
    if (message.description !== "") {
      writer.uint32(26).string(message.description);
    }
    if (message.signer !== "") {
      writer.uint32(34).string(message.signer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgAddReason {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgAddReason();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subspaceId = reader.uint64() as Long;
          break;
        case 2:
          message.title = reader.string();
          break;
        case 3:
          message.description = reader.string();
          break;
        case 4:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgAddReason {
    return {
      subspaceId: isSet(object.subspaceId) ? Long.fromValue(object.subspaceId) : Long.UZERO,
      title: isSet(object.title) ? String(object.title) : "",
      description: isSet(object.description) ? String(object.description) : "",
      signer: isSet(object.signer) ? String(object.signer) : "",
    };
  },

  toJSON(message: MsgAddReason): unknown {
    const obj: any = {};
    message.subspaceId !== undefined && (obj.subspaceId = (message.subspaceId || Long.UZERO).toString());
    message.title !== undefined && (obj.title = message.title);
    message.description !== undefined && (obj.description = message.description);
    message.signer !== undefined && (obj.signer = message.signer);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgAddReason>, I>>(object: I): MsgAddReason {
    const message = createBaseMsgAddReason();
    message.subspaceId = (object.subspaceId !== undefined && object.subspaceId !== null)
      ? Long.fromValue(object.subspaceId)
      : Long.UZERO;
    message.title = object.title ?? "";
    message.description = object.description ?? "";
    message.signer = object.signer ?? "";
    return message;
  },
};

function createBaseMsgAddReasonResponse(): MsgAddReasonResponse {
  return { reasonId: 0 };
}

export const MsgAddReasonResponse = {
  encode(message: MsgAddReasonResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.reasonId !== 0) {
      writer.uint32(8).uint32(message.reasonId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgAddReasonResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgAddReasonResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.reasonId = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgAddReasonResponse {
    return { reasonId: isSet(object.reasonId) ? Number(object.reasonId) : 0 };
  },

  toJSON(message: MsgAddReasonResponse): unknown {
    const obj: any = {};
    message.reasonId !== undefined && (obj.reasonId = Math.round(message.reasonId));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgAddReasonResponse>, I>>(object: I): MsgAddReasonResponse {
    const message = createBaseMsgAddReasonResponse();
    message.reasonId = object.reasonId ?? 0;
    return message;
  },
};

function createBaseMsgRemoveReason(): MsgRemoveReason {
  return { subspaceId: Long.UZERO, reasonId: 0, signer: "" };
}

export const MsgRemoveReason = {
  encode(message: MsgRemoveReason, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (!message.subspaceId.isZero()) {
      writer.uint32(8).uint64(message.subspaceId);
    }
    if (message.reasonId !== 0) {
      writer.uint32(16).uint32(message.reasonId);
    }
    if (message.signer !== "") {
      writer.uint32(26).string(message.signer);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRemoveReason {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRemoveReason();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.subspaceId = reader.uint64() as Long;
          break;
        case 2:
          message.reasonId = reader.uint32();
          break;
        case 3:
          message.signer = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgRemoveReason {
    return {
      subspaceId: isSet(object.subspaceId) ? Long.fromValue(object.subspaceId) : Long.UZERO,
      reasonId: isSet(object.reasonId) ? Number(object.reasonId) : 0,
      signer: isSet(object.signer) ? String(object.signer) : "",
    };
  },

  toJSON(message: MsgRemoveReason): unknown {
    const obj: any = {};
    message.subspaceId !== undefined && (obj.subspaceId = (message.subspaceId || Long.UZERO).toString());
    message.reasonId !== undefined && (obj.reasonId = Math.round(message.reasonId));
    message.signer !== undefined && (obj.signer = message.signer);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgRemoveReason>, I>>(object: I): MsgRemoveReason {
    const message = createBaseMsgRemoveReason();
    message.subspaceId = (object.subspaceId !== undefined && object.subspaceId !== null)
      ? Long.fromValue(object.subspaceId)
      : Long.UZERO;
    message.reasonId = object.reasonId ?? 0;
    message.signer = object.signer ?? "";
    return message;
  },
};

function createBaseMsgRemoveReasonResponse(): MsgRemoveReasonResponse {
  return {};
}

export const MsgRemoveReasonResponse = {
  encode(_: MsgRemoveReasonResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgRemoveReasonResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgRemoveReasonResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): MsgRemoveReasonResponse {
    return {};
  },

  toJSON(_: MsgRemoveReasonResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgRemoveReasonResponse>, I>>(_: I): MsgRemoveReasonResponse {
    const message = createBaseMsgRemoveReasonResponse();
    return message;
  },
};

/** Msg defines the reports Msg service. */
export interface Msg {
  /** CreateReport allows to create a new report */
  CreateReport(request: MsgCreateReport): Promise<MsgCreateReportResponse>;
  /** DeleteReport allows to delete an existing report */
  DeleteReport(request: MsgDeleteReport): Promise<MsgDeleteReportResponse>;
  /**
   * SupportStandardReason allows to support one of the reasons present inside
   * the module params
   */
  SupportStandardReason(request: MsgSupportStandardReason): Promise<MsgSupportStandardReasonResponse>;
  /** AddReason allows to add a new supported reporting reason */
  AddReason(request: MsgAddReason): Promise<MsgAddReasonResponse>;
  /** RemoveReason allows to remove a supported reporting reason */
  RemoveReason(request: MsgRemoveReason): Promise<MsgRemoveReasonResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || "desmos.reports.v1.Msg";
    this.rpc = rpc;
    this.CreateReport = this.CreateReport.bind(this);
    this.DeleteReport = this.DeleteReport.bind(this);
    this.SupportStandardReason = this.SupportStandardReason.bind(this);
    this.AddReason = this.AddReason.bind(this);
    this.RemoveReason = this.RemoveReason.bind(this);
  }
  CreateReport(request: MsgCreateReport): Promise<MsgCreateReportResponse> {
    const data = MsgCreateReport.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateReport", data);
    return promise.then((data) => MsgCreateReportResponse.decode(new _m0.Reader(data)));
  }

  DeleteReport(request: MsgDeleteReport): Promise<MsgDeleteReportResponse> {
    const data = MsgDeleteReport.encode(request).finish();
    const promise = this.rpc.request(this.service, "DeleteReport", data);
    return promise.then((data) => MsgDeleteReportResponse.decode(new _m0.Reader(data)));
  }

  SupportStandardReason(request: MsgSupportStandardReason): Promise<MsgSupportStandardReasonResponse> {
    const data = MsgSupportStandardReason.encode(request).finish();
    const promise = this.rpc.request(this.service, "SupportStandardReason", data);
    return promise.then((data) => MsgSupportStandardReasonResponse.decode(new _m0.Reader(data)));
  }

  AddReason(request: MsgAddReason): Promise<MsgAddReasonResponse> {
    const data = MsgAddReason.encode(request).finish();
    const promise = this.rpc.request(this.service, "AddReason", data);
    return promise.then((data) => MsgAddReasonResponse.decode(new _m0.Reader(data)));
  }

  RemoveReason(request: MsgRemoveReason): Promise<MsgRemoveReasonResponse> {
    const data = MsgRemoveReason.encode(request).finish();
    const promise = this.rpc.request(this.service, "RemoveReason", data);
    return promise.then((data) => MsgRemoveReasonResponse.decode(new _m0.Reader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
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
