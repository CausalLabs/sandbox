import type { AppContext, AppInitialProps, AppProps } from "next/app";
import App from "next/app";
import { useRouter } from "next/router";
import { v4 as uuidv4 } from "uuid";
import {
  initCausal,
  qb,
  Session,
  SessionContext,
  SessionJSON,
  useSession,
  useSessionJSON,
} from "../causal";
import "../styles/globals.css";
import { getOrMakeDeviceId, MyPageContext, RequestIdContext } from "../utils";

initCausal({ defaultPageType: "SSR" });

type MyAppRenderProps = AppProps & {
  sessionJson: SessionJSON;
  requestId: string;
};
type MyAppInitialProps = AppInitialProps & {
  sessionJson: SessionJSON;
  requestId: string;
};

export default function MyApp({
  Component,
  pageProps,
  sessionJson,
  requestId,
}: MyAppRenderProps) {
  const session = useSessionJSON(sessionJson);

  // This in not technically needed
  // The stats are are not transferred with the session
  // It is here for illustrative purposes
  session.clearImpressionStats();

  const result = (
    <SessionContext.Provider value={session}>
      <RequestIdContext.Provider value={requestId}>
        <Component {...pageProps} />
        {/***************************/}
        {/* Log out the cache stats */}
        <StatsLogger />
      </RequestIdContext.Provider>
    </SessionContext.Provider>
  );

  return result;
}

MyApp.getInitialProps = async (
  context: AppContext
): Promise<MyAppInitialProps> => {
  const deviceId = getOrMakeDeviceId(context.ctx);

  const session = Session.fromDeviceId(deviceId, context.ctx.req);
  await session.requestCacheFill(qb().getFeature2({ exampleArg: "123" }));

  // Add the session to the context so each page's getInitialProps can use it
  const appProps = await App.getInitialProps({
    ...context,
    ctx: {
      ...context.ctx,
      session,
    } as MyPageContext,
  });

  // In this example, we are using a new impressionId for every request
  // In general, we recommend that you use explicit impression ids
  // to control when impressions are registered.
  //
  // If you don't use explicit impression ids, impression lifecycles will be
  // tied to react component lifecycles, which may, or may not, be what you want
  const requestId = uuidv4();

  // Add the sessionJson to the props, so it transfers to the render function.
  // Note: this transfer can happen across network boundaries.
  // For example during SSR, the following happens:
  //   1. getInitialProps runs server side,
  //   2. render happens server side (receiving the props) and generates html
  //   3. the html is sent to the client and displayed
  //   4. the props are transferred to the client for render (hydrate)
  //
  // (This is all just standard Next.js / React SSR mechanics)
  const ret = {
    ...appProps,
    sessionJson: session.toJSON(),
    requestId,
  };
  return ret;
};

/**
 * Component that logs out cache stats.
 *  This is for demonstration purposes.
 *  Place this at the end of the render tree,
 *  so it can log out the stats after everthing renders
 *
 * There are better places in code for "after everthing renders".
 *  On the client, a useEffect hook on the app
 *  On the server, after a ReactDOMServer render method, or similar,
 *  depending on the framework you use.
 *
 * For a real use of this, you probably want to limit to a slice
 *  of traffic, and push the data into a monitoring system,
 *  as opposed to logging it to the console.
 */
function StatsLogger() {
  const session = useSession();
  const router = useRouter();

  // log out cache misses for SSR
  const logCacheMisses = typeof window == "undefined";
  if (logCacheMisses) {
    if (session == undefined) console.log("No session for Stats Logger");
    else {
      const impressionStats = session.getImpressionStats();
      if (impressionStats.cacheMisses.length > 0) {
        console.log(
          "WARNING!: The following features were not cached: " +
            JSON.stringify(impressionStats.cacheMisses) +
            `. Please make sure your page (route pathname = ${router.pathname}) ` +
            "is requesting them in getInitialProps"
        );
      }
      if (impressionStats.cacheNoOps.length > 0) {
        console.log(
          "WARNING!: The following features were spuriously cached: " +
            JSON.stringify(impressionStats.cacheNoOps) +
            `. Please make sure your page (route pathname = ${router.pathname}) ` +
            "is not needlessly requesting them in getInitialProps"
        );
      }
    }
  }
  return null;
}
