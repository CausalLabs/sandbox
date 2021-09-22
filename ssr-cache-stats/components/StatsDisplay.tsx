import { useEffect, useState } from "react";
import { useSession } from "../causal";

/**
 * This component indicates how many loading impressions were encountered on a client render.
 *  This is used by Causal to test and ensure client caching and loading logic is correct
 *  It's probably not relevant to you
 */
export default function StatsDisplay() {
  const [hasMounted, setHasMounted] = useState(false);
  const session = useSession();
  const stats = session?.getImpressionStats();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <>
        <div>- Loading Impressions</div>
        <div>- Cache Hits </div>
        <div>- Cache Misses </div>
      </>
    );
  }

  return (
    <>
      <div data-testid="loading-impressions">
        {stats?.loadingImpressions} Loading Impressions
      </div>
      <div data-testid="cache-hits">{stats?.cacheHits.length} Cache Hits </div>
      <div data-testid="cache-misses">
        {stats?.cacheMisses.length} Cache Misses{" "}
      </div>
    </>
  );
}
