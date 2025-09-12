function App() {
  const [content, setContent] = React.useState(localStorage.getItem('content') || '');
  const [align, setAlign] = React.useState(localStorage.getItem('align') || 'left');
  const [flipX, setFlipX] = React.useState(localStorage.getItem('flipx') === 'true');
  const [flipY, setFlipY] = React.useState(localStorage.getItem('flipy') === 'true');
  const [bgColor, setBgColor] = React.useState(localStorage.getItem('bg-color') || '#000000');
  const [textColor, setTextColor] = React.useState(localStorage.getItem('text-color') || '#ffffff');
  const [textSize, setTextSize] = React.useState(parseInt((localStorage.getItem('text-size') || '58px'), 10));
  const [margin, setMargin] = React.useState(parseInt((localStorage.getItem('margin') || '5%'), 10));
  const [speed, setSpeed] = React.useState(parseInt(localStorage.getItem('speed') || '10', 10));
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const timeoutRef = React.useRef();
  const contentRef = React.useRef();
  const recorderRef = React.useRef();

  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', bgColor);
    root.style.setProperty('--text-color', textColor);
    root.style.setProperty('--text-size', textSize + 'px');
    root.style.setProperty('--margin', margin + '%');
    root.style.setProperty('--align', align);
  }, [bgColor, textColor, textSize, margin, align]);

  React.useEffect(() => { localStorage.setItem('content', content); if(recorderRef.current){recorderRef.current.value = content;} }, [content]);
  React.useEffect(() => { localStorage.setItem('align', align); }, [align]);
  React.useEffect(() => { localStorage.setItem('flipx', flipX); }, [flipX]);
  React.useEffect(() => { localStorage.setItem('flipy', flipY); }, [flipY]);
  React.useEffect(() => { localStorage.setItem('bg-color', bgColor); }, [bgColor]);
  React.useEffect(() => { localStorage.setItem('text-color', textColor); }, [textColor]);
  React.useEffect(() => { localStorage.setItem('text-size', textSize + 'px'); }, [textSize]);
  React.useEffect(() => { localStorage.setItem('margin', margin + '%'); }, [margin]);
  React.useEffect(() => { localStorage.setItem('speed', speed); }, [speed]);

  React.useEffect(() => { document.body.classList.toggle('playing', isPlaying); }, [isPlaying]);
  React.useEffect(() => { document.body.classList.toggle('noscroll', expanded); }, [expanded]);

  const scroll = () => {
    if (!isPlaying) return;
    if (flipY) {
      window.scrollBy(0, -1);
      if (window.scrollY === 0) {
        pause();
        window.scrollTo({ top: document.body.scrollHeight - window.innerHeight, left: 0, behavior: 'smooth' });
        return;
      }
    } else {
      window.scrollBy(0, 1);
      if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
        pause();
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
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

  React.useEffect(() => {
    if (isPlaying) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(scroll, 50 - speed);
    }
  }, [speed, isPlaying]);

  const toggleAlign = () => {
    setAlign(a => (a === 'left' ? 'center' : 'left'));
  };

  const toggleFlipX = () => {
    setFlipX(f => !f);
  };

  const toggleFlipY = () => {
    setFlipY(f => !f);
    const currentScrollTop = window.scrollY;
    const totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const currentScrollPercentage = (currentScrollTop / totalScrollableHeight) * 100;
    const invertedScrollPercentage = 100 - currentScrollPercentage;
    const newScrollTop = (invertedScrollPercentage / 100) * totalScrollableHeight;
    window.scrollTo({ top: newScrollTop, behavior: 'smooth' });
  };

  const handleExpand = () => {
    setExpanded(e => !e);
  };

  React.useEffect(() => {
    const onKeyDown = e => {
      if (document.activeElement === contentRef.current) return;
      if (e.code === 'Space') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.code === 'ArrowDown') {
        e.preventDefault();
        setSpeed(s => Math.max(1, s - 1));
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        setSpeed(s => Math.min(50, s + 1));
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handlePlayPause]);

  return (
    <div>
      <nav className={expanded ? 'expanded' : ''}>
        <button id="play-pause" title="Play / Pause [Space]" onClick={handlePlayPause}>
          <svg id="play" xmlns="http://www.w3.org/2000/svg" height="40" width="40" style={{display: isPlaying ? 'none' : 'block'}}><path d="M13.333 31.583V8.25l18.334 11.667Zm2.792-11.666Zm0 6.625L26.5 19.917l-10.375-6.625Z"/></svg>
          <svg id="pause" xmlns="http://www.w3.org/2000/svg" height="40" width="40" style={{display: isPlaying ? 'block' : 'none'}}><path d="M23.458 31.667V8.333H30v23.334Zm-13.458 0V8.333h6.542v23.334Z"/></svg>
        </button>
        <button id="align" title="Align text left / center" onClick={toggleAlign}>
          <svg id="center" xmlns="http://www.w3.org/2000/svg" height="40" width="40" style={{display: align === 'left' ? 'block' : 'none'}}><path d="M5 35v-2.792h30V35Zm6.792-6.792v-2.791H28.25v2.791ZM5 21.375v-2.75h30v2.75Zm6.792-6.792v-2.791H28.25v2.791ZM5 7.792V5h30v2.792Z"/></svg>
          <svg id="left" xmlns="http://www.w3.org/2000/svg" height="40" width="40" style={{display: align === 'left' ? 'none' : 'block'}}><path d="M5 35v-2.792h30V35Zm0-6.792v-2.791h19.792v2.791Zm0-6.833v-2.75h30v2.75Zm0-6.792v-2.791h19.792v2.791Zm0-6.791V5h30v2.792Z"/></svg>
        </button>
        <button id="flipx" title="Mirror text horizontally" onClick={toggleFlipX}>
          <svg className={flipX ? 'flipx' : ''} xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M15.875 35H7.792q-1.125 0-1.959-.833Q5 33.333 5 32.208V7.792q0-1.125.833-1.959Q6.667 5 7.792 5h8.083v2.792H7.792v24.416h8.083Zm2.792 3.333V1.667h2.791v36.666ZM32.208 7.792h-.375V5h.375q1.125 0 1.959.833.833.834.833 1.959v.375h-2.792Zm0 14.291v-4.166H35v4.166Zm0 12.917h-.375v-2.792h.375v-.375H35v.375q0 1.125-.833 1.959-.834.833-1.959.833Zm0-19.875v-4.167H35v4.167Zm0 13.917v-4.167H35v4.167Zm-8 5.958v-2.792h4.834V35Zm0-27.208V5h4.834v2.792Z"/></svg>
        </button>
        <button id="flipy" title="Mirror text vertically" onClick={toggleFlipY}>
          <svg className={flipY ? 'flipy' : ''} xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M 5 15.875 L 5 7.792 C 5 7.042 5.278 6.389 5.833 5.833 C 6.389 5.278 7.042 5 7.792 5 L 32.208 5 C 32.958 5 33.611 5.278 34.167 5.833 C 34.722 6.389 35 7.042 35 7.792 L 35 15.875 L 32.208 15.875 L 32.208 7.792 L 7.792 7.792 L 7.792 15.875 L 5 15.875 Z M 1.667 18.667 L 38.333 18.667 L 38.333 21.458 L 1.667 21.458 L 1.667 18.667 Z M 32.208 32.208 L 32.208 31.833 L 35 31.833 L 35 32.208 C 35 32.958 34.722 33.611 34.167 34.167 C 33.611 34.722 32.958 35 32.208 35 L 31.833 35 L 31.833 32.208 L 32.208 32.208 Z M 17.917 32.208 L 22.083 32.208 L 22.083 35 L 17.917 35 L 17.917 32.208 Z M 5 32.208 L 5 31.833 L 7.792 31.833 L 7.792 32.208 L 8.167 32.208 L 8.167 35 L 7.792 35 C 7.042 35 6.389 34.722 5.833 34.167 C 5.278 33.611 5 32.958 5 32.208 Z M 24.875 32.208 L 29.042 32.208 L 29.042 35 L 24.875 35 L 24.875 32.208 Z M 10.958 32.208 L 15.125 32.208 L 15.125 35 L 10.958 35 L 10.958 32.208 Z M 5 24.208 L 7.792 24.208 L 7.792 29.042 L 5 29.042 L 5 24.208 Z M 32.208 24.208 L 35 24.208 L 35 29.042 L 32.208 29.042 L 32.208 24.208 Z"/></svg>
        </button>
        <button id="expand" title="Expand" onClick={handleExpand}>
          <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="m20 25.625-10-10 1.958-1.958L20 21.708l8.042-8.041 1.958 2Z"/></svg>
        </button>
        <div className="drawer">
          <div>
            <input type="color" id="bg-color" value={bgColor} onChange={e => setBgColor(e.target.value)} />
            <div className="disable-select">Background color</div>
          </div>
          <div>
            <input type="color" id="text-color" value={textColor} onChange={e => setTextColor(e.target.value)} />
            <div className="disable-select">Text color</div>
          </div>
          <div>
            <input id="text-size" type="range" min="30" max="180" value={textSize} step="1" onChange={e => setTextSize(parseInt(e.target.value, 10))} />
            <div className="disable-select">Text size: <span id="text-size-display">{textSize}</span>px</div>
          </div>
          <div>
            <input id="margin" type="range" min="0" max="40" value={margin} step="1" onChange={e => setMargin(parseInt(e.target.value, 10))} />
            <div className="disable-select">Margin: <span id="margin-display">{margin}</span>%</div>
          </div>
          <div>
            <input id="speed" type="range" min="1" max="50" value={speed} step="1" onChange={e => setSpeed(parseInt(e.target.value, 10))} />
            <div className="disable-select">Speed: <span id="speed-display">{speed}</span></div>
          </div>
          <div>
            <form action="https://app.teleprompter.com/recorder" target="_blank">
              <input id="record-content" ref={recorderRef} type="hidden" name="content" />
              <button className="record-video-button"> Record Video </button>
            </form>
          </div>
        </div>
      </nav>
      <div
        ref={contentRef}
        className={`content${flipX ? ' flipx' : ''}${flipY ? ' flipy' : ''}`}
        spellCheck="false"
        contentEditable={!isPlaying}
        onInput={e => setContent(e.currentTarget.innerHTML)}
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <div
        id="triangle"
        className={`${flipX ? 'shiftx' : ''} ${flipY ? 'shifty' : ''}`.trim()}
        style={{ display: isPlaying ? 'block' : 'none' }}
      ></div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
