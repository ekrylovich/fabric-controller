/**
 * @file instanceChangesController.js
 * @author Zishan Iqbal
 * @description This file includes the implementation of the instance-changes end-point
 */

import async from 'async';
import express from 'express';
const router = express.Router();
import BaseApiController from './baseApiController';
import ChangeTrackingManager from '../../managers/changeTrackingManager';
import FabricManager from '../../managers/fabricManager';
import Constants from '../../constants.js';
import ChangeTrackingService from '../../services/changeTrackingService';
import FabricService from '../../services/fabricService';
import AppUtils from '../../utils/appUtils';



/**
 * @desc - if there is changeTracking data present, the data is checked against the timpstamp
 * and the client is responsed with the true values for the changed data and false for unchanged data.
 * @param Integer - instanceId
 * @return - returns and appropriate response to the client
 */

router.get('/api/v2/instance/changes/id/:ID/token/:Token/timestamp/:TimeStamp', BaseApiController.checkUserExistance, (req, res) => {
  var params = {},
      newLastActive = new Date().getTime(),

      findInstanceProps={
        setProperty: 'changeData',
        error: 'Error: Cannot find any instance with input id.'
      },

        fabricConfig = {
            lastActive: newLastActive
        };

      params=req.params;
      params.instanceId=params.ID;
      params.bodyParams=fabricConfig;
      params.changes = {
          config: false,
          containerlist: false,
          containerconfig: false,
          routing: false,
          registeries: false
        };
  
  if (params.TimeStamp.length < 1) {
        params.TimeStamp = 0;
  }

  async.waterfall([
     async.apply(ChangeTrackingService.findByInstanceId, findInstanceProps, params),
     async.apply(checkChanges),
     async.apply(FabricService.updateFabrics)

  ], function(err, result) {

     AppUtils.sendResponse(res, err, 'changes', params.changes, result);
    
    });
});

 function checkChanges(params, callback) {
 //      if (params.changeData) {
 
          if (params.changeData.config > params.TimeStamp) {
            params.changes.config = true;
          }

          if (params.changeData.containerList > params.TimeStamp) {
            params.changes.containerlist = true;
          }

          if (params.changeData.containerConfig > params.TimeStamp) {
            params.changes.containerconfig = true;
          }

          if (params.changeData.routing > params.TimeStamp) {
            params.changes.routing = true;
          }

          if (params.changeData.registeries > params.TimeStamp) {
            params.changes.registeries = true;
          }
          callback(null,params);
        // }
        // else
        // {
        //   callback('Error',);

        // }
        //   // Updates the fabric with the fabricConfig based on the fabrics instanceId
        //   FabricManager
        //   .updateFabricConfig(params.instanceId, fabricConfig)
        //   .then(AppUtils.onUpdate.bind(null, params, 'No Record Updated', callback));
        // }
}

export default router;