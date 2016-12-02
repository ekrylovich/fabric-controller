/**
 * @file instanceConfigController.js
 * @author Zishan Iqbal
 * @description This file includes the implementation of instance-config and config-changes end-points
 */
import async from 'async';
import express from 'express';
const router = express.Router();
import FabricManager from '../../managers/fabricManager';
import BaseApiController from './baseApiController';
import AppUtils from '../../utils/appUtils';
import Constants from '../../constants.js';
import FabricService from '../../services/fabricService';


router.get('/api/v2/instance/config/id/:ID/token/:Token', BaseApiController.checkUserExistance, (req, res) => {
  var params={},

      instanceProps={
          setProperty: 'fabricData',
          error: 'fabricData not found'
      };

      params= req.params;


  async.waterfall([
     async.apply(FabricService.findByInstance,instanceProps,params)
 
  ], function(err, result) {
        var successValue={
            networkinterface: params.fabricData.networkInterface,
            dockerurl: params.fabricData.dockerURL,
            disklimit: params.fabricData.diskLimit,
            diskdirectory: params.fabricData.diskDirectory,
            memorylimit: params.fabricData.memoryLimit,
            cpulimit: params.fabricData.cpuLimit,
            loglimit: params.fabricData.logLimit,
            logdirectory: params.fabricData.logDirectory,
            logfilecount: params.fabricData.logFileCount
        }
  
        var errMsg = 'Configuration was not available for the instance you specified.';

        AppUtils.sendResponse(res, err, 'config', successValue, errMsg);
      });
  });


router.post('/api/v2/instance/config/changes/id/:ID/token/:Token', BaseApiController.checkUserExistance, (req, res) => {
  var params ={};

      params=req.params;
      params.bodyParams = req.body;

  async.waterfall([
    async.apply(FabricService.updateFabrics,params)

  ], function(err, result) {
        AppUtils.sendResponse(res, err, null, null, result);
  });
});


export default router;