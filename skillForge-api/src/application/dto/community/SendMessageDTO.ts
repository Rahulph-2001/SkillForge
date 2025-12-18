export interface SendMessageDTO {
  communityId: string;
  content: string;
  type?: 'text' | 'image' | 'video' | 'file';
  replyToId?: string;
  forwardedFromId?: string;
}
