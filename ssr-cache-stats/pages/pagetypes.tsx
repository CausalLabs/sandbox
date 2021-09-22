import type { NextPage } from "next";
import { useRouter } from "next/router";
import { OptionContext, qb } from "../causal";
import Layout from "../components/Layout";
import { MyPageContext } from "../utils";

const Index: NextPage = () => {
  const router = useRouter();
  const defaultPageType = router.query.defaultPageType as "SSR" | "SSG" | "CSR";

  return (
    <OptionContext.Provider value={{ defaultPageType }}>
      <Layout featuresToShow={["Feature2", "ProductInfo", "RatingBox"]} />
    </OptionContext.Provider>
  );
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
