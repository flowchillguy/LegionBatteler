export interface IInGameState {
    players: {
        [username: string]:{
            gold: number
        }
    }
}