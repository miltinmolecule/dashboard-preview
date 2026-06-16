import { io, type Socket } from "socket.io-client";

let _socket: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === "undefined") return null;
  if (!_socket) {
    _socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5000",
      {
        transports: ["websocket"],
        autoConnect: false,
      },
    );
  }
  return _socket;
}
