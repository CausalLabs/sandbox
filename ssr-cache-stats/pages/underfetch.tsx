import type { NextPage, NextPageContext } from "next";
import { qb, Session } from "../causal";
import Layout from "../components/Layout";
import { MyPageContext } from "../utils";

const Underfetch: NextPage = () => {
  return <Layout featuresToShow={["Feature2", "ProductInfo", "RatingBox"]} />;
};

Underfetch.getInitialProps = async (ctx: MyPageContext) => {
  const session = ctx.session;

  // fetching less features than the page will display
  await session.requestCacheFill(qb().getRatingBox({ product: "abc" }));
  return { otherData: "foo" };
};

export default Underfetch;
