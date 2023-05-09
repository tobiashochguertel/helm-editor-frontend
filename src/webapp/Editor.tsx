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

  function editorDidMount(editor: { focus: () => void; }) {
    // editor.focus();
  }

  function internalOnChange(event: { target: { value: any; }; }) {
    // console.debug("event", event);
    onChange(event.target.value, event);
  }

  function handleEditorChange(value, event) {
    // console.debug("handleEditorChange.value", value);
    // console.debug("handleEditorChange.event", event);
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
          {/*           <textarea
            placeholder="code"
            name="textValue"
            onChange={internalOnChange}
            defaultValue={input}
            rows="25"
            cols="80"
          >
          </textarea> */}

          {/* <MonacoEditor
            key={input}
            height={height}
            edito
            editorDidMount={editorDidMount}
            onChange={onChange}
            language={language_editor}
            value={input}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore:
            options={options}
          /> */}

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
          {/* <MonacoEditor
            height={height}
            language={language_render}
            value={output}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore:
            options={{ ...options, readOnly: true }}
          /> */}
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