/**
 * @name localApi
 * @description API service for local git-based threat model storage
 */
import api from './api.js';

const resource = '/api/local';

/**
 * Gets all threat models from local storage
 * @returns {Promise}
 */
const modelsAsync = () => {
    return api.getAsync(`${resource}/models`);
};

/**
 * Gets a specific threat model from local storage
 * @param {String} modelName
 * @returns {Promise}
 */
const modelAsync = (modelName) => {
    const encodedModel = encodeURIComponent(modelName);
    return api.getAsync(`${resource}/${encodedModel}/data`);
};

/**
 * Creates a new threat model in local storage
 * @param {String} modelName
 * @param {Object} threatModel
 * @returns {Promise}
 */
const createAsync = (modelName, threatModel) => {
    const encodedModel = encodeURIComponent(modelName);
    return api.postAsync(`${resource}/${encodedModel}/create`, threatModel);
};

/**
 * Updates an existing threat model in local storage
 * @param {String} modelName
 * @param {Object} threatModel
 * @returns {Promise}
 */
const updateAsync = (modelName, threatModel) => {
    const encodedModel = encodeURIComponent(modelName);
    return api.putAsync(`${resource}/${encodedModel}/update`, threatModel);
};

/**
 * Gets the version history for a threat model
 * @param {String} modelName
 * @returns {Promise}
 */
const historyAsync = (modelName) => {
    const encodedModel = encodeURIComponent(modelName);
    return api.getAsync(`${resource}/${encodedModel}/history`);
};

/**
 * Gets a specific version of a threat model
 * @param {String} modelName
 * @param {String} versionHash
 * @returns {Promise}
 */
const versionAsync = (modelName, versionHash) => {
    const encodedModel = encodeURIComponent(modelName);
    const encodedVersion = encodeURIComponent(versionHash);
    return api.getAsync(`${resource}/${encodedModel}/version/${encodedVersion}`);
};

export default {
    modelsAsync,
    modelAsync,
    createAsync,
    updateAsync,
    historyAsync,
    versionAsync
};
