export interface IEndVideoRoomUseCase {
    execute(userId: string, roomId: string): Promise<void>
}