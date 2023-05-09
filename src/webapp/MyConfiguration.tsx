import Offcanvas from 'react-bootstrap/Offcanvas';
import { Editor as MonacoEditor } from '@monaco-editor/react';

import './SetConfigurationValuesMenu.css';
import { useState } from 'react';
import { Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap';
import { Filecontent, Filename } from './TemplateOutput';

type OffCanvasProps = {
  name: string | undefined,
  filesAndContent: Map<Filename, Filecontent>,
  onChange?: (newValue: string) => void,
}

const LOCAL_STORAGE_KEY = 'my-configuration'

export default function MyConfiguration({ name, filesAndContent, onChange }: OffCanvasProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  const [myConfig, setMyConfig] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || "");

  const loadFromValuesYaml = (event: unknown) => {
    event.stopPropagation();

    const cfg: string = filesAndContent.get('values.yaml') || "";
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cfg));
    setMyConfig(cfg);
    if (onChange !== undefined && typeof onChange === 'function') onChange(cfg);
  }

  const myConfigChangeHandler = (newValue: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newValue));
    setMyConfig(newValue);
    if (onChange !== undefined && typeof onChange === 'function') onChange(newValue);
  }

  return (
    <>
      <a href='#' onClick={toggleShow} className="nav-link">
        {name}
      </a>
      <Offcanvas show={show} onHide={handleClose} scroll={true} backdrop={false}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My Configuration:</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Container fluid className="">
            <Row>
              <Col></Col>
              <Col>
                Load from...
                <ButtonGroup aria-label="Load Configuration Settings" size="sm">
                  <Button variant="secondary" onClick={loadFromValuesYaml}>Values.yaml</Button>
                  {/* <Button variant="secondary">Middle</Button> */}
                  {/* <Button variant="secondary">Right</Button> */}
                  {/* <DropdownButton as={ButtonGroup} title="Dropdown" id="bg-nested-dropdown" variant="secondary">
                    <Dropdown.Item eventKey="1">Dropdown link</Dropdown.Item>
                    <Dropdown.Item eventKey="2">Dropdown link</Dropdown.Item>
                  </DropdownButton> */}
                </ButtonGroup>
              </Col>
              <Col></Col>
            </Row>
          </Container>
          <MonacoEditor
            defaultLanguage="yaml"
            // defaultValue={myConfig}
            value={myConfig}
            onChange={myConfigChangeHandler}
            options={{
              readOnly: false,
            }}
          />
        </Offcanvas.Body>
      </Offcanvas >
    </>
  );
}