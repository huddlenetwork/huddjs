import { AminoMsg } from "@cosmjs/amino";
import {
  GenericSubspaceAuthorizationAminoType,
  MsgAddUserToUserGroupAminoType,
  MsgCreateSectionAminoType,
  MsgCreateSubspaceAminoType,
  MsgCreateUserGroupAminoType,
  MsgDeleteSectionAminoType,
  MsgDeleteSubspaceAminoType,
  MsgDeleteUserGroupAminoType,
  MsgEditSectionAminoType,
  MsgEditSubspaceAminoType,
  MsgEditUserGroupAminoType,
  MsgMoveSectionAminoType,
  MsgMoveUserGroupAminoType,
  MsgRemoveUserFromUserGroupAminoType,
  MsgSetUserGroupPermissionsAminoType,
  MsgSetUserPermissionsAminoType,
} from "../../const";

export interface AminoGenericSubspaceAuthorization extends AminoMsg {
  readonly type: typeof GenericSubspaceAuthorizationAminoType;
  readonly value: {
    subspaces_ids: string[];
    msg: string;
  };
}

export interface AminoMsgCreateSubspace extends AminoMsg {
  readonly type: typeof MsgCreateSubspaceAminoType;
  readonly value: {
    name: string;
    description: string;
    treasury: string;
    owner: string;
    creator: string;
  };
}

export interface AminoMsgEditSubspace extends AminoMsg {
  readonly type: typeof MsgEditSubspaceAminoType;
  readonly value: {
    subspace_id: string;
    name: string;
    description: string;
    treasury: string;
    owner: string;
    signer: string;
  };
}

export interface AminoMsgDeleteSubspace extends AminoMsg {
  readonly type: typeof MsgDeleteSubspaceAminoType;
  readonly value: {
    subspace_id: string;
    signer: string;
  };
}

export interface AminoMsgCreateSection extends AminoMsg {
  readonly type: typeof MsgCreateSectionAminoType;
  readonly value: {
    subspace_id: string;
    name: string;
    description: string;
    parent_id: number;
    creator: string;
  };
}

export interface AminoMsgEditSection extends AminoMsg {
  readonly type: typeof MsgEditSectionAminoType;
  readonly value: {
    subspace_id: string;
    section_id: number;
    name: string;
    description: string;
    editor: string;
  };
}

export interface AminoMsgMoveSection extends AminoMsg {
  readonly type: typeof MsgMoveSectionAminoType;
  readonly value: {
    subspace_id: string;
    section_id: number;
    new_parent_id: number;
    signer: string;
  };
}

export interface AminoMsgDeleteSection extends AminoMsg {
  readonly type: typeof MsgDeleteSectionAminoType;
  readonly value: {
    subspace_id: string;
    section_id: number;
    signer: string;
  };
}

export interface AminoMsgCreateUserGroup extends AminoMsg {
  readonly type: typeof MsgCreateUserGroupAminoType;
  readonly value: {
    subspace_id: string;
    section_id: number;
    name: string;
    description: string;
    default_permissions: string[];
    initial_members: string[];
    creator: string;
  };
}

export interface AminoMsgEditUserGroup extends AminoMsg {
  readonly type: typeof MsgEditUserGroupAminoType;
  readonly value: {
    subspace_id: string;
    group_id: number;
    name: string;
    description: string;
    signer: string;
  };
}

export interface AminoMsgMoveUserGroup extends AminoMsg {
  readonly type: typeof MsgMoveUserGroupAminoType;
  readonly value: {
    subspace_id: string;
    group_id: number;
    new_section_id: number;
    signer: string;
  };
}

export interface AminoMsgSetUserGroupPermissions extends AminoMsg {
  readonly type: typeof MsgSetUserGroupPermissionsAminoType;
  readonly value: {
    subspace_id: string;
    group_id: number;
    permissions: string[];
    signer: string;
  };
}

export interface AminoMsgDeleteUserGroup extends AminoMsg {
  readonly type: typeof MsgDeleteUserGroupAminoType;
  readonly value: {
    subspace_id: string;
    group_id: number;
    signer: string;
  };
}

export interface AminoMsgAddUserToUserGroup extends AminoMsg {
  readonly type: typeof MsgAddUserToUserGroupAminoType;
  readonly value: {
    subspace_id: string;
    group_id: number;
    user: string;
    signer: string;
  };
}

export interface AminoMsgRemoveUserFromUserGroup extends AminoMsg {
  readonly type: typeof MsgRemoveUserFromUserGroupAminoType;
  readonly value: {
    subspace_id: string;
    group_id: number;
    user: string;
    signer: string;
  };
}

export interface AminoMsgSetUserPermissions extends AminoMsg {
  readonly type: typeof MsgSetUserPermissionsAminoType;
  readonly value: {
    subspace_id: string;
    section_id: number;
    user: string;
    permissions: string[];
    signer: string;
  };
}
