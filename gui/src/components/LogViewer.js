import React from "react";
import { Accordion, Card, ListGroup, Button } from "react-bootstrap"; // Necessary react-bootstrap components

const maxLength = 200

const ListStyle = {
  maxHeight: '800px',
  marginBottom: '10px',
  overflow: 'scroll'
}

export default class LogViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numLogs: 0,
      logs: []
    }
  }

  getColor(type)
  {
    let variant
    if(type === '[E]') {
      variant = "danger"
    }
    else if(type === '[W]') {
      variant = "warning"
    }
    else if(type === '[I]') {
      variant = "info"
    }
    else if(type === '[D]') {
      variant = "dark"
    }
    else {
      variant = null
    }
    return variant
  }

  addElement()
  {
    var newArray = this.state.logs;
    newArray.unshift('Log message ' + (this.state.logs.length+1));
    if(this.state.logs.length > maxLength) {
      newArray.pop()
    }
    this.setState({ logs: newArray });
  }
  componentDidMount() {
    this.props.socket.on("logFromSerial", data => {
      var newArray = this.state.logs;
      newArray.unshift(data);
      if(this.state.logs.length > maxLength) {
        newArray.pop()
      }
      this.setState({ logs: newArray });
    });
  }
  render() {
      var logListItems = this.state.logs.map((log, index) => {
          let messageType = log.substring(0, 3)
          let variant = this.getColor(messageType)
          log = log.substring(3)
          return <ListGroup.Item key={'log-item-'+index} variant={variant}>{log}</ListGroup.Item>
      })
    return (
        <div>
        <Accordion defaultActiveKey="0" style = {{borderBottom: '1px solid rgba(0, 0, 0, .125)'}}>
            <Card>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                    Logs {this.state.logs.length > 0 ? `(Number of logs: ${this.state.logs.length})` : `(Empty)`}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                <Card.Body>
                    <Button variant="danger" style = {{marginBottom: '5px'}} onClick = {() => {this.setState({logs: []})}}>Reset</Button>
                    <ListGroup style = {ListStyle}>
                        {this.state.logs.length > 0 ? logListItems : "There are no logs."}
                    </ListGroup>
                </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
        </div>
    )
  }
}
