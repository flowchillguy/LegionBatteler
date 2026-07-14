export interface GameState {
    roomId: string; // id room in socket
    players: string[];
    status: "playing" | "ended";

    // các chỉ số hp atk ... của 2 bên
}