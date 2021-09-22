import Cookies from "cookies";
import { IncomingMessage, ServerResponse } from "http";
import { v4 as uuidv4 } from "uuid";
import React from "react";
import { NextPageContext } from "next";
import { Session } from "./causal";
import JSCookies from "js-cookie";

// getInitialProps passes some additional information
// (the session) to each page's  getInitialContext
export type MyPageContext = NextPageContext & { session: Session };

const deviceIdStr = "deviceId";

// if context is undefined assumes client side and use browser cookies
// otherwise assumes server side and pulls cookies out of the request object
export function getOrMakeDeviceId(context?: {
  req?: IncomingMessage;
  res?: ServerResponse;
}): string {
  if (context?.req && context?.res) {
    const cookies = new Cookies(context.req, context.res);
    const deviceId = cookies.get(deviceIdStr);
    if (deviceId !== undefined) {
      return deviceId;
    }

    const id = uuidv4();
    const date = new Date();
    date.setFullYear(2050);
    cookies.set(deviceIdStr, id, { expires: date, httpOnly: false });
    return id;
  } else {
    if (typeof window == "undefined") {
      console.error("Server side but no context passed in");
    }
    const device = JSCookies.get(deviceIdStr);
    if (device !== undefined) return device;

    const id = uuidv4();
    const date = new Date();
    date.setFullYear(2050);
    JSCookies.set(deviceIdStr, id, { expires: date, secure: false });
    return id;
  }
}

export const RequestIdContext = React.createContext<string | undefined>(
  undefined
);
