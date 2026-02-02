import { localServerRoutes } from '@/router/localServer.js';

describe('routes/localServer.js', () => {
    describe('Models list', () => {
        let route;

        beforeEach(() => {
            route = localServerRoutes
                .find(x => x.name === 'localServerModels');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/localServer/models');
        });

        it('uses the ModelSelect view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('LocalServerModelSelect');
        });
    });

    describe('Threat model', () => {
        let route;

        beforeEach(() => {
            route = localServerRoutes
                .find(x => x.name === 'localServerThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/localServer/:threatmodel');
        });

        it('uses the ThreatModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ThreatModel');
        });
    });

    describe('Threat model edit', () => {
        let route;

        beforeEach(() => {
            route = localServerRoutes
                .find(x => x.name === 'localServerThreatModelEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/localServer/:threatmodel/edit');
        });

        it('uses the ThreatModelEdit view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ThreatModelEdit');
        });
    });

    describe('Diagram edit', () => {
        let route;

        beforeEach(() => {
            route = localServerRoutes
                .find(x => x.name === 'localServerDiagramEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/localServer/:threatmodel/edit/:diagram');
        });

        it('uses the DiagramEdit view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('DiagramEdit');
        });
    });

    describe('New threat model', () => {
        let route;

        beforeEach(() => {
            route = localServerRoutes
                .find(x => x.name === 'localServerNewThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/localServer/threatmodel/new');
        });

        it('uses the NewThreatModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('NewThreatModel');
        });
    });

    describe('Report model', () => {
        let route;

        beforeEach(() => {
            route = localServerRoutes
                .find(x => x.name === 'localServerReport');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/localServer/:threatmodel/report');
        });

        it('uses the ReportModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ReportModel');
        });
    });

    describe('Version history', () => {
        let route;

        beforeEach(() => {
            route = localServerRoutes
                .find(x => x.name === 'localServerHistory');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/localServer/:threatmodel/history');
        });

        it('uses the ModelHistory view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('LocalServerModelHistory');
        });
    });
});
