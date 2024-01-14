export function timeAgo(timestamp) {
  const targetDate = timestamp.toDate();
  return formatDistanceToNow(targetDate, { addSuffix: true });
}
