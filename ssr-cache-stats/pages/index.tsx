import type { NextPage, NextPageContext } from "next";
import { qb, Session } from "../causal";
import Layout from "../components/Layout";
import { MyPageContext } from "../utils";

const Index: NextPage = () => {
  return <Layout featuresToShow={["Feature2", "ProductInfo", "RatingBox"]} />;
};

Index.getInitialProps = async (ctx: MyPageContext) => {
  const session = ctx.session;

  // fetching exactly the features than the page will display
  // (_app.getInitialProps fetches Feature2)
  await session.requestCacheFill(
    qb().getProductInfo().getRatingBox({ product: "abc" })
  );
  return { otherData: "foo" };
};

export default Index;
