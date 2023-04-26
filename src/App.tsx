import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap';

function App() {
  return (
    <Container fluid className="themed-container text-center">
      <Row>
        <Col className='themed-grid-col'>1 of 1</Col>
        <Col className='themed-grid-col'>1 of 1</Col>
        <Col className='themed-grid-col'>1 of 1</Col>
      </Row>
    </Container>
  )
}

export default App