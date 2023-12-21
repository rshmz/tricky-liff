import liff from "@line/liff";
// import liff from "@line/liff/core";
// import login from "@line/liff/login";
// import sendMessages from "@line/liff/send-messages";

const playgroundPage = document.createElement("div");
function sendMessages() {
  if (!liff.isInClient()) {
    alert("LIFFブラウザでないと送信できません。");
    return;
  }
  const input = document.querySelector<HTMLInputElement>(
    "#message"
  ) as HTMLInputElement;
  if (!input.value) return;

  liff
    .sendMessages([
      {
        type: "text",
        text: input.value,
      },
    ])
    .then((res) => {
      input.value = "";
      alert("送信しました。");
      window.scroll({ top: 0, behavior: "smooth" });
    })
    .catch((err) => {
      alert(
        "sendMessages API の利用条件を満たしていません。\n" +
          "以下をご確認ください。\n" +
          "    - 1対1のトーク、グループトーク、または複数人トークから起動したLIFFアプリのLIFFブラウザ内である\n" +
          "    - chat_message.writeスコープが有効である"
      );
    });
}
function login() {
  liff.login();
}

playgroundPage.innerHTML = `
  <h1>Playground</h1>
  <div class="box">
    <label>liff.login()</label>
    <button id="login" class="run">RUN</button>
  </div>
  <div class="box">
    <label>liff.sendMessages()</label>
    <input type="text" id="message" placeholder="送信メッセージを入力" />
    <button id="sendMessages" class="run">RUN</button>
  </div>
`;

playgroundPage.addEventListener("mounted", function () {
  const sendMsgBtn = document.querySelector(
    "#sendMessages"
  ) as HTMLButtonElement;
  const loginBtn = document.querySelector("#login") as HTMLButtonElement;
  sendMsgBtn.addEventListener("click", sendMessages);
  loginBtn.addEventListener("click", login);
});

export default playgroundPage;
