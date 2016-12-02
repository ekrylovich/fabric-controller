import FabricProvisionKeyManager from '../managers/fabricProvisionKeyManager';
import AppUtils from '../utils/appUtils';

/**
 * @desc - if the provision key exists in the database forwards to getFabric function
 * @param - provisionKey, fabricType, callback
 * @return - none
 */
const getFabricProvisionKey = function(props,params,callback) {
  FabricProvisionKeyManager
   .getByProvisionKey(params.bodyParams.provisionKey)
   .then(AppUtils.onFind.bind(null, params, props.setProperty, props.error, callback));
} 

const newFabricProvisionKey = function(props,params,callback) {
 FabricProvisionKeyManager
 .createProvisionKey(params)
 .then(AppUtils.onCreate.bind(null, params, props.setProperty, props.error, callback));
}

/**
 * @desc - this function deletes the provision key entry in all cases from the database
 * @param - provisionKey
 * @return - none
 */
const deleteKey =function (params) {
   FabricProvisionKeyManager
    .deleteByProvisionKey(params.bodyParams.provisionKey);
//    .then(onDeleteProvisionKey(null, params,'Provision Key Not Deleted'));

}

const deleteByFabricInstance=function(params, callback) {
  FabricProvisionKeyManager
    .deleteByInstanceId(params.bodyParams.fabricInstanceId)
    .then(AppUtils.onDelete.bind(null, params, 'Error: No such provisionKey found', callback));

}



export default {
  newFabricProvisionKey: newFabricProvisionKey,
  getFabricProvisionKey: getFabricProvisionKey,
  deleteByFabricInstance: deleteByFabricInstance,
  deleteKey:deleteKey
};