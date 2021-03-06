/**
 * @file fogManager.js
 * @author Zishan Iqbal
 * @description This file includes the CURD operations for the fog Model.
 */

import Fog from './../models/fog';
import BaseManager from './../managers/baseManager';
import sequelize from './../utils/sequelize';

class FogManager extends BaseManager {
  getEntity() {
      return Fog;
    }
    /**
     * @desc - finds the fog based on the instanceId
     * @param Integer - instanceId
     * @return JSON - returns a JSON object of fog
     */
  findByInstanceId(instanceId) {
      return Fog.find({
        where: {
          uuid: instanceId
        }
      });
    }
    /**
     * @desc - updates the config data in the fog with the id that matches the instanceId
     * @param Integer, JSON object - instanceId, config
     * @return Integer - returns the number of rows updated
     */
  updateFogConfig(instanceId, config) {
      return Fog.update(config, {
        where: {
          uuid: instanceId
        }
      });
    }

    /**
     * @desc - creates a new Iofog with config data
     * @param JSON object - config
     * @return Integer - returns the number of rows created
     */
  createFog(config) {
      return Fog.create(config);
    }
    /**
     * @desc - finds all the fog UUID and Typkey and sends them
     * back in order of TypeKey in the form of JSON objects
     * @param - none
     * @return Array of JSON - returns an Array containing JSON objects
     */
  getFogList() {
      var fogListQuery = "SELECT UUID, typeKey from iofogs ORDER BY TypeKey";
      return sequelize.query(fogListQuery, { type: sequelize.QueryTypes.SELECT });
    }
    /**
     * @desc - deletes the fog based on the instanceId
     * @param String - instanceId
     * @return  Integer - returns the number of rows deleted
     */
  deleteByInstanceId(instanceId) {
    return Fog.destroy({
      where: {
        uuid: instanceId
      }
    });
  }

  findByUserId(userId){
    var instanceQuery = 'SELECT i.*, t.id as typeId, t.name as typeName, t.image as typeImage, t.description as typeDescription FROM iofogs i JOIN iofog_type t ON (i.typeKey= t.ID)'+ 
    ' JOIN iofog_users u ON (i.UUID = u.fog_id) WHERE u.user_id ='+userId;

    return sequelize.query(instanceQuery, { type: sequelize.QueryTypes.SELECT });
  }

  getFogInstanceDetails(instanceId){
    var instanceQuery = 'SELECT i.*, t.name as typeName, t.image as typeImage, t.description as typeDescription '+
      'FROM iofogs i INNER JOIN iofog_type t ON i.typeKey = t.ID WHERE i.UUID in (:instanceId)';

    return sequelize.query(instanceQuery, {
      replacements: {
        instanceId: instanceId
      },
      type: sequelize.QueryTypes.SELECT 
    });
  }
}

const instance = new FogManager();
export default instance;