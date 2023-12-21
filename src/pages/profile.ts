import liff from "@line/liff";

const profilePage = document.createElement("div");

liff.ready.then(() => {
  const items = [
    { key: "liff.id", value: liff.id },
    { key: "liff.getOS()", value: liff.getOS() },
    { key: "liff.getLanguage()", value: liff.getLanguage() },
    { key: "liff.getVersion()", value: liff.getVersion() },
    { key: "liff.getLineVersion()", value: liff.getLineVersion() },
    { key: "liff.isLoggedIn()", value: liff.isLoggedIn() },
    { key: "liff.isInClient()", value: liff.isInClient() },
  ];
  const trs = items.map((item: { key: string; value: any }) => {
    return `<tr>
        <td>${item.key}</td>
        <td>${item.value}</td>
      </tr>`;
  });
  profilePage.innerHTML = `
    <h1>Profile</h1>
    <div class="flex-center">
      <table>
        ${trs.join("")}
      </table>
    </div>
  `;
});

export default profilePage;
