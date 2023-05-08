import MonacoEditor from '@uiw/react-monacoeditor';
// import MonacoEditor from 'react-monaco-editor';

import { Col, Container, Row } from 'react-bootstrap';

type Props = {
  input: string | undefined,
  output: string | undefined,
  onChange?: (newValue: any, e: any) => void,
  selectedFile?: string,
}

function Editor(
  {
    input,
    output,
    onChange = (newValue: any, e: any) => {
      console.debug("newValue", newValue);
      console.debug("e", e);
    },
    selectedFile = "",
  }: Props) {

  const options = {
    selectOnLineNumbers: true,
    roundedSelection: false,
    readOnly: false,
    cursorStyle: 'line',
    automaticLayout: false,
    // theme: 'vs-dark',
    theme: 'vs-light',
    scrollbar: {
      // Subtle shadows to the left & top. Defaults to true.
      useShadows: false,
      // Render vertical arrows. Defaults to false.
      verticalHasArrows: true,
      // Render horizontal arrows. Defaults to false.
      horizontalHasArrows: true,
      // Render vertical scrollbar.
      // Accepted values: 'auto', 'visible', 'hidden'.
      // Defaults to 'auto'
      vertical: 'visible',
      // Render horizontal scrollbar.
      // Accepted values: 'auto', 'visible', 'hidden'.
      // Defaults to 'auto'
      horizontal: 'visible',
      verticalScrollbarSize: 17,
      horizontalScrollbarSize: 17,
      arrowSize: 30,
    },
  };

  const language_editor = "yaml";
  const language_render = "yaml";
  const height = "700px"

  function editorDidMount(editor) {
    editor.focus();
  }

  return (
    <Container fluid>
      <Row>
        {/* <Col>
        <h6>Values</h6>
      </Col> */}
        <Col>
          <h6>Selected File: {selectedFile}</h6>
          <MonacoEditor
            height={height}
            editorDidMount={editorDidMount}
            onChange={onChange}
            language={language_editor}
            value={input}
            options={options}
          />
        </Col>
        <Col>
          <h6>Render Output</h6>
          <MonacoEditor
            height={height}
            language={language_render}
            value={output}
            options={{ ...options, readOnly: true }}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Editor;