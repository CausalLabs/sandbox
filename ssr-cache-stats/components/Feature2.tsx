import { ReactNode, useContext } from "react";
import { qb, useImpression } from "../causal";
import { RequestIdContext } from "../utils";

export default function Feature2() {
  const requestId = useContext(RequestIdContext);
  const { impression, loading } = useImpression(
    qb().getFeature2({ exampleArg: "123" }),
    requestId
  );
  return (
    <div>
      <div>
        Feature2 feature flag is{" "}
        {loading
          ? "loading..."
          : impression.Feature2 == undefined
          ? "OFF"
          : "ON"}
      </div>
    </div>
  );
}
