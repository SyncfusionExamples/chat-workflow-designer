export interface WorkflowListPathsType {
    readonly getWorkflowRules: string;
    readonly updateWorkflowRules: string;
    readonly deleteWorkflowRules: string;
}

const apiPaths: WorkflowListPathsType = {
    getWorkflowRules: `{baseUrl}/{workflowId}/rules`,
    updateWorkflowRules: `{baseUrl}/{workflowId}/rules/{ruleId}/update`,
    deleteWorkflowRules: `{baseUrl}/{workflowId}/rules/{ruleId}/delete`,
}

export const WorkflowApiPaths: WorkflowListPathsType = apiPaths;