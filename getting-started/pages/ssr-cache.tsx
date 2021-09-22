import { GetServerSidePropsContext } from "next";
import {
  Session,
  SessionContext,
  SessionJSON,
  qb,
  useSessionJSON,
} from "../causal";
import { getOrGenDeviceId, products } from "../utils";
import { ProductInfo } from "./react-example";

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<{ props: PageProps }> {
  const product =
    products[context.query.pid as keyof typeof products] ?? products["iphone"];

  const deviceId = getOrGenDeviceId(context);
  const session = Session.fromDeviceId(deviceId, context.req);
  await session.requestCacheFill(qb().getRatingBox({ product: product.name }));

  return { props: { sessionJson: session.toJSON(), product } };
}

export default function Index(props: PageProps) {
  const session = useSessionJSON(props.sessionJson);

  return (
    <SessionContext.Provider value={session}>
      <ProductInfo product={props.product} />
    </SessionContext.Provider>
  );
}

type PageProps = {
  sessionJson: SessionJSON;
  product: React.ComponentProps<typeof ProductInfo>["product"];
};
