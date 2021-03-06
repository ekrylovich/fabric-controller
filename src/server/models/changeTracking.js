/**
 * @file changeTracking.js
 * @author Zishan Iqbal
 * @description This file includes a iofog_change_tracking model used by sequalize for ORM;
 */

import Sequelize from 'sequelize';
import sequelize from './../utils/sequelize';

import Fog from './fog';
import Registry from './registry';

const ChangeTracking = sequelize.define('iofog_change_tracking', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID'
  },
  containerConfig: {
    type: Sequelize.BIGINT,
    field: 'container_config'
  },
  containerList: {
    type: Sequelize.BIGINT,
    field: 'container_list'
  },
  config: {
    type: Sequelize.BIGINT,
    field: 'config'
  },
  routing: {
    type: Sequelize.BIGINT,
    field: 'routing'
  },
  registries: {
    type: Sequelize.BIGINT,
    field: 'registries'
  }
}, {
  // don't add the timestamp attributes (updatedAt, createdAt)
  timestamps: false,
  // disable the modification of table names
  freezeTableName: true,
  // don't use camelcase for automatically added attributes but underscore style
  // so updatedAt will be updated_at
  underscored: true
});

ChangeTracking.belongsTo(Fog, {
  foreignKey: 'iofog_uuid'
});
export default ChangeTracking;