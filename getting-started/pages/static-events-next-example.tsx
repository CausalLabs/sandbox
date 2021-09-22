import { GetServerSideProps } from "next";
import { useState } from "react";
import {
  initRequest,
  queryBuilder,
  RatingBox,
  requestImpression,
} from "../causal";
import { RatingWidget } from "../components/RatingWidget";
import { getOrGenDeviceId } from "../utils";

type SSRProps = {
  showRatingBox: boolean;
  product: typeof products[keyof typeof products];
  CTA: string;
  deviceId: string;
  impressionId: string;
};

export const getServerSideProps: GetServerSideProps<SSRProps> = async (
  context
) => {
  const deviceId = getOrGenDeviceId(context);
  initRequest({ deviceId }, context.req);
  const product = products[context.query.pid as keyof typeof products];
  const impressionId = "imp-1234";

  const query = queryBuilder().getRatingBox({ product: product.name });
  const { impression, flags, error } = await requestImpression(
    query,
    impressionId
  );

  if (product == undefined) {
    return {
      redirect: { destination: "static-events-next-example?pid=iphone" },
    } as any; // eslint-disable-line
  }

  if (error) {
    console.log(
      "There is no impression server running yet, but it still works! " +
        "Causal is resilient to network and backend outages because the defaults are compiled in 😃."
    );
  }

  const props: SSRProps = {
    showRatingBox: flags.RatingBox,
    deviceId,
    impressionId,
    product,
    CTA: impression.RatingBox?.callToAction ?? "",
  };
  return { props };
};

export default function ProductInfo({
  showRatingBox,
  deviceId,
  product,
  CTA,
  impressionId,
}: SSRProps) {
  const [rating, setRating] = useState(0);

  return (
    <div className="center">
      <h1>{product.name}</h1>
      <img src={product.url} alt="product image" />
      <h3>{CTA}</h3>

      {showRatingBox && (
        <>
          <RatingWidget
            curRating={rating}
            onSetRating={(newRating) => {
              setRating(newRating);
              RatingBox.signalRating({ deviceId }, impressionId, {
                stars: rating,
              });

              // For autocomplete convenience, you can also reference the feature
              // classes through the allFeatureTypes variable.
              //
              // allFeatureTypes.RatingBox.signalRating(deviceId, impressionId, {
              //   stars: rating,
              // });
            }}
          />
          <a href={"static-events-next-example?pid=" + product.next}>
            Rate Another
          </a>
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
