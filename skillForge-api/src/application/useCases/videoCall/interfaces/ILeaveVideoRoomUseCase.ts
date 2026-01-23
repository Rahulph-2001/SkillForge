export interface ILeaveVideoRoomUseCase {
    execute(userId: string , roomId: string): Promise<void>
}