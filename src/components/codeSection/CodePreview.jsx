import { useState, useEffect, useRef } from "react";
import { BiSolidPhone, BiDesktop } from "react-icons/bi";
import { IoTabletPortrait } from "react-icons/io5";
import { BsCode } from "react-icons/bs";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { FiCopy } from "react-icons/fi";
import { FaAlignRight, FaAlignLeft } from "react-icons/fa";

const CodePreview = ({item}) => {
  const [view, setView] = useState("desktop");
  const [isRTL, setIsRTL] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const iframeRef = useRef(null);

  const deviceOptions = {
    mobile: "max-w-[360px]",
    tablet: "max-w-[768px]",
    desktop: "max-w-[1024px]",
  };

  const bodyContent = item.code;

  const generateHTML = () => `
    <html lang="en" dir="${isRTL ? "rtl" : "ltr"}" class="${
    darkMode ? "dark" : ""
  }">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.tailwindcss.com"></script>
        <script>
          tailwind.config = { darkMode: "class" };
          function updateTheme(isDark, isRTL) {
            document.documentElement.classList.toggle("dark", isDark);
            document.documentElement.dir = isRTL ? "rtl" : "ltr";
          }
          window.addEventListener("message", (event) => {
            if (event.data.darkMode !== undefined || event.data.isRTL !== undefined) {
              updateTheme(event.data.darkMode, event.data.isRTL);
            }
          });
        </script>
      </head>
      <body class="flex items-center justify-center h-screen">
        ${bodyContent}
      </body>
    </html>
  `;

  const updateIframe = () => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ darkMode, isRTL }, "*");
    }
  };

  useEffect(() => {
    updateIframe();
  }, [darkMode, isRTL]);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(bodyContent.trim())
      .then(() => alert("Code copied!"));
  };

  return (
    
      
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 p-4 border rounded-lg bg-amber-50 shadow-md mt-10">
        {/* Control Buttons */}
        <div className="flex justify-between items-center px-4 py-3 bg-amber-50 rounded-md">
          {/* Component Name */}
          <div className="text-xl  text-amber-900  hover:scale-90 bg-amber-200 p-2 rounded-xl font-bold ">{item.name}</div>

          {/* Device View Buttons */}
          <div className="flex items-center gap-2">
            {Object.keys(deviceOptions).map((type) => (
              <button
                key={type}
                className={`p-2 rounded-md transition-all ${
                  view === type
                    ? "bg-amber-200 dark:bg-amber-400"
                    : "hover:bg-amber-300 dark:hover:bg-amber-100"
                }`}
                onClick={() => setView(type)}
              >
                {type === "mobile" ? (
                  <BiSolidPhone className="text-amber-800" />
                ) : type === "tablet" ? (
                  <IoTabletPortrait className="text-amber-800" />
                ) : (
                  <BiDesktop className="text-amber-800" />
                )}
              </button>
            ))}
          </div>

          <div>
            {/* Dark Mode Toggle */}
            <button
              onClick={() => {
                setDarkMode(!darkMode);
                updateIframe();
              }}
              className="p-2 rounded-md hover:bg-amber-300 dark:hover:bg-amber-400"
            >
              {darkMode ? (
                <MdLightMode size={22} className="text-amber-800" />
              ) : (
                <MdDarkMode
                  size={22}
                  className="text-amber-800 dark:text-amber-800"
                />
              )}
            </button>

            {/* RTL / LTR Toggle */}
            <button
              onClick={() => {
                setIsRTL(!isRTL);
                updateIframe();
              }}
              className="p-2 rounded-md hover:bg-amber-300 dark:hover:bg-amber-400"
            >
              {isRTL ? <FaAlignLeft className="text-amber-800" size={20} /> : <FaAlignRight className="text-amber-800" size={20} />}
            </button>

            {/* Show Code Button */}
            <button
              onClick={() => setShowCode(!showCode)}
              className="p-2 rounded-md hover:bg-amber-300 dark:hover:bg-amber-400"
            >
              <BsCode  className="text-amber-800" size={20} />
            </button>

            {/* Copy Code Button */}
            <button
              onClick={copyToClipboard}
              className="p-2 rounded-md hover:bg-amber-300 dark:hover:bg-amber-400"
            >
              <FiCopy className="text-amber-800" size={20} />
            </button>
          </div>
        </div>

        {/* Code Preview Container (Centered & Wider) */}
        <div className="w-full flex justify-center">
          <div
            className={`border rounded-md overflow-hidden w-full ${deviceOptions[view]}`}
          >
            <iframe
              ref={iframeRef}
              srcDoc={generateHTML()}
              className="w-full h-[400px] border-none"
            ></iframe>
          </div>
        </div>

        {/* Show Code Section (Only Body Content) */}
        {showCode && (
          <pre className="p-3 bg-amber-100 text-sm rounded-md overflow-x-auto">
            <code>{bodyContent.trim()}</code>
          </pre>
        )}
      </div>
   
  );
};

export default CodePreview;
