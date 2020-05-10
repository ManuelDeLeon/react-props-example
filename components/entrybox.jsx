import { getName } from "../props/SharedProps";
import { getProp } from "../props/prop";

export default () => {
  const name = getName();
  const title = getProp("");
  return (
    <div>
      Name:{" "}
      <input
        value={name.value}
        onChange={(e) => (name.value = e.target.value)}
      />
      Title:{" "}
      <input
        value={title.value}
        onChange={(e) => (title.value = e.target.value)}
      />
      <br />
      <h2>Title: {title.value}</h2>
    </div>
  );
};
