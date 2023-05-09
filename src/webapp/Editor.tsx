// import MonacoEditor from '@uiw/react-monacoeditor';
// import MonacoEditor from 'react-monaco-editor';
// import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { Editor as MonacoEditor } from '@monaco-editor/react';

import { Col, Container, Row } from 'react-bootstrap';

type Props = {
  input: string | undefined,
  output: string | undefined,
  onChange?: (newValue: unknown, e: unknown) => void,
  selectedFile?: string,
}

function Editor(
  {
    input,
    output,
    onChange = (newValue: unknown, e: unknown) => {
      console.debug("newValue", newValue);
      console.debug("e", e);
    },
    selectedFile = "",
  }: Props) {

  const language_editor = "yaml";
  const language_render = "yaml";

  function handleEditorChange(value: unknown, event: unknown) {
    onChange(value, event);
  }

  return (
    <Container fluid>
      <Row>
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
            height="90vh"
            defaultLanguage={language_render}
            defaultValue={output}
            value={output}
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