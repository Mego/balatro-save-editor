import pako from "pako";
import React, { ChangeEventHandler, useCallback, useState } from "react";
import "./App.css";
import { load, save } from "./lua";

const App: React.FC = () => {
  const [data, setData] = useState("");

  const onUpload = useCallback<ChangeEventHandler<HTMLInputElement>>(
    async (ev) => {
      const file = ev.target.files?.[0];
      if (file) {
        const contents = await file.arrayBuffer();
        const decompressed = pako.inflateRaw(contents, {
          windowBits: 15,
          to: "string",
        });
        const res = await load(decompressed);
        const newData = JSON.stringify(res, undefined, 2);
        setData(newData);
      }
    },
    []
  );

  const doDownload = useCallback(async () => {
    const tableData = await save(JSON.parse(data));
    const compressed = pako.deflateRaw(tableData, { windowBits: 15 });
    const blob = new Blob([compressed], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "profile.jkr";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [data]);

  const onTextUpdate = useCallback<
    React.ChangeEventHandler<HTMLTextAreaElement>
  >((ev) => {
    const data = ev.target.value;
    setData(data);
  }, []);

  return (
    <div>
      <input type="file" id="save-input" onChange={onUpload} />
      <textarea value={data} onChange={onTextUpdate}></textarea>
      <button type="button" onClick={doDownload}>
        Download
      </button>
    </div>
  );
};

export default App;
