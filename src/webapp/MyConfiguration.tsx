import Offcanvas from 'react-bootstrap/Offcanvas';
import { Editor as MonacoEditor } from '@monaco-editor/react';

import './SetConfigurationValuesMenu.css';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Col, Container, Row } from 'react-bootstrap';
import { Content } from './TemplateOutput';

type OffCanvasProps = {
  name: string | undefined,
  chart: Map<string, Content>,
  onChange?: (newValue: string) => void,
}

export const LOCAL_STORAGE_KEY = 'my-configuration'

export default function MyConfiguration({ name, chart, onChange }: OffCanvasProps) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [myConfig, setMyConfig] = useState(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || "");

  const loadFromValuesYaml = (event: unknown) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    event.stopPropagation();

    const cfg: string = chart.get('values.yaml')?.content || "";
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cfg));
    setMyConfig(cfg);
    if (onChange !== undefined && typeof onChange === 'function') onChange(cfg);
  }

  const myConfigChangeHandler = (newValue: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newValue));
    setMyConfig(newValue);
    if (onChange !== undefined && typeof onChange === 'function') onChange(newValue);
  }

  useEffect(() => {
    // console.debug("Loaded!!!");
  }, []);

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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore 
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