import React, { Component } from 'react';
import '../assets/styles/App.scss';
import { AppBar, Toolbar, Typography, Table, TableRow, TableBody, IconButton, Grid, TableHead, TableCell } from '@material-ui/core';
import PhoneIcon from '@material-ui/icons/Phone';
import CallEndIcon from '@material-ui/icons/CallEnd';

class App extends Component {

  state = {
    peers: []
  };

  handleInitCall = (peer) => {
    peer.status = 'Busy';
    
    var counter = setInterval(() => {
      peer.time.setSeconds(peer.time.getSeconds() + 1);

      this.forceUpdate();
    }, 1000);

    peer.counter = counter;
  }

  handleCallOut = (peer) => {
    clearInterval(peer.counter);
    peer.status = 'Free';
    peer.time = new Date(peer.timestamp);
    this.forceUpdate();
  }

  componentDidMount() {
    fetch("http://localhost:3334/peers")
      .then(res => res.json())
      .then(
        (result) => {
          result.list.map(peer => {
            peer.status = 'Free';
            peer.timestamp = '0';
            peer.time = new Date(peer.timestamp)
          });
          this.setState({
            peers: result.list
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    return (
      <div className="App">

        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" color="inherit" >
              React Task Manager
            </Typography>
          </Toolbar>
        </AppBar>

        <main>
          <Grid container spacing={0} justify="flex-end" className="grid-main">
            <Grid item xs={12} className="grid-table">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Operador</TableCell>
                    <TableCell align="left">Número</TableCell>
                    <TableCell align="right">Status</TableCell>
                    <TableCell align="right">Tempo</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {this.state.peers.map(peer => {
                    return (
                      <TableRow key={peer.id}>
                        <TableCell component="th" scope="row">{peer.name}</TableCell>
                        <TableCell align="left" >{peer.number}</TableCell>
                        <TableCell align="right" >{peer.status}</TableCell>
                        <TableCell align="right" >{peer.time.toLocaleTimeString()}</TableCell>
                        <TableCell align="right" >
                          <IconButton
                            aria-label="Edit"
                            onClick={() => {peer.status === 'Free' ? this.handleInitCall(peer) : this.handleCallOut(peer) }}
                          >
                            {peer.status === 'Free' ? <PhoneIcon /> : <CallEndIcon />}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Grid>
          </Grid>
        </main>

      </div>
    );
  }
}

export default App;
