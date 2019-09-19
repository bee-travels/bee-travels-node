/**
 * Router for destination locations
 */

var express = require('express');
var router = express.Router();

var dataHandler = require('../services/dataHandler');

/* GET list of destination locations */
router.get('/', function(req, res, next) {

  var getDestinationData = dataHandler.getDestinationData(null);
  
  getDestinationData.then(function(destinationData) {
    res.send(destinationData);
  }).catch(function(err) {
		res.sendStatus(500);
	})
});

/* GET location data for a given city */
router.get('/:city/:country', function(req, res, next) {

  var getDestinationData = dataHandler.getDestinationData(req.params.city,req.params.country);
  
  getDestinationData.then(function(destinationData) {
    res.send(destinationData);
  }).catch(function(err) {
		res.sendStatus(500);
	})
});

module.exports = router;
