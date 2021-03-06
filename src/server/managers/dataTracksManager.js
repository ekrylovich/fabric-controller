/**
 * @file dataTracksManager.js
 * @author Zishan Iqbal
 * @description This file includes the CURD operations for the dataTracks Model.
 */

import BaseManager from './../managers/baseManager';
import DataTracks from './../models/dataTracks';
import sequelize from './../utils/sequelize';


class DataTracksManager extends BaseManager {

  getEntity() {
    return DataTracks;
  }

  findByInstanceId(instanceId) {
    return DataTracks.findAll({
      where: {
        instanceId: instanceId
      },
      attributes: ['id', 'name', 'description']
    });
  }

  findById(trackId) {
    return DataTracks.findOne({
      where: {
        'id': trackId
      }
    });
  }

  getTracksByUserId(userId) {
    return DataTracks.findAll({
      where: {
        updatedBy: userId
      }
    });
  }

  deleteByTrackId(trackId) {
    return DataTracks.destroy({
      where: {
        id: trackId
      }
    });
  }

  updateById(id, data) {
    return DataTracks.update(data, {
      where: {
        id: id
      }
    });
  }

  updateByUserId(userId, data){
   return DataTracks.update(data, {
      where: {
        updatedBy: userId
      }
    });
  }

  // findContainerListByInstanceId(instanceId) {                                                         
  //   var instanceTrackingQuery = "SELECT i.*, t.is_activated FROM element_instance i LEFT JOIN \
  //   data_tracks t ON i.track_id = t.ID \
  //   WHERE i.iofog_uuid in (:instanceId) AND (i.track_id = 0 OR t.is_activated = 1)";

  //   return sequelize.query(instanceTrackingQuery, {
  //     replacements: {
  //       instanceId: instanceId
  //     },
  //     type: sequelize.QueryTypes.SELECT
  //   });
  // }
}

const instance = new DataTracksManager();
export default instance;