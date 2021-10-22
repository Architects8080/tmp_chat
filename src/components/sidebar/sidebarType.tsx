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

export type UserItemProps = {
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

export type DropdownMenuInfo = {
  channelId: number;
  userId: number;
  targetId: number;

  permission: MemberRole;
  isInGame: boolean;
  isBlocked: boolean; //friend
  isFriend: boolean;
  isBannable: boolean; //chat: admin
  isMuted: boolean; //chat: admin
  isAdmin: boolean; //chat: owner
};

export type DM = {
  id: number;
  message: string;
};
