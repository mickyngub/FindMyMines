import React from "react";
import "./Grids.css";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const Grids = () => {
  return (
    <div className="Grid-wrapper">
      <Grid container spacing={3}>
        <Grid item xs={4} className="Grid-body">
          <Paper className="Paper-body">1st</Paper>
        </Grid>
        <Grid item xs={4} className="Grid-body">
          <Paper className="Paper-body">2nd</Paper>
        </Grid>
        <Grid item xs={4} className="Grid-body">
          <Paper className="Paper-body">3rd</Paper>
        </Grid>

        <Grid item xs={4} className="Grid-body">
          <Paper className="Paper-body">4th</Paper>
        </Grid>
        <Grid item xs={4} className="Grid-body">
          <Paper className="Paper-body">5th</Paper>
        </Grid>
        <Grid item xs={4} className="Grid-body">
          <Paper className="Paper-body">6th</Paper>
        </Grid>
        <Grid item xs={4} className="Grid-body">
          <Paper className="Paper-body">7th</Paper>
        </Grid>
        <Grid item xs={4} className="Grid-body">
          <Paper className="Paper-body">8th</Paper>
        </Grid>
        <Grid item xs={4} className="Grid-body">
          <Paper className="Paper-body">9th</Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Grids;
