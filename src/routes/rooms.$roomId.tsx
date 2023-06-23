import { NavLink, Outlet, useLoaderData } from "@remix-run/react"
import { json, type LoaderArgs, redirect } from "@vercel/remix"
import { $path } from "remix-routes"
import { Player } from "~/components/player"
import { Spinner } from "~/components/spinner"
import { vinylApi } from "~/data/vinyl-api.server"
import { getSessionToken } from "~/data/vinyl-session"
import { type Room } from "~/data/vinyl-types"
import { raise } from "~/helpers/errors"
import { NowPlaying } from "../components/now-playing"
import { ProgressBar } from "../components/progress-bar"
import { RoomMembers } from "../components/room-members"
import { RoomStateProvider, useRoomConnected } from "../components/room-state-context"

export async function loader({ request, params }: LoaderArgs) {
  const roomId = params.roomId ?? raise("roomId not defined")

  const api = vinylApi(request)

  const [user, room, queue, token] = await Promise.all([
    api.getUser(),
    api.getRoom(roomId),
    api.getRoomQueue(roomId),
    getSessionToken(request),
  ])

  if (!user.data || !token) {
    return redirect(`/sign-in?redirect=${request.url}`)
  }

  return json({
    user: user.data,
    room,
    queue,
    streamUrl: api.getRoomStreamUrl(roomId, token).href,
    socketUrl: api.getGatewayUrl(token).href,
  })
}

export default function RoomPage() {
  const { room, queue, socketUrl } = useLoaderData<typeof loader>()
  if ("error" in room) {
    return <p>Failed to load room: {room.error}</p>
  }
  if ("error" in queue) {
    return <p>Failed to load queue: {queue.error}</p>
  }
  return (
    <RoomStateProvider
      room={room.data}
      queue={queue.data}
      socketUrl={socketUrl}
    >
      <RoomPageContent room={room.data} />
    </RoomStateProvider>
  )
}

function RoomPageContent({ room }: { room: Room }) {
  const data = useLoaderData<typeof loader>()
  const connected = useRoomConnected()
  const roomId = room.id
  return (
    <>
      <main className="container grid flex-1 content-start gap-4 py-4">
        <div className="panel flex flex-col gap-3 p-3">
          <header className="flex flex-wrap items-center">
            <h1 className="flex-1 text-2xl font-light">{room.name}</h1>
            <RoomMembers />
          </header>
          <nav className="flex flex-row flex-wrap gap-3">
            <NavLink
              to={$path("/rooms/:roomId", { roomId })}
              end
              className="border-b-2 border-transparent font-medium uppercase opacity-50 transition hover:border-accent-200 hover:text-accent-200 [&.active]:border-current [&.active]:opacity-100"
            >
              Queue
            </NavLink>
            <NavLink
              to={$path("/rooms/:roomId/history", { roomId })}
              className="border-b-2 border-transparent font-medium uppercase opacity-50 transition hover:border-accent-200 hover:text-accent-200 [&.active]:border-current [&.active]:opacity-100"
            >
              History
            </NavLink>
          </nav>
        </div>
        <Outlet />
      </main>
      <footer className="panel sticky bottom-0">
        <ProgressBar />
        <div className="container flex flex-col items-center gap-4 py-4 sm:flex-row">
          {connected ? <Player streamUrl={data.streamUrl} /> : <Spinner />}
          <NowPlaying />
        </div>
      </footer>
    </>
  )
}
