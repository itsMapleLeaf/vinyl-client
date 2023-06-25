import prettyMs from "pretty-ms"
import { useCurrentRoomQueueItem, useRoomSongProgress } from "./room-state-context"

export function NowPlaying() {
  const item = useCurrentRoomQueueItem()
  const progress = useRoomSongProgress()
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center leading-5 sm:flex-row sm:justify-end sm:text-right">
      {item
        ? (
          <>
            <div>
              <p className="text-sm tabular-nums opacity-75">
                {item.track.metadata.artist} &bull; {prettyMs(progress * 1000, {
                  colonNotation: true,
                  secondsDecimalDigits: 0,
                })} / {prettyMs(item.track.metadata.duration * 1000, {
                  colonNotation: true,
                  secondsDecimalDigits: 0,
                })}
              </p>
              <p className="line-clamp-1 [word-break:break-all]">
                {item.track.metadata.title}
              </p>
            </div>
            {item.track.metadata.artwork && (
              <img
                src={item.track.metadata.artwork}
                alt=""
                className="ml-2 h-12 w-12 object-cover"
              />
            )}
          </>
        )
        : <p className="opacity-75">Nothing playing</p>}
    </div>
  )
}
