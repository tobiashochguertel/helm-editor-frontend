// import MonacoEditor from '@uiw/react-monacoeditor';
// import MonacoEditor from 'react-monaco-editor';
// import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { Editor as MonacoEditor } from '@monaco-editor/react';

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

  const language_editor = "yaml";
  const language_render = "yaml";

  function handleEditorChange(value, event) {
    onChange(value, event);
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
            key={input}
            height="90vh"
            defaultLanguage={language_editor}
            defaultValue={input}
            onChange={handleEditorChange}
          />
        </Col>
        <Col>
          <h6>Render Output</h6>
          <MonacoEditor
            key={output}
            height="90vh"
            defaultLanguage={language_render}
            defaultValue={output}
            options={{
              readOnly: true,
            }}
          />
        </Col>
      </Row>
    </Container >
  )
}

export default Editor;