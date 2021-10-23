export class CreateChannelDto {
  readonly title: string;

  readonly type: number;

  readonly password?: string;

  ownerId: number;
}
