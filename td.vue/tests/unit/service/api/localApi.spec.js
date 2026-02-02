import api from '@/service/api/api.js';
import localApi from '@/service/api/localApi.js';

describe('service/localApi.js', () => {
    beforeEach(() => {
        jest.spyOn(api, 'getAsync').mockImplementation(() => {});
        jest.spyOn(api, 'postAsync').mockImplementation(() => {});
        jest.spyOn(api, 'putAsync').mockImplementation(() => {});
    });

    describe('modelsAsync', () => {
        beforeEach(async () => {
            await localApi.modelsAsync();
        });

        it('calls the models endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/local/models');
        });
    });

    describe('modelAsync', () => {
        const modelName = 'test-model';

        beforeEach(async () => {
            await localApi.modelAsync(modelName);
        });

        it('calls the model data endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/local/test-model/data');
        });
    });

    describe('modelAsync with special characters', () => {
        const modelName = 'test model&name?';

        beforeEach(async () => {
            await localApi.modelAsync(modelName);
        });

        it('encodes the model name', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/local/test%20model%26name%3F/data');
        });
    });

    describe('createAsync', () => {
        const modelName = 'new-model';
        const threatModel = { summary: { title: 'New Model' } };

        beforeEach(async () => {
            await localApi.createAsync(modelName, threatModel);
        });

        it('calls the create endpoint', () => {
            expect(api.postAsync).toHaveBeenCalledWith('/api/local/new-model/create', threatModel);
        });
    });

    describe('updateAsync', () => {
        const modelName = 'existing-model';
        const threatModel = { summary: { title: 'Updated Model' } };

        beforeEach(async () => {
            await localApi.updateAsync(modelName, threatModel);
        });

        it('calls the update endpoint', () => {
            expect(api.putAsync).toHaveBeenCalledWith('/api/local/existing-model/update', threatModel);
        });
    });

    describe('historyAsync', () => {
        const modelName = 'test-model';

        beforeEach(async () => {
            await localApi.historyAsync(modelName);
        });

        it('calls the history endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/local/test-model/history');
        });
    });

    describe('versionAsync', () => {
        const modelName = 'test-model';
        const versionHash = 'abc123def';

        beforeEach(async () => {
            await localApi.versionAsync(modelName, versionHash);
        });

        it('calls the version endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/local/test-model/version/abc123def');
        });
    });
});
