<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <b-jumbotron class="text-center">
                    <h4>
                        {{ $t('history.title') || 'Version History' }}: {{ modelName }}
                    </h4>
                </b-jumbotron>
            </b-col>
        </b-row>
        <b-row>
            <b-col md=8 offset=2>
                <b-button
                    variant="secondary"
                    @click="goBack"
                    class="mb-3">
                    <font-awesome-icon icon="arrow-left" />
                    {{ $t('forms.back') || 'Back' }}
                </b-button>

                <b-list-group v-if="history.length > 0">
                    <b-list-group-item
                        v-for="(entry, idx) in history"
                        :key="idx"
                        class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{{ entry.message }}</strong>
                            <br>
                            <small class="text-muted">
                                {{ formatDate(entry.date) }}
                                <span v-if="entry.author">by {{ entry.author }}</span>
                            </small>
                            <br>
                            <small class="text-muted font-monospace">{{ entry.hash.substring(0, 8) }}</small>
                        </div>
                        <div>
                            <b-button
                                variant="outline-primary"
                                size="sm"
                                @click="viewVersion(entry.hash)"
                                :title="$t('history.view') || 'View this version'">
                                <font-awesome-icon icon="eye" />
                            </b-button>
                        </div>
                    </b-list-group-item>
                </b-list-group>

                <b-alert v-else show variant="info">
                    {{ $t('history.empty') || 'No version history available.' }}
                </b-alert>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import localApi from '@/service/api/localApi.js';
import tmActions from '@/store/actions/threatmodel.js';
import { providerTypes } from '@/service/provider/providerTypes.js';

export default {
    name: 'LocalServerModelHistory',
    data() {
        return {
            history: [],
            modelName: ''
        };
    },
    async mounted() {
        this.modelName = this.$route.params.threatmodel;
        await this.loadHistory();
    },
    methods: {
        async loadHistory() {
            try {
                this.history = await localApi.historyAsync(this.modelName);
            } catch (error) {
                console.error('Failed to load history:', error);
                this.$toast.error(this.$t('history.error') || 'Failed to load version history');
                this.history = [];
            }
        },
        async viewVersion(hash) {
            try {
                const modelData = await localApi.versionAsync(this.modelName, hash);
                this.$store.dispatch(tmActions.selected, modelData);
                this.$router.push({
                    name: `${providerTypes.localServer}ThreatModel`,
                    params: { threatmodel: this.modelName }
                });
            } catch (error) {
                console.error('Failed to load version:', error);
                this.$toast.error(this.$t('history.loadError') || 'Failed to load version');
            }
        },
        formatDate(dateString) {
            try {
                const date = new Date(dateString);
                return date.toLocaleString();
            } catch {
                return dateString;
            }
        },
        goBack() {
            this.$router.push({
                name: `${providerTypes.localServer}ThreatModel`,
                params: { threatmodel: this.modelName }
            });
        }
    }
};
</script>

<style scoped>
.font-monospace {
    font-family: monospace;
}
</style>
