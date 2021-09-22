import { useRouter } from "next/router";
import { useState } from "react";
import { qb, Session, SessionContext, useFeature } from "../causal";
import { RatingWidget } from "../components/RatingWidget";
import { getOrGenDeviceId, products } from "../utils";

export default function Page() {
  const router = useRouter();

  const session = new Session({ deviceId: getOrGenDeviceId(router) });

  const product = products[router.query.pid as keyof typeof products];
  if (product == undefined) {
    return <></>; // Product not found
  }

  return (
    <SessionContext.Provider value={session}>
      <ProductInfo product={product} />
    </SessionContext.Provider>
  );
}

export function ProductInfo({
  product,
}: {
  product: { name: string; url: string; next: string };
}) {
  const [rating, setRating] = useState(0);
  const router = useRouter();

  const ratingBox = useFeature(qb().getRatingBox({ product: product.name }));

  return (
    <div className="center">
      <h1>{product.name}</h1>
      <img src={product.url} alt="product image" />

      {ratingBox != "OFF" && (
        <>
          {/* use impression data */}
          <h3>{ratingBox?.callToAction}</h3>
          <RatingWidget
            curRating={rating}
            onSetRating={(newRating) => {
              setRating(newRating);
              // wire up events
              ratingBox?.signalRating({ stars: newRating });
            }}
          />
          <a href={router.route + "?pid=" + product.next}>Rate Another</a>
        </>
      )}
    </div>
  );
}
