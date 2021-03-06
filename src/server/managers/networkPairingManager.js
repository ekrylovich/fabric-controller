/**
 * @file networkPairingManager.js
 * @author Zishan Iqbal
 * @description
 */

import NetworkPairing from './../models/networkPairing';
import BaseManager from './../managers/baseManager';
import sequelize from './../utils/sequelize';

class NetworkPairingManager extends BaseManager {

  getEntity() {
    return NetworkPairing;
  }

  findByElemen1PortIds(portIds) {
    return NetworkPairing.findAll({
      where: {
        'elemen1PortId': {
          $in: portIds
        }
      }
    });
  }

  findNetworkPairingElemenId1ByUuids(uuids) {
    const query = 'select distinct(elementId1) from network_pairing where networkElementId2 in (:uuids)';
    return sequelize.query(query, {
      replacements: {
        uuids: uuids
      },
      type: sequelize.QueryTypes.SELECT
    });
  }

  findNetworkPairingElemenId2ByUuids(uuids) {
    const query = 'select distinct(elementId2) from network_pairing where networkElementId1 in (:uuids)';
    return sequelize.query(query, {
      replacements: {
        uuids: uuids
      },
      type: sequelize.QueryTypes.SELECT
    });
  }

  findByFogAndElement(fogInstanceId1, fogInstanceId2, elementId1, elementId2) {
    return NetworkPairing.findOne({
      where: {
        'instanceId1': fogInstanceId1,
        'instanceId2': fogInstanceId2,
        'elementId1': elementId1,
        'elementId2': elementId2
      }
    });
  }

  findByElementIds(elementId) {
    return NetworkPairing.findAll({
      where: {
        $or: [{
          elementId1: elementId
        }, {
          elementId2: elementId
        }]
      }
    });
  }
  deleteByElementId1(elementId) {
    return NetworkPairing.destroy({
      where: {
          elementId1: elementId
      }
    });
  }

  deleteByElementId(elementId) {
    return NetworkPairing.destroy({
      where: {
        $or: [{
          elementId1: {
            $eq: elementId
          }
        }, {
          elementId2: {
            $eq: elementId
          }
        }]
      }
    });
  }

}

const instance = new NetworkPairingManager();
export default instance;