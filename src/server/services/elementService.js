import ElementManager from '../managers/elementManager';
import AppUtils from '../utils/appUtils';

const createElement = function(props, params, callback) {
  ElementManager
    .create(props.element)
    .then(AppUtils.onCreate.bind(null, params, props.setProperty, 'Unable to create Element object.', callback));
}

const deleteElementById = function(props, params, callback) {
  var elementId = AppUtils.getProperty(params, props.elementId);

  ElementManager
    .deleteElementById(elementId)
    .then(AppUtils.onDelete.bind(null, params, 'Unable to delete Element', callback));
}

const getElementDetails = function(props, params, callback) {
  var elementId = AppUtils.getProperty(params, props.elementId);

  ElementManager
    .getElementDetails(elementId)
    .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Unable to find Element details', callback));
}

const findElementAndRegistryById = function(props, params, callback) {
  var elementId = AppUtils.getProperty(params, props.elementId);

  ElementManager
    .findElementAndRegistryById(elementId)
    .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Unable to find Element object with id ' + elementId, callback));
}

const getElementCatalog = function(props, params, callback) {

  ElementManager
    .getElementCatalog()
    .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Error: Element catalog not found', callback));
}

const getElementForPublish = function(props, params, callback) {

  ElementManager
    .getElementForPublish()
    .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Error: Element catalog not found', callback));
}

const getNetworkElement = function(props, params, callback) {
  var networkElementId = AppUtils.getProperty(params, props.networkElementId);

  ElementManager
    .findElementById(networkElementId)
    .then(AppUtils.onFind.bind(null, params, props.setProperty, 'Unable to find Element object with id ' + networkElementId, callback));
}

const updateElement = function(props, params, callback) {
  var elementId = AppUtils.getProperty(params, props.elementId);

  ElementManager
    .updateElementById(elementId, props.updatedElement)
    .then(AppUtils.onUpdate.bind(null, params, 'Unable to update Element object', callback));
}

export default {
  createElement: createElement,
  deleteElementById: deleteElementById,
  findElementAndRegistryById: findElementAndRegistryById,
  getElementCatalog: getElementCatalog,
  getElementDetails: getElementDetails,
  getElementForPublish: getElementForPublish,
  getNetworkElement: getNetworkElement,
  updateElement: updateElement
};