import liff from "@line/liff";

import HomePage from "./pages/home";
import PlaygroundPage from "./pages/playground";
import ProfilePage from "./pages/profile";

type Route = {
  id: string;
  path: string;
  content: HTMLElement | string;
};

const routes: Array<Route> = [
  {
    id: "home",
    path: "/",
    content: HomePage,
  },
  {
    id: "Playground",
    path: "/playground",
    content: PlaygroundPage,
  },
  {
    id: "profile",
    path: "/profile",
    content: ProfilePage,
  },
  {
    id: "error",
    path: "/error",
    content: `Error`,
  },
];

const navContents = [
  { routeId: "home", label: "App", classList: ["logo"] },
  { routeId: "home", label: "Home" },
  { routeId: "Playground", label: "Playground" },
  {
    routeId: "profile",
    label: `<span class="material-symbols-outlined icon">account_circle</span>`,
  },
];

const app = document.querySelector<HTMLDivElement>("#app") as HTMLDivElement;

function renderContent(path: string) {
  const page = routes.find((route) => route.path === path);
  let content = app.querySelector<HTMLDivElement>("#content") as HTMLDivElement;
  if (content) {
    app.removeChild(content);
  }

  content = document.createElement("div");
  content.id = "content";
  app.appendChild(content);

  if (!page) {
    content.innerHTML = "404";
    return;
  }

  if (page.content instanceof HTMLElement) {
    content.innerHTML = page.content.innerHTML;
    page.content.dispatchEvent(new Event("mounted"));
  } else {
    content.innerHTML = page.content;
  }
}

function navigate(e: Event) {
  e.preventDefault();
  let target = e.target as HTMLElement;

  // 子要素イベントをpreventDefaultすると親へイベントが伝播しない.
  // かと言ってpreventDefaultしないと、aタグのhrefに遷移（再読み込み）してしまう...
  // ので親のaタグ再帰探索する...
  if (!(target instanceof HTMLAnchorElement)) {
    let parent = target.parentElement;
    for (let i = 0; i < 2; i++) {
      if (parent && parent instanceof HTMLAnchorElement) {
        target = parent;
        break;
      }
    }

    if (!(target instanceof HTMLAnchorElement)) {
      return;
    }
  }

  const { href, pathname } = target as HTMLAnchorElement;
  window.history.pushState({}, "", href);

  activateNav();
  renderContent(pathname);
}

function renderNav() {
  app.innerHTML = `
    <nav id="nav">
      <ul id="pages"></ul>
    </nav>`;
  const ul = document.querySelector<HTMLUListElement>(
    "#pages"
  ) as HTMLUListElement;

  const ulFragment = document.createDocumentFragment();
  navContents.forEach((content) => {
    const route = routes.find((route) => route.id === content.routeId);

    const li = document.createElement("li");
    li.id = content.routeId;
    li.classList.add(...(content.classList || []));
    const anchor = document.createElement("a");
    anchor.href = route?.path || "#";
    anchor.innerHTML = content.label;
    anchor.onclick = navigate;
    li.appendChild(anchor);

    ulFragment.appendChild(li);
  });

  ul.appendChild(ulFragment);
  stickyNav();
}

function stickyNav() {
  const nav = document.querySelector<HTMLElement>("#nav") as HTMLElement;
  let topOfNav = nav.offsetTop;

  window.addEventListener("scroll", () => {
    if (window.scrollY > topOfNav) {
      document.body.style.paddingTop = nav.offsetHeight + "px";
      document.body.classList.add("fixed-nav");
    } else {
      document.body.classList.remove("fixed-nav");
      document.body.style.paddingTop = "0";
    }
  });
}

function setProfileIfLoggedIn() {
  liff.ready.then(async () => {
    if (liff.isLoggedIn()) {
      const { pictureUrl } = await liff
        .getProfile()
        .then(({ pictureUrl, displayName }) => ({ pictureUrl, displayName }));
      const profileAnchor = document.querySelector<HTMLAnchorElement>(
        "#profile a"
      ) as HTMLAnchorElement;

      profileAnchor.innerHTML = `
        <img src="${pictureUrl}" class="icon">
      `;
    }
  });
}

function activateNav() {
  document.querySelectorAll("nav ul#pages li a").forEach((anchor) => {
    anchor.classList.remove("active");
  });
  const activeId = routes.find((route) => route.path === location.pathname)?.id;
  document
    .querySelectorAll(`nav ul#pages li#${activeId} a`)
    .forEach((anchor) => {
      anchor.classList.add("active");
    });
}

main: {
  renderNav();
  activateNav();
  setProfileIfLoggedIn();
}

export function useNavRouter() {
  return {
    renderContent,
  };
}
