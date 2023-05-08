import { Container, Row } from 'react-bootstrap';
import { PlusCircle } from 'react-feather';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tree, useToasts } from '@geist-ui/core'
import TemplateOutput from './TemplateOutput';
import Editor from './Editor';

type FileContent = {
  fielname: string,
  content: string
}

async function getContent(filename: string): Promise<FileContent> {
  // http://localhost:5173/api/file/templates%2Fworker-deployment.yaml
  const SLASH = '%2F';
  if (filename.indexOf("/") > -1) {
    filename = filename.replace("/", SLASH);
  }

  const data = await (
    await fetch(`/api/file/${filename}`)
  ).json();
  return data;
}

function App() {
  const { setToast } = useToasts()

  const [output, setOutput] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState("");
  const [filesTree, setFilesTree] = useState([]);

  const [files, setFiles] = useState<string[]>(new Array<string>());
  const [filesAndContent, setFilesAndContent] = useState<Map<string, string>>(new Map<string, string>());
  const [filesContentLoaded, setFilesContentLoaded] = useState(false);

  useEffect(() => {
    async function getFiles() {
      if (files.length == 0) return;
      if (filesContentLoaded === true) return;

      await Promise.all(files.map(async (file) => {
        return await getContent(file);
      })).then((filesContent) => {

        const filesAndContent = new Map<string, string>();
        for (const { fielname, content } of filesContent) {
          filesAndContent.set(fielname, content);
        }

        setFilesAndContent(filesAndContent);
        setFilesContentLoaded(true);
      });
    }

    if (files.length === 0)
      fetch(`/api/list`).then(response => response.json()).then((data) => {
        setFiles(data);
      });

    if (filesTree.length === 0)
      fetch(`/api/tree`).then(response => response.json()).then((data) => {
        setFilesTree(data);
      });

    getFiles();

    console.debug("useEffect.selectedFile", selectedFile);
    setCode(filesAndContent.get(selectedFile));
  }, [files, filesAndContent, filesContentLoaded, filesTree.length, selectedFile, setFilesAndContent]);

  function onChange(newValue) {
    console.debug("onChange.newValue", newValue);
    console.debug("onChange.selectedFile", selectedFile);

    TemplateOutput(filesAndContent, newValue).then((output) => {
      setOutput(output);
    });

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'text/plain' },
      body: newValue
    };
    fetch(`/api/file/${selectedFile}`, requestOptions)
      .then(response => response.text())
    // .then(response => setToast({ text: response }));
  }

  const handler = (path: string) => {
    setToast({ text: path })
    if (selectedFile !== path) {
      console.debug("File change detected.", selectedFile, path);
      setSelectedFile(path);
    }
  }

  if (files.length === 0) return (<>'No Files available...'</>)
  if (filesContentLoaded === false) return (<>'Files Content not yet loaded...'</>)

  return (
    <>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6" href="#">Company name</a>
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
              />
            </div>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            {selectedFile && <Editor
              input={code}
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