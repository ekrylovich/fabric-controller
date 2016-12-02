import AppUtils from '../utils/appUtils';
import Constants from '../constants.js';
import FabricAccessTokenManager from '../managers/fabricAccessTokenManager';


/**
 * @desc - this function checks if an accessToken is present for a user, if yes then
 * removes it and then calls the saveUserToken function with a new generated token as
 * a parameter.
 * @param - fabricUser, fabricData, callback
 * @return - none
 */
function generateAccessToken(params, callback) {
  var accessToken,
    tokenExpiryTime;

  accessToken =AppUtils.generateAccessToken();

  tokenExpiryTime = new Date();
  tokenExpiryTime.setDate(tokenExpiryTime.getDate() + Constants.ACCESS_TOKEN_EXPIRE_PERIOD);

  params.tokenExpiryTime=tokenExpiryTime;

  FabricAccessTokenManager
    .getByToken(accessToken)
    .then(function(tokenData){
      if (tokenData && tokenData != " ") {
        accessToken = AppUtils.generateAccessToken();
        params.accessToken = accessToken;
      }else{
        params.accessToken = accessToken;
      }
      callback(null, params);
    });
}


const deleteAccessToken= function(props, params, callback) {
  FabricAccessTokenManager
     .deleteByUserId(params.fabricUser.user_id)
     .then(AppUtils.onDelete.bind(null,params, props.error, callback));
}

/**
 * @desc - this function inserts a new token against a user_Id
 * @param - fabricUser, fabricData, tokenExpiryTime, accessToken, callback
 * @return - none
 */

const saveUserToken=function (props, params, callback) {
  FabricAccessTokenManager
  .saveUserToken(params.fabricUser.user_id, params.tokenExpiryTime, params.accessToken)
  .then(AppUtils.onCreate.bind(null, params, props.setProperty, props.error, callback));
}

export default {
  generateAccessToken: generateAccessToken,
  deleteAccessToken: deleteAccessToken,
  saveUserToken: saveUserToken
};
