import FabricUserManager from '../managers/fabricUserManager';
import AppUtils from '../utils/appUtils';

/**
 * @desc - this function finds the element instance which was changed
 */
const createFabricUser = function(params, callback) {
  FabricUserManager
    .create(params.userId, params.fabricInstance.uuid)
    .then(AppUtils.onCreate.bind(null, params, null, 'Unable to create user for Fabric Instance', callback));
}



/**
 * @desc - if the fabricType matches the type in the database this function
 * retrieves the data for the user who owns this fabric and forwards to
 * generateAccessToken function.
 * @param - fabricType, fabricData, callback
 * @return - none
 */
const getFabricUser= function(props,params,callback) {

  if(params.bodyParams.fabricType == params.fabric.typeKey) {
    FabricUserManager
    .findByInstanceId(params.fabric.uuid)
    .then(AppUtils.onFind.bind(null,params, props.setProperty, props.error, callback));
	}
  else
  {
    console.log('****************');
    console.log(params.bodyParams.fabricType);
    console.log(params.fabric.fabricType);

  }
}


export default {
  createFabricUser: createFabricUser,
  getFabricUser: getFabricUser
  

};