import { expect } from 'chai';
import sinon from 'sinon';
import fs from 'fs';
import path from 'path';

import localgitrepo from '../../src/repositories/localgitrepo.js';
import env from '../../src/env/Env.js';

describe('repositories/localgitrepo.js', () => {
    let sandbox;
    let mockGit;
    let fsStubs;

    beforeEach(() => {
        sandbox = sinon.createSandbox();

        // Mock environment
        sandbox.stub(env, 'get').returns({
            config: {
                LOCAL_STORAGE_PATH: '/tmp/test-threat-models'
            }
        });

        // Mock fs operations
        fsStubs = {
            existsSync: sandbox.stub(fs, 'existsSync'),
            mkdirSync: sandbox.stub(fs, 'mkdirSync'),
            readdirSync: sandbox.stub(fs, 'readdirSync'),
            readFileSync: sandbox.stub(fs, 'readFileSync'),
            writeFileSync: sandbox.stub(fs, 'writeFileSync'),
            unlinkSync: sandbox.stub(fs, 'unlinkSync'),
            rmdirSync: sandbox.stub(fs, 'rmdirSync')
        };
    });

    afterEach(() => {
        sandbox.restore();
    });

    describe('getStoragePath', () => {
        it('should return configured storage path', () => {
            const storagePath = localgitrepo.getStoragePath();
            expect(storagePath).to.equal('/tmp/test-threat-models');
        });

        it('should return default path when not configured', () => {
            env.get.restore();
            sandbox.stub(env, 'get').returns({ config: {} });
            const storagePath = localgitrepo.getStoragePath();
            expect(storagePath).to.include('threat-models');
        });
    });

    describe('isConfigured', () => {
        it('should always return true', () => {
            expect(localgitrepo.isConfigured()).to.be.true;
        });
    });

    describe('modelsAsync', () => {
        it('should return list of models from directories', async () => {
            fsStubs.existsSync.returns(true);
            fsStubs.readdirSync
                .onFirstCall().returns([
                    { name: 'model1', isDirectory: () => true },
                    { name: 'model2', isDirectory: () => true },
                    { name: '.git', isDirectory: () => true },
                    { name: 'file.txt', isDirectory: () => false }
                ]);

            // Model files exist
            fsStubs.existsSync.withArgs(sinon.match(/model1\.json$/)).returns(true);
            fsStubs.existsSync.withArgs(sinon.match(/model2\.json$/)).returns(true);

            const result = await localgitrepo.modelsAsync();

            expect(result[0]).to.have.lengthOf(2);
            expect(result[0]).to.deep.include({ name: 'model1' });
            expect(result[0]).to.deep.include({ name: 'model2' });
        });

        it('should exclude directories without model files', async () => {
            fsStubs.existsSync.returns(true);
            fsStubs.readdirSync.returns([
                { name: 'model1', isDirectory: () => true }
            ]);
            fsStubs.existsSync.withArgs(sinon.match(/model1\.json$/)).returns(false);

            const result = await localgitrepo.modelsAsync();

            expect(result[0]).to.have.lengthOf(0);
        });
    });

    describe('modelAsync', () => {
        it('should return model content as base64', async () => {
            const modelContent = JSON.stringify({ title: 'Test Model' });
            fsStubs.existsSync.returns(true);
            fsStubs.readFileSync.returns(modelContent);

            const result = await localgitrepo.modelAsync({ model: 'test-model' });

            expect(result[0].content).to.equal(Buffer.from(modelContent).toString('base64'));
        });

        it('should throw 404 error when model not found', async () => {
            fsStubs.existsSync.returns(false);

            try {
                await localgitrepo.modelAsync({ model: 'nonexistent' });
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.statusCode).to.equal(404);
                expect(error.message).to.include('Model not found');
            }
        });
    });

    describe('createAsync', () => {
        it('should throw 409 error when model already exists', async () => {
            fsStubs.existsSync.returns(true);

            try {
                await localgitrepo.createAsync({ model: 'existing-model', body: {} });
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.statusCode).to.equal(409);
                expect(error.message).to.include('already exists');
            }
        });
    });

    describe('updateAsync', () => {
        it('should throw 404 error when model not found', async () => {
            fsStubs.existsSync.returns(false);

            try {
                await localgitrepo.updateAsync({ model: 'nonexistent', body: {} });
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.statusCode).to.equal(404);
                expect(error.message).to.include('Model not found');
            }
        });
    });

    describe('deleteAsync', () => {
        it('should throw 404 error when model not found', async () => {
            fsStubs.existsSync.returns(false);

            try {
                await localgitrepo.deleteAsync({ model: 'nonexistent' });
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.statusCode).to.equal(404);
                expect(error.message).to.include('Model not found');
            }
        });
    });

    describe('historyAsync', () => {
        it('should throw 404 error when model not found', async () => {
            fsStubs.existsSync.returns(false);

            try {
                await localgitrepo.historyAsync({ model: 'nonexistent' });
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.statusCode).to.equal(404);
                expect(error.message).to.include('Model not found');
            }
        });
    });

    describe('versionAsync', () => {
        it('should throw 404 error when model not found', async () => {
            fsStubs.existsSync.returns(false);

            try {
                await localgitrepo.versionAsync({ model: 'nonexistent', version: 'abc123' });
                expect.fail('Should have thrown an error');
            } catch (error) {
                expect(error.statusCode).to.equal(404);
                expect(error.message).to.include('Model not found');
            }
        });
    });
});
