import { render, type RenderOptions } from "@builder.io/qwik";
import App from "./routes/index";

export default function (opts: RenderOptions) {
  const container = document.getElementById("app") || document;
  return render(container, <App />, opts);
}
