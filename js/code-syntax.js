(function(){

  "use strict";

  /* ==========================================
     SVG ICONS
     ========================================== */

  var ICONS = {

    open:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M14 3h7v7"/>' +
      '<path d="M10 14 21 3"/>' +
      '<path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>' +
      '</svg>',

    download:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M12 3v12"/>' +
      '<path d="m7 10 5 5 5-5"/>' +
      '<path d="M5 21h14"/>' +
      '</svg>',

    copy:
      '<svg viewBox="0 0 24 24">' +
      '<rect x="9" y="9" width="11" height="11" rx="2"/>' +
      '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>' +
      '</svg>',

    fullscreen:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M8 3H5a2 2 0 0 0-2 2v3"/>' +
      '<path d="M16 3h3a2 2 0 0 1 2 2v3"/>' +
      '<path d="M8 21H5a2 2 0 0 1-2-2v-3"/>' +
      '<path d="M16 21h3a2 2 0 0 0 2-2v-3"/>' +
      '</svg>',

    fullscreenExit:
      '<svg viewBox="0 0 24 24">' +
      '<path d="M9 3v6H3"/>' +
      '<path d="m3 9 6-6"/>' +
      '<path d="M15 3v6h6"/>' +
      '<path d="m21 9-6-6"/>' +
      '<path d="M9 21v-6H3"/>' +
      '<path d="m3 15 6 6"/>' +
      '<path d="M15 21v-6h6"/>' +
      '<path d="m21 15-6 6"/>' +
      '</svg>'
  };


  /* ==========================================
     LANGUAGE NAMES
     ========================================== */

  function languageName(lang){

    var names = {
      javascript: "JavaScript",
      typescript: "TypeScript",
      xml: "HTML",
      html: "HTML",
      css: "CSS",
      scss: "SCSS",
      less: "LESS",
      json: "JSON",
      python: "Python",
      java: "Java",
      c: "C",
      cpp: "C++",
      csharp: "C#",
      php: "PHP",
      ruby: "Ruby",
      go: "Go",
      rust: "Rust",
      kotlin: "Kotlin",
      swift: "Swift",
      sql: "SQL",
      bash: "Bash",
      shell: "Shell",
      yaml: "YAML",
      markdown: "Markdown",
      plaintext: "Plain Text",
      text: "Text"
    };

    return names[lang] || (
      lang ?
      lang.charAt(0).toUpperCase() + lang.slice(1) :
      "Code"
    );
  }


  /* ==========================================
     LANGUAGE NORMALIZATION
     ========================================== */

  function normalizeLanguage(lang){

    if(!lang){
      return "";
    }

    lang = String(lang)
      .toLowerCase()
      .trim()
      .replace(/^language-/,"")
      .replace(/^lang-/,"");

    var aliases = {

      js: "javascript",
      jsx: "javascript",
      mjs: "javascript",

      ts: "typescript",
      tsx: "typescript",

      html: "xml",
      html5: "xml",
      xhtml: "xml",

      css3: "css",

      py: "python",

      sh: "bash",
      shell: "bash",

      yml: "yaml",

      md: "markdown",

      cxx: "cpp",
      cc: "cpp",

      cs: "csharp",

      text: "plaintext",
      txt: "plaintext"
    };

    return aliases[lang] || lang;
  }


  /* ==========================================
     SAFE HTML ESCAPE
     ========================================== */

  function escapeHTML(text){

    return String(text)
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");

  }


  /* ==========================================
     CREATE BUTTON
     ========================================== */

  function createButton(className, tip, icon){

    var button = document.createElement("button");

    button.type = "button";
    button.className = "bl-codebox-btn " + className;
    button.setAttribute("data-tip",tip);
    button.setAttribute("aria-label",tip);
    button.innerHTML = icon;

    return button;
  }


  /* ==========================================
     GET ORIGINAL CODE
     ========================================== */

  function getCode(box){

    return box._blCode || "";

  }


  /* ==========================================
     COPY CODE
     ========================================== */

  function copyCode(box,button){

    var code = getCode(box);

    function success(){

      button.classList.add("success");
      button.setAttribute("data-tip","Copied!");

      setTimeout(function(){

        button.classList.remove("success");
        button.setAttribute("data-tip","Copy");

      },1500);

    }

    if(navigator.clipboard && window.isSecureContext){

      navigator.clipboard.writeText(code)
        .then(success)
        .catch(function(){
          fallbackCopy(code,success);
        });

    }else{

      fallbackCopy(code,success);

    }

  }


  /* ==========================================
     COPY FALLBACK
     ========================================== */

  function fallbackCopy(text,callback){

    var textarea = document.createElement("textarea");

    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";

    document.body.appendChild(textarea);

    textarea.focus();
    textarea.select();

    try{
      document.execCommand("copy");

      if(callback){
        callback();
      }

    }catch(error){

      console.error("Copy failed:",error);

    }

    document.body.removeChild(textarea);

  }


  /* ==========================================
     DOWNLOAD CODE
     ========================================== */

  function downloadCode(box){

    var code = getCode(box);

    var filename =
      box.getAttribute("data-filename") ||
      "code.txt";

    var blob = new Blob(
      [code],
      {type:"text/plain;charset=utf-8"}
    );

    var url = URL.createObjectURL(blob);

    var link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(function(){
      URL.revokeObjectURL(url);
    },1000);

  }


  /* ==========================================
     OPEN CODE
     ========================================== */

  function openCode(box){

    var code = getCode(box);

    var lang =
      normalizeLanguage(
        box.getAttribute("data-language")
      );

    /* HTML */
    if(lang === "xml"){

      var newWindow = window.open();

      if(newWindow){

        newWindow.document.open();
        newWindow.document.write(code);
        newWindow.document.close();

      }

      return;
    }


    /* Other code */
    var blob = new Blob(
      [code],
      {type:"text/plain;charset=utf-8"}
    );

    var url = URL.createObjectURL(blob);

    window.open(url,"_blank");

    setTimeout(function(){
      URL.revokeObjectURL(url);
    },10000);

  }


  /* ==========================================
     FULLSCREEN
     ========================================== */

  function toggleFullscreen(box,button){

    var isFullscreen =
      box.classList.contains("fullscreen");

    if(isFullscreen){

      box.classList.remove("fullscreen");

      document.body.style.overflow = "";

      button.innerHTML = ICONS.fullscreen;
      button.setAttribute("data-tip","Fullscreen");

    }else{

      box.classList.add("fullscreen");

      document.body.style.overflow = "hidden";

      button.innerHTML = ICONS.fullscreenExit;
      button.setAttribute("data-tip","Exit Fullscreen");

    }

  }


  /* ==========================================
     EXIT FULLSCREEN WITH ESC
     ========================================== */

  document.addEventListener("keydown",function(event){

    if(event.key === "Escape"){

      var fullscreenBox =
        document.querySelector(
          ".bl-codebox.fullscreen"
        );

      if(fullscreenBox){

        fullscreenBox.classList.remove("fullscreen");

        document.body.style.overflow = "";

        var button =
          fullscreenBox.querySelector(
            ".bl-btn-fullscreen"
          );

        if(button){

          button.innerHTML =
            ICONS.fullscreen;

          button.setAttribute(
            "data-tip",
            "Fullscreen"
          );

        }

      }

    }

  });


  /* ==========================================
     CONVERT CODE BLOCK
     ========================================== */

  function convertCode(pre){

    if(!pre || pre.getAttribute("data-bl-converted") === "true"){
      return;
    }

    pre.setAttribute("data-bl-converted","true");


    /* ------------------------------------------
       Get Code
       ------------------------------------------ */

    var code = pre.textContent || "";

    /*
      Remove only unnecessary first/last newline.
      Actual code indentation is preserved.
    */

    code = code
      .replace(/^\r?\n/,"")
      .replace(/\r?\n$/,"");


    /* ------------------------------------------
       Language
       ------------------------------------------ */

    var lang =
      pre.getAttribute("data-language") ||
      pre.getAttribute("data-lang") ||
      "";


    /* Check class:
       language-javascript
       lang-js
    */

    if(!lang){

      var classes =
        pre.className || "";

      var match =
        classes.match(
          /(?:language|lang)-([a-zA-Z0-9_-]+)/
        );

      if(match){
        lang = match[1];
      }

    }


    lang = normalizeLanguage(lang);


    /* ------------------------------------------
       Auto Detect
       ------------------------------------------ */

    if(!lang && window.hljs){

      try{

        var detected =
          hljs.highlightAuto(code);

        if(detected && detected.language){

          lang =
            normalizeLanguage(
              detected.language
            );

        }

      }catch(error){

        console.warn(
          "Highlight detection failed:",
          error
        );

      }

    }


    if(!lang){
      lang = "plaintext";
    }


    /* ------------------------------------------
       Filename
       ------------------------------------------ */

    var filename =
      pre.getAttribute("data-file") ||
      pre.getAttribute("data-filename") ||
      "";


    if(!filename){

      var defaultFiles = {

        javascript:"script.js",
        typescript:"script.ts",
        xml:"index.html",
        css:"style.css",
        scss:"style.scss",
        less:"style.less",
        json:"data.json",
        python:"script.py",
        java:"Main.java",
        c:"main.c",
        cpp:"main.cpp",
        csharp:"Program.cs",
        php:"index.php",
        ruby:"script.rb",
        go:"main.go",
        rust:"main.rs",
        kotlin:"Main.kt",
        swift:"main.swift",
        sql:"query.sql",
        bash:"script.sh",
        yaml:"config.yml",
        markdown:"README.md",
        plaintext:"code.txt"
      };

      filename =
        defaultFiles[lang] ||
        "code.txt";

    }


    /* ------------------------------------------
       Create Main Box
       ------------------------------------------ */

    var box =
      document.createElement("div");

    box.className =
      "bl-codebox";

    box._blCode = code;

    box.setAttribute(
      "data-language",
      lang
    );

    box.setAttribute(
      "data-filename",
      filename
    );


    /* ------------------------------------------
       Header
       ------------------------------------------ */

    var header =
      document.createElement("div");

    header.className =
      "bl-codebox-header";


    /* File information */

    var file =
      document.createElement("div");

    file.className =
      "bl-codebox-file";


    var dot =
      document.createElement("span");

    dot.className =
      "bl-codebox-dot";


    var info =
      document.createElement("div");

    info.className =
      "bl-codebox-info";


    var language =
      document.createElement("span");

    language.className =
      "bl-codebox-language";

    language.textContent =
      languageName(lang);


    var fileNameElement =
      document.createElement("span");

    fileNameElement.className =
      "bl-codebox-filename";

    fileNameElement.textContent =
      filename;


    info.appendChild(language);
    info.appendChild(fileNameElement);

    file.appendChild(dot);
    file.appendChild(info);


    /* ------------------------------------------
       Toolbar
       ------------------------------------------ */

    var tools =
      document.createElement("div");

    tools.className =
      "bl-codebox-tools";


    var openBtn =
      createButton(
        "bl-btn-open",
        "Open",
        ICONS.open
      );


    var downloadBtn =
      createButton(
        "bl-btn-download",
        "Download",
        ICONS.download
      );


    var copyBtn =
      createButton(
        "bl-btn-copy",
        "Copy",
        ICONS.copy
      );


    var fullscreenBtn =
      createButton(
        "bl-btn-fullscreen",
        "Fullscreen",
        ICONS.fullscreen
      );


    tools.appendChild(openBtn);
    tools.appendChild(downloadBtn);
    tools.appendChild(copyBtn);
    tools.appendChild(fullscreenBtn);


    header.appendChild(file);
    header.appendChild(tools);


    /* ------------------------------------------
       Code Body
       ------------------------------------------ */

    var body =
      document.createElement("div");

    body.className =
      "bl-codebox-body";


    var codeWrapper =
      document.createElement("div");

    codeWrapper.className =
      "bl-codebox-code";


    /* ------------------------------------------
       Line Numbers
       ------------------------------------------ */

    var lines =
      document.createElement("div");

    lines.className =
      "bl-codebox-lines";


    var lineCount =
      code.split("\n").length;


    var lineHTML = "";

    for(
      var i = 1;
      i <= lineCount;
      i++
    ){

      lineHTML +=
        i + "<br>";

    }


    lines.innerHTML =
      lineHTML;


    /* ------------------------------------------
       Highlighted Source
       ------------------------------------------ */

    var source =
      document.createElement("code");

    source.className =
      "bl-codebox-source";


    if(
      window.hljs &&
      lang !== "plaintext"
    ){

      try{

        var highlighted =
          hljs.highlight(
            code,
            {
              language:lang,
              ignoreIllegals:true
            }
          );

        source.innerHTML =
          highlighted.value;

        source.classList.add("hljs");

      }catch(error){

        source.textContent =
          code;

      }

    }else{

      source.textContent =
        code;

    }


    codeWrapper.appendChild(lines);
    codeWrapper.appendChild(source);

    body.appendChild(codeWrapper);


    /* ------------------------------------------
       Status
       ------------------------------------------ */

    var status =
      document.createElement("div");

    status.className =
      "bl-codebox-status";


    var statusLeft =
      document.createElement("span");

    statusLeft.textContent =
      lineCount +
      (lineCount === 1 ? " line" : " lines");


    var statusRight =
      document.createElement("span");

    statusRight.textContent =
      languageName(lang);


    status.appendChild(statusLeft);
    status.appendChild(statusRight);


    /* ------------------------------------------
       Assemble
       ------------------------------------------ */

    box.appendChild(header);
    box.appendChild(body);
    box.appendChild(status);


    /* ------------------------------------------
       Replace Original PRE
       ------------------------------------------ */

    if(pre.parentNode){

      pre.parentNode.replaceChild(
        box,
        pre
      );

    }


    /* ------------------------------------------
       Button Events
       ------------------------------------------ */

    openBtn.addEventListener(
      "click",
      function(){
        openCode(box);
      }
    );


    downloadBtn.addEventListener(
      "click",
      function(){
        downloadCode(box);
      }
    );


    copyBtn.addEventListener(
      "click",
      function(){
        copyCode(
          box,
          copyBtn
        );
      }
    );


    fullscreenBtn.addEventListener(
      "click",
      function(){
        toggleFullscreen(
          box,
          fullscreenBtn
        );
      }
    );

  }


  /* ==========================================
     INITIALIZE
     ========================================== */

  function initializeCodeBoxes(){

    var blocks =
      document.querySelectorAll(
        "pre.bl-code"
      );


    for(
      var i = 0;
      i < blocks.length;
      i++
    ){

      convertCode(blocks[i]);

    }

  }


  /* ==========================================
     START
     ========================================== */

  if(
    document.readyState === "loading"
  ){

    document.addEventListener(
      "DOMContentLoaded",
      initializeCodeBoxes
    );

  }else{

    initializeCodeBoxes();

  }

})();

