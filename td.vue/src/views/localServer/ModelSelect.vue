<template>
    <td-selection-page
        :items="threatModels"
        :onItemClick="onThreatmodelClick"
        :emptyStateText="$t('threatmodelSelect.newThreatModel')"
        :onEmptyStateClick="newThreatModel">
            {{ $t('threatmodelSelect.selectLocal') || 'Select a threat model from local storage or' }}
            <a href="javascript:void(0)" id="new-threat-model" @click="newThreatModel">{{ $t('threatmodelSelect.newThreatModel') }}</a>
    </td-selection-page>
</template>

<script>
import { mapState } from 'vuex';

import { getProviderType } from '@/service/provider/providers.js';
import localApi from '@/service/api/localApi.js';
import providerActions from '@/store/actions/provider.js';
import TdSelectionPage from '@/components/SelectionPage.vue';
import tmActions from '@/store/actions/threatmodel.js';

export default {
    name: 'LocalServerModelSelect',
    components: {
        TdSelectionPage
    },
    data() {
        return {
            threatModels: []
        };
    },
    computed: mapState({
        provider: (state) => state.provider.selected,
        providerType: (state) => getProviderType(state.provider.selected),
        selectedModel: (state) => state.threatmodel.data
    }),
    async mounted() {
        if (this.provider !== 'localServer') {
            this.$store.dispatch(providerActions.selected, 'localServer');
        }

        this.$store.dispatch(tmActions.clear);
        await this.loadModels();
    },
    methods: {
        async loadModels() {
            try {
                const models = await localApi.modelsAsync();
                this.threatModels = models;
            } catch (error) {
                console.error('Failed to load models from local storage:', error);
                this.$toast.error(this.$t('threatmodel.errors.load') || 'Failed to load models');
                this.threatModels = [];
            }
        },
        async onThreatmodelClick(threatmodel) {
            try {
                const modelData = await localApi.modelAsync(threatmodel);
                this.$store.dispatch(tmActions.selected, modelData);
                const params = { threatmodel };
                this.$router.push({ name: `${this.providerType}ThreatModel`, params });
            } catch (error) {
                console.error('Failed to load threat model:', error);
                this.$toast.error(this.$t('threatmodel.errors.load') || 'Failed to load model');
            }
        },
        newThreatModel() {
            this.$store.dispatch(tmActions.clear);
            this.$router.push({ name: `${this.providerType}NewThreatModel` });
        }
    }
};
</script>
