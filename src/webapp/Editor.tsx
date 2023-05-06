import MonacoEditor from '@uiw/react-monacoeditor';
import { Col, Container, Row } from 'react-bootstrap';
function Editor(props) {

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
  const height = "500px"

  function editorDidMount(editor) {
    // editor.focus();
  }

  function onChange(newValue: string, event: monaco.editor.IModelContentChangedEvent) {
    console.debug("event", event);
    // setOutput(newValue);
  }

  return (
    <Container fluid>
      <Row>
        {/* <Col>
        <h6>Values</h6>
      </Col> */}
        <Col>
          <h6>Selected File</h6>
          <MonacoEditor
            height={height}
            editorDidMount={editorDidMount}
            // onChange={onChange}
            language={language_editor}
            // value={code}
            options={options}
          />
        </Col>
        <Col>
          <h6>Render Output</h6>
          <MonacoEditor
            height={height}
            language={language_render}
            // value={output}
            options={{ ...options, readOnly: true }}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default Editor;