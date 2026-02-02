/**
 * @name localController
 * @description Controller for local git-based threat model storage
 */
import loggerHelper from '../helpers/logger.helper.js';
import repositories from '../repositories/index.js';
import responseWrapper from './responseWrapper.js';
import { serverError } from './errors.js';

const logger = loggerHelper.get('controllers/localController.js');

/**
 * Lists all threat models in local storage
 */
const models = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const localRepo = repositories.getSpecific('localgitrepo');
    logger.debug('API local models request');

    const modelsResp = await localRepo.modelsAsync();
    return modelsResp[0].map((x) => x.name);
}, req, res, logger);

/**
 * Gets a specific threat model
 */
const model = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const localRepo = repositories.getSpecific('localgitrepo');
    const modelInfo = {
        model: req.params.model
    };
    logger.debug(`API local model request: ${modelInfo.model}`);

    const modelResp = await localRepo.modelAsync(modelInfo);
    return JSON.parse(Buffer.from(modelResp[0].content, 'base64').toString('utf8'));
}, req, res, logger);

/**
 * Creates a new threat model
 */
const create = async (req, res) => {
    const localRepo = repositories.getSpecific('localgitrepo');
    const modelBody = {
        model: req.params.model,
        body: req.body
    };
    logger.debug(`API local create request: ${modelBody.model}`);

    try {
        const createResp = await localRepo.createAsync(modelBody);
        return res.status(201).send(createResp);
    } catch (err) {
        logger.error(err);
        if (err.statusCode === 409) {
            return res.status(409).send({ error: err.message });
        }
        return serverError('Error creating model', res, logger);
    }
};

/**
 * Updates an existing threat model
 */
const update = async (req, res) => {
    const localRepo = repositories.getSpecific('localgitrepo');
    const modelBody = {
        model: req.params.model,
        body: req.body
    };
    logger.debug(`API local update request: ${modelBody.model}`);

    try {
        const updateResp = await localRepo.updateAsync(modelBody);
        return res.send(updateResp);
    } catch (err) {
        logger.error(err);
        if (err.statusCode === 404) {
            return res.status(404).send({ error: err.message });
        }
        return serverError('Error updating model', res, logger);
    }
};

/**
 * Deletes a threat model (disabled by default for security)
 */
const deleteModel = async (req, res) => {
    const localRepo = repositories.getSpecific('localgitrepo');
    const modelInfo = {
        model: req.params.model
    };
    logger.debug(`API local delete request: ${modelInfo.model}`);

    try {
        const deleteResp = await localRepo.deleteAsync(modelInfo);
        return res.send(deleteResp);
    } catch (err) {
        logger.error(err);
        if (err.statusCode === 404) {
            return res.status(404).send({ error: err.message });
        }
        return serverError('Error deleting model', res, logger);
    }
};

/**
 * Gets the version history for a threat model
 */
const history = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const localRepo = repositories.getSpecific('localgitrepo');
    const modelInfo = {
        model: req.params.model
    };
    logger.debug(`API local history request: ${modelInfo.model}`);

    return await localRepo.historyAsync(modelInfo);
}, req, res, logger);

/**
 * Gets a specific version of a threat model
 */
const version = (req, res) => responseWrapper.sendResponseAsync(async () => {
    const localRepo = repositories.getSpecific('localgitrepo');
    const modelInfo = {
        model: req.params.model,
        version: req.params.version
    };
    logger.debug(`API local version request: ${modelInfo.model} @ ${modelInfo.version}`);

    return await localRepo.versionAsync(modelInfo);
}, req, res, logger);

export default {
    models,
    model,
    create,
    update,
    deleteModel,
    history,
    version
};
