import { getName } from "../props/SharedProps";

export default () => {
  const name = getName();
  return <h1>Name: {name.value}</h1>;
};
