/**
 * @name localgitrepo
 * @description Local git repository for storing threat models with versioning
 */
import fs from 'fs';
import path from 'path';
import { simpleGit } from 'simple-git';

import env from '../env/Env.js';

/**
 * Gets the local storage path from environment or uses default
 * @returns {string}
 */
const getStoragePath = () => {
    return env.get().config.LOCAL_STORAGE_PATH || path.join(process.cwd(), 'threat-models');
};

/**
 * Ensures the storage directory exists and is a git repository
 * @returns {Promise<void>}
 */
const ensureRepoExists = async () => {
    const storagePath = getStoragePath();

    if (!fs.existsSync(storagePath)) {
        fs.mkdirSync(storagePath, { recursive: true });
    }

    const git = simpleGit(storagePath);
    const isRepo = await git.checkIsRepo();

    if (!isRepo) {
        await git.init();
        // Create initial commit
        const readmePath = path.join(storagePath, 'README.md');
        fs.writeFileSync(readmePath, '# Threat Dragon Models\n\nThis repository contains threat models managed by OWASP Threat Dragon.\n');
        await git.add('README.md');
        await git.commit('Initial commit - Threat Dragon local storage initialized');
    }
};

/**
 * Gets the git instance for the storage repository
 * @returns {SimpleGit}
 */
const getGit = () => {
    return simpleGit(getStoragePath());
};

/**
 * Gets the path for a model file
 * @param {string} modelName
 * @returns {string}
 */
const getModelPath = (modelName) => {
    return path.join(modelName, `${modelName}.json`);
};

/**
 * Gets the full filesystem path for a model
 * @param {string} modelName
 * @returns {string}
 */
const getFullModelPath = (modelName) => {
    return path.join(getStoragePath(), getModelPath(modelName));
};

/**
 * Lists all threat models in the repository
 * @returns {Promise<Array>}
 */
const modelsAsync = async () => {
    await ensureRepoExists();
    const storagePath = getStoragePath();

    const entries = fs.readdirSync(storagePath, { withFileTypes: true });
    const models = [];

    for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
            const modelFile = path.join(storagePath, entry.name, `${entry.name}.json`);
            if (fs.existsSync(modelFile)) {
                models.push({ name: entry.name });
            }
        }
    }

    return [models];
};

/**
 * Gets a specific threat model
 * @param {Object} modelInfo - Contains model name
 * @returns {Promise<Array>}
 */
const modelAsync = async (modelInfo) => {
    await ensureRepoExists();
    const modelPath = getFullModelPath(modelInfo.model);

    if (!fs.existsSync(modelPath)) {
        const error = new Error(`Model not found: ${modelInfo.model}`);
        error.statusCode = 404;
        throw error;
    }

    const content = fs.readFileSync(modelPath, 'utf8');
    return [{ content: Buffer.from(content).toString('base64') }];
};

/**
 * Creates a new threat model
 * @param {Object} modelInfo - Contains model name and body
 * @returns {Promise<Object>}
 */
const createAsync = async (modelInfo) => {
    await ensureRepoExists();
    const modelDir = path.join(getStoragePath(), modelInfo.model);
    const modelPath = getFullModelPath(modelInfo.model);

    if (fs.existsSync(modelPath)) {
        const error = new Error(`Model already exists: ${modelInfo.model}`);
        error.statusCode = 409;
        throw error;
    }

    // Create model directory
    if (!fs.existsSync(modelDir)) {
        fs.mkdirSync(modelDir, { recursive: true });
    }

    // Write model file
    const content = JSON.stringify(modelInfo.body, null, 2);
    fs.writeFileSync(modelPath, content, 'utf8');

    // Git commit
    const git = getGit();
    await git.add(getModelPath(modelInfo.model));
    await git.commit(`Created threat model: ${modelInfo.model}`);

    return { success: true, model: modelInfo.model };
};

/**
 * Updates an existing threat model
 * @param {Object} modelInfo - Contains model name and body
 * @returns {Promise<Object>}
 */
const updateAsync = async (modelInfo) => {
    await ensureRepoExists();
    const modelPath = getFullModelPath(modelInfo.model);

    if (!fs.existsSync(modelPath)) {
        const error = new Error(`Model not found: ${modelInfo.model}`);
        error.statusCode = 404;
        throw error;
    }

    // Write updated model
    const content = JSON.stringify(modelInfo.body, null, 2);
    fs.writeFileSync(modelPath, content, 'utf8');

    // Git commit
    const git = getGit();
    await git.add(getModelPath(modelInfo.model));
    await git.commit(`Updated threat model: ${modelInfo.model}`);

    return { success: true, model: modelInfo.model };
};

/**
 * Deletes a threat model
 * @param {Object} modelInfo - Contains model name
 * @returns {Promise<Object>}
 */
const deleteAsync = async (modelInfo) => {
    await ensureRepoExists();
    const modelDir = path.join(getStoragePath(), modelInfo.model);
    const modelPath = getFullModelPath(modelInfo.model);

    if (!fs.existsSync(modelPath)) {
        const error = new Error(`Model not found: ${modelInfo.model}`);
        error.statusCode = 404;
        throw error;
    }

    // Remove model file and directory
    fs.unlinkSync(modelPath);
    if (fs.readdirSync(modelDir).length === 0) {
        fs.rmdirSync(modelDir);
    }

    // Git commit
    const git = getGit();
    await git.add(getModelPath(modelInfo.model));
    await git.commit(`Deleted threat model: ${modelInfo.model}`);

    return { success: true, model: modelInfo.model };
};

/**
 * Gets the version history for a threat model
 * @param {Object} modelInfo - Contains model name
 * @returns {Promise<Array>}
 */
const historyAsync = async (modelInfo) => {
    await ensureRepoExists();
    const modelPath = getModelPath(modelInfo.model);
    const fullPath = getFullModelPath(modelInfo.model);

    if (!fs.existsSync(fullPath)) {
        const error = new Error(`Model not found: ${modelInfo.model}`);
        error.statusCode = 404;
        throw error;
    }

    const git = getGit();
    const log = await git.log({ file: modelPath });

    return log.all.map(entry => ({
        hash: entry.hash,
        date: entry.date,
        message: entry.message,
        author: entry.author_name
    }));
};

/**
 * Gets a specific version of a threat model
 * @param {Object} modelInfo - Contains model name and version hash
 * @returns {Promise<Object>}
 */
const versionAsync = async (modelInfo) => {
    await ensureRepoExists();
    const modelPath = getModelPath(modelInfo.model);
    const fullPath = getFullModelPath(modelInfo.model);

    if (!fs.existsSync(fullPath)) {
        const error = new Error(`Model not found: ${modelInfo.model}`);
        error.statusCode = 404;
        throw error;
    }

    const git = getGit();
    const content = await git.show([`${modelInfo.version}:${modelPath}`]);

    return JSON.parse(content);
};

/**
 * Checks if local storage is configured and available
 * @returns {boolean}
 */
const isConfigured = () => {
    return true; // Local storage is always available
};

export default {
    modelsAsync,
    modelAsync,
    createAsync,
    updateAsync,
    deleteAsync,
    historyAsync,
    versionAsync,
    isConfigured,
    ensureRepoExists,
    getStoragePath
};
