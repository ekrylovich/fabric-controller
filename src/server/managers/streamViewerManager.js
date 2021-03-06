/**
 * @file streamViewerManager.js
 * @author Zishan Iqbal
 * @description This file includes the CURD operations for the streamViewer Model.
 */

import StreamViewer from './../models/streamViewer';
import BaseManager from './../managers/baseManager';

class StreamViewerManager extends BaseManager {

	getEntity() {
			return StreamViewer;
		}
		/**
		 * @desc - finds the StreamViewer based on the instanceId
		 * @param Integer - instanceId
		 * @return JSON - returns a JSON object of streamViewer
		 */
	findByInstanceId(instanceId) {
			return StreamViewer.find({
				where: {
					iofog_uuid: instanceId
				}
			});
		}
		/**
		 * @desc - deletes the streamViewer based on the instanceId
		 * @param String - instanceId
		 * @return  Integer - returns the number of rows deleted
		 */
	deleteByInstanceId(instanceId) {
		return StreamViewer.destroy({
			where: {
				iofog_uuid: instanceId
			}
		});
	}
}

const instance = new StreamViewerManager();
export default instance;