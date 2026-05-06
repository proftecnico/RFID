import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const globalAny = global as unknown as { rfidEmitter?: EventTarget };

function getEmitter(): EventTarget {
  if (!globalAny.rfidEmitter) {
    globalAny.rfidEmitter = new EventTarget();
  }
  return globalAny.rfidEmitter;
}

export async function GET(req: NextRequest) {
  const emitter = getEmitter();
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();

  const sendEvent = (data: unknown) => {
    writer.write(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  const onReading = (e: CustomEvent<unknown>) => {
    sendEvent(e.detail);
  };

  emitter.addEventListener('reading', onReading as EventListener);

  req.signal.addEventListener("abort", () => {
    emitter.removeEventListener('reading', onReading as EventListener);
    writer.close();
  });

  return new Response(responseStream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}
