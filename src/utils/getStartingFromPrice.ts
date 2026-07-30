export const getStartingFromPrice = (
  sessions: any[] | undefined
): number | undefined => {
  const list = Array.isArray(sessions) ? sessions : [];
  const oneTimeActive = list.filter(
    (s) => s?.is_active === true && s?.session_nature === "one_time"
  );
  const oneTimeActiveVideo = oneTimeActive.filter(
    (s) => s?.video_call === true
  );
  const candidates =
    oneTimeActiveVideo.length > 0 ? oneTimeActiveVideo : oneTimeActive;

  if (candidates.length === 0) return undefined;

  const min = candidates.reduce((acc: number, s: any) => {
    const price = typeof s?.price === "number" ? s.price : Number(s?.price);
    return Number.isFinite(price) ? Math.min(acc, price) : acc;
  }, Number.POSITIVE_INFINITY);

  return Number.isFinite(min) ? min : undefined;
};
