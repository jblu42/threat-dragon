/**
 * @name localServerRoutes
 * @description Routes for local git-based server storage
 */
import { providerTypes } from '@/service/provider/providerTypes';

const providerType = providerTypes.localServer;

export const localServerRoutes = [
    {
        path: `/${providerType}/models`,
        name: `${providerType}Models`,
        component: () => import(/* webpackChunkName: "local-server-models" */ '../views/localServer/ModelSelect.vue')
    },
    {
        path: `/${providerType}/threatmodel/new`,
        name: `${providerType}NewThreatModel`,
        component: () => import(/* webpackChunkName: "new-threatmodel" */ '../views/NewThreatModel.vue')
    },
    {
        path: `/${providerType}/:threatmodel`,
        name: `${providerType}ThreatModel`,
        component: () => import(/* webpackChunkName: "threatmodel" */ '../views/ThreatModel.vue')
    },
    {
        path: `/${providerType}/:threatmodel/edit`,
        name: `${providerType}ThreatModelEdit`,
        component: () => import(/* webpackChunkName: "threatmodel-edit" */ '../views/ThreatModelEdit.vue')
    },
    {
        path: `/${providerType}/:threatmodel/edit/:diagram`,
        name: `${providerType}DiagramEdit`,
        component: () => import(/* webpackChunkName: "diagram-edit" */ '../views/DiagramEdit.vue')
    },
    {
        path: `/${providerType}/:threatmodel/report`,
        name: `${providerType}Report`,
        component: () => import(/* webpackChunkName: "report-model" */ '../views/ReportModel.vue')
    },
    {
        path: `/${providerType}/:threatmodel/history`,
        name: `${providerType}History`,
        component: () => import(/* webpackChunkName: "local-server-history" */ '../views/localServer/ModelHistory.vue')
    }
];
