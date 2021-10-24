import { User } from "../../views/profile/profileType";

export enum Status {
  ONLINE = "/icons/status/online.svg",
  OFFLINE = "/icons/status/offline.svg",
  INGAME = "/icons/status/ingame.svg",
}

export enum SidebarProperty {
  FRIEND_LIST = "친구 목록",
  CHAT_MEMBER_LIST = "채팅 참여자 목록",
  // OBSERVER_LIST = "관전자 목록",
}

export type ChannelMember = {
  id: number;
  channelId: number;
  role: MemberRole;
  user: User;
  userId: number;
}

export type DMUser = {
  id: number;
  avatar: string;
  status: number;
  nickname: string;
  alert: boolean;
};

export type ModalManager = {
  isModalOpen: any;
  handleModalOpen: any;
  handleModalClose: any;
  setWaiting?: any;
};

export type SidebarProps = {
  channelId: number; //chat or game인데 이걸 여기서 가지는게 맞나?

  modalHandler: ModalManager; //game에서는 필요가 없어..
  // userId: number;
};

export enum MemberRole {
  MEMBER = 'member',
  ADMIN = 'admin',
  OWNER = 'owner',
}

export type ContextMenuInfo = {
  userId: number;
  targetId: number;

  isInGame: boolean;

  gameId: number;
  channelId: number;

  isFriend: boolean;
  isBannable: boolean; //chat: admin
  isMuteAble: boolean; //chat: admin
  isAdmin: boolean; //chat: owner

  myRole?: MemberRole;
};

export type DM = {
  id: number;
  message: string;
};
