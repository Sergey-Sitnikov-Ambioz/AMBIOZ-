(function () {

  "use strict";


  /* =========================================================
     CONFIG
  ========================================================= */

  const SUPABASE_URL =
    "https://qabvpdmdikjqdzeogrcz.supabase.co";


  const SUPABASE_KEY =
    "sb_publishable_bySPn4HxH44yhY11-3H4hQ_2yMEh5FN";


  /* =========================================================
     SCRIPT
  ========================================================= */

  const currentScript =
    document.currentScript;


  if (!currentScript) {

    return;

  }


  const ambiId =
    currentScript.dataset.ambiId;


  if (!ambiId) {

    console.error(
      "AMBIOZ: data-ambi-id is missing."
    );

    return;

  }


  /* =========================================================
     STATE
  ========================================================= */

  let business = null;

  let history = [];

  let isOpen = false;

  let isSending = false;


  /* =========================================================
     SHADOW DOM
  ========================================================= */

  const host =
    document.createElement(
      "div"
    );


  host.id =
    "ambioz-ambi-widget";


  document.body.appendChild(
    host
  );


  const shadow =
    host.attachShadow({
      mode: "open"
    });


  /* =========================================================
     STYLES
  ========================================================= */

  const style =
    document.createElement(
      "style"
    );


  style.textContent = `

    * {
      box-sizing: border-box;
    }

    .button {

      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

    }


    .launcher {

      position: fixed;

      right: 22px;

      bottom: 22px;

      width: 58px;

      height: 58px;

      border-radius: 50%;

      border: 1px solid #ddd;

      background: #111;

      color: #fff;

      cursor: pointer;

      display: flex;

      align-items: center;

      justify-content: center;

      box-shadow:
        0 8px 30px rgba(0,0,0,.18);

      z-index: 2147483647;

      overflow: hidden;

      padding: 0;

    }


    .launcher img {

      width: 100%;

      height: 100%;

      object-fit: cover;

    }


    .launcher-letter {

      font-size: 22px;

      font-weight: 700;

    }


    .panel {

      position: fixed;

      right: 22px;

      bottom: 92px;

      width: min(
        360px,
        calc(100vw - 30px)
      );

      height: min(
        600px,
        calc(100vh - 120px)
      );

      background: #fff;

      border:
        1px solid #ddd;

      border-radius: 20px;

      box-shadow:
        0 20px 60px rgba(0,0,0,.20);

      overflow: hidden;

      display: none;

      flex-direction: column;

      z-index: 2147483647;

      font-family:
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      color: #111;

    }


    .panel.open {

      display: flex;

    }


    .header {

      display: flex;

      align-items: center;

      gap: 12px;

      padding: 15px;

      border-bottom:
        1px solid #eee;

    }


    .avatar {

      width: 46px;

      height: 46px;

      border-radius: 50%;

      background: #eee;

      object-fit: cover;

      display: flex;

      align-items: center;

      justify-content: center;

      overflow: hidden;

      flex-shrink: 0;

    }


    .avatar img {

      width: 100%;

      height: 100%;

      object-fit: cover;

    }


    .avatar-letter {

      font-weight: 700;

    }


    .identity {

      min-width: 0;

      flex: 1;

    }


    .name {

      font-size: 15px;

      font-weight: 700;

      white-space: nowrap;

      overflow: hidden;

      text-overflow: ellipsis;

    }


    .business {

      font-size: 12px;

      color: #777;

      margin-top: 3px;

      white-space: nowrap;

      overflow: hidden;

      text-overflow: ellipsis;

    }


    .close {

      width: 34px;

      height: 34px;

      border: 0;

      border-radius: 50%;

      background: #f2f2f0;

      cursor: pointer;

      font-size: 18px;

    }


    .messages {

      flex: 1;

      overflow-y: auto;

      padding: 15px;

      background: #f7f7f5;

    }


    .message {

      max-width: 88%;

      padding: 11px 13px;

      border-radius: 13px;

      margin-bottom: 9px;

      font-size: 14px;

      line-height: 1.45;

      white-space: pre-wrap;

      word-break: break-word;

    }


    .message.ambi {

      background: #fff;

      border:
        1px solid #e7e7e5;

      margin-right: auto;

    }


    .message.user {

      background: #111;

      color: #fff;

      margin-left: auto;

    }


    .composer {

      padding: 12px;

      border-top:
        1px solid #eee;

      background: #fff;

    }


    .input-row {

      display: flex;

      gap: 8px;

    }


    textarea {

      flex: 1;

      min-width: 0;

      height: 44px;

      resize: none;

      border:
        1px solid #ddd;

      border-radius: 11px;

      padding: 12px;

      font-family: inherit;

      font-size: 14px;

      outline: none;

    }


    textarea:focus {

      border-color: #999;

    }


    .send {

      width: 44px;

      height: 44px;

      border: 0;

      border-radius: 11px;

      background: #111;

      color: #fff;

      cursor: pointer;

      font-size: 16px;

    }


    .send:disabled {

      opacity: .4;

    }


    .video {

      margin-top: 9px;

      width: 100%;

      padding: 10px;

      border:
        1px solid #e2e2df;

      border-radius: 10px;

      background: #fafaf8;

      color: #666;

      font-size: 12px;

      cursor: default;

      text-align: center;

    }


    .typing {

      color: #999;

      font-style: italic;

    }


    @media (max-width: 600px) {

      .panel {

        right: 10px;

        bottom: 80px;

        width:
          calc(100vw - 20px);

        height:
          calc(100vh - 100px);

      }


      .launcher {

        right: 15px;

        bottom: 15px;

      }

    }

  `;


  shadow.appendChild(
    style
  );


  /* =========================================================
     STRUCTURE
  ========================================================= */

  const launcher =
    document.createElement(
      "button"
    );


  launcher.className =
    "launcher";


  launcher.setAttribute(
    "aria-label",
    "Open Ambi"
  );


  launcher.innerHTML =
    `<span class="launcher-letter">A</span>`;


  const panel =
    document.createElement(
      "div"
    );


  panel.className =
    "panel";


  panel.innerHTML = `

    <div class="header">

      <div class="avatar">
        <span class="avatar-letter">A</span>
      </div>

      <div class="identity">

        <div class="name">
          Ambi
        </div>

        <div class="business">
          Your business
        </div>

      </div>

      <button
        class="close"
        type="button"
        aria-label="Close"
      >
        ×
      </button>

    </div>


    <div class="messages"></div>


    <div class="composer">

      <div class="input-row">

        <textarea
          maxlength="1000"
          placeholder="Ask Ambi something…"
        ></textarea>

        <button
          class="send"
          type="button"
          aria-label="Send"
        >
          →
        </button>

      </div>


      <div class="video">
        🎥 Video conversation — coming soon
      </div>

    </div>

  `;


  shadow.appendChild(
    launcher
  );


  shadow.appendChild(
    panel
  );


  /* =========================================================
     ELEMENTS
  ========================================================= */

  const avatar =
    panel.querySelector(
      ".avatar"
    );


  const nameElement =
    panel.querySelector(
      ".name"
    );


  const businessElement =
    panel.querySelector(
      ".business"
    );


  const messages =
    panel.querySelector(
      ".messages"
    );


  const textarea =
    panel.querySelector(
      "textarea"
    );


  const sendButton =
    panel.querySelector(
      ".send"
    );


  const closeButton =
    panel.querySelector(
      ".close"
    );


  /* =========================================================
     AVATAR
  ========================================================= */

  function renderAvatar() {

    if (
      business &&
      business.ambi_avatar_url
    ) {

      avatar.innerHTML =
        `<img src="${escapeAttribute(
          business.ambi_avatar_url
        )}" alt="">`;


      launcher.innerHTML =
        `<img src="${escapeAttribute(
          business.ambi_avatar_url
        )}" alt="">`;


    } else {

      const letter =
        (
          business?.ambi_name ||
          "A"
        )
        .trim()
        .charAt(0)
        .toUpperCase();


      avatar.innerHTML =
        `<span class="avatar-letter">${escapeHtml(
          letter
        )}</span>`;


      launcher.innerHTML =
        `<span class="launcher-letter">${escapeHtml(
          letter
        )}</span>`;

    }

  }


  /* =========================================================
     BUSINESS
  ========================================================= */

  async function loadBusiness() {

    try {

      const response =
        await fetch(

          `${SUPABASE_URL}/rest/v1/businesses?id=eq.${encodeURIComponent(
            ambiId
          )}&select=*`,

          {

            headers: {

              "apikey":
                SUPABASE_KEY,

              "Authorization":
                `Bearer ${SUPABASE_KEY}`,

              "Accept":
                "application/json"

            }

          }

        );


      if (
        !response.ok
      ) {

        throw new Error(
          "Could not load Ambi."
        );

      }


      const data =
        await response.json();


      if (
        !data.length
      ) {

        throw new Error(
          "Ambi not found."
        );

      }


      business =
        data[0];


      const ambiName =
        business.ambi_name ||
        "Ambi";


      nameElement.textContent =
        ambiName;


      businessElement.textContent =
        business.name ||
        "Your business";


      textarea.placeholder =
        `Ask ${ambiName} something…`;


      renderAvatar();


      addMessage(

        "ambi",

        `Hello. I'm ${ambiName}, the digital representative of ${business.name || "this business"}. How can I help?`

      );


    } catch (
      error
    ) {

      console.error(
        "AMBIOZ widget:",
        error
      );


      addMessage(
        "ambi",
        "Sorry, this Ambi is currently unavailable."
      );

    }

  }


  /* =========================================================
     OPEN / CLOSE
  ========================================================= */

  function openPanel() {

    isOpen =
      true;


    panel.classList.add(
      "open"
    );


    textarea.focus();

  }


  function closePanel() {

    isOpen =
      false;


    panel.classList.remove(
      "open"
    );

  }


  launcher.addEventListener(
    "click",
    () => {

      if (
        isOpen
      ) {

        closePanel();

      } else {

        openPanel();

      }

    }
  );


  closeButton.addEventListener(
    "click",
    closePanel
  );


  /* =========================================================
     MESSAGES
  ========================================================= */

  function addMessage(
    type,
    text
  ) {

    const element =
      document.createElement(
        "div"
      );


    element.className =
      `message ${type}`;


    element.textContent =
      text;


    messages.appendChild(
      element
    );


    messages.scrollTop =
      messages.scrollHeight;


    return element;

  }


  /* =========================================================
     SEND
  ========================================================= */

  async function sendMessage() {

    const question =
      textarea.value.trim();


    if (
      !question ||
      isSending
    ) {

      return;

    }


    isSending =
      true;


    textarea.disabled =
      true;


    sendButton.disabled =
      true;


    addMessage(
      "user",
      question
    );


    textarea.value =
      "";


    history.push({

      role:
        "user",

      content:
        question

    });


    const typing =
      addMessage(
        "ambi",
        "Thinking…"
      );


    typing.classList.add(
      "typing"
    );


    try {

      const response =
        await fetch(

          `${SUPABASE_URL}/functions/v1/chat-with-ambi`,

          {

            method:
              "POST",

            headers: {

              "Content-Type":
                "application/json",

              "apikey":
                SUPABASE_KEY

            },

            body:
              JSON.stringify({

                message:
                  question,

                business:
                  business,

                history:
                  history.slice(
                    -20
                  )

              })

          }

        );


      const data =
        await response.json();


      typing.remove();


      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.error ||
          "Ambi could not answer."
        );

      }


      history.push({

        role:
          "assistant",

        content:
          data.reply

      });


      addMessage(
        "ambi",
        data.reply
      );


    } catch (
      error
    ) {

      typing.remove();


      addMessage(
        "ambi",
        "Sorry, I couldn't answer that right now."
      );


      console.error(
        "AMBIOZ widget chat:",
        error
      );

    } finally {

      isSending =
        false;


      textarea.disabled =
        false;


      sendButton.disabled =
        false;


      textarea.focus();

    }

  }


  sendButton.addEventListener(
    "click",
    sendMessage
  );


  textarea.addEventListener(
    "keydown",
    function (event) {

      if (
        event.key === "Enter" &&
        !event.shiftKey
      ) {

        event.preventDefault();

        sendMessage();

      }

    }
  );


  /* =========================================================
     ESCAPE
  ========================================================= */

  function escapeHtml(
    value
  ) {

    return String(value)

      .replaceAll(
        "&",
        "&amp;"
      )

      .replaceAll(
        "<",
        "&lt;"
      )

      .replaceAll(
        ">",
        "&gt;"
      )

      .replaceAll(
        '"',
        "&quot;"
      )

      .replaceAll(
        "'",
        "&#039;"
      );

  }


  function escapeAttribute(
    value
  ) {

    return escapeHtml(
      value
    );

  }


  /* =========================================================
     START
  ========================================================= */

  loadBusiness();


})();
