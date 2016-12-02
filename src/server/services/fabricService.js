import FabricManager from '../managers/fabricManager';
import AppUtils from '../utils/appUtils';


const getFogInstance = function(props, params, callback) {
  var fabricId = AppUtils.getProperty(params, props.fogId);
    FabricManager
     .findByInstanceId(fabricId)
     .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Cannot find Fog Instance', callback));
  }

/**
 * @desc - this function finds the element instance which was changed
 */
const createFabricInstance = function(params, callback) {
  var fabricType = params.bodyParams.FabricType,
    instanceId = AppUtils.generateRandomString(32);

  var config = {
    uuid: instanceId,
    typeKey: fabricType
  };

  // This function creates a new fabric and inserts its data
  // in to the database, along with the default values
  FabricManager
    .createFabric(config)
    .then(AppUtils.onCreate.bind(null, params, 'fabricInstance', 'Unable to create Fabric Instance', callback));
}


/**
   * @desc - if fabric are found, this function sends its Configuration data back to the client
   * @param Integer - instanceId
   * @return - returns an appropriate response to the client
   */
const findByInstance = function(props, params, callback) {
  FabricManager
  .findByInstanceId(params.ID)
  .then(AppUtils.onFind.bind(null, params, props.setProperty, props.error, callback));
}

/**
 * @desc - updates the fabric with the fabricConfig based on the fabrics instanceId
 * @param - instanceId, fabricConfig, callback
 * @return - none
 */
const updateFabrics=function(params, callback) {
  FabricManager.updateFabricConfig(params.ID, params.bodyParams)
    .then(AppUtils.onUpdate.bind(null, params, 'No Fabric Instance updated', callback));
}



export default {
  getFogInstance: getFogInstance,
  createFabricInstance: createFabricInstance,
  findByInstance: findByInstance,
  updateFabrics: updateFabrics
};