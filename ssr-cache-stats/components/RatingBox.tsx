import { useContext } from "react";
import { qb, useImpression } from "../causal";
import { RequestIdContext } from "../utils";

export default function RatingBox() {
  const requestId = useContext(RequestIdContext);

  const { impression, loading } = useImpression(
    qb().getRatingBox({ product: "abc" }),
    requestId
  );
  return (
    <div>
      RatingBox feature flag is{" "}
      {loading
        ? "loading..."
        : impression.RatingBox == undefined
        ? "OFF"
        : "ON"}
    </div>
  );
}
