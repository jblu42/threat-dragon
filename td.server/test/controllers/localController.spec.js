import { expect } from 'chai';
import sinon from 'sinon';

import localController from '../../src/controllers/localController.js';
import repositories from '../../src/repositories/index.js';
import responseWrapper from '../../src/controllers/responseWrapper.js';
import { getMockRequest, getMockResponse } from '../mocks/express.mocks.js';

describe('controllers/localController.js', () => {
    let mockRequest, mockResponse;
    let sandbox;
    let mockLocalRepo;

    beforeEach(() => {
        sandbox = sinon.createSandbox();
        mockRequest = getMockRequest();
        mockResponse = getMockResponse();

        // Mock the local repository
        mockLocalRepo = {
            modelsAsync: sandbox.stub(),
            modelAsync: sandbox.stub(),
            createAsync: sandbox.stub(),
            updateAsync: sandbox.stub(),
            deleteAsync: sandbox.stub(),
            historyAsync: sandbox.stub(),
            versionAsync: sandbox.stub()
        };

        sandbox.stub(repositories, 'getSpecific').returns(mockLocalRepo);
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('models', () => {
        beforeEach(() => {
            sandbox.stub(responseWrapper, 'sendResponseAsync').callsFake(async (fn, req, res) => {
                const result = await fn();
                res.send(result);
            });
        });

        it('should return list of model names', async () => {
            mockLocalRepo.modelsAsync.resolves([[{ name: 'model1' }, { name: 'model2' }]]);

            await localController.models(mockRequest, mockResponse);

            expect(mockResponse.send).to.have.been.calledWith(['model1', 'model2']);
        });
    });

    describe('model', () => {
        beforeEach(() => {
            sandbox.stub(responseWrapper, 'sendResponseAsync').callsFake(async (fn, req, res) => {
                const result = await fn();
                res.send(result);
            });
            mockRequest.params.model = 'test-model';
        });

        it('should return parsed model content', async () => {
            const modelData = { summary: { title: 'Test' } };
            const base64Content = Buffer.from(JSON.stringify(modelData)).toString('base64');
            mockLocalRepo.modelAsync.resolves([{ content: base64Content }]);

            await localController.model(mockRequest, mockResponse);

            expect(mockResponse.send).to.have.been.calledWith(modelData);
        });
    });

    describe('create', () => {
        beforeEach(() => {
            mockRequest.params.model = 'new-model';
            mockRequest.body = { summary: { title: 'New Model' } };
        });

        it('should return 201 on successful creation', async () => {
            mockLocalRepo.createAsync.resolves({ success: true, model: 'new-model' });

            await localController.create(mockRequest, mockResponse);

            expect(mockResponse.status).to.have.been.calledWith(201);
        });

        it('should return 409 when model already exists', async () => {
            const error = new Error('Model already exists');
            error.statusCode = 409;
            mockLocalRepo.createAsync.rejects(error);

            await localController.create(mockRequest, mockResponse);

            expect(mockResponse.status).to.have.been.calledWith(409);
        });
    });

    describe('update', () => {
        beforeEach(() => {
            mockRequest.params.model = 'existing-model';
            mockRequest.body = { summary: { title: 'Updated Model' } };
        });

        it('should return success on update', async () => {
            mockLocalRepo.updateAsync.resolves({ success: true, model: 'existing-model' });

            await localController.update(mockRequest, mockResponse);

            expect(mockResponse.send).to.have.been.calledWith({ success: true, model: 'existing-model' });
        });

        it('should return 404 when model not found', async () => {
            const error = new Error('Model not found');
            error.statusCode = 404;
            mockLocalRepo.updateAsync.rejects(error);

            await localController.update(mockRequest, mockResponse);

            expect(mockResponse.status).to.have.been.calledWith(404);
        });
    });

    describe('deleteModel', () => {
        beforeEach(() => {
            mockRequest.params.model = 'model-to-delete';
        });

        it('should return success on delete', async () => {
            mockLocalRepo.deleteAsync.resolves({ success: true, model: 'model-to-delete' });

            await localController.deleteModel(mockRequest, mockResponse);

            expect(mockResponse.send).to.have.been.calledWith({ success: true, model: 'model-to-delete' });
        });

        it('should return 404 when model not found', async () => {
            const error = new Error('Model not found');
            error.statusCode = 404;
            mockLocalRepo.deleteAsync.rejects(error);

            await localController.deleteModel(mockRequest, mockResponse);

            expect(mockResponse.status).to.have.been.calledWith(404);
        });
    });

    describe('history', () => {
        beforeEach(() => {
            sandbox.stub(responseWrapper, 'sendResponseAsync').callsFake(async (fn, req, res) => {
                const result = await fn();
                res.send(result);
            });
            mockRequest.params.model = 'test-model';
        });

        it('should return version history', async () => {
            const history = [
                { hash: 'abc123', date: '2024-01-01', message: 'Update', author: 'test' }
            ];
            mockLocalRepo.historyAsync.resolves(history);

            await localController.history(mockRequest, mockResponse);

            expect(mockResponse.send).to.have.been.calledWith(history);
        });
    });

    describe('version', () => {
        beforeEach(() => {
            sandbox.stub(responseWrapper, 'sendResponseAsync').callsFake(async (fn, req, res) => {
                const result = await fn();
                res.send(result);
            });
            mockRequest.params.model = 'test-model';
            mockRequest.params.version = 'abc123';
        });

        it('should return specific version content', async () => {
            const versionData = { summary: { title: 'Old Version' } };
            mockLocalRepo.versionAsync.resolves(versionData);

            await localController.version(mockRequest, mockResponse);

            expect(mockResponse.send).to.have.been.calledWith(versionData);
        });
    });
});
