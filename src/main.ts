import "./style.css";
import "material-symbols";
import liff from "@line/liff";

import { useNavRouter } from "./nav-router";

const { renderContent } = useNavRouter();

// alert(`LIFF init start\n${window.location.href}`);
liff
  .init({
    liffId: import.meta.env.VITE_LIFF_ID,
  })
  .then(() => {
    // alert("LIFF init success");
    renderContent(window.location.pathname);
  })
  .catch((error: Error) => {
    renderContent("/error");
  });
