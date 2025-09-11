
<!DOCTYPE html>
<html>
    <head>
        <title>CuePrompter.com - The Online Teleprompter</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="apple-itunes-app" content="app-id=1420515755, app-argument=cueprompter.com">

        <style>
            :root {
                --bg-color: #000000;
                --text-color: #ffffff;
                --text-size: 58px;
                --margin: 5%;
                --align: left;
            }
            * {
                padding: 0;
                margin: 0;
                outline: none;
                box-sizing: border-box;
            }
            /* Button styles reset */
            button {
                background-color: transparent;
                border-width: 0;
                font-family: inherit;
                font-size: inherit;
                font-style: inherit;
                font-weight: inherit;
                line-height: inherit;
                padding: 0;
                cursor: pointer;
            }
            body {
                background-color: var(--bg-color);
                font-family: sans-serif;
            }
            nav {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 60px;
                padding: 10px;
                background-color: var(--bg-color);
                color: var(--text-color);
                font-size: 12px;
                z-index: 10;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
                flex-wrap: wrap;
                box-shadow: var(--text-color) 0px 2px 2px -1px;
            }
            body.playing nav {
                opacity: 0.3;
            }
            nav button {
                width: 40px;
                height: 40px;
                overflow: hidden;
            }
            nav .drawer {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 20px;
                text-align: center;
            }
            nav #expand {
                display: none;
            }
            .content {
                color: var(--text-color);
                line-height: 1.8;
                font-size: var(--text-size);
                padding-left: var(--margin);
                padding-right: var(--margin);
                text-align: var(--align);
                padding-top: 300px;
                padding-bottom: 100vh;
                overflow-wrap: break-word;
            }
            .flipx {
                transform: rotateY(180deg);
            }
            .flipy {
                transform: rotateX(180deg);
            }
            .flipx.flipy {
                transform: rotateY(180deg) rotateX(180deg);
            }
            svg path {
                fill: var(--text-color);
            }
            #triangle {
                position: fixed;
                top: 150px;
                left: 0;
                width: 0;
                height: 0;
                border-top: 20px solid transparent;
                border-bottom: 20px solid transparent;
                border-left: 20px solid var(--text-color);
            }
            #triangle.shiftx {
                left: unset;
                right: 0;
                border-right: 20px solid var(--text-color);
                border-left: unset;
            }
            #triangle.shifty {
                top: unset;
                bottom: 150px;
            }
            .disable-select {
                user-select: none; /* supported by Chrome and Opera */
                -webkit-user-select: none; /* Safari */
                -khtml-user-select: none; /* Konqueror HTML */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
            }
            .noscroll {
                overflow: hidden;
            }
            input[type="color"] {
                border: 2px solid #c0c0c0;
            }
            input[type=range] {
                background-color: transparent;
                margin: 8px 0;
                -webkit-appearance: none;
            }
            input[type=range]:focus {
                outline: none;
            }
            input[type=range]::-webkit-slider-runnable-track {
                background: #c0c0c0;
                border: 0.2px solid #010101;
                border-radius: 1.3px;
                width: 100%;
                height: 8.4px;
                cursor: pointer;
            }
            input[type=range]::-webkit-slider-thumb {
                margin-top: -4px;
            }
            input[type=range]:focus::-webkit-slider-runnable-track {
                background: #cdcdcd;
            }
            input[type=range]::-moz-range-track {
                background: #c0c0c0;
                border: 0.2px solid #010101;
                border-radius: 1.3px;
                width: 100%;
                height: 8.4px;
                cursor: pointer;
            }


            @media only screen and (max-width: 1023px) {
                nav.expanded {
                    height: auto;
                    overflow-y: scroll;
                    opacity: 1 !important;
                }
                nav #expand {
                    display: block;
                    margin-left: auto;
                }
                nav .drawer {
                    display: none;
                }
                nav .drawer > div {
                    width: 100%;
                }
                nav .drawer input[type="range"] {
                    width: 100%;
                }
                nav.expanded #expand {
                    transform: rotateX(180deg);
                }
                nav.expanded .drawer {
                    display: flex;
                    flex-basis: 100%;
                    order: 1;
                    flex-direction: column;
                }
            }
            @media(hover: hover) and (pointer: fine) {
                nav:hover {
                    opacity: 1 !important;
                }
            }
        #popup-banner-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 100;
        }

        #popup-banner {
            width: 602px;
            height: 534px;
            padding: 0;
            position: relative;
            box-shadow: 0px 0px 30px lightgray;
            border-radius: 20px;
            border-width: 0;
        }

#popup-banner-mac {
    width: 933px;
    height: 538px;
    padding: 0;
    position: relative;
    box-shadow: 0px 0px 30px lightgray;
    border-radius: 20px;
    border-width: 0;
}

#popup-banner-iphone {
    width: 342px;
    height: 557px;
    padding: 0;
    position: relative;
    box-shadow: 0px 0px 30px lightgray;
    border-radius: 20px;
    border-width: 0;
}
#popup-banner-android {
    width: 342px;
    height: 556px;
    padding: 0;
    position: relative;
    box-shadow: 0px 0px 30px lightgray;
    border-radius: 20px;
    border-width: 0;
}
        #adlink {
            border-width: 0;
        }

        #close-button {
            position: relative;
            top: -270px;
            right: 0;
            width: 46px;
            height: 46px;
            background-color: transparent;
            border: none;
            color: #fff;
            font-size: 16px;
        }

        .record-video-button{
            border: 1px solid #dc3545;
            border-radius: 5px;
            color: #dc3545;
            padding: 5px 10px;
            margin: 0;
            width: auto;
            font-size: 1.1em;
            font-weight: bold;
        }

        </style>

        		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-123627-2"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'UA-123627-2');
            </script>
    </head>
    <body>
            <nav>
            <button id="play-pause" title="Play / Pause [Space]">
                <svg id="play" xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M13.333 31.583V8.25l18.334 11.667Zm2.792-11.666Zm0 6.625L26.5 19.917l-10.375-6.625Z"/></svg>
                <svg id="pause" xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M23.458 31.667V8.333H30v23.334Zm-13.458 0V8.333h6.542v23.334Z"/></svg>
            </button>
            <button id="align" title="Align text left / center">
                <svg id="center" xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M5 35v-2.792h30V35Zm6.792-6.792v-2.791H28.25v2.791ZM5 21.375v-2.75h30v2.75Zm6.792-6.792v-2.791H28.25v2.791ZM5 7.792V5h30v2.792Z"/></svg>
                <svg id="left" xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M5 35v-2.792h30V35Zm0-6.792v-2.791h19.792v2.791Zm0-6.833v-2.75h30v2.75Zm0-6.792v-2.791h19.792v2.791Zm0-6.791V5h30v2.792Z"/></svg>
            </button>
            <button id="flipx" title="Mirror text horizontally">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M15.875 35H7.792q-1.125 0-1.959-.833Q5 33.333 5 32.208V7.792q0-1.125.833-1.959Q6.667 5 7.792 5h8.083v2.792H7.792v24.416h8.083Zm2.792 3.333V1.667h2.791v36.666ZM32.208 7.792h-.375V5h.375q1.125 0 1.959.833.833.834.833 1.959v.375h-2.792Zm0 14.291v-4.166H35v4.166Zm0 12.917h-.375v-2.792h.375v-.375H35v.375q0 1.125-.833 1.959-.834.833-1.959.833Zm0-19.875v-4.167H35v4.167Zm0 13.917v-4.167H35v4.167Zm-8 5.958v-2.792h4.834V35Zm0-27.208V5h4.834v2.792Z"/></svg>
            </button>
            <button id="flipy" title="Mirror text vertically">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="M 5 15.875 L 5 7.792 C 5 7.042 5.278 6.389 5.833 5.833 C 6.389 5.278 7.042 5 7.792 5 L 32.208 5 C 32.958 5 33.611 5.278 34.167 5.833 C 34.722 6.389 35 7.042 35 7.792 L 35 15.875 L 32.208 15.875 L 32.208 7.792 L 7.792 7.792 L 7.792 15.875 L 5 15.875 Z M 1.667 18.667 L 38.333 18.667 L 38.333 21.458 L 1.667 21.458 L 1.667 18.667 Z M 32.208 32.208 L 32.208 31.833 L 35 31.833 L 35 32.208 C 35 32.958 34.722 33.611 34.167 34.167 C 33.611 34.722 32.958 35 32.208 35 L 31.833 35 L 31.833 32.208 L 32.208 32.208 Z M 17.917 32.208 L 22.083 32.208 L 22.083 35 L 17.917 35 L 17.917 32.208 Z M 5 32.208 L 5 31.833 L 7.792 31.833 L 7.792 32.208 L 8.167 32.208 L 8.167 35 L 7.792 35 C 7.042 35 6.389 34.722 5.833 34.167 C 5.278 33.611 5 32.958 5 32.208 Z M 24.875 32.208 L 29.042 32.208 L 29.042 35 L 24.875 35 L 24.875 32.208 Z M 10.958 32.208 L 15.125 32.208 L 15.125 35 L 10.958 35 L 10.958 32.208 Z M 5 24.208 L 7.792 24.208 L 7.792 29.042 L 5 29.042 L 5 24.208 Z M 32.208 24.208 L 35 24.208 L 35 29.042 L 32.208 29.042 L 32.208 24.208 Z"/></svg>
            </button>
            <button id="expand" title="Expand">
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40"><path d="m20 25.625-10-10 1.958-1.958L20 21.708l8.042-8.041 1.958 2Z"/></svg>
            </button>
            <div class="drawer">
                <div>
                    <input type="color" id="bg-color" value="#000000">
                    <div class="disable-select">Background color</div>
                </div>
                <div>
                    <input type="color" id="text-color" value="#ffffff">
                    <div class="disable-select">Text color</div>
                </div>
                <div>
                    <input id="text-size" type="range" min="30" max="180" value="58" step="1">
                    <div class="disable-select">Text size: <span id="text-size-display">58</span>px</div>
                </div>
                <div>
                    <input id="margin" type="range" min="0" max="40" value="5" step="1">
                    <div class="disable-select">Margin: <span id="margin-display">5</span>%</div>
                </div>
                <div>
                    <input id="speed" type="range" min="1" max="50" value="10" step="1">
                    <div class="disable-select">Speed: <span id="speed-display">10</span></div>
                </div>
                <div>
                    <form action="https://app.teleprompter.com/recorder" target="_blank">
                        <input id="record-content" type="hidden" name="content" />
                        <button class="record-video-button"> Record Video </button>
                    </form>
                </div>
            </div>
        </nav>
        <div class="content" spellcheck="false" contenteditable="true">
          
        </div>
        <div id="triangle" style="display: none"></div>
        <script>
            let isPlaying = false;
            let timeoutDelay = 50 - parseInt(document.querySelector("#speed").value);
            let scrollTimeout;

            // Get options from localStorage if user already visited site
            fetchOptions();

            // Disable Rich Text Formatting pasting
            document.querySelector(".content").addEventListener("paste", function(e) {
                e.preventDefault();
                const text = (e.originalEvent || e).clipboardData.getData('text/plain');
                document.execCommand('insertHTML', false, text);
            });

            function getCssVariable(name) {
                let rootStyle = getComputedStyle(document.querySelector(':root'));
                return rootStyle.getPropertyValue("--" + name).trim();
            }
            function setCssVariable(name, value) {
                document.querySelector(':root').style.setProperty("--" + name, value);
            }

            document.querySelector("#play-pause").addEventListener("click", handlePlayPause);

            function handlePlayPause() {
                if (isPlaying) {
                    pause();
                } else {
                    play();
                }
            }

            document.querySelector("#align").addEventListener("click", function(e) {
                if (getCssVariable("align") == "left") {
                    setCssVariable("align", "center");
                    document.querySelector("#left").style.setProperty("display", "block");
                    document.querySelector("#center").style.setProperty("display", "none");
                } else {
                    setCssVariable("align", "left");
                    document.querySelector("#left").style.setProperty("display", "none");
                    document.querySelector("#center").style.setProperty("display", "block");
                }
                saveChanges();
            });

            document.querySelector("#flipx").addEventListener("click", function(e) {
                toggleFlipx();
                saveChanges();
            });

            function toggleFlipx() {
                document.querySelector(".content").classList.toggle("flipx");
                document.querySelector("#flipx svg").classList.toggle("flipx");
                document.querySelector("#triangle").classList.toggle("shiftx");
            }

            document.querySelector("#flipy").addEventListener("click", function(e) {
                toggleFlipy();
                saveChanges();
            });

            function toggleFlipy() {
                document.querySelector(".content").classList.toggle("flipy");
                document.querySelector("#flipy svg").classList.toggle("flipy");
                document.querySelector("#triangle").classList.toggle("shifty");
    
                var currentScrollTop = window.scrollY;
                var totalScrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
                var currentScrollPercentage = (currentScrollTop / totalScrollableHeight) * 100;
                var invertedScrollPercentage = 100 - currentScrollPercentage;
                var newScrollTop = (invertedScrollPercentage / 100) * totalScrollableHeight;

                window.scrollTo({
                    top: newScrollTop,
                    behavior: 'smooth'
                });
            }

            document.querySelector("#expand").addEventListener("click", function(e) {
                document.querySelector("nav").classList.toggle("expanded");
                document.querySelector("body").classList.toggle("noscroll");
            });

            document.querySelector("#bg-color").addEventListener("input", function(e) {
                setCssVariable("bg-color", e.target.value);
                saveChanges();
            });

            document.querySelector("#text-color").addEventListener("input", function(e) {
                setCssVariable("text-color", e.target.value);
                saveChanges();
            });

            document.querySelector("#text-size").addEventListener("input", function(e) {
                setCssVariable("text-size", e.target.value + "px");
                document.querySelector("#text-size-display").textContent = e.target.value;
                saveChanges();
            });

            document.querySelector("#margin").addEventListener("input", function(e) {
                setCssVariable("margin", e.target.value + "%");
                document.querySelector("#margin-display").textContent = e.target.value;
                saveChanges();
            });

            document.querySelector("#speed").addEventListener("input", handleSpeedChange);

            function handleSpeedChange() {
                const speedInput = document.querySelector("#speed");
                timeoutDelay = 40 - parseInt(speedInput.value);
                document.querySelector("#speed-display").textContent = speedInput.value;
                saveChanges();
            }

            window.addEventListener("keydown", function (e) {
                if (document.activeElement == document.querySelector(".content")) {
                    return;
                }
                e.preventDefault();
                switch(e.code) {
                    case "Space":
                        handlePlayPause();
                        break;
                    case "ArrowDown":
                        document.querySelector("#speed").value = parseInt(document.querySelector("#speed").value) - 1;
                        handleSpeedChange();
                        break;
                    case "ArrowUp":
                        document.querySelector("#speed").value = parseInt(document.querySelector("#speed").value) + 1;
                        handleSpeedChange();
                        break;
                }

            });

            document.querySelector(".content").addEventListener("keyup", saveChanges);

            function scroll() {
                const contentEl = document.querySelector(".content");
                if (contentEl.classList.contains("flipy")) {
                    window.scrollBy(0, -1);
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(scroll, timeoutDelay);

                    if (window.scrollY == 0) {
                        pause();
                        window.scrollTo({
                            top: document.body.scrollHeight - window.innerHeight,
                            left: 0,
                            behavior: "smooth"
                        });
                    }
                } else {
                    window.scrollBy(0, 1);
                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(scroll, timeoutDelay);

                    if (window.scrollY + window.innerHeight >= document.body.scrollHeight) {
                        pause();
                        window.scrollTo({
                            top: 0,
                            left: 0,
                            behavior: "smooth"
                        });
                    }
                }
            }

            function play() {
                document.querySelector("#play").style.setProperty("display", "none");
                document.querySelector("#pause").style.setProperty("display", "block");

                document.querySelector(".content").setAttribute("contenteditable", false);
                document.querySelector("#triangle").style.setProperty("display", "block");
                document.querySelector("body").classList.add("playing");
                isPlaying = true;
                scroll();
            }

            function pause() {
                document.querySelector("#play").style.setProperty("display", "block");
                document.querySelector("#pause").style.setProperty("display", "none");

                clearTimeout(scrollTimeout);
                document.querySelector(".content").setAttribute("contenteditable", true);
                document.querySelector("#triangle").style.setProperty("display", "none");
                document.querySelector("body").classList.remove("playing");
                isPlaying = false;
            }

            function saveChanges() {
                const recorderInput = document.getElementById('record-content');
                if(recorderInput){
                    recorderInput.value = document.querySelector(".content").innerHTML;
                }
                localStorage.setItem("content", document.querySelector(".content").innerHTML);
                localStorage.setItem("align", getCssVariable("align"));
                localStorage.setItem("flipx", document.querySelector(".content").classList.contains("flipx"));
                localStorage.setItem("flipy", document.querySelector(".content").classList.contains("flipy"));
                localStorage.setItem("bg-color", getCssVariable("bg-color"));
                localStorage.setItem("text-color", getCssVariable("text-color"));
                localStorage.setItem("text-size", getCssVariable("text-size"));
                localStorage.setItem("margin", getCssVariable("margin"));
                localStorage.setItem("speed", parseInt(document.querySelector("#speed").value));
            }
            saveChanges();


            function fetchOptions() {
                const content = localStorage.getItem("content");
                if (content) {
                    //document.querySelector(".content").innerHTML = content;

                    if (localStorage.getItem("align") == "left") {
                        document.querySelector("#left").style.setProperty("display", "none");
                        document.querySelector("#center").style.setProperty("display", "block");
                    } else {
                        document.querySelector("#left").style.setProperty("display", "block");
                        document.querySelector("#center").style.setProperty("display", "none");
                    }
                    setCssVariable("align", localStorage.getItem("align"));

                    if (localStorage.getItem("flipx") == "true") {
                        toggleFlipx();
                    }

                    if (localStorage.getItem("flipy") == "true") {
                        toggleFlipy();
                    }

                    setCssVariable("bg-color", localStorage.getItem("bg-color"));
                    document.querySelector("#bg-color").value = localStorage.getItem("bg-color");

                    setCssVariable("text-color", localStorage.getItem("text-color"));
                    document.querySelector("#text-color").value = localStorage.getItem("text-color");

                    const textSize = localStorage.getItem("text-size");
                    setCssVariable("text-size", textSize);
                    const textSizeNum = parseInt(textSize.replace("px", ""));
                    document.querySelector("#text-size").value = textSizeNum;
                    document.querySelector("#text-size-display").textContent = textSizeNum;

                    const margin = localStorage.getItem("margin");
                    setCssVariable("margin", margin);
                    const marginNum = parseInt(margin.replace("%", ""));
                    document.querySelector("#margin").value = marginNum;
                    document.querySelector("#margin-display").textContent = marginNum;

                    document.querySelector("#speed").value = parseInt(localStorage.getItem("speed"));
                    handleSpeedChange();
                }
            };
        </script>
        <script>
        // Get the close button
        var closeButton = document.getElementById('close-button');
        if(closeButton){
            // Add a click event listener to the close button
            closeButton.addEventListener('click', function() {
                // Get the banner container div
                var bannerContainer = document.getElementById('popup-banner-container');
    
                // Hide the banner container div
                bannerContainer.style.display = 'none';
            });
        }
        </script>
    </body>
</html>
