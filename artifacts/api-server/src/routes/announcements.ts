import { Router } from "express";

export interface Announcement {
  id: string;
  message: string;
  sentAt: string;
  type: "info" | "urgent" | "success";
}

let current: Announcement | null = null;

const router = Router();

router.get("/announcements/current", (_req, res) => {
  res.json({ announcement: current });
});

router.post("/announcements", (req, res) => {
  const { pin, message, type } = req.body as {
    pin?: string;
    message?: string;
    type?: string;
  };

  if (pin !== "2026") {
    res.status(403).json({ error: "Invalid PIN" });
    return;
  }
  if (!message || typeof message !== "string" || message.trim().length === 0) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  current = {
    id: `${Date.now()}`,
    message: message.trim(),
    sentAt: new Date().toISOString(),
    type: (["info", "urgent", "success"].includes(type ?? "") ? type : "info") as Announcement["type"],
  };

  res.json({ ok: true, announcement: current });
});

router.delete("/announcements", (req, res) => {
  const { pin } = req.body as { pin?: string };
  if (pin !== "2026") {
    res.status(403).json({ error: "Invalid PIN" });
    return;
  }
  current = null;
  res.json({ ok: true });
});

export default router;
