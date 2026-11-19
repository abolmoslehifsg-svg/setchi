"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  addComment,
  COMMENTS_UPDATED_EVENT,
  deleteComment,
  formatCommentTime,
  getCommentScore,
  listComments,
  setCommentVote,
  type StyleComment,
} from "@/lib/comments";
import {
  getUserSession,
  USER_AUTH_EVENT,
  type UserSession,
} from "@/lib/user-auth";

type Props = {
  outfitId: string;
};

export function OutfitComments({ outfitId }: Props) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [comments, setComments] = useState<StyleComment[]>([]);
  const [body, setBody] = useState("");
  const [replyTo, setReplyTo] = useState<StyleComment | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    setComments(listComments("outfit", outfitId));
  };

  useEffect(() => {
    const syncUser = () => setUser(getUserSession());
    syncUser();
    refresh();
    window.addEventListener(USER_AUTH_EVENT, syncUser);
    window.addEventListener(COMMENTS_UPDATED_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(USER_AUTH_EVENT, syncUser);
      window.removeEventListener(COMMENTS_UPDATED_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [outfitId]);

  const roots = useMemo(
    () => comments.filter((c) => !c.parentId),
    [comments]
  );

  const repliesOf = (id: string) =>
    comments.filter((c) => c.parentId === id);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) {
      setError("برای ثبت نظر باید وارد شوی");
      return;
    }
    setBusy(true);
    const res = addComment({
      targetType: "outfit",
      targetId: outfitId,
      parentId: replyTo?.id || null,
      authorUsername: user.username,
      authorDisplayName: user.displayName || user.username,
      body,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error || "خطا در ثبت");
      return;
    }
    setBody("");
    setReplyTo(null);
    refresh();
  };

  const vote = (c: StyleComment, v: 1 | -1) => {
    if (!user) return;
    setCommentVote(c.id, user.username, v);
    refresh();
  };

  const remove = (c: StyleComment) => {
    if (!user) return;
    if (!confirm("این نظر حذف شود؟")) return;
    deleteComment(c.id, user.username);
    refresh();
  };

  const total = comments.length;

  return (
    <section className="mt-16 lg:mt-24" dir="rtl">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold">نظرات</h2>
          <p className="mt-1 text-sm text-[var(--secondary)]">
            {total === 0
              ? "هنوز نظری ثبت نشده"
              : `${total.toLocaleString("fa-IR")} نظر`}
          </p>
        </div>
      </div>

      {!user ? (
        <div className="mb-8 rounded-2xl border border-[var(--border)] bg-[var(--muted)]/50 p-5 text-sm leading-relaxed">
          <p className="text-[var(--secondary)]">
            می‌توانی نظرات و لایک‌ها را ببینی. برای نوشتن نظر، لایک/دیسلایک یا
            ریپلای باید{" "}
            <Link href="/auth/login/" className="text-link font-medium">
              وارد
            </Link>{" "}
            شوی یا{" "}
            <Link href="/auth/register/" className="text-link font-medium">
              ثبت‌نام
            </Link>{" "}
            کنی.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="mb-10 space-y-3">
          {replyTo && (
            <div className="flex items-center justify-between rounded-xl bg-[var(--muted)] px-4 py-2 text-sm">
              <span>
                ریپلای به{" "}
                <strong>{replyTo.authorDisplayName || replyTo.authorUsername}</strong>
              </span>
              <button
                type="button"
                className="text-xs text-[var(--secondary)] hover:text-[var(--foreground)]"
                onClick={() => setReplyTo(null)}
              >
                لغو
              </button>
            </div>
          )}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            maxLength={1000}
            placeholder={
              replyTo
                ? "پاسخت را بنویس..."
                : "نظرت درباره این استایل چیه؟"
            }
            className="w-full rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] resize-y min-h-[88px]"
          />
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">
              {error}
            </p>
          )}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-[var(--secondary)]">
              به‌عنوان {user.displayName || user.username}
            </span>
            <button
              type="submit"
              disabled={busy || body.trim().length < 2}
              className="btn btn-cta px-6 py-2.5 text-sm disabled:opacity-50"
            >
              {replyTo ? "ارسال ریپلای" : "ثبت نظر"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-5">
        {roots.length === 0 && (
          <p className="text-sm text-[var(--secondary)] text-center py-8">
            اولین نفری باش که نظر می‌ده.
          </p>
        )}

        {roots.map((c) => (
          <CommentItem
            key={c.id}
            comment={c}
            replies={repliesOf(c.id)}
            user={user}
            onVote={vote}
            onReply={(parent) => {
              if (!user) return;
              setReplyTo(parent);
              setBody("");
            }}
            onDelete={remove}
          />
        ))}
      </div>
    </section>
  );
}

function CommentItem({
  comment,
  replies,
  user,
  onVote,
  onReply,
  onDelete,
  nested = false,
}: {
  comment: StyleComment;
  replies: StyleComment[];
  user: UserSession | null;
  onVote: (c: StyleComment, v: 1 | -1) => void;
  onReply: (c: StyleComment) => void;
  onDelete: (c: StyleComment) => void;
  nested?: boolean;
}) {
  const { likes, dislikes } = getCommentScore(comment);
  const myVote = user ? comment.votes?.[user.username] : undefined;
  const isOwner = user?.username === comment.authorUsername;

  return (
    <div
      className={`${
        nested
          ? "mr-4 sm:mr-8 border-r border-[var(--border)] pr-4"
          : "rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 sm:p-5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-sm">
            {comment.authorDisplayName || comment.authorUsername}
          </p>
          <p className="text-xs text-[var(--secondary)] mt-0.5">
            {formatCommentTime(comment.createdAt)}
          </p>
        </div>
        {isOwner && (
          <button
            type="button"
            onClick={() => onDelete(comment)}
            className="text-xs text-[var(--secondary)] hover:text-red-600"
          >
            حذف
          </button>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">
        {comment.body}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          disabled={!user}
          onClick={() => onVote(comment, 1)}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 border transition-colors ${
            myVote === 1
              ? "border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--foreground)]"
              : "border-[var(--border)] text-[var(--secondary)]"
          } ${!user ? "opacity-60 cursor-not-allowed" : "hover:bg-[var(--muted)]"}`}
          title={user ? "لایک" : "برای لایک وارد شو"}
        >
          <span aria-hidden>▲</span>
          <span>{likes}</span>
        </button>
        <button
          type="button"
          disabled={!user}
          onClick={() => onVote(comment, -1)}
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 border transition-colors ${
            myVote === -1
              ? "border-red-300 bg-red-50 text-red-700"
              : "border-[var(--border)] text-[var(--secondary)]"
          } ${!user ? "opacity-60 cursor-not-allowed" : "hover:bg-[var(--muted)]"}`}
          title={user ? "دیسلایک" : "برای دیسلایک وارد شو"}
        >
          <span aria-hidden>▼</span>
          <span>{dislikes}</span>
        </button>
        {!nested && (
          <button
            type="button"
            disabled={!user}
            onClick={() => onReply(comment)}
            className={`rounded-full px-2.5 py-1 border border-[var(--border)] text-[var(--secondary)] ${
              !user ? "opacity-60 cursor-not-allowed" : "hover:bg-[var(--muted)]"
            }`}
            title={user ? "ریپلای" : "برای ریپلای وارد شو"}
          >
            ریپلای
          </button>
        )}
      </div>

      {replies.length > 0 && (
        <div className="mt-4 space-y-4">
          {replies.map((r) => (
            <CommentItem
              key={r.id}
              comment={r}
              replies={[]}
              user={user}
              onVote={onVote}
              onReply={onReply}
              onDelete={onDelete}
              nested
            />
          ))}
        </div>
      )}
    </div>
  );
}
