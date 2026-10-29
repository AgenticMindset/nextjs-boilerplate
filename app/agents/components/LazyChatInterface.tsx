"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

const ChatInterface = dynamic(() => import("./ChatInterface"), { ssr: false });

// The agents index is mostly static copy, but the Tech Stack Advisor sits
// inline near the bottom of it. Fetching its chat bundle only once the section
// is approached keeps it out of the page's initial JS. The client gate lives in
// its own Client Component because a Server Component importing a Client
// Component through next/dynamic does not get code split.
export default function LazyChatInterface() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    // Pre-2019 browsers without IntersectionObserver just get the chat
    // immediately. Deferred by a frame rather than set synchronously here, so
    // it stays an effect callback instead of a cascading render.
    if (typeof IntersectionObserver === "undefined") {
      const frame = requestAnimationFrame(() => setShouldLoad(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sentinelRef}>
      {shouldLoad ? <ChatInterface /> : <div className="chat-placeholder" aria-hidden="true" />}
    </div>
  );
}
