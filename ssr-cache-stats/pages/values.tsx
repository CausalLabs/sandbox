import type { NextPage } from "next";
import { qb, useFeature } from "../causal";
import { MyPageContext } from "../utils";
import styles from "../styles/Home.module.css";

const Index: NextPage = () => {
  const ratingBox = useFeature(qb().getRatingBox({ product: "abc" }));
  const feature2 = useFeature(qb().getFeature2({ exampleArg: "ea" }));

  if (ratingBox == "OFF" || feature2 == "OFF") return <></>;

  return (
    <div className={styles.main}>
      <div>ratingBox: {ratingBox?.callToAction} </div>
      <div>Feature2: {feature2?.exampleOutput}</div>
    </div>
  );
};

Index.getInitialProps = async (ctx: MyPageContext) => {
  const session = ctx.session;

  await session.requestCacheFill(
    qb().getRatingBox({ product: "abc" }).getFeature2({ exampleArg: "ea" })
  );
  return { otherData: "foo" };
};

export default Index;
