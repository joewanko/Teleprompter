import React from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";

function App() {
  const [content, setContent] = React.useState(
    localStorage.getItem("content") || ""
  );
  const [align, setAlign] = React.useState(
    localStorage.getItem("align") || "left"
  );
  const [flipX, setFlipX] = React.useState(
    localStorage.getItem("flipx") === "true"
  );
  const [flipY, setFlipY] = React.useState(
    localStorage.getItem("flipy") === "true"
  );
  const [bgColor, setBgColor] = React.useState(
    localStorage.getItem("bg-color") || "#000000"
  );
  const [textColor, setTextColor] = React.useState(
    localStorage.getItem("text-color") || "#ffffff"
  );
  const [textSize, setTextSize] = React.useState(
    parseInt(localStorage.getItem("text-size") || "58px", 10)
  );
  const [margin, setMargin] = React.useState(
    parseInt(localStorage.getItem("margin") || "5%", 10)
  );
  const [speed, setSpeed] = React.useState(
    parseInt(localStorage.getItem("speed") || "10", 10)
  );
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [navHidden, setNavHidden] = React.useState(
    localStorage.getItem("nav-hidden") === "true"
  );

  // Timer state
  const [showTimer, setShowTimer] = React.useState(
    localStorage.getItem("timer-show") === "true"
  );
  const [timerDuration, setTimerDuration] = React.useState(() => {
    const v = parseInt(localStorage.getItem("timer-duration") || "300", 10);
    return Number.isFinite(v) ? v : 300; // default 5 minutes
  });
  const [timerRemaining, setTimerRemaining] = React.useState(timerDuration);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [timerWindowOpen, setTimerWindowOpen] = React.useState(false);
  const [timerFontSize, setTimerFontSize] = React.useState(() => {
    const v = parseInt(localStorage.getItem("timer-font-size") || "48", 10);
    return Number.isFinite(v) ? v : 48;
  });
  const [timerColor, setTimerColor] = React.useState(
    localStorage.getItem("timer-color") || "#ffff00"
  );
  const [timerInput, setTimerInput] = React.useState("")
  const timerIntervalRef = React.useRef();
  const timerStartRef = React.useRef(null);
  const childWindowRef = React.useRef(null);

  const timeoutRef = React.useRef();
  const contentRef = React.useRef();
  const recorderRef = React.useRef();
  const smallBtnStyle = {
    width: "auto",
    height: "32px",
    padding: "0 10px",
    border: "1px solid var(--text-color)",
    borderRadius: "4px",
    color: "var(--text-color)",
  };

  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = content || "";
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg-color", bgColor);
    root.style.setProperty("--text-color", textColor);
    root.style.setProperty("--text-size", textSize + "px");
    root.style.setProperty("--margin", margin + "%");
    root.style.setProperty("--align", align);
  }, [bgColor, textColor, textSize, margin, align]);

  React.useEffect(() => {
    // Persist commonly changed settings in one place
    localStorage.setItem("content", content);
    localStorage.setItem("align", align);
    localStorage.setItem("flipx", flipX);
    localStorage.setItem("flipy", flipY);
    localStorage.setItem("bg-color", bgColor);
    localStorage.setItem("text-color", textColor);
    localStorage.setItem("text-size", textSize + "px");
    localStorage.setItem("margin", margin + "%");
    localStorage.setItem("speed", speed);
    localStorage.setItem("timer-show", showTimer);
    localStorage.setItem("timer-duration", String(timerDuration));
    localStorage.setItem("timer-font-size", String(timerFontSize));
    localStorage.setItem("timer-color", timerColor);
    if (recorderRef.current && recorderRef.current.value !== content) {
      recorderRef.current.value = content;
    }
  }, [
    content,
    align,
    flipX,
    flipY,
    bgColor,
    textColor,
    textSize,
    margin,
    speed,
    showTimer,
    timerDuration,
    timerFontSize,
    timerColor,
  ]);
  React.useEffect(() => {
    localStorage.setItem("nav-hidden", navHidden);
    document.body.classList.toggle("nav-hidden", navHidden);
  }, [navHidden]);

  React.useEffect(() => {
    document.body.classList.toggle("playing", isPlaying);
  }, [isPlaying]);
  React.useEffect(() => {
    document.body.classList.toggle("noscroll", expanded);
  }, [expanded]);

  const scroll = () => {
    if (!isPlaying) return;
    if (flipY) {
      window.scrollBy(0, -1);
      if (window.scrollY === 0) {
        pause();
        pauseTimer();
        window.scrollTo({
          top: document.body.scrollHeight - window.innerHeight,
          left: 0,
          behavior: "smooth",
        });
        return;
      }
    } else {
      window.scrollBy(0, 1);
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        pause();
        pauseTimer();
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        return;
      }
    }
    timeoutRef.current = setTimeout(scroll, 50 - speed);
  };

  const play = () => {
    setIsPlaying(true);
    timeoutRef.current = setTimeout(scroll, 50 - speed);
  };

  const pause = () => {
    setIsPlaying(false);
    clearTimeout(timeoutRef.current);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  // Toggle teleprompter and timer together
  const togglePlayAndTimer = () => {
    handlePlayPause();
    if (showTimer) {
      if (timerRunning) pauseTimer();
      else startTimer();
    }
  };

  React.useEffect(() => {
    if (isPlaying) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(scroll, 50 - speed);
    }
  }, [speed, isPlaying]);

  const toggleAlign = () => {
    setAlign((a) => (a === "left" ? "center" : "left"));
  };

  const toggleFlipX = () => {
    setFlipX((f) => !f);
  };

  const toggleFlipY = () => {
    setFlipY((f) => !f);
    const currentScrollTop = window.scrollY;
    const totalScrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const currentScrollPercentage =
      (currentScrollTop / totalScrollableHeight) * 100;
    const invertedScrollPercentage = 100 - currentScrollPercentage;
    const newScrollTop =
      (invertedScrollPercentage / 100) * totalScrollableHeight;
    window.scrollTo({ top: newScrollTop, behavior: "smooth" });
  };

  const handleExpand = () => {
    setExpanded((e) => !e);
  };

  // Timer helpers
  const pad2 = (n) => String(Math.max(0, Math.floor(n))).padStart(2, "0");
  const formatTime = (totalSeconds) => {
    const neg = totalSeconds < 0;
    const sAbs = Math.floor(Math.abs(totalSeconds));
    const m = Math.floor(sAbs / 60);
    const sec = sAbs % 60;
    const base = `${pad2(m)}:${pad2(sec)}`;
    return neg ? `+${base}` : base;
  };

  const stopTimerInterval = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = undefined;
    }
  };

  const startTimer = () => {
    if (timerRunning) return;
    setTimerRunning(true);
    const start = Date.now();
    const baseRemaining = timerRemaining;
    timerStartRef.current = start;
    stopTimerInterval();
    timerIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const next = baseRemaining - elapsed;
      setTimerRemaining(next);
    }, 200);
  };

  const pauseTimer = () => {
    if (!timerRunning) return;
    setTimerRunning(false);
    stopTimerInterval();
  };

  const resetTimer = () => {
    // Pause teleprompter and timer
    pause();
    pauseTimer();
    // Reset timer to full duration
    setTimerRemaining(timerDuration);
    // Scroll back to the top
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const setTimerFromInput = (value) => {
    // value expected as MM:SS or M:SS (allow leading '+')
    value = String(value || "").trim().replace(/^\+/, "");
    const m = value.split(":");
    if (m.length !== 2) return;
    const mins = parseInt(m[0], 10);
    const secs = parseInt(m[1], 10);
    if (!Number.isFinite(mins) || !Number.isFinite(secs)) return;
    const total = Math.max(0, mins * 60 + secs);
    setTimerDuration(total);
    setTimerRemaining(total);
  };

  // Keep the editable timer input in sync with remaining time when it changes externally
  React.useEffect(() => {
    setTimerInput(formatTime(timerRemaining));
  }, [timerRemaining]);

  // Close child window if open when hiding timer
  React.useEffect(() => {
    if (!showTimer && childWindowRef.current && !childWindowRef.current.closed) {
      childWindowRef.current.close();
    }
  }, [showTimer]);

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      stopTimerInterval();
      if (childWindowRef.current && !childWindowRef.current.closed) {
        childWindowRef.current.close();
      }
    };
  }, []);

  const openTimerWindow = () => {
    if (childWindowRef.current && !childWindowRef.current.closed) return;
    const w = window.open("", "TeleprompterTimer", "width=420,height=200");
    if (!w) return;
    w.document.title = "Timer";
    // Basic styles and variables to match theme
    const style = w.document.createElement("style");
    style.textContent = `
      :root { --bg-color: ${bgColor}; --text-color: ${textColor}; }
      html, body { height: 100%; margin: 0; background: var(--bg-color); color: var(--text-color); }
      body { display: flex; align-items: center; justify-content: center; }
      .popup-timer { font-size: ${timerFontSize}px; color: ${timerColor}; font-weight: 700; letter-spacing: 2px; }
    `;
    w.document.head.appendChild(style);
    setTimerWindowOpen(true);
    childWindowRef.current = w;
    const onClose = () => setTimerWindowOpen(false);
    w.addEventListener("beforeunload", onClose);
  };

  const closeTimerWindow = () => {
    if (childWindowRef.current && !childWindowRef.current.closed) {
      childWindowRef.current.close();
    }
    setTimerWindowOpen(false);
  };

  const ChildWindowPortal = ({ children }) => {
    const [container, setContainer] = React.useState(null);
    React.useEffect(() => {
      if (!childWindowRef.current || childWindowRef.current.closed) return;
      const el = childWindowRef.current.document.createElement("div");
      childWindowRef.current.document.body.appendChild(el);
      setContainer(el);
      return () => {
        if (!childWindowRef.current || childWindowRef.current.closed) return;
        el.remove();
      };
    }, [timerWindowOpen]);
    if (!container) return null;
    return createPortal(children, container);
  };

  // Keep popup window theme in sync
  React.useEffect(() => {
    if (!childWindowRef.current || childWindowRef.current.closed) return;
    const doc = childWindowRef.current.document;
    doc.documentElement.style.setProperty("--bg-color", bgColor);
    doc.documentElement.style.setProperty("--text-color", textColor);
    doc.body.style.background = "var(--bg-color)";
    doc.body.style.color = "var(--text-color)";
    const el = doc.querySelector('.popup-timer');
    if (el) {
      el.style.fontSize = `${timerFontSize}px`;
      el.style.color = timerColor;
    }
  }, [bgColor, textColor, timerFontSize, timerColor, timerWindowOpen]);

  // Named scripts in localStorage
  const scriptsKey = "teleprompter-scripts";
  const currentNameKey = "teleprompter-current-name";

  const [scripts, setScripts] = React.useState(() => {
    try {
      const v = JSON.parse(localStorage.getItem(scriptsKey));
      return v && typeof v === "object" ? v : {};
    } catch (e) {
      return {};
    }
  });
  const [currentScriptName, setCurrentScriptName] = React.useState(
    localStorage.getItem(currentNameKey) || ""
  );
  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [showOpenDialog, setShowOpenDialog] = React.useState(false);
  const [saveName, setSaveName] = React.useState("");

  // Lock page scroll when any dialog or drawer is open
  React.useEffect(() => {
    const lock = expanded || showSaveDialog || showOpenDialog;
    document.body.classList.toggle("noscroll", lock);
  }, [expanded, showSaveDialog, showOpenDialog]);

  React.useEffect(() => {
    localStorage.setItem(currentNameKey, currentScriptName);
  }, [currentScriptName]);

  const buildSnapshot = () => ({
    content: contentRef.current ? contentRef.current.innerHTML : content,
    align,
    flipX,
    flipY,
    bgColor,
    textColor,
    textSize,
    margin,
    speed,
    // Timer settings saved per script
    showTimer,
    timerDuration,
    timerFontSize,
    timerColor,
  });

  const applySnapshot = (snap) => {
    pause();
    pauseTimer();
    const newContent = snap.content ?? "";
    if (contentRef.current) {
      contentRef.current.innerHTML = newContent;
    }
    setContent(newContent);
    setAlign(snap.align ?? "left");
    setFlipX(Boolean(snap.flipX));
    setFlipY(Boolean(snap.flipY));
    setBgColor(snap.bgColor ?? "#000000");
    setTextColor(snap.textColor ?? "#ffffff");
    setTextSize(Number.isFinite(snap.textSize) ? snap.textSize : 58);
    setMargin(Number.isFinite(snap.margin) ? snap.margin : 5);
    setSpeed(Number.isFinite(snap.speed) ? snap.speed : 10);
    // Apply timer settings from script (defaulting to existing if absent)
    setShowTimer(typeof snap.showTimer === "boolean" ? snap.showTimer : showTimer);
    const duration = Number.isFinite(snap.timerDuration) ? snap.timerDuration : timerDuration;
    setTimerDuration(duration);
    setTimerRemaining(duration);
    setTimerFontSize(Number.isFinite(snap.timerFontSize) ? snap.timerFontSize : timerFontSize);
    setTimerColor(snap.timerColor ?? timerColor);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const deriveDefaultName = () => {
    if (currentScriptName) return currentScriptName;
    let text = "";
    if (contentRef.current) {
      text = contentRef.current.innerText || "";
    }
    const sanitized = (text || "").replace(/\s+/g, " ").trim();
    return sanitized ? sanitized.slice(0, 50) : "Untitled";
  };

  const openSaveDialog = () => {
    setSaveName(deriveDefaultName());
    setShowSaveDialog(true);
  };

  const confirmSave = () => {
    const name = (saveName || "").trim();
    if (!name) return;
    const exists = !!scripts[name];
    if (exists && !window.confirm(`Overwrite \"${name}\"?`)) return;
    const updated = {
      ...scripts,
      [name]: { ...buildSnapshot(), name, updatedAt: Date.now() },
    };
    setScripts(updated);
    localStorage.setItem(scriptsKey, JSON.stringify(updated));
    setCurrentScriptName(name);
    setShowSaveDialog(false);
  };

  const openOpenDialog = () => {
    setShowOpenDialog(true);
  };

  const loadScript = (name) => {
    const snap = scripts[name];
    if (!snap) return;
    applySnapshot(snap);
    setCurrentScriptName(name);
    setShowOpenDialog(false);
  };

  const deleteScript = (name) => {
    if (!scripts[name]) return;
    if (!window.confirm(`Delete \"${name}\"? This cannot be undone.`)) return;
    const { [name]: _removed, ...rest } = scripts;
    setScripts(rest);
    localStorage.setItem(scriptsKey, JSON.stringify(rest));
    if (currentScriptName === name) setCurrentScriptName("");
  };

  const handleClear = () => {
    pause();
    pauseTimer();
    if (contentRef.current) {
      contentRef.current.innerHTML = "";
    }
    setContent("");
  };

  React.useEffect(() => {
    const onKeyDown = (e) => {
      const ae = document.activeElement;
      if (
        ae === contentRef.current ||
        (ae && (ae.isContentEditable || ["INPUT","TEXTAREA","SELECT","BUTTON"].includes(ae.tagName)))
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        togglePlayAndTimer();
      } else if (e.code === "ArrowDown") {
        e.preventDefault();
        setSpeed((s) => Math.max(1, s - 1));
      } else if (e.code === "ArrowUp") {
        e.preventDefault();
        setSpeed((s) => Math.min(50, s + 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [togglePlayAndTimer]);

  return (
    <div>
      <nav className={expanded ? "expanded" : ""}>
        {/* Reset (left of Play/Pause) */}
        <button
          id="reset"
          title="Reset (scroll to top; reset timer)"
          onClick={resetTimer}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40" viewBox="0 0 24 24">
            <path d="M17.65 6.35A7.95 7.95 0 0 0 12 4 8 8 0 1 0 20 12h-2A6 6 0 1 1 12 6a5.96 5.96 0 0 1 4.24 1.76L13 11h7V4l-2.35 2.35z" />
          </svg>
        </button>
        <button
          id="play-pause"
          title="Play / Pause [Space]"
          onClick={togglePlayAndTimer}
        >
          <svg
            id="play"
            xmlns="http://www.w3.org/2000/svg"
            height="40"
            width="40"
            style={{ display: isPlaying ? "none" : "block" }}
          >
            <path d="M13.333 31.583V8.25l18.334 11.667Zm2.792-11.666Zm0 6.625L26.5 19.917l-10.375-6.625Z" />
          </svg>
          <svg
            id="pause"
            xmlns="http://www.w3.org/2000/svg"
            height="40"
            width="40"
            style={{ display: isPlaying ? "block" : "none" }}
          >
            <path d="M23.458 31.667V8.333H30v23.334Zm-13.458 0V8.333h6.542v23.334Z" />
          </svg>
        </button>
        <button
          id="align"
          title="Align text left / center"
          onClick={toggleAlign}
        >
          <svg
            id="center"
            xmlns="http://www.w3.org/2000/svg"
            height="40"
            width="40"
            style={{ display: align === "left" ? "block" : "none" }}
          >
            <path d="M5 35v-2.792h30V35Zm6.792-6.792v-2.791H28.25v2.791ZM5 21.375v-2.75h30v2.75Zm6.792-6.792v-2.791H28.25v2.791ZM5 7.792V5h30v2.792Z" />
          </svg>
          <svg
            id="left"
            xmlns="http://www.w3.org/2000/svg"
            height="40"
            width="40"
            style={{ display: align === "left" ? "none" : "block" }}
          >
            <path d="M5 35v-2.792h30V35Zm0-6.792v-2.791h19.792v2.791Zm0-6.833v-2.75h30v2.75Zm0-6.792v-2.791h19.792v2.791Zm0-6.791V5h30v2.792Z" />
          </svg>
        </button>
        <button
          id="flipx"
          title="Mirror text horizontally"
          onClick={toggleFlipX}
        >
          <svg
            className={flipX ? "flipx" : ""}
            xmlns="http://www.w3.org/2000/svg"
            height="40"
            width="40"
          >
            <path d="M15.875 35H7.792q-1.125 0-1.959-.833Q5 33.333 5 32.208V7.792q0-1.125.833-1.959Q6.667 5 7.792 5h8.083v2.792H7.792v24.416h8.083Zm2.792 3.333V1.667h2.791v36.666ZM32.208 7.792h-.375V5h.375q1.125 0 1.959.833.833.834.833 1.959v.375h-2.792Zm0 14.291v-4.166H35v4.166Zm0 12.917h-.375v-2.792h.375v-.375H35v.375q0 1.125-.833 1.959-.834.833-1.959.833Zm0-19.875v-4.167H35v4.167Zm0 13.917v-4.167H35v4.167Zm-8 5.958v-2.792h4.834V35Zm0-27.208V5h4.834v2.792Z" />
          </svg>
        </button>
        <button id="flipy" title="Mirror text vertically" onClick={toggleFlipY}>
          <svg
            className={flipY ? "flipy" : ""}
            xmlns="http://www.w3.org/2000/svg"
            height="40"
            width="40"
          >
            <path d="M 5 15.875 L 5 7.792 C 5 7.042 5.278 6.389 5.833 5.833 C 6.389 5.278 7.042 5 7.792 5 L 32.208 5 C 32.958 5 33.611 5.278 34.167 5.833 C 34.722 6.389 35 7.042 35 7.792 L 35 15.875 L 32.208 15.875 L 32.208 7.792 L 7.792 7.792 L 7.792 15.875 L 5 15.875 Z M 1.667 18.667 L 38.333 18.667 L 38.333 21.458 L 1.667 21.458 L 1.667 18.667 Z M 32.208 32.208 L 32.208 31.833 L 35 31.833 L 35 32.208 C 35 32.958 34.722 33.611 34.167 34.167 C 33.611 34.722 32.958 35 32.208 35 L 31.833 35 L 31.833 32.208 L 32.208 32.208 Z M 17.917 32.208 L 22.083 32.208 L 22.083 35 L 17.917 35 L 17.917 32.208 Z M 5 32.208 L 5 31.833 L 7.792 31.833 L 7.792 32.208 L 8.167 32.208 L 8.167 35 L 7.792 35 C 7.042 35 6.389 34.722 5.833 34.167 C 5.278 33.611 5 32.958 5 32.208 Z M 24.875 32.208 L 29.042 32.208 L 29.042 35 L 24.875 35 L 24.875 32.208 Z M 10.958 32.208 L 15.125 32.208 L 15.125 35 L 10.958 35 L 10.958 32.208 Z M 5 24.208 L 7.792 24.208 L 7.792 29.042 L 5 29.042 L 5 24.208 Z M 32.208 24.208 L 35 24.208 L 35 29.042 L 32.208 29.042 L 32.208 24.208 Z" />
          </svg>
        </button>
        <button id="expand" title="Expand" onClick={handleExpand}>
          <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40">
            <path d="m20 25.625-10-10 1.958-1.958L20 21.708l8.042-8.041 1.958 2Z" />
          </svg>
        </button>
        <button
          id="open"
          title="Open saved scripts"
          onClick={openOpenDialog}
          style={smallBtnStyle}
        >
          Open
        </button>
        <button
          id="save"
          title="Save as named script"
          onClick={openSaveDialog}
          style={smallBtnStyle}
        >
          Save
        </button>
        <button
          id="clear"
          title="Clear the content"
          onClick={handleClear}
          style={smallBtnStyle}
        >
          Clear
        </button>
        <button
          id="hide-nav"
          className="nav-reveal-btn tp-btn"
          title={navHidden ? "Show Nav" : "Hide Nav"}
          onClick={() => setNavHidden((v) => !v)}
        >
          {navHidden ? "Show Nav" : "Hide Nav"}
        </button>
        {/* Teleprompter controls continue... */}
        <div className="drawer">
          <div>
            <input
              type="color"
              id="bg-color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
            />
            <div className="disable-select">Background color</div>
          </div>
          <div>
            <input
              type="color"
              id="text-color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
            />
            <div className="disable-select">Text color</div>
          </div>
          <div>
            <input
              id="text-size"
              type="range"
              min="30"
              max="180"
              value={textSize}
              step="1"
              onChange={(e) => setTextSize(parseInt(e.target.value, 10))}
            />
            <div className="disable-select">
              Text size: <span id="text-size-display">{textSize}</span>px
            </div>
          </div>
          <div>
            <input
              id="margin"
              type="range"
              min="0"
              max="40"
              value={margin}
              step="1"
              onChange={(e) => setMargin(parseInt(e.target.value, 10))}
            />
            <div className="disable-select">
              Margin: <span id="margin-display">{margin}</span>%
            </div>
          </div>
          <div>
            <input
              id="speed"
              type="range"
              min="1"
              max="50"
              value={speed}
              step="1"
              onChange={(e) => setSpeed(parseInt(e.target.value, 10))}
            />
            <div className="disable-select">
              Speed: <span id="speed-display">{speed}</span>
            </div>
          </div>
        </div>
        {/* Timer controls (second line) */}
        <div
          className="timer-controls"
          style={{ marginLeft: 0, flexBasis: "100%", justifyContent: "center" }}
        >
          <button
            id="timer-toggle"
            title="Toggle timer visibility"
            onClick={() => setShowTimer((v) => !v)}
            style={smallBtnStyle}
          >
            {showTimer ? "Hide Timer" : "Show Timer"}
          </button>
          <input
            className="timer-input"
            aria-label="Timer (MM:SS)"
            title="Timer (MM:SS)"
            value={timerInput}
            onChange={(e) => !timerRunning && setTimerInput(e.target.value)}
            onBlur={() => !timerRunning && setTimerFromInput(timerInput)}
            onKeyDown={(e) => {
              if (timerRunning) return;
              if (e.key === "Enter") {
                e.preventDefault();
                setTimerFromInput(timerInput);
              } else if (e.key === "Escape") {
                e.preventDefault();
                setTimerInput(formatTime(timerRemaining));
              }
            }}
            disabled={timerRunning || !showTimer}
          />
          <input
            type="color"
            aria-label="Timer color"
            title="Timer color"
            value={timerColor}
            onChange={(e) => setTimerColor(e.target.value)}
            disabled={!showTimer}
          />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <input
              type="range"
              min="24"
              max="120"
              step="1"
              value={timerFontSize}
              onChange={(e) => setTimerFontSize(parseInt(e.target.value, 10))}
              disabled={!showTimer}
            />
            <div className="disable-select" title="Timer size">
              {timerFontSize}px
            </div>
          </div>
          {!timerWindowOpen ? (
            <button className="tp-btn" style={smallBtnStyle} onClick={openTimerWindow} disabled={!showTimer}>
              Pop Out
            </button>
          ) : (
            <button className="tp-btn" style={smallBtnStyle} onClick={closeTimerWindow}>
              Close Window
            </button>
          )}
        </div>
      </nav>
      {navHidden && (
        <button
          className="nav-reveal-btn tp-btn"
          onClick={() => setNavHidden(false)}
          title="Show Nav"
        >
          Show Nav
        </button>
      )}
      {/* Timer displays */}
      {showTimer && !timerWindowOpen && (
        <div
          className="timer-overlay"
          aria-live="polite"
          style={{ fontSize: `${timerFontSize}px`, color: timerColor }}
        >
          {formatTime(timerRemaining)}
        </div>
      )}
      {showTimer && timerWindowOpen && childWindowRef.current && !childWindowRef.current.closed && (
        <ChildWindowPortal>
          <div
            className="popup-timer"
            aria-live="polite"
            style={{ fontSize: `${timerFontSize}px`, color: timerColor }}
          >
            {formatTime(timerRemaining)}
          </div>
        </ChildWindowPortal>
      )}
      {showSaveDialog && (
        <div className="tp-modal" role="dialog" aria-modal="true">
          <div className="tp-panel">
            <div className="tp-panel-title">Save Script</div>
            <label htmlFor="script-name" style={{ marginTop: 10 }}>Script name</label>
            <input
              id="script-name"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="Enter a script name"
              className="tp-input"
              autoFocus
            />
            <div className="tp-row" style={{ marginTop: 16 }}>
              <button className="tp-btn primary" onClick={confirmSave}>Save</button>
              <button className="tp-btn" onClick={() => setShowSaveDialog(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {showOpenDialog && (
        <div className="tp-modal" role="dialog" aria-modal="true">
          <div className="tp-panel">
            <div className="tp-panel-title">Open Script</div>
            <div className="tp-list" role="list">
              {Object.keys(scripts).length === 0 && (
                <div className="tp-empty">No saved scripts yet.</div>
              )}
              {Object.values(scripts)
                .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
                .map((s) => (
                  <div key={s.name} className="tp-row" role="listitem">
                    <div className="tp-col">
                      <div className="tp-name">{s.name}</div>
                      <div className="tp-muted">
                        {s.updatedAt ? new Date(s.updatedAt).toLocaleString() : ""}
                      </div>
                    </div>
                    <div className="tp-actions">
                      <button className="tp-btn primary" onClick={() => loadScript(s.name)}>Load</button>
                      <button className="tp-btn danger" onClick={() => deleteScript(s.name)}>Delete</button>
                    </div>
                  </div>
                ))}
            </div>
            <div className="tp-row" style={{ marginTop: 8 }}>
              <button className="tp-btn" onClick={() => setShowOpenDialog(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      <div
        ref={contentRef}
        className={`content${flipX ? " flipx" : ""}${flipY ? " flipy" : ""}`}
        spellCheck="false"
        contentEditable={!isPlaying}
        suppressContentEditableWarning
        onInput={(e) => setContent(e.currentTarget.innerHTML)}
      />
      <div
        id="triangle"
        className={`${flipX ? "shiftx" : ""} ${flipY ? "shifty" : ""}`.trim()}
        style={{ display: isPlaying ? "block" : "none" }}
      ></div>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<App />);
