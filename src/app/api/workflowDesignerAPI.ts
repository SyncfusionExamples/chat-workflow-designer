export interface WorkflowListPathsType {
    readonly getWorkflowRules: string;
}

const apiPaths: WorkflowListPathsType = {
    getWorkflowRules: `{baseUrl}/{workflowId}/rules`,
}

export const WorkflowApiPaths: WorkflowListPathsType = apiPaths;