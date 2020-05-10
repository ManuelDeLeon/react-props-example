import Head from "next/head";
import { SharedType } from "../props/SharedType";
import { setInitialProps } from "../props/shared";
import { NextPageContext } from "next";
import { getName } from "../props/SharedProps";
import EntryBox from "../components/entrybox";
import TitleBox from "../components/titlebox";

const Home = (props: SharedType) => {
  setInitialProps(props);
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
      </Head>

      <main>
        <TitleBox />
        <EntryBox />
      </main>
    </div>
  );
};
Home.getInitialProps = async (context: NextPageContext) => {
  const initialProps: SharedType = {
    name: await getName.initialProp(context),
  };
  return initialProps;
};

export default Home;
