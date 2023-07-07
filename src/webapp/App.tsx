import { Container, Row } from 'react-bootstrap';
import { PlusCircle } from 'react-feather';
import { useEffect, useState } from 'react';
import { Tree, useToasts } from '@geist-ui/core'
import TemplateOutput, { Content } from './TemplateOutput';
import Editor from './Editor';
import { replaceSlash } from './getContent';
import MyConfiguration, { LOCAL_STORAGE_KEY } from './MyConfiguration';

function isEmpty(array: Array<unknown> | Map<unknown, unknown>) {
  if (array instanceof Map) return array.size === 0;
  return array.length === 0;
}

function App() {
  const { setToast } = useToasts()

  const [output, setOutput] = useState<string>("");
  const [code, setCode] = useState<Content>({ filename: '', content: '', type: 'file' } as Content);
  const [selectedFile, setSelectedFile] = useState("");
  const [filesTree, setFilesTree] = useState([]);
  const [isFileChange, setIsFileChange] = useState(false);

  const [chart, setChart] = useState<Map<string, Content>>(new Map<string, Content>());
  const [chartLoaded, setChartLoaded] = useState(false);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [myConfig, setMyConfig] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || "");

  useEffect(() => {
    if (isEmpty(chart)) {
      fetch(`/api/chart`).then(response => response.json()).then((data) => {
        // https://www.cloudhadoop.com/2018/09/typescript-how-to-convert-map-tofrom.html
        const map = new Map<string, Content>();
        for (const value in data) {
          map.set(value, data[value]);
        }
        setChart(map);
        setChartLoaded(true);
      });
    }
    if (isEmpty(filesTree)) {
      fetch(`/api/tree`).then(response => response.json()).then((data) => {
        setFilesTree(data);
      });
    }
    if (isFileChange === true) {
      const code: Content = {
        filename: selectedFile,
        content: chart.get(selectedFile)?.content || "",
        type: "file"
      }
      setCode(code);
      TemplateOutput(chart, code, myConfig)
        .then((output) => setOutput(output));
      setIsFileChange(false);
    }
  }, [chart, filesTree, isFileChange, myConfig, selectedFile]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onChange(newValue: unknown, _e: unknown) {
    const code: Content = {
      filename: selectedFile,
      content: newValue as string,
      type: "file"
    }
    TemplateOutput(chart, code, myConfig)
      .then((output) => setOutput(output));

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body: newValue as string
    };

    if (isFileChange === false) {
      fetch(`/api/file/${replaceSlash(selectedFile)}`, requestOptions)
        .then(response => response.text())
        .then(() => {
          const currentValue: Content = chart.get(selectedFile) || { filename: selectedFile, content: "", type: "file" } as Content;
          currentValue.content = newValue as string;
          chart.set(selectedFile, currentValue)
        })
    }
  }

  const handler = (path: string) => {
    setToast({ text: path })
    if (selectedFile !== path) {
      setIsFileChange(true);
      setSelectedFile(path);
    }
  }

  const myConfigurationChangeHandler = (newValue: string) => {
    setMyConfig(newValue);
    TemplateOutput(chart, code, newValue)
      .then((output) => setOutput(output));
  }

  if (chart.size === 0) return (<>'No Files available... or backend not available?'</>)
  if (chartLoaded === false) return (<>'Files Content not yet loaded...'</>)

  return (
    <>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">TH. Helm Chart Playground</a>
      </header>

      <Container fluid className="">
        <Row>
          <nav id="sidebarMenu" className="col-md-3 col-lg-2 d-md-block bg-body-tertiary sidebar collapse">
            <div className="position-sticky pt-3 sidebar-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    <span data-feather="home" className="align-text-bottom"></span>
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <MyConfiguration
                    name={"Set Configuration Values"}
                    chart={chart}
                    onChange={myConfigurationChangeHandler}
                  />
                </li>
              </ul>

              {/* List Files / Directories */}
              <h6
                className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-body-secondary text-uppercase">
                <span>Files</span>
                <a className="link-secondary" href="#" aria-label="Add a new report">
                  <PlusCircle className='feather align-text-bottom' />
                </a>
              </h6>
              <Tree
                onClick={handler}
                value={filesTree}
                initialExpand={false}
              />
            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {selectedFile && <Editor
              input={code.content}
              output={output}
              onChange={onChange}
              selectedFile={selectedFile}
            />}
          </main>

        </Row>
      </Container>

    </>
  )
}

export default App