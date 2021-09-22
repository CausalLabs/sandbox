import { useContext } from "react";
import { qb, useImpression } from "../causal";
import { RequestIdContext } from "../utils";

export default function ProductInfo() {
  const requestId = useContext(RequestIdContext);
  const { impression, loading } = useImpression(
    qb().getProductInfo(),
    requestId
  );

  return (
    <div>
      ProductInfo feature flag is{" "}
      {loading
        ? "loading..."
        : impression.ProductInfo == undefined
        ? "OFF"
        : "ON"}
    </div>
  );
}
