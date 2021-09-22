// This is a FeatureDL automatically generated file. DO NOT DIRECTLY EDIT, your changes will not persist.
import fetch from "cross-fetch";
import React, { useEffect, useReducer, useRef, useState } from "react";

///////////////////////////////////////////////////////////////////////////////
//#region  parameterized


/** Wraps a rating box that we can put on various product pages
to collect ratings from our users
 *   */
type RatingBoxWireOutputs = {
  readonly callToAction: string;
  readonly _impressionId: string;
}

/** Wraps a rating box that we can put on various product pages
to collect ratings from our users
 *   */
export class RatingBox {
    /** The product that we are collecting ratings for
     *
     *  Default: null
     *   */
    readonly product: string;
    /** The text next to the stars that prompts the visitor to rate the product
     *
     *  Control: "Rate this product!"
     *   */
    readonly callToAction: string;

    /** @internal
     *
     * when constructed from cache, this is the original impression
     * otherwise it will be the the one associated with the fetch
     */
    readonly #_impression: ImpressionImpl;

    /** @internal */
    readonly #_impressionId: string;

    /** Occurs each time a rating is collected   
    *  */
    signalRating( { stars } 
        : {  stars : number  } ) : void
    {
      RatingBox.signalRating( this.#_impression.userId, this.#_impressionId, { stars, } );
    }
    /** Occurs each time a rating is collected   
      *  */
    static signalRating( userId : UserIds, impressionId : string,  { stars } 
        : {  stars : number  } ) : void
    {
        const _data = { 
          id : userId,
          feature: "RatingBox",
          event: "Rating",
          impressionId: impressionId,
          args: {  stars: stars  }
        };
      network.sendBeacon(_data);
    }

  constructor( 
    impression: ImpressionImpl, 
    args: NonNullable<_WireArgs["RatingBox"]>, 
    outputs: RatingBoxWireOutputs ) {
    this.#_impression = impression;
    this.#_impressionId = outputs._impressionId;
    this.product = args.product;
    if (outputs.callToAction != undefined) {
        this.callToAction = outputs.callToAction;
    } else {
        this.callToAction = "Rate this product!";
    }
  }
}
/** An empty feature to use only as a kill switch
 *   */
type ProductInfoWireOutputs = {
  readonly _impressionId: string;
}

/** An empty feature to use only as a kill switch
 *   */
export class ProductInfo {

    /** @internal
     *
     * when constructed from cache, this is the original impression
     * otherwise it will be the the one associated with the fetch
     */
    readonly #_impression: ImpressionImpl;

    /** @internal */
    readonly #_impressionId: string;


  constructor( 
    impression: ImpressionImpl, 
    args: NonNullable<_WireArgs["ProductInfo"]>, 
    outputs: ProductInfoWireOutputs ) {
    this.#_impression = impression;
    this.#_impressionId = outputs._impressionId;
  }
}
/** Another feature just for demonstration purposes
 *   */
type Feature2WireOutputs = {
  readonly exampleOutput: string;
  readonly _impressionId: string;
}

/** Another feature just for demonstration purposes
 *   */
export class Feature2 {
    /** Example args
     *
     *  Default: null
     *   */
    readonly exampleArg: string;
    /** Example output
     *
     *  Control: "Example output"
     *   */
    readonly exampleOutput: string;

    /** @internal
     *
     * when constructed from cache, this is the original impression
     * otherwise it will be the the one associated with the fetch
     */
    readonly #_impression: ImpressionImpl;

    /** @internal */
    readonly #_impressionId: string;

    /** Example event   
    *  */
    signalExampleEvent( { data } 
        : {  data : string  } ) : void
    {
      Feature2.signalExampleEvent( this.#_impression.userId, this.#_impressionId, { data, } );
    }
    /** Example event   
      *  */
    static signalExampleEvent( userId : UserIds, impressionId : string,  { data } 
        : {  data : string  } ) : void
    {
        const _data = { 
          id : userId,
          feature: "Feature2",
          event: "ExampleEvent",
          impressionId: impressionId,
          args: {  data: data  }
        };
      network.sendBeacon(_data);
    }

  constructor( 
    impression: ImpressionImpl, 
    args: NonNullable<_WireArgs["Feature2"]>, 
    outputs: Feature2WireOutputs ) {
    this.#_impression = impression;
    this.#_impressionId = outputs._impressionId;
    this.exampleArg = args.exampleArg;
    if (outputs.exampleOutput != undefined) {
        this.exampleOutput = outputs.exampleOutput;
    } else {
        this.exampleOutput = "Example output";
    }
  }
}

type SessionArgs = {
   deviceId: string;
};

function sseUrl( s : SessionArgs ) {
  let sseUrl = network.baseUrl.replace(
        /\/?$/,
        "/sse?id=");
  if ( s.deviceId != undefined)
      sseUrl += s.deviceId + "+";
  return sseUrl;
}

class ImpressionImpl implements Impression<FeatureNames> {
  readonly #_impressionJson: ImpressionJSON<FeatureNames>;

  // Note: There is no impression id declared at this level
  // The features have impression ids as part of their outputs

  toJSON() {
    return this.#_impressionJson;
  }

  get userId() {
    return this.#_impressionJson.userId;
  }

  constructor(impressionJson: ImpressionJSON<FeatureNames>) {
    this.#_impressionJson = impressionJson;
    const { wireArgs, wireOutputs } = impressionJson;
    for (const [featureName, args] of Object.entries(wireArgs) as [
      keyof _WireArgs,
      _WireArgs[keyof _WireArgs]
    ][]) {
      const output = wireOutputs[featureName];

      let featureHasData;
      switch (impressionJson.impressionType) {
        case "error":
          featureHasData = defaultFlags[featureName];
          break;
        case "loading":
          featureHasData = false;
          break;
        case "real":
          featureHasData = output != "OFF" && output != undefined;
          if (output == undefined) {
            log.log("undefined or null output for " + featureName + ". Using defaults.");
            featureHasData = defaultFlags[featureName];            
          }
      }

      if (featureHasData) {
        (this as any)[featureName] = new (allFeatureTypes as any)[featureName]( // eslint-disable-line
          this,
          args as any, // eslint-disable-line
          (output == undefined
            ? { _impressionId: "errNoOutputs" }
            : output) as any // eslint-disable-line
        ) as any; // eslint-disable-line
      }
    }
  }

  RatingBox?: RatingBox 
  ProductInfo?: ProductInfo 
  Feature2?: Feature2 

}

/**
 * Represents the type of a query, both its features and arguments. 
 * 
 * The type signature looks complicated, but it just represents an object that maps the selected feature names to the corresponding feature arguments.
 * This type generally will not be constructed manually, but instead be inferred from the return value of [[queryBuilder]] or [[createQuery]]. 
 * The typing will then cary through to all the other Causal functions like [[useImpression]] and [[requestImpression]].
 *
 * @paramtype The feature to query for
 */
export type QueryArgs<T extends FeatureNames> = 
    /** Wraps a rating box that we can put on various product pages
to collect ratings from our users
     *  */
    & ("RatingBox" extends T ?   
      { RatingBox : 
          {  product : string  } } : unknown ) 
    /** An empty feature to use only as a kill switch
     *  */
    & ("ProductInfo" extends T ?   
      { ProductInfo : 
          { _ignore_forceExcessPropertyCheck?: undefined } } : unknown ) 
    /** Another feature just for demonstration purposes
     *  */
    & ("Feature2" extends T ?   
      { Feature2 : 
          {  exampleArg : string  } } : unknown ) 

      

/**
 * Create a query to use with [[requestImpression]] or [[useImpression]].
 * 
 * @typeparam The names of the features to query for.
 * @param args The arguments for each feature in T.
 * @return Query to use with [[requestImpression]] or [[useImpression]].
 */ 
export function createQuery<T extends FeatureNames>(
  args: QueryArgs<T>
): Query<T> {
  const query = new Query<T>();
  const _args = args as unknown as QueryArgs<FeatureNames>; // cast needed for older versions of typescript
   
  if (_args.RatingBox !== undefined)
    query.getRatingBox(_args.RatingBox);
  if (_args.ProductInfo !== undefined)
    query.getProductInfo();
  if (_args.Feature2 !== undefined)
    query.getFeature2(_args.Feature2);
  return query;
}

/** 
* Features to query, along with their arguments.
*
* A query is created by using either [[queryBuilder]] or [[createQuery]].
*
* A query is executed by calling either [[requestImpression]] or [[useImpression]].
*
*/
export class Query<T extends FeatureNames>{
    /** Wraps a rating box that we can put on various product pages
to collect ratings from our users
     *  */
    getRatingBox( { product } 
      : {  product : string  } )
        : Query<T | "RatingBox"> {
        this._wireArgs['RatingBox'] = { product: product, }
        return this
    }
    /** An empty feature to use only as a kill switch
     *  */
    getProductInfo()
        : Query<T | "ProductInfo"> {
        this._wireArgs['ProductInfo'] = { }
        return this
    }
    /** Another feature just for demonstration purposes
     *  */
    getFeature2( { exampleArg } 
      : {  exampleArg : string  } )
        : Query<T | "Feature2"> {
        this._wireArgs['Feature2'] = { exampleArg: exampleArg, }
        return this
    }

    /** @internal **/
    _wireArgs: _WireArgs = {};
}

/**
 * @internal
 * Do not use - only exported for testing
 */
export type _WireArgs = {
    RatingBox?:  { 
      product: string
       },
    ProductInfo?:       Record<string, never>,
    Feature2?:  { 
      exampleArg: string
       },
};

type FeatureNames = 
    |"RatingBox"
    |"ProductInfo"
    |"Feature2"
;


const featureNames = [
    "RatingBox",
    "ProductInfo",
    "Feature2",
] as const;

/**
 * An object of the form `{"FeatureName": FeatureType}` for all features
 * Useful as an object to autocomplete off of.
 */
export const allFeatureTypes = {
    RatingBox,
    ProductInfo,
    Feature2,
    };

/**
 * @internal
 * Do not use - only exported for testing
 */
export type _WireOutputs = {
    RatingBox?:RatingBoxWireOutputs | "OFF";
    ProductInfo?:ProductInfoWireOutputs | "OFF";
    Feature2?:Feature2WireOutputs | "OFF";
}

type UserIds = {
    deviceId?: string
    } & (
     | { deviceId: string }
    );

function sessionKeys( s : SessionArgs ) : UserIds {
  return {
    deviceId : s.deviceId,
  };
}

type Impression<T extends FeatureNames> =
    & ("RatingBox" extends T ? { RatingBox?:RatingBox } : unknown)
    & ("ProductInfo" extends T ? { ProductInfo?:ProductInfo } : unknown)
    & ("Feature2" extends T ? { Feature2?:Feature2 } : unknown)
    & { userId: UserIds }
    & { toJSON(): ImpressionJSON<T> }
    & {
    }

/**
 * @internal
 * Do not use - only exported for testing
 */
export type _WireFlags = {
    RatingBox: boolean;
    ProductInfo: boolean;
    Feature2: boolean;
};

type Flags<T extends FeatureNames> = 
    & ("RatingBox" extends T ? { RatingBox: boolean } : unknown )
    & ("ProductInfo" extends T ? { ProductInfo: boolean } : unknown )
    & ("Feature2" extends T ? { Feature2: boolean } : unknown )


/**
 * The state of the feature flags when the FDL was compiled to this file.
 */
export const defaultFlags: Flags<FeatureNames> = {
    RatingBox: true,
    ProductInfo: true,
    Feature2: true,
};

//#endregion
///////////////////////////////////////////////////////////////////////////////

/** very basic uuid generator (to minimize external dependencies) **/
function uuidv4() {
  let digits = "";
  let ii = 0;
  for (; digits.length < 32 && ii < 100; ii++)
    digits += (Math.random() * 0xffffffff).toString(16).split(".")[0];

  if (ii == 100) {
    log.error("failure to generate digits");
    digits += "00000000000000000000000000000000";
  }

  return (
    digits.slice(0, 8) +
    "-" +
    digits.slice(8, 12) +
    "-" +
    digits.slice(12, 16) +
    "-" +
    digits.slice(16, 20) +
    "-" +
    digits.slice(20, 32)
  );
}

//#region caching

/**
 * @internal
 * Do not use - only exported for testing
 */
export function debugGetCache() {
  return _cache;
}

let _flushCount = 0;

/**
 * @internal
 * Do not use - only exported for testing
 */
export type BackingStore = {
  get(
    key: string
  ): undefined | { identity: string; value: unknown; created: Date };
  set(key: string, identity: string, value: unknown, expiresTS: Date): void;
  del(key: string): void;
  dontStore(): boolean;
};

/**
 * @internal
 * Do not use - only exported for testing
 */
export type StoreItem = {
  created: string;
  expires: string;
  identity: string;
  value: unknown;
};

class LocalStorageStore implements BackingStore {
  static makeKey(key: string): string {
    return "_causal_" + key;
  }

  get(
    key: string
  ): undefined | { identity: string; value: unknown; created: Date } {
    const _key = LocalStorageStore.makeKey(key);
    const raw = window.localStorage.getItem(_key);
    if (!raw) return undefined;
    try {
      const { identity, value, created, expires }: StoreItem = JSON.parse(raw);

      const now = new Date();
      const createdTS = new Date(created);
      const expiresTS = new Date(expires);

      if (expiresTS < now) {
        window.localStorage.removeItem(_key);
        return undefined;
      }

      return { identity, value, created: createdTS };
    } catch (e) {
      log.error(
        "failed to deserialize from cache. Error = " + JSON.stringify(e)
      );
      window.localStorage.removeItem(_key);
      return undefined;
    }
  }

  set(key: string, identity: string, value: string, expiresTS: Date) {
    const _key = LocalStorageStore.makeKey(key);
    const createdString = new Date().toISOString();
    const expiresString = expiresTS.toISOString();
    const toStore: StoreItem = {
      created: createdString,
      expires: expiresString,
      identity,
      value,
    };
    return window.localStorage.setItem(_key, JSON.stringify(toStore));
  }

  del(key: string) {
    const _key = LocalStorageStore.makeKey(key);
    window.localStorage.removeItem(_key);
  }

  dontStore() {
    return false;
  }
}
class NoOpStore implements BackingStore {
  get(): undefined {
    return undefined;
  }
  set() {
    undefined;
  }

  del() {
    undefined;
  }

  dontStore() {
    return true;
  }
}

type CacheOptions = {
  /**
   * The cache to use to cache feature values.
   * The default is to use LocalStorage on the client and not cache on the server
   * Set to null to explicitly disable caching
   */
  backingStore: BackingStore;

  /**
   * The maximum amount of time to cache feature values.
   * The default is to cache for the same duration as a session
   * Setting to zero will disable caching
   * Setting to a negative number will be ignored
   */
  outputExpirySeconds: number | undefined;

  /**
   * The duration of inactivity before the entire cache is flushed
   * The default is 30 minutes (1800 seconds)
   * This is typically set in your environment and compiled into this file
   * It is not recommended you set it here
   */
  sessionCacheExpirySeconds: number;

  /** useServerSentEvents: Use server side events to update features
   *  defaults to true for CSR, unless caching is disabled
   *
   *  setting to false will prevent push updates to feature outputs,
   *  in which case features will only update when the cache expires
   */
  useServerSentEvents: boolean;
};

class Cache {
  sessionArgs: SessionArgs | undefined;
  backingStore: BackingStore;
  outputExpirySeconds: number | undefined;
  useServerSentEvents: boolean;
  sessionCacheExpirySeconds: number;
  eventSource: EventSource | undefined;

  constructor(
    sessionArgs: SessionArgs | undefined,
    options: CacheOptions | undefined
  ) {
    if (options == undefined) {
      options = {
        backingStore: new NoOpStore(),
        outputExpirySeconds: undefined,
        useServerSentEvents: false,
        sessionCacheExpirySeconds: 0,
      };
    }

    const {
      backingStore,
      outputExpirySeconds,
      useServerSentEvents,
      sessionCacheExpirySeconds,
    } = options;

    this.backingStore = backingStore;
    this.outputExpirySeconds = outputExpirySeconds;
    this.useServerSentEvents = useServerSentEvents;
    this.sessionCacheExpirySeconds = sessionCacheExpirySeconds;
    this.sessionArgs = sessionArgs;

    if (sessionArgs == undefined) return;

    // register server side events
    this.eventSource = undefined;
    if (
      sessionArgs != undefined &&
      !misc.ssr &&
      !this.backingStore.dontStore() &&
      this.useServerSentEvents
    ) {
      if (!network.newEvtSource) log.error("unexpected undefined newEvtSource");
      else {
        const url = sseUrl(sessionArgs);
        this.eventSource = network.newEvtSource(url);
        this.eventSource.addEventListener("flush", this.sseFlush.bind(this));
        this.eventSource.addEventListener("flushcache", this.sseFlushCache.bind(this));
        this.eventSource.addEventListener("flushfeatures", this.sseFlushFeatures.bind(this));
        this.eventSource.addEventListener("hello", this.sseHello.bind(this));
      }
    }
  }

  deleteAll(invalidateHooks: boolean): void {
    if (this.sessionArgs == undefined) return;

    for (const k of featureNames) this.backingStore.del(k);
    this.backingStore.del("_flags");
    this.backingStore.del("_cacheInfo");

    // forces react hooks to re-execute next time they are used
    if (invalidateHooks) _flushCount += 1;
  }

  /**
   * @returns false if the caller should short circuit
   */
  testAndTouchSession(): boolean {
    log.debug(5, "testAndTouchSession");
    if (this.backingStore.dontStore()) return false;

    const rawInfo = this.backingStore.get("_cacheInfo")?.value as
      | {
          sessionStart: string;
          lastAccess: string;
        }
      | undefined;

    const now = new Date();
    let sessionStart = now;
    let lastAccess = now;
    if (rawInfo) {
      sessionStart = new Date(rawInfo.sessionStart);
      lastAccess = new Date(rawInfo.lastAccess);
    }

    const cacheInfo = { sessionStart, lastAccess };

    const expires = addSeconds(
      cacheInfo.lastAccess,
      this.sessionCacheExpirySeconds
    );
    const invalid = isNaN(expires.valueOf());
    if (expires < now || invalid) {
      log.debug(1, "session expired");
      cacheInfo.sessionStart = now;
      cacheInfo.lastAccess = now;

      // should never happen, but be extra cautious to avoid render loop
      const invalidateHooks = !invalid;
      this.deleteAll(invalidateHooks);
    }

    cacheInfo.lastAccess = now;
    this.backingStore.set("_cacheInfo", "", cacheInfo, maxDate);
    return true;
  }

  getOutputExpiry() {
    if (this.outputExpirySeconds == undefined) return maxDate;
    return makeFutureDate(this.outputExpirySeconds);
  }

  getOutputIdentity(
    featureName: FeatureNames,
    wireArg: _WireArgs[keyof _WireArgs]
  ): string | undefined {
    if (featureName == undefined) {
      log.warn("unexpected undefined featureName");
      return;
    }

    if (wireArg == undefined) {
      log.warn("unexpected undefined wireArgs");
      return;
    }

    return JSON.stringify({
      n: featureName,
      a: wireArg,
    });
  }

  flags(): Flags<FeatureNames> | undefined {
    if (!this.testAndTouchSession()) return undefined;

    const store = this.backingStore.get("_flags");
    if (store == undefined) return undefined;

    const { value } = store;
    return value as Flags<FeatureNames>;
  }

  setFlags(flags: Flags<FeatureNames>) {
    if (!this.testAndTouchSession()) return;
    this.backingStore.set("_flags", "", flags, maxDate); // flags expire with session
  }

  outputs(wireArgs: _WireArgs): _WireOutputs | undefined {
    if (!this.testAndTouchSession()) return undefined;

    const flags = this.flags();
    const outputs: _WireOutputs = {};

    if (flags == undefined) return undefined;

    let allCached = true;
    for (const k of Object.keys(wireArgs) as (keyof _WireArgs)[]) {
      const featureName: FeatureNames = k;

      const output = this.backingStore.get(k);
      if (output == undefined) {
        allCached = false;
        break;
      }

      const identity = this.getOutputIdentity(featureName, wireArgs[k]);
      if (identity !== output.identity) {
        allCached = false;
        break;
      }

      try {
        // eslint-disable-next-line
        (outputs as any)[k] = output.value;
      } catch {
        allCached = false;
        break;
      }
    }
    if (allCached) {
      return outputs;
    }
    return undefined;
  }

  setOutputs(wireArgs: _WireArgs, wireOutputs: _WireOutputs) {
    if (!this.testAndTouchSession()) return;
    const nextExpiry = this.getOutputExpiry();

    for (const [k, v] of Object.entries(wireOutputs) as [
      keyof _WireOutputs,
      _WireOutputs[keyof _WireOutputs]
    ][]) {
      const wireArg = wireArgs[k];
      if (wireArg != undefined) {
        const identity = this.getOutputIdentity(k, wireArg);
        if (identity != undefined && !(k as string).startsWith("_"))
          this.backingStore.set(k, identity, v, nextExpiry);
      }
    }
  }

  //#region server sent events
  sseMaybeDel(name: string, createdBeforeDate: string | null) {
    if (this.backingStore.dontStore()) return;

    if (!createdBeforeDate) {
      this.backingStore.del(name);
      return;
    }

    try {
      const createdBefore = new Date(createdBeforeDate);
      const cur = this.backingStore.get(name);
      if (cur == undefined) return;
      if (cur.created < createdBefore) this.backingStore.del(name);
    } catch (e) {
      log.error(
        "unexpected error analyzing cache - deleting entry. error was " +
          JSON.stringify(e)
      );
      this.backingStore.del(name);
    }
  }

  // handle the "flush" sse, which is now deprecated.
  // data is either '_all', or a list of features to flush
  sseFlush(evt: Event) {
    if (this.backingStore.dontStore()) return;

    const mevt: MessageEvent = evt as MessageEvent;
    _flushCount++;
    if (mevt.data == "_all") this.deleteAll(false);
    // hooks already invalidated
    else this.sseMaybeDel(mevt.data, null);
    this.backingStore.set("_cacheVersion", "", "0", maxDate);
  }

  // handle the "flushcache" sse.
  // flush the entire cache. The cache version is send in the data.
  sseFlushCache(evt: Event) {
    if (this.backingStore.dontStore()) return;

    const mevt: MessageEvent = evt as MessageEvent;
    _flushCount++;
    this.deleteAll(false);
    this.backingStore.set("_cacheVersion", "", mevt.data, maxDate);
  }

  // handle the "flushfeatures" sse.
  // flush the cache for the feature names listed in the data.
  sseFlushFeatures(evt: Event) {
    if (this.backingStore.dontStore()) return;

    const mevt: MessageEvent = evt as MessageEvent;
    _flushCount++;
    this.sseMaybeDel(mevt.data, null);
  }

  sseHello(evt: Event) {
    if (this.backingStore.dontStore()) return;
    const mevt: MessageEvent = evt as MessageEvent;
    const cacheVersion = this.backingStore.get("_cacheVersion");
    if (cacheVersion != undefined && mevt.data != cacheVersion.value)
      this.deleteAll(true);
    this.backingStore.set("_cacheVersion", "", mevt.data, maxDate);
  }
}

//#endregion

//#endregion

//#region initialization

function normalizeUrl(url: string) {
  if (url.endsWith("/")) return url;
  return url + "/";
}

let lastLoggedUrl = "";

function makeBaseUrl(ssr: boolean): string {
  let url = undefined;
  if (ssr) {
    url = process.env.CAUSAL_ISERVER;
    if (url == undefined) {
      log.error(
        "SSR impression server environment variable not set, defaulting to http://localhost:3004/iserver" +
          "Please set CAUSAL_ISERVER"
      );
      url = "http://localhost:3004/iserver/";
    }
  } else {
    url =
      process.env.NEXT_PUBLIC_CAUSAL_BROWSER_ISERVER ??
      process.env.VAGRANT_CAUSAL_BROWSER_ISERVER ??
      process.env.REACT_APP_CAUSAL_BROWSER_ISERVER ??
      process.env.CAUSAL_BROWSER_ISERVER;

    if (url == undefined) {
      log.error(
        "Browser impression server environment variable not set, defaulting to http://localhost:3004/iserver " +
          "Please set one of: NEXT_PUBLIC_CAUSAL_BROWSER_ISERVER, VAGRANT_CAUSAL_BROWSER_ISERVER, CAUSAL_BROWSER_ISERVER"
      );
      url = "http://localhost:3004/iserver/";
    }
  }

  url = normalizeUrl(url);

  if (misc.ssr && url != lastLoggedUrl) {
    // it's easy to see the url on the client, but a bit harder in SSR output
    log.log("impression server url: ", url);
    lastLoggedUrl = url;
  }
  return url;
}

/**
 * @internal
 * Do not use - only exported for testing
 */
type LogFn = (message: string, ...optionalParams: unknown[]) => void;

/**
 * @internal
 * Do not use - only exported for testing
 */
export type FetchUrl = string;

/**
 * @internal
 * Do not use - only exported for testing
 */
export type FetchRequestInit = {
  method?: "GET" | "POST";
  body?: string;
  signal?: AbortSignal;
};

/**
 * @internal
 * Do not use - only exported for testing
 */
export type FetchResponse = {
  status: number;
  text(): Promise<string>;
  json(): Promise<unknown>;
};

/**
 * Causal configuration options.
 */
export type CausalOptions = {
  /**
   * By default Causal will send all network requests to the value compiled into the generated API.
   * This default value comes from the url associated with the impression server for each environment.
   * You can also set it here - for example if you want to use a different URL on the client and server.
   */
  baseUrl?: string;

  /**
   * useServerSentEvents: Use server side events to update features
   * Defaults to true for registered devices, false otherwise.
   */
  useServerSentEvents?: boolean;

  /**
   * How long to wait for the impression server to respond before a timeout
   * The default is 1000 ms (1 second)
   */
  timeoutMs?: number;
};

/**
 * @internal
 * Do not use - only exported for testing
 */
export type CausalDebugOptions = {
  /**
   * Reset the cache?
   * Defaults to false
   * If true, will delete all backing store entries,
   *  create a new cache, and redo event source
   */
  reset?: boolean;

  /**
   * By default Causal use console.log to log information.
   * You can alter this behavior be providing a logging function.
   */
  log?: LogFn;

  /**
   * By default Causal use console.warn to log warnings.
   * You can alter this behavior be providing a logging function.
   */
  logWarning?: LogFn;

  /**
   * By default Causal use console.error to log errors.
   * You can alter this behavior be providing a logging function.
   */
  logError?: LogFn;

  /**
   * By default, when running in the browser, Causal uses Navigor.sendBeacons to send non synchronous data.
   * By default, when running in node, Causal uses fetch.
   * You can alter this behavior by setting this function
   */
  sendBeacon?: (data: unknown) => void;

  /**
   * By default, Causal uses cross-fetch to fetch
   * You can alter this behavior by setting this function
   */
  fetch?: (url: string, init?: FetchRequestInit) => Promise<FetchResponse>;

  /**
   * By default, Causal uses new EventSource to create an EvtSource
   * You can alter this behavior by setting this function
   */
  newEvtSource?: (url: string) => EventSource;

  /**
   * By default when a non SSR CausalClient is created it will immediately
   * make an asynchronous request for feature flags (which might be filled from cache)
   *
   * You can alter this behavior with this method, although it's generally not recommended
   */
  immediatelyRequestFlags?: boolean;

  logDebug?: (
    level: number,
    message: string,
    ...optionalParams: unknown[]
  ) => void;

  debugLogLevel?: number;
  cacheOptions?: Partial<Omit<CacheOptions, "useServerSentEvents">>;
};

const defaultLog: {
  log: LogFn;
  warn: LogFn;
  error: LogFn;
  debug: (level: number, message: string, ...optionalParams: unknown[]) => void;
  debugLogLevel: number;
} = {
  debugLogLevel: 0,
  log: (...args) => {
    console.log(...args);
  },
  warn: (...args) => {
    console.warn(...args);
  },
  error: (...args) => {
    console.error(...args);
  },
  debug: (level: number, message: string, ...optionalParams: unknown[]) => {
    if (level <= log.debugLogLevel) console.log(message, ...optionalParams);
  },
};
let log = defaultLog;

const defaultSSR = typeof window == "undefined";
const defaultMisc = {
  ssr: defaultSSR,
  immediatelyRequestFlags: !defaultSSR,
};
let misc = defaultMisc;

const defaultCacheOptions: CacheOptions = {
  backingStore: defaultSSR ? new NoOpStore() : new LocalStorageStore(),
  outputExpirySeconds: undefined,
  useServerSentEvents:
    typeof window != "undefined"
      ? window.localStorage.getItem("_causal_registered") == "true"
      : false,
  sessionCacheExpirySeconds: 60 * 30,
};

const defaultNetwork = {
  timeoutMs: 1000,
  sendBeacon: (data: unknown) => {
    if (typeof navigator == "undefined") {
      // we are running server side
      log.debug(2, "defaultSendBeacon as fetch");
      network.fetch(network.baseUrl + "signal", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } else {
      log.debug(2, "defaultSendBeacon as beacon");
      navigator.sendBeacon(network.baseUrl + "signal", JSON.stringify(data));
    }
  },
  fetch: (url: FetchUrl, init?: FetchRequestInit): Promise<FetchResponse> => {
    log.debug(2, "defaultFetch");
    return fetch(url, init);
  },
  newEvtSource:
    typeof EventSource == "undefined"
      ? undefined
      : (url: string) => {
          return new EventSource(url);
        },
  baseUrl: makeBaseUrl(defaultSSR),
};
let network = defaultNetwork;

let session:
  | undefined
  | {
      args: SessionArgs & {
        // implicit arguments
        userAgent?: string;
        ipAddress?: string;
        entryUrl?: string;
        clientType?: string;
      };
    };

// simpler to have a no-op cache then check for undefined everywhere
let _cache: Cache = new Cache(undefined, undefined);

/**
 * A method to setup Causal for each request.
 *
 * Make sure to call `initRequest` in a context that will get executed on each request. If you execute it in a global context and are doing server side rendering, it will only get initialized once and it will not be able to distinguish between different sessions.
 *
 * It is safe to call `initRequest` multiple times. A good place to call `initRequest` is in a high level/root component like an App component or a always called data fetching function like getServerSideProps.
 *
 * @param sessionArgs The session args for this request.
 * @param incomingMessage If doing SSR, an IncomingMessage (i.e the request object). See: https://nodejs.org/api/http.html#class-httpincomingmessage
 * @param options Configurable options.
 */
export function initRequest(
  sessionArgs: SessionArgs,
  incomingMessage?: {
    headers: { [key: string]: string | string[] | undefined };
    url?: string;
    socket: {
      remoteAddress?: string;
    };
  },
  options?: CausalOptions,
  /** @internal */
  debugOptions?: CausalDebugOptions
) {
  if (!sessionArgs) {
    log.error("Fatal: Session was undefined or null");
    return;
  }

  network.baseUrl = options?.baseUrl
    ? normalizeUrl(options?.baseUrl)
    : defaultNetwork.baseUrl;

  const ssr = incomingMessage != undefined;
  if (
    typeof window == "undefined" &&
    !ssr &&
    // stifle this message in development because the dev version compiles the page on
    // every render which prints this message each time
    process.env.NODE_ENV != "development"
   ) {
      log.warn(
      "Looks like you are rendering server side (SSR), did you forget to pass incomingMessage to initRequest? " +
        "This message can also appear during a static build of a CSR page, in which case you can ignore it."
    );
  }
  misc.ssr = ssr;

  const changed =
    session == undefined ||
    JSON.stringify(session.args) != JSON.stringify(sessionArgs);
  if (!changed && !debugOptions?.reset) return;

  // re-initialize everything if the session object changes or
  // or if we are being told to do so

  if (
    debugOptions?.cacheOptions?.backingStore &&
    debugOptions.cacheOptions?.outputExpirySeconds === 0
  ) {
    log.warn("backing store set, but outputExpirySeconds is 0. Not caching");
  }

  if (!incomingMessage) {
    session = {
      args: sessionArgs,
    };
  } else {
    // if this is being rendered server side, pass along some data from the request
    session = {
      args: {
        ...sessionArgs,
        userAgent: incomingMessage?.headers["user-agent"] as string,
        clientType: "typescript",
        ipAddress: incomingMessage?.socket.remoteAddress,
        entryUrl: incomingMessage?.url,
      },
    };
  }

  // not using any type of {...one, ...two} constructs because
  // that will asssign explicitly undefined values
  log = {
    log: debugOptions?.log ?? defaultLog.log,
    warn: debugOptions?.logWarning ?? defaultLog.warn,
    error: debugOptions?.logError ?? defaultLog.error,
    debug: debugOptions?.logDebug ?? defaultLog.debug,
    debugLogLevel: debugOptions?.debugLogLevel ?? defaultLog.debugLogLevel,
  };

  network = {
    timeoutMs: options?.timeoutMs ?? defaultNetwork.timeoutMs,
    baseUrl: options?.baseUrl
      ? normalizeUrl(options.baseUrl)
      : defaultNetwork.baseUrl,
    fetch: (url: FetchUrl, init?: FetchRequestInit): Promise<FetchResponse> => {
      const baseFetch = debugOptions?.fetch ?? defaultNetwork.fetch;

      if (typeof AbortController == "undefined") {
        return baseFetch(url, init);
      } else {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), network.timeoutMs);
        return baseFetch(url, { ...init, signal: controller.signal })
          .then((response) => {
            clearTimeout(id);
            return response;
          })
          .catch((response) => {
            clearTimeout(id);
            return response;
          });
      }
    },
    sendBeacon: debugOptions?.sendBeacon ?? defaultNetwork.sendBeacon,
    newEvtSource: debugOptions?.newEvtSource ?? defaultNetwork.newEvtSource,
  };

  misc = {
    ssr,
    immediatelyRequestFlags: debugOptions?.immediatelyRequestFlags ?? !ssr,
  };

  const debugCO = debugOptions?.cacheOptions;
  const cacheOptions: CacheOptions = {
    backingStore:
      debugCO?.backingStore ??
      (ssr ? new NoOpStore() : defaultCacheOptions.backingStore),
    outputExpirySeconds:
      debugCO?.outputExpirySeconds ?? defaultCacheOptions.outputExpirySeconds,
    sessionCacheExpirySeconds:
      debugCO?.sessionCacheExpirySeconds ??
      defaultCacheOptions.sessionCacheExpirySeconds,
    useServerSentEvents:
      options?.useServerSentEvents ?? defaultCacheOptions.useServerSentEvents,
  };

  if (_cache) _cache?.deleteAll(true);
  _cache = new Cache(sessionArgs, cacheOptions);

  if (misc.immediatelyRequestFlags && !_cache.backingStore.dontStore()) {
    requestFlags()
      .then(
        () => {
          undefined;
        },
        () => {
          log.error("request flags failed");
        }
      )
      .catch(() => {
        log.error("request flags failed with exception");
      });
  }
}

//#endregion

//#region impressions + flags

const notIntializedStatus = -1;
const fetchFailureStatus = -2;

/**
 * This is a utility type so autocomplete works better.
 * I.e. `type MyFeatures = SelectFeatures<"this_will_autocomplete">`.
 * If it is not autocompleting, try typing a quote (') or double quote (").
 */
export type SelectFeatures<T extends FeatureNames> = T;

/**
 * Create a query to use with [[requestImpression]] or [[useImpression]] using the builder pattern.
 *
 * @return Query to use with [[requestImpression]] or [[useImpression]].
 */
export function queryBuilder(): Query<never> {
  return new Query();
}

/**
 * JSON format for an impression.
 * This can be safely serialized to JSON with functions like `JSON.stringify()`.
 * Use the function [[toImpresion]] to convert back to an impression.
 *
 * @typeparam T Type information for the impression. Use the same type when converting back to an impression with [[toImpresion]].
 */
export type ImpressionJSON<T extends FeatureNames> = {
  /** @internal */
  t?: T; // unused - suppresses T is unused error

  /** @internal */
  userId: UserIds;

  /** @internal */
  impressionType: "real" | "loading" | "error";

  /** @internal If an error, why */
  reason?: string;

  /** @internal */
  wireArgs: _WireArgs;

  /** @internal */
  wireOutputs: _WireOutputs;
};

function loadingImpression<T extends FeatureNames>(
  userId: UserIds
): Impression<T> {
  const impression = new ImpressionImpl({
    impressionType: "loading",
    userId,
    wireArgs: {},
    wireOutputs: {} as _WireOutputs,
  });
  return impression as unknown as Impression<T>;
}

function errorImpression<T extends FeatureNames>(
  reason: string,
  { wireArgs }: Pick<ImpressionJSON<T>, "wireArgs">
): Impression<T> {
  const impression = new ImpressionImpl({
    userId: {} as UserIds,
    impressionType: "error",
    reason,
    wireArgs: cleanWireArgs(wireArgs),
    wireOutputs: {} as _WireOutputs,
  });
  return impression as unknown as Impression<T>;
}

/**
 * Convert a [[ImpressionJSON]] back to an impression.
 */
export function toImpression<T extends FeatureNames>({
  impressionType,
  userId,
  wireArgs,
  wireOutputs: outputs,
}: ImpressionJSON<T>): Impression<T> {
  const impression = new ImpressionImpl({
    impressionType,
    userId,
    wireArgs,
    wireOutputs: outputs as _WireOutputs,
  });
  return impression as unknown as Impression<T>;
}

type IServerResponse = _WireOutputs & {
  _flags: _WireFlags;
};

// Currently only one kind of fetch option now, do we want to get the complete set of flags
type FetchOptions = "flags";

/**
 * Async function to get the on/off flags associated with a feature.
 *
 * @returns A promise that will resolve with the current set of feature flags.
 * On an error, it will return the default flags and an additional informational error value.
 *
 * Please note - The return value is strongly typed. A TypDoc documentation generation bug shows it as an Object here. It returns the same values as [[useFlags]].
 */
export async function requestFlags(): Promise<{
  flags: Flags<FeatureNames>;
  error?: CausalError;
}> {
  if (session == undefined) {
    log.error(notInitializedMsg);
    return { flags: defaultFlags, error: notInitializedError };
  }

  const cachedFlags = _cache.flags();
  if (cachedFlags != undefined) return { flags: cachedFlags };

  const { flags: responseFlags, error } = await iserverFetch({
    sessionArgs: session.args,
    options: ["flags"],
  });

  if (!error) {
    if (responseFlags == undefined)
      log.error("no error requesting flags, but no responseFlags");
    else {
      _cache.setFlags(responseFlags);
    }
  }

  // cache.flags() is very likely to be undefined, but on the off
  // chance a different request completed, including here
  return { flags: responseFlags ?? _cache.flags() ?? defaultFlags, error };
}

function cleanWireArgs(wireArgs: _WireArgs | undefined): _WireArgs {
  // the line below removes all undefined attributes
  // i.e. {a:1, b:undefined} => {a:1}
  // we do this because the wire args are returned back to the client and
  // some frameworks do not like undefined across serialization boundaries
  // most notably, next.js, see:
  //   https://github.com/vercel/next.js/discussions/11209
  //
  // this should be reasonably quick, and this should not be a huge
  // increase over all the other serialization that will happen as
  // part of the request
  return wireArgs == undefined ? {} : JSON.parse(JSON.stringify(wireArgs));
}

/**
 * Make the actual network call to the impression server to get feature and flag information
 *
 * @param impressionId
 * @param wireArgs
 * @param getFlags
 * @returns
 */
async function iserverFetch({
  options,
  impressionId,
  sessionArgs,
  wireArgs,
}: {
  options: readonly FetchOptions[];
  impressionId?: string;
  sessionArgs: SessionArgs;
  wireArgs?: _WireArgs;
}): Promise<{
  impression?: ImpressionImpl;
  flags?: Flags<FeatureNames>;
  error?: CausalError;
}> {
  const fetchOptions = [...options];
  try {
    let result: FetchResponse | undefined = undefined;
    let fetchExceptionError = "";

    wireArgs = cleanWireArgs(wireArgs);

    try {
      const body: {
        fetchOptions: FetchOptions[] | undefined;
        args: SessionArgs;
        requests: _WireArgs | undefined;
        impressionId: string | undefined;
      } = {
        fetchOptions,
        args: sessionArgs,
        impressionId,
        requests: wireArgs,
      };
      result = await network.fetch(network.baseUrl + "features", {
        method: "POST",
        body: JSON.stringify(body),
      });
    } catch (e) {
      if ((e as Error).message) fetchExceptionError = (e as Error).message;
      else fetchExceptionError = "Unknown exception calling fetch. ";
    }

    if (result == undefined) {
      const errMsg =
        "Received null or undefined result. Impression server error or timeout. " +
        fetchExceptionError;

      const error = {
        status: -1,
        message: errMsg,
      };
      log.error(errMsg);

      return {
        impression: undefined,
        flags: undefined,
        error,
      };
    } else if (result.status != 200) {
      let errMsg = "Impression server error or timeout. " + fetchExceptionError;
      if (result.text != undefined && typeof result.text == "function") {
        const errTxt = await result.text();
        errMsg += errTxt;
      }

      const error = {
        status: result?.status || -1,
        message: errMsg,
      };
      log.error(errMsg);

      return {
        impression: undefined,
        flags: undefined,
        error,
      };
    }
    const response = (await result.json()) as IServerResponse | undefined;
    if (response == undefined) {
      const error = {
        status: -1,
        message: "unexpected null response or timeout",
      };
      const errMsg = "Impression server error: " + JSON.stringify(error);
      log.error(errMsg);

      return {
        impression: undefined,
        flags: undefined,
        error,
      };
    }

    const { _flags: responseFlags, ...wireOutputs } = response;

    if (log.debugLogLevel >= 3) {
      log.debug(4, "fetch outputs:", wireOutputs);
    }

    const impression = new ImpressionImpl({
      impressionType: "real",
      userId: sessionKeys(sessionArgs),
      wireArgs,
      wireOutputs,
    });

    let returnFlags = responseFlags;
    if (fetchOptions?.includes("flags") && responseFlags == undefined) {
      log.error("unexpected empty response flags");
      returnFlags = returnFlags ?? defaultFlags;
    }

    return {
      impression,
      flags: returnFlags,
      error: undefined,
    };
  } catch (e) {
    const errMsg = "unexpected error in network.fetch";
    log.error(errMsg, e);

    return {
      impression: undefined,
      flags: undefined,
      error: { status: fetchFailureStatus, message: errMsg },
    };
  }
}

function sendImpressionBeacon<T extends FeatureNames>(
  impression: Impression<T>,
  impressionId: string
) {
  const outputs = impression.toJSON().wireOutputs as _WireOutputs;
  const impressionIdMap: {
    [idx: string]: { impression: string; newImpression: string | undefined };
  } = {};

  let count = 0;
  Object.entries(outputs).forEach(([k, v]) => {
    if (v != "OFF" && v != undefined) {
      count += 1;
      impressionIdMap[k] = {
        impression: (v as { _impressionId: string })?._impressionId, // older versions of TS need this cast
        newImpression: impressionId,
      };
    }
  });

  if (count > 0) {
    network.sendBeacon({
      id: impression.userId,
      impressions: impressionIdMap,
    });
  }
}

function updateImpressionIds<T extends FeatureNames>(
  impression: Impression<T>,
  newImpressionId: string,
  wireArgs: _WireArgs
): Impression<T> {
  const newOutputs: _WireOutputs = {};
  for (const k of Object.keys(wireArgs) as (keyof _WireArgs)[]) {
    const currentOutput = impression.toJSON().wireOutputs[k];
    if (currentOutput == "OFF" || currentOutput == undefined) {
      // Casting b/c it can be too much for TS to understand
      (newOutputs as { [idx: string]: unknown })[k] = currentOutput;
    } else {
      const newOutput: { _impressionId: string } = {
        ...(currentOutput as any), // eslint-disable-line
        _impressionId: newImpressionId,
      };
      // Casting b/c it can be too much for TS to understand
      (newOutputs as { [idx: string]: unknown })[k] = newOutput;
    }
  }
  return toImpression({
    impressionType: impression.toJSON().impressionType,
    userId: impression.userId,
    wireArgs,
    wireOutputs: newOutputs,
  });
}

function getCachedImpression<T extends FeatureNames>(
  sessionArgs: SessionArgs,
  wireArgs: _WireArgs
): { cachedImpression?: Impression<T>; cachedFlags?: Flags<FeatureNames> } {
  const cachedFlags = _cache.flags();
  if (cachedFlags == undefined) return {};

  const cachedOutputs = _cache.outputs(wireArgs);
  if (cachedOutputs == undefined) return {};

  return {
    cachedImpression: toImpression({
      impressionType: "real", // we only cache real impressions, not errors or loads
      wireArgs,
      userId: sessionKeys(sessionArgs),
      wireOutputs: cachedOutputs,
    }),
    cachedFlags,
  };
}

/**
 * Async function to get the impression and on/off flags associated with a feature.
 *
 * @returns A promise that will resolve with the impression and the current set of feature flags.
 * On an error, it will return the default values for the impression and flags, as well as an additional informational error value.
 * Please note - The return value is strongly typed. A TypeDoc documentation generation bug shows it as an Object here. It returns the same values as [[useImpression]].
 *
 * @typeparam Type information for the request and returned impression. Typically inferred from the query.
 * @param query Features to request and their arguments.
 * @param impressionId The impression id.
 *
 */
export async function requestImpression<T extends FeatureNames>(
  query: Query<T>,
  impressionId?: string
): Promise<{
  impression: Impression<T>;
  flags: Flags<T>;
  error?: CausalError;
}> {
  if (session == undefined) {
    log.error(notInitializedMsg);
    return {
      impression: errorImpression("Not Initialized", {
        wireArgs: query._wireArgs,
      }),
      flags: defaultFlags as Flags<T>,
      error: notInitializedError,
    };
  }

  if (impressionId == undefined) impressionId = uuidv4();

  const { cachedImpression, cachedFlags } = getCachedImpression<T>(
    session.args,
    query._wireArgs
  );

  if (cachedImpression != undefined && cachedFlags != undefined) {
    sendImpressionBeacon(cachedImpression, impressionId);
    return {
      impression: updateImpressionIds(
        cachedImpression,
        impressionId,
        query._wireArgs
      ),
      flags: cachedFlags as Flags<T>, // cast needed for older version of TS
    };
  }

  const fetchOptions: FetchOptions[] = [];
  if (cachedFlags == undefined) fetchOptions.push("flags");

  const {
    impression,
    flags: responseFlags,
    error,
  } = await iserverFetch({
    options: fetchOptions,
    impressionId,
    sessionArgs: session.args,
    wireArgs: query._wireArgs,
  });

  if (
    cachedFlags == undefined &&
    responseFlags == undefined &&
    error == undefined
  ) {
    log.error("unexpected undefined flags in requestImpression");
  }

  if (responseFlags) _cache.setFlags(responseFlags);
  const returnFlags = cachedFlags ?? responseFlags ?? defaultFlags;

  if (impression) {
    _cache.setOutputs(query._wireArgs, impression.toJSON().wireOutputs);
    return {
      impression: impression as unknown as Impression<T>,
      flags: returnFlags as Flags<T>, // cast needed for older version of TS
      error,
    };
  } else {
    return {
      impression: errorImpression("Fetch Failure", {
        wireArgs: query._wireArgs,
      }),
      flags: returnFlags as Flags<T>, // cast needed for older version of TS
      error: error ?? {
        message: "unknown error",
        status: -1,
      },
    };
  }
}

/**
 * Causal error type.
 */
export type CausalError = {
  /**
   * The status code associated with the error
   */
  status: number;

  /**
   * The message associated with the error
   */
  message: string;
};

type FlagsNone = { state: "none" };
type FlagsFatal<T extends FeatureNames> = { state: "fatal"; flags: Flags<T> };
type FlagsLoading = { state: "loading" };
type FlagsDone<T extends FeatureNames> = { state: "done"; flags: Flags<T> };

type FlagsState<T extends FeatureNames> =
  | FlagsNone
  | FlagsFatal<T>
  | FlagsLoading
  | FlagsDone<T>;

/**
 * React hook to get the on/off flags associated with a feature
 */
export function useFlags(): {
  loading: boolean;
  flags: Flags<FeatureNames> | undefined;
  error: CausalError | undefined;
} {
  const _session = session;
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const errorState = useRef<CausalError>();
  const flagsState = useRef<FlagsState<FeatureNames>>({ state: "none" });
  const prevSession = useRef(session);
  const prevFlushCount = useRef(_flushCount);
  let hasChange = false;

  // re-request if cache is busted or if the session changes

  if (prevSession.current != session || prevFlushCount.current != _flushCount) {
    // not using useEffect / dependency array for this b/c want
    // this code to reset the state in the same render cycle,
    // the rest of the non effect code in the hook can further update it
    hasChange = true;
    flagsState.current = { state: "none" };

    // update prev's
    prevSession.current = session;
    prevFlushCount.current = _flushCount;
  }

  if (_session == undefined) {
    // no session is fatal

    if (flagsState.current.state != "fatal") {
      hasChange = true;
      flagsState.current = {
        state: "fatal",
        flags: defaultFlags as Flags<FeatureNames>,
      };
    }
    if (errorState.current != notInitializedError) {
      hasChange = true;
      errorState.current = notInitializedError;
    }
  } else {
    // get cached values
    const _cacheFlags = _cache.flags();
    if (flagsState.current.state == "none" && _cacheFlags != undefined) {
      hasChange = true;
      flagsState.current = {
        state: "done",
        flags: _cacheFlags,
      };
    }
  }

  // fetch results
  useEffect(() => {
    log.debug(1, "useFlags fetch results effect");
    if (!_session) return;

    async function request() {
      log.debug(1, "useFlags fetch results effect: request()");

      if (!_session) return;
      log.debug(1, "request");

      const { flags, error } = await requestFlags();
      flagsState.current = {
        state: "done",
        flags,
      };
      errorState.current = error;
      forceUpdate();
    }

    if (flagsState.current.state == "none") {
      flagsState.current = { state: "loading" };
      request();
      forceUpdate();
    }
  });

  // return current values
  const loading =
    flagsState.current.state == "none" || flagsState.current.state == "loading";

  log.debug(3, "useImpression returning. loading", loading);

  let flags: Flags<FeatureNames> | undefined = undefined;
  if (
    flagsState.current.state == "fatal" ||
    flagsState.current.state == "done"
  ) {
    flags = flagsState.current.flags;
  }

  if (hasChange) forceUpdate();

  return {
    loading,
    flags: flags,
    error: errorState.current,
  };
}

type ImpressionNone<T extends FeatureNames> = {
  state: "none";
  impression: Impression<T>;
};
type ImpressionFatal<T extends FeatureNames> = {
  state: "fatal";
  impression: Impression<T>;
};
type ImpressionCached<T extends FeatureNames> = {
  state: "cached";
  newImpressionId: string;
  cachedImpression: Impression<T>;
  impression: Impression<T>;
};
type ImpressionLoading<T extends FeatureNames> = {
  state: "loading";
  impression: Impression<T>;
};
type ImpressionDone<T extends FeatureNames> = {
  state: "done";
  impression: Impression<T>;
};

type ImpressionState<T extends FeatureNames> =
  | ImpressionNone<T>
  | ImpressionFatal<T>
  | ImpressionCached<T>
  | ImpressionLoading<T>
  | ImpressionDone<T>;

/**
 * React hook to get both the impression and the on/off flags associated with a feature
 */
export function useImpression<T extends FeatureNames>(
  query: Query<T>,
  impressionId?: string
): {
  impression: Impression<T>;
  flags: Flags<T> | undefined;
  loading: boolean;
  error?: CausalError;
} {
  const _session = session;

  // putting into a ref so hook always returns the same loading impression when loading
  const _loadingImpression = useRef<Impression<T>>(
    loadingImpression(_session?.args ?? ({} as UserIds))
  );

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const errorState = useRef<CausalError>();
  const flagsState = useRef<FlagsState<T>>({ state: "none" });
  const impressionState = useRef<ImpressionState<T>>({
    state: "none",
    impression: _loadingImpression.current,
  });

  const requestFinishTS = useRef<Date>();
  const wireArgsJson = JSON.stringify(query._wireArgs);
  const prevSession = useRef(session);
  const prevWireArgsJson = useRef(wireArgsJson);
  const prevFlushCount = useRef(_flushCount);
  const prevImpressionId = useRef(impressionId);

  let hasChange = false;

  // re-request as frequently as the cache expires
  // or if cache is busted
  // or if the session changes
  // or if the query changes
  // of it the impression id changes
  let nextCycle: Date | undefined = undefined;
  const now = new Date();
  if (requestFinishTS.current != undefined && _cache.outputExpirySeconds)
    nextCycle = addSeconds(requestFinishTS.current, _cache.outputExpirySeconds);

  if (
    prevSession.current != session ||
    (nextCycle != undefined && nextCycle < now) ||
    prevWireArgsJson.current != wireArgsJson ||
    prevFlushCount.current != _flushCount ||
    prevImpressionId.current != impressionId
  ) {
    // not using useEffect / dependency array for this b/c want
    // this code to reset the state in the same render cycle,
    // the rest of the non effect code in the hook can further update it

    hasChange = true;

    // update impression state
    impressionState.current = {
      state: "none",
      impression: _loadingImpression.current,
    };

    // flag state  only need to be flushed on a sse event or session change
    if (prevFlushCount.current != _flushCount || prevSession.current != session)
      flagsState.current = { state: "none" };

    // update prev's
    requestFinishTS.current = undefined;
    prevSession.current = session;
    prevWireArgsJson.current = wireArgsJson;
    prevFlushCount.current = _flushCount;
    prevImpressionId.current = impressionId;
    _loadingImpression.current = loadingImpression({
      deviceId: _session?.args.deviceId ?? "unexpected-loading-impression-id",
    });
  }

  if (_session == undefined) {
    // no session is fatal

    if (impressionState.current.state != "fatal") {
      hasChange = true;
      impressionState.current = {
        state: "fatal",
        impression: errorImpression("NoSession", {
          wireArgs: query._wireArgs,
        }),
      };
    }
    if (flagsState.current.state != "fatal") {
      hasChange = true;
      flagsState.current = { state: "fatal", flags: defaultFlags as Flags<T> };
    }
    if (errorState.current != notInitializedError) {
      hasChange = true;
      errorState.current = notInitializedError;
    }
  } else {
    // get cached values
    if (
      impressionState.current.state == "none" ||
      flagsState.current.state == "none"
    ) {
      const { cachedImpression, cachedFlags } = getCachedImpression<T>(
        _session.args,
        query._wireArgs
      );

      if (
        cachedImpression != undefined &&
        impressionState.current.state == "none"
      ) {
        hasChange = true;
        const newImpressionId = impressionId ?? uuidv4();
        impressionState.current = {
          state: "cached",
          newImpressionId,
          impression: updateImpressionIds(
            cachedImpression,
            newImpressionId,
            query._wireArgs
          ),
          cachedImpression,
        };
      }

      if (cachedFlags != undefined && flagsState.current.state == "none") {
        hasChange = true;
        flagsState.current = {
          state: "done",
          flags: cachedFlags as Flags<T>,
        };
      }
    }
  }

  // fetch results
  useEffect(() => {
    log.debug(1, "useImpression fetch results effect");
    if (!_session) return;

    async function request() {
      log.debug(1, "useImpression fetch results effect: request()");

      if (!_session) return;
      log.debug(1, "request");

      const { impression, flags, error } = await requestImpression(
        query,
        impressionId
      );
      requestFinishTS.current = new Date();
      impressionState.current = {
        state: "done",
        impression,
      };
      flagsState.current = {
        state: "done",
        flags,
      };
      errorState.current = error;
      forceUpdate();
    }

    if (
      impressionState.current.state == "none" ||
      flagsState.current.state == "none"
    ) {
      if (impressionState.current.state == "none")
        impressionState.current = {
          state: "loading",
          impression: _loadingImpression.current,
        };
      if (flagsState.current.state == "none")
        flagsState.current = { state: "loading" };
      request();
      forceUpdate();
    }
  });

  // send beacons for cached impressions
  useEffect(() => {
    log.debug(1, "useImpression useEffect: cached");
    if (impressionState.current.state == "cached") {
      sendImpressionBeacon(
        impressionState.current.cachedImpression,
        impressionState.current.newImpressionId
      );
      impressionState.current = {
        state: "done",
        impression: impressionState.current.impression,
      };
    }
  });

  // return current values
  const loading =
    impressionState.current.state == "none" ||
    impressionState.current.state == "loading" ||
    flagsState.current.state == "none" ||
    flagsState.current.state == "loading";

  log.debug(3, "useImpression returning. loading", loading);

  let flags: Flags<T> | undefined = undefined;
  if (
    flagsState.current.state == "fatal" ||
    flagsState.current.state == "done"
  ) {
    flags = flagsState.current.flags;
  }

  if (hasChange) forceUpdate();

  return {
    loading,
    impression: impressionState.current.impression,
    flags: flags,
    error: errorState.current,
  };
}

//#endregion

//#region utility

const notInitializedMsg =
  "FATAL: session is not defined. Did you call CausalInit?";

const notInitializedError: CausalError = {
  status: notIntializedStatus,
  message: notInitializedMsg,
};

const maxDate = new Date(8640000000000000);

function makeFutureDate(secondsFromNow: number): Date {
  return new Date(Date.now() + secondsFromNow * 1000);
}

function addSeconds(date: Date, seconds: number): Date {
  return new Date(date.valueOf() + seconds * 1000);
}

//#endregion
