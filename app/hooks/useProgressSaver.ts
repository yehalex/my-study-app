import { useCallback, useRef, useEffect, useState } from "react";
import { updateProgressBatch } from "@/app/_lib/actions";

const useProgressSaver = (userId: number, subjectId: number) => {
  const [error, setError] = useState<string | null>(null);
  const batch = useRef<Record<number, string>>({});
  const timer = useRef<NodeJS.Timeout>();
  const retryCount = useRef(0);
  const MAX_RETRIES = 3;

  const saveBatch = useCallback(async () => {
    const currentBatch = { ...batch.current };
    if (Object.keys(currentBatch).length === 0) return;

    try {
      const result = await updateProgressBatch(userId, subjectId, currentBatch);
      if (!result.success) throw new Error("Batch update failed");

      batch.current = {};
      retryCount.current = 0;
      setError(null);
    } catch (err) {
      if (retryCount.current < MAX_RETRIES) {
        retryCount.current += 1;
        timer.current = setTimeout(saveBatch, 1000 * retryCount.current);
        setError(`Saving... (retry ${retryCount.current}/${MAX_RETRIES})`);
      } else {
        setError("Failed to save progress. Changes will be retried.");
        retryCount.current = 0;
      }
    }
  }, [userId, subjectId]);

  const debouncedSave = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(saveBatch, 1500);
  }, [saveBatch]);

  const queueUpdate = useCallback(
    (questionId: number, answer: string) => {
      batch.current[questionId] = answer;
      debouncedSave();
    },
    [debouncedSave]
  );

  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    await saveBatch();
  }, [saveBatch]);

  // Save on window close
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      if (Object.keys(batch.current).length > 0) {
        navigator.sendBeacon(
          "/api/save-progress",
          JSON.stringify({
            userId,
            subjectId,
            answers: batch.current,
          })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [userId, subjectId]);

  // Save on component unmount
  useEffect(
    () => () => {
      flush();
    },
    [flush]
  );

  return { queueUpdate, flush, error };
};

export default useProgressSaver;
