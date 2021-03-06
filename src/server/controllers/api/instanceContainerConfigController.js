/**
 * @file instanceContainerListController.js
 * @author Zishan Iqbal
 * @description This file includes the implementation of the instance-container-config end-point
 */

import async from 'async';

import BaseApiController from './baseApiController';
import ElementInstanceService from '../../services/elementInstanceService';
import AppUtils from '../../utils/appUtils';
import logger from '../../utils/winstonLogs';

/********************************************* EndPoints ******************************************************/

/****** Instance Container Config EndPoint (Post: /api/v2/instance/containerconfig/id/:ID/token/:Token) *******/
const containerConfigEndPoint = function(req, res){
  logger.info("Endpoint hit: "+ req.originalUrl);
	var params = {},
		instanceProps = {
			fogId: 'bodyParams.ID',
			setProperty: 'outputData'
		};

	params.bodyParams = req.params;
	logger.info("Parameters:" + JSON.stringify(params.bodyParams));

	async.waterfall([
		async.apply(BaseApiController.checkUserExistance, req, res),
		async.apply(ElementInstanceService.getElementInstancesByFogId, instanceProps, params),
		processOutput

	], function(err, result) {
		AppUtils.sendResponse(res, err, 'containerconfig', params.containerList, result);
	})
};

/*********************************** Extra Functions ***************************************************/
const processOutput = function (params, callback)
{
	var containerList = new Array();
	for (var i = 0; i < params.outputData.length; i++) {
		var container = params.outputData[i],
			containerId = container.uuid;

		if (container.isStreamViewer > 0) {
			containerId = "viewer";
		}
		if (container.isDebugConsole > 0) {
			containerId = "debug";
		}
		var containerUpdated = container.configLastUpdated,
			containerConfig = container.config;
			containerList.push({
				'id': containerId,
				'lastupdatedtimestamp': containerUpdated,
				'config': containerConfig
			});
		params.containerList = containerList;
	}
	callback (null, params);
}

export default {
	containerConfigEndPoint: containerConfigEndPoint
};