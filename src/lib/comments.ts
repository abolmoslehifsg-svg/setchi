"use client";

export type CommentTargetType = "outfit" | "product";

export type CommentVote = 1 | -1;

export type StyleComment = {
  id: string;
  targetType: CommentTargetType;
  targetId: string;
  /** null = root comment */
  parentId: string | null;
  authorUsername: string;
  authorDisplayName: string;
  body: string;
  createdAt: number;
  /** username -> 1 like / -1 dislike */
  votes: Record<string, CommentVote>;
};

const KEY = "setchi_comments_v1";
export const COMMENTS_UPDATED_EVENT = "setchi-comments-updated";

function notify() {
  try {
    window.dispatchEvent(new Event(COMMENTS_UPDATED_EVENT));
  } catch {
    /* ignore */
  }
}

function readAll(): StyleComment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StyleComment[];
    return Array.isArray(parsed) ? parsed.filter((c) => c?.id && c?.body) : [];
  } catch {
    return [];
  }
}

function writeAll(list: StyleComment[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    notify();
  } catch {
    /* ignore */
  }
}

function uid() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function listComments(
  targetType: CommentTargetType,
  targetId: string
): StyleComment[] {
  return readAll()
    .filter((c) => c.targetType === targetType && c.targetId === targetId)
    .sort((a, b) => a.createdAt - b.createdAt);
}

export function getCommentScore(c: StyleComment): { likes: number; dislikes: number; score: number } {
  let likes = 0;
  let dislikes = 0;
  for (const v of Object.values(c.votes || {})) {
    if (v === 1) likes++;
    else if (v === -1) dislikes++;
  }
  return { likes, dislikes, score: likes - dislikes };
}

export function addComment(input: {
  targetType: CommentTargetType;
  targetId: string;
  parentId?: string | null;
  authorUsername: string;
  authorDisplayName: string;
  body: string;
}): { ok: boolean; error?: string; comment?: StyleComment } {
  const body = input.body.trim();
  if (body.length < 2) return { ok: false, error: "نظر خیلی کوتاه است" };
  if (body.length > 1000) return { ok: false, error: "حداکثر ۱۰۰۰ کاراکتر" };
  if (!input.authorUsername) return { ok: false, error: "باید وارد شده باشی" };
  if (!input.targetId) return { ok: false, error: "هدف نامعتبر" };

  if (input.parentId) {
    const parent = readAll().find((c) => c.id === input.parentId);
    if (!parent) return { ok: false, error: "نظر والد پیدا نشد" };
    if (parent.targetId !== input.targetId) return { ok: false, error: "ریپلای نامعتبر" };
  }

  const comment: StyleComment = {
    id: uid(),
    targetType: input.targetType,
    targetId: input.targetId,
    parentId: input.parentId || null,
    authorUsername: input.authorUsername,
    authorDisplayName: input.authorDisplayName || input.authorUsername,
    body,
    createdAt: Date.now(),
    votes: {},
  };

  const list = readAll();
  list.push(comment);
  writeAll(list);
  return { ok: true, comment };
}

export function setCommentVote(
  commentId: string,
  username: string,
  vote: CommentVote | 0
): { ok: boolean; error?: string } {
  if (!username) return { ok: false, error: "باید وارد شده باشی" };
  const list = readAll();
  const i = list.findIndex((c) => c.id === commentId);
  if (i < 0) return { ok: false, error: "نظر پیدا نشد" };

  const votes = { ...(list[i].votes || {}) };
  if (vote === 0) {
    delete votes[username];
  } else if (votes[username] === vote) {
    // toggle off
    delete votes[username];
  } else {
    votes[username] = vote;
  }
  list[i] = { ...list[i], votes };
  writeAll(list);
  return { ok: true };
}

export function deleteComment(
  commentId: string,
  username: string
): { ok: boolean; error?: string } {
  if (!username) return { ok: false, error: "باید وارد شده باشی" };
  const list = readAll();
  const target = list.find((c) => c.id === commentId);
  if (!target) return { ok: false, error: "نظر پیدا نشد" };
  if (target.authorUsername !== username) {
    return { ok: false, error: "فقط نویسنده می‌تواند حذف کند" };
  }
  // remove comment + its direct replies
  const next = list.filter(
    (c) => c.id !== commentId && c.parentId !== commentId
  );
  writeAll(next);
  return { ok: true };
}

export function formatCommentTime(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "همین الان";
  if (m < 60) return `${m} دقیقه پیش`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} ساعت پیش`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} روز پیش`;
  try {
    return new Date(ts).toLocaleDateString("fa-IR");
  } catch {
    return "";
  }
}
