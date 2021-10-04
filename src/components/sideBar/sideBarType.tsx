
export enum status {
  online = "/icons/status/online.svg",
  offline = "/icons/status/offline.svg",
  ingame = "/icons/status/ingame.svg",
}

export enum sidebarProperty {
  friendList = "친구 목록",
  chatMemberList = "채팅 참여자 목록",
  observerList = "관전자 목록"
}

export type userItemProps = {
  avatar: string;
  status: status;
  nickname: string;
}