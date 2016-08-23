/**
* @file instanceRoutingController.js
* @author Zishan Iqbal
* @description This file includes the implementation of the instance-routing end-point
*/

import async from 'async';
import express from 'express';
const router = express.Router();
import BaseApiController from './baseApiController';
import StreamViewerManager from '../../managers/streamViewerManager';
import FabricManager from '../../managers/fabricManager';
import ConsoleManager from '../../managers/consoleManager';
import RoutingManager from '../../managers/routingManager';
import Constants from '../../constants.js';


 //Get ioFabric Routing
 router.get('/api/v2/instance/routing/id/:ID/token/:Token',BaseApiController.checkUserExistance, (req, res) => {
  	var milliseconds = new Date().getTime(),
       instanceId = req.params.ID,
       token = req.params.Token,
       streamId = "",
       consoleId = "",
       containerList = [];

    async.waterfall([
    async.apply(getStreamViewer, instanceId, streamId, consoleId, containerList),
    getConsole,
    getRouting
    ], function(err, result) {
    	if (err) {
      		res.send({
        		'status':'failure',
        		'timestamp': new Date().getTime(),
        		'errormessage': result
      		});
    	} else {
        console.log("result");
        console.log(result);
       //   res.status(200);
      		res.send({
        		'status':'ok',
        		'timestamp': new Date().getTime(),
        		'routng': result
      		});
    	}
  	});
});

function getStreamViewer(instanceId, streamId, consoleId, containerList, callback) {
	StreamViewerManager.findByInstanceId(instanceId)
    .then((streamData) => {
   		if(streamData) {
   			streamId = streamData.elementId;
   			callback(null, instanceId, streamId, consoleId,  containerList);
   		}
    	else callback('error', Constants.MSG.ERROR_STREAMVIEWER_UNKNOWN);
  	},
  	(err) => {
    	callback('error', Constants.MSG.SYSTEM_ERROR);
  	});
}

function getConsole(instanceId, streamId, consoleId, containerList, callback) {
	ConsoleManager.findByInstanceId(instanceId)
    .then((consoleData) => {
   		if(consoleData) {
   			consoleId = console.elementId;
   			callback(null, instanceId, streamId, consoleId, containerList);
   		}
    	else callback('error', Constants.MSG.ERROR_CONSOLE_UNKNOWN);
  	},
  	(err) => {
    	callback('error', Constants.MSG.SYSTEM_ERROR);
  	});
}

function getRouting(instanceId, streamId, consoleId, containerList, callback) {
	RoutingManager.findByInstanceId(instanceId)
    .then((routingData) => {
   		if(routingData) {
   		 var routingList = routingData;
      	for(let i = 0; i < routingList.length; i++) {
   		    var container = routingList[i];
			    var containerID = container.publishingElementId;
		      var destinationInstanceID = container.destinationInstanceId;
          var destinationElementID = container.destinationElementId;
			    var foundIt = false;
          for(var j = 0; j < containerList.length; j++) {
            var curItem = containerList[j];
            var curID = curItem.container;
          
            if(curID == containerID) {
              foundIt = true;                
              var outElementLabel = destinationElementID;
                if(destinationElementID == streamId) { outElementLabel = "viewer"; }
                if(destinationElementID == consoleId) {  outElementLabel = "debug"; }

                containerList[j]["receivers"].push(outElementLabel);
            }
          }
          if(foundIt == false) {
            var tmpNewContainerItem = {
            container : containerID
            };
          //  tmpNewContainerItem.container = containerID;
            var receiverList = new Array();
            var outElementLabel = destinationElementID;   
              if(destinationElementID == streamId) { outElementLabel = "viewer"; }
              if(destinationElementID == consoleId) {  outElementLabel = "debug"; }
              receiverList.push(outElementLabel);
              tmpNewContainerItem.receivers = receiverList;
              containerList.push(tmpNewContainerItem);
            }
   			}
         callback(null, containerList);
   		}
    	else callback('error', Constants.MSG.ERROR_ROUTING_UNKNOWN);
  	},
  	(err) => {
    	callback('error', Constants.MSG.SYSTEM_ERROR);
  	});
}

export default router;