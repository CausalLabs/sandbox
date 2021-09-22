import { useRouter } from "next/router";
import { useState } from "react";
import { initRequest, queryBuilder, useFlags, useImpression } from "../causal";
import { RatingWidget } from "../components/RatingWidget";
import { getOrGenDeviceId } from "../utils";

export default function Page() {
  const router = useRouter();
  initRequest({ deviceId: getOrGenDeviceId(router) });
  const { flags } = useFlags();
  const product = products[router.query.pid as keyof typeof products];

  if (!flags?.ProductInfo) {
    return <div>Product info has been feature flagged off</div>;
  }

  if (product == undefined) {
    return <></>; // Product not found
  }

  return <ProductInfo product={product} />;
}

function ProductInfo({
  product,
}: {
  product: { name: string; url: string; next: string };
}) {
  const [rating, setRating] = useState(0);
  const query = queryBuilder().getRatingBox({ product: product.name });
  const { impression, flags, error } = useImpression(query);

  // check for errors
  if (error) {
    console.log(
      "There is no impression server running yet, but it still works! " +
        "Causal is resilient to network and backend outages " +
        "because the defaults are compiled in 😃."
    );
  }

  return (
    <div className="center">
      <h1>{product.name}</h1>
      <img src={product.url} alt="product image" />

      {/* test feature flag */}
      {flags?.RatingBox && (
        <>
          {/* use impression data */}
          <h3>{impression.RatingBox?.callToAction}</h3>
          <RatingWidget
            curRating={rating}
            onSetRating={(newRating) => {
              setRating(newRating);
              // wire up events
              impression.RatingBox?.signalRating({ stars: rating });
            }}
          />
          <a href={"react-example?pid=" + product.next}>Rate Another</a>
        </>
      )}
    </div>
  );
}

const products = {
  iphone: { name: "iPhone 13", url: "/iphone13.webp", next: "pixel" },
  pixel: { name: "Pixel 5", url: "/pixel5.webp", next: "fold" },
  fold: {
    name: "Samsung Galaxy Fold",
    url: "/galaxyfold.webp",
    next: "iphone",
  },
};
