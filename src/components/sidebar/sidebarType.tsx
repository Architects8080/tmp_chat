export enum status {
  online = "/icons/status/online.svg",
  offline = "/icons/status/offline.svg",
  ingame = "/icons/status/ingame.svg",
}

export enum sidebarProperty {
  friendList = "친구 목록",
  chatMemberList = "채팅 참여자 목록",
  observerList = "관전자 목록",
}

export type userItemProps = {
  id: number;
  avatar: string;
  status: number;
  nickname: string;
  alert: boolean;
};

export type modalHandler = {
  isModalOpen: any;
  handleModalOpen: any;
  handleModalClose: any;
  setWaiting?: any;
};

export type sidebarProps = {
  roomId: number; //chat or game인데 이걸 여기서 가지는게 맞나?

  modalHandler: modalHandler; //game에서는 필요가 없어..
  // userId: number;
};

export enum chatroomPermission {
  member,
  admin,
  owner,
}

export type dropdownMenuInfo = {
  roomId: number;
  userId: number;
  targetId: number;

  permission: chatroomPermission;
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
