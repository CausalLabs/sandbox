import type { NextPage, NextPageContext } from "next";
import { qb, Session } from "../causal";
import Layout from "../components/Layout";
import { MyPageContext } from "../utils";

const Overfetch: NextPage = () => {
  return <Layout featuresToShow={["Feature2", "ProductInfo"]} />;
};

Overfetch.getInitialProps = async (ctx: MyPageContext) => {
  const session = ctx.session;

  // fetching more features than the page will display
  // (_app.getInitialProps fetches Feature2)
  await session.requestCacheFill(
    qb().getProductInfo().getRatingBox({ product: "abc" })
  );
  return { otherData: "foo" };
};

export default Overfetch;
