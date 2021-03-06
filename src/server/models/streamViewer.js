/**
 * @file streamViewer.js
 * @author Zishan Iqbal
 * @description This file includes a stream_viewer model used by sequalize for ORM;
 */

import Sequelize from 'sequelize';
import sequelize from './../utils/sequelize';
import Fog from './fog';

const StreamViewer = sequelize.define('stream_viewer', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'ID'
  },
  version: {
    type: Sequelize.BIGINT,
    field: 'version'
  },
  apiBaseUrl: {
    type: Sequelize.TEXT,
    field: 'api_base_url'
  },
  accessToken: {
    type: Sequelize.TEXT,
    field: 'access_token'
  },
  elementId:{
    type: Sequelize.TEXT,
    field: 'element_id'
  },
}, {
  // don't add the timestamp attributes (updatedAt, createdAt)
  timestamps: false,
  // disable the modification of table names
  freezeTableName: true,
  // don't use camelcase for automatically added attributes but underscore style
  // so updatedAt will be updated_at
  underscored: true
});

StreamViewer.belongsTo(Fog, {
  foreignKey: 'iofog_uuid'
});

export default StreamViewer;