const shortDate = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export const formatShortDate = (iso: string) => shortDate.format(new Date(iso));
export const formatReadTime = (minutes: number) => `${minutes} min read`;
