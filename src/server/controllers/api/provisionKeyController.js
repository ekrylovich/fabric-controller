/**
 * @file provisionKeyController.js
 * @author Zishan Iqbal
 * @description This file includes the implementation of the instance-provision key end-point
 */
import async from 'async';
import express from 'express';
const router = express.Router();
import BaseApiController from './baseApiController';
import FabricManager from '../../managers/fabricManager';
import UserManager from '../../managers/userManager';
import FabricAccessTokenManager from '../../managers/fabricAccessTokenManager';
import FabricProvisionKeyManager from '../../managers/fabricProvisionKeyManager';
import FabricUserManager from '../../managers/fabricUserManager';
import AppUtils from '../../utils/appUtils';
import Constants from '../../constants.js';
import FabricProvisionKeyService from '../../services/fabricProvisionKeyService';
import FabricService from '../../services/fabricService';
import FabricUserService from '../../services/fabricUserService';
import FabricAccessTokenService from '../../services/fabricAccessTokenService';
import UserService from '../../services/userService';


router.get('/api/v2/authoring/fabric/provisionkey/instanceid/:instanceId', BaseApiController.checkfabricExistance, (req, res) => {
  var params = {
        iofabric_uuid: req.params.instanceId,
        provisionKey: AppUtils.generateRandomString(8),
        expirationTime: new Date().getTime() + (20 * 60 * 1000)
      },
      newProvisionProps = {
        setProperty: 'provisionKey',
        error: 'Error: New Provision Key not created.'
      };

  async.waterfall([
     async.apply(FabricProvisionKeyService.newFabricProvisionKey,newProvisionProps,params)
 
  ], function(err, result) {
  
  var errMsg = 'Error: There was a problem in creating the newProvisionKey.';
  AppUtils.sendResponse(res, err, 'provisonKey', params.provisionKey.provisionKey, errMsg);

  });
});

router.get('/api/v2/instance/provision/key/:provisionKey/fabrictype/:fabricType', (req, res) => {

  var params = {},
      date = new Date(),

      provisionKeyProps = {
        setProperty: 'fabricProvisionKey',
        error: 'ProvisionKey not found'
      },

      fogProps = {
        setProperty: 'fabric',
        error: 'Fabric not found'
      },

      fabricUserProps={
        setProperty: 'fabricUser',
        error: 'FabricUser not found'
      },
      deleteTokenProps={
        error: 'FabricAccessToken not deleted'
      },
      saveTokenProps={
        setProperty: 'fabricAccessToken',
        error: 'FabricAccessToken not generated'
      };

  params.bodyParams = req.params;

  // async.waterfall control flow, sequential calling of an Array of functions.
  async.waterfall([
    async.apply(FabricProvisionKeyService.getFabricProvisionKey, provisionKeyProps, params),
    async.apply(getFog, fogProps),
    async.apply(FabricUserService.getFabricUser , fabricUserProps),
    async.apply(FabricAccessTokenService.generateAccessToken),
    async.apply(FabricAccessTokenService.deleteAccessToken,deleteTokenProps),
    async.apply(FabricAccessTokenService.saveUserToken,saveTokenProps),

  ], function(err, result) {
    if(!err)
    {
      var errMsg = 'Error: There was a problem in creating the AcessToken.',
          successLableArr=['id','token'],
          successValueArr=[params.fabric.uuid,params.accessToken];
      
      FabricProvisionKeyService.deleteKey(params);  
      params.bodyParams.provisionKey=null; 
      AppUtils.sendMultipleResponse(res, err, successLableArr, successValueArr, errMsg);   
    }
    else
    {
      AppUtils.sendResponse(res, err, 'Success', 'ok', result);   
    }
  });
});


router.post('/api/v2/authoring/fabric/provisioningkey/list/delete', (req, res) => {

  var params = {};

  params.bodyParams = req.body;
  params.milliseconds = new Date().getTime();

  async.waterfall([
    async.apply(UserService.getUser, params),
    async.apply(FabricProvisionKeyService.deleteByFabricInstance)

  ], function(err, result) {
    AppUtils.sendResponse(res, err, 'fabricInstanceId', params.bodyParams.fabricInstanceId, result);
  });
});

/**
 * @desc - if the provision key is not expired in the database finds its
 * coresponding fabric data and forwards to getFabricUser function
 * @param - fabricType, fabricKey, callback
 * @return - none
 */
 function getFog(props, params, callback) {
  var date = new Date();

    if (date < params.fabricProvisionKey.expirationTime) {
      FabricManager
      .findByInstanceId(params.fabricProvisionKey.iofabric_uuid)
      .then(AppUtils.onFind.bind(null, params, props.setProperty, props.error, callback));
    }
    else
    {
      callback('error', Constants.MSG.ERROR_PROVISION_KEY_EXPIRED);
    }
  }


export default router;
