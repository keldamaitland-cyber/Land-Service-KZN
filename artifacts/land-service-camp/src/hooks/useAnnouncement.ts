import { useState, useEffect, useRef } from "react";

export interface Announcement {
  id: string;
  message: string;
  sentAt: string;
  type: "info" | "urgent" | "success";
}

const POLL_INTERVAL_MS = 8000;

export function useAnnouncement() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function fetchCurrent() {
    try {
      const res = await fetch("/api/announcements/current");
      if (!res.ok) return;
      const data = await res.json() as { announcement: Announcement | null };
      setAnnouncement(data.announcement);
    } catch {
      // Offline or API unavailable — fail silently, app still works
    }
  }

  useEffect(() => {
    fetchCurrent();
    intervalRef.current = setInterval(fetchCurrent, POLL_INTERVAL_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function dismiss(id: string) {
    setDismissedIds(prev => new Set([...prev, id]));
  }

  const visible = announcement && !dismissedIds.has(announcement.id)
    ? announcement
    : null;

  return { announcement: visible, dismiss };
}
