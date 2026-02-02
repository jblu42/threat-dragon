import localServer from '@/service/provider/localServer.provider.js';

describe('service/localServer.provider.js', () => {
    describe('getDashboardActions', () => {

        describe('open existing', () => {
            let action;

            beforeEach(() => {
                action = localServer.getDashboardActions().find(x => x.key === 'openExisting');
            });

            it('links to the models page', () => {
                expect(action.to).toEqual('/localServer/models');
            });

            it('uses the folder-open icon', () => {
                expect(action.icon).toEqual('folder-open');
            });
        });

        describe('new', () => {
            let action;

            beforeEach(() => {
                action = localServer.getDashboardActions().find(x => x.key === 'createNew');
            });

            it('links to the create page', () => {
                expect(action.to).toEqual('/localServer/threatmodel/new');
            });

            it('uses the plus icon', () => {
                expect(action.icon).toEqual('plus');
            });
        });

        describe('demo', () => {
            let action;

            beforeEach(() => {
                action = localServer.getDashboardActions().find(x => x.key === 'readDemo');
            });

            it('links to the demo select page', () => {
                expect(action.to).toEqual('/demo/select');
            });

            it('uses the cloud download icon', () => {
                expect(action.icon).toEqual('cloud-download-alt');
            });
        });
    });
});
