import { Channel } from '../entity/channel.entity';

export class CountChannel extends Channel {
  memberCount: number;
}

export const mergeChannelAndCount = (channel: Channel, count: number) => {
  const result: CountChannel = channel as CountChannel;
  result.memberCount = count;
  return result;
};
