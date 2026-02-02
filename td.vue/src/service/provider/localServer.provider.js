/**
 * @name localServerProvider
 * @description Provider configuration for local git-based server storage
 */
import { providerTypes } from './providerTypes.js';

const providerType = providerTypes.localServer;

/**
 * Gets the dashboard actions for the local server provider
 * @returns {Array}
 */
const getDashboardActions = () => ([
    {
        to: `/${providerType}/models`,
        key: 'openExisting',
        icon: 'folder-open'
    },
    {
        to: `/${providerType}/threatmodel/new`,
        key: 'createNew',
        icon: 'plus'
    },
    {
        to: '/demo/select',
        key: 'readDemo',
        icon: 'cloud-download-alt'
    }
]);

export default {
    getDashboardActions
};
