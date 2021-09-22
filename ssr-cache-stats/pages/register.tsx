import { useRouter } from "next/router";
import React from "react";
import { getOrMakeDeviceId } from "../utils";

export default function Page() {
  const router = useRouter();

  if (typeof window === "undefined") {
    // no device ID in server side rendering
    return <></>;
  }

  const persistentId = getOrMakeDeviceId();
  const iserver = process.env.NEXT_PUBLIC_CAUSAL_BROWSER_ISERVER;

  if (iserver == undefined)
    return <>NEXT_PUBLIC_CAUSAL_BROWSER_ISERVER is not defined</>;

  for (let ii = localStorage.length - 1; ii >= 0; --ii) {
    const key = localStorage.key(ii);
    if (key?.startsWith("_causal_")) localStorage.removeItem(key);
  }

  const webtoolsUrl =
    process.env.NEXT_PUBLIC_WEBTOOLS ?? "https://tools.causallabs.io";
  const redirectTo = `${webtoolsUrl}/QA?persistentId=${persistentId}`;
  router.push(redirectTo);
  return (
    <div style={{ display: "none" }}>
      <div>iserver: {iserver}</div>
      <div>webtoolsUrl: {webtoolsUrl}</div>
      <div>redirectTo: {redirectTo}</div>
    </div>
  );
}
