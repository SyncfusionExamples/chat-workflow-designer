import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { SidebarComponent, SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { TextFormatEnum, ChatWorkflowEditorTypeEnum, ChatWorkflowBlockTypeEnum } from '../../models/enum';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BranchDetail, ChatWorkflowCommonObject, ChatWorkflowRulesData, ChatWorkflowRulesUpdateRequest, CustomerBlockFieldDetails, FieldDetails, FieldOptionDetail, FieldValidation, MessageDetails } from '../../models/appModel';
import { NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { DropDownListComponent, DropDownListModule } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ButtonModule, CheckBoxModule, SwitchModule } from '@syncfusion/ej2-angular-buttons';
import { WorkflowService } from '../../services/workflow.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';
import { v1 as uuidv1 } from 'uuid';


@Component({
    selector: 'app-workflow-sidebar',
    imports: [SidebarModule, FormsModule, DialogModule, CommonModule, DatePickerModule, DateTimePickerModule, ButtonModule, CheckBoxModule, SwitchModule, DropDownListModule],
    templateUrl: './workflow-sidebar.component.html',
    styleUrl: './workflow-sidebar.component.scss'
})
export class WorkflowSidebarComponent {
  @ViewChild('sidebar') sidebar?: SidebarComponent;
  @ViewChild('ddlTextFormat') ddlTextFormat!: DropDownListComponent;
  @ViewChild('optionLabel', { static: false }) optionLabelRef!: ElementRef;
  @ViewChild('optionValue', { static: false }) optionValueRef!: ElementRef;
  @ViewChild('optionDescription', { static: false }) optionDescriptionRef!: ElementRef;
  @ViewChild('ejDialog') ejDialog: DialogComponent;


  public chatWorkflowEditorTypeEnum = ChatWorkflowEditorTypeEnum;
  public chatWorkflowBlockTypeEnum = ChatWorkflowBlockTypeEnum;
  public options: Array<{ label: string, value: string, description: string | null }> = [];
  public addOptions: Array<{ label: string, value: string, description: string | null }> = [];
  public editOptions: Array<{ label: string, value: string, description: string | null }> = [];
  public deleteOptions: Array<{ label: string, value: string, description: string | null }> = [];

  public sideBarLabel: string = '';
  public sideBarDescription: string = '';
  public sideBarPlaceholder: string = '';
  public fieldOptionMinValue: number = 1;
  public fieldOptionMaxValue: number = 1;
  public fieldOptionRegexValue: string = '';
  public fromDate: Date = new Date();
  public toDate: Date = new Date();
  public fromDateTime: Date = new Date();
  public toDateTime: Date = new Date();
  public static nodeLength: number = 12;
  public type: string = 'Push';
  public width: string = '280px';
  public checkedIsPrivate: boolean = false;
  public newNodeWidth: number = 200;
  public newNodeHeight: number = 150;
  public newNode: NodeModel = {};

  public isEdit: boolean = false;
  public isEditButton: boolean = false;
  public editIndex: number = -1;
  public addOption: boolean = false;
  public newNodeInfo: any;
  private updatePending = false;

  textFormatDDLOptions: Array<{ text: string, value: number }>;
  ddlTextFormatFields: Object = { text: 'text', value: 'value' };
  public value = 1;

  public getEmailInfo: boolean = true;
  public getNameInfo: boolean = false;
  public getPhoneNumberInfo: boolean = false;

  @Input() nodeEditType!: number;
  @Input() nodeBlockType!: number;
  @Input() sidebarHeader!: string;
  @Input() optionValue!: string;
  @Input() clickedNodeRuleId!: number;
  @Input() selectedWorkFlowId!: number;
  @Output() ruleNodeChange = new EventEmitter();


  // Enables the footer buttons
  public buttons: Object = [
    {
        'click': () => this.onDialogClose(true),
        // Accessing button component properties by buttonModel property
          buttonModel:{
          content:'Yes',
          iconCss: 'e-icons e-ok-icon',
          //Enables the primary button
          isPrimary: true
        }
    },
    {
        'click': () => this.onDialogClose(false),
        // Accessing button component properties by buttonModel property
          buttonModel:{
          content:'No',
          iconCss: 'e-icons e-close-icon'
        }
    }
  ];

  //Animation options
  public animationSettings: Object = { effect: 'Zoom', duration: 400, delay: 0 };
  public position: object={ X: '400', Y: '200' };

  constructor(private workflowService: WorkflowService) {
    this.textFormatDDLOptions = this.enumToArray(TextFormatEnum);
  }

  // Convert enum to array of objects
  private enumToArray(enumObj: any): Array<{ text: string, value: number }> {
    return Object.keys(enumObj)
      .filter(key => isNaN(Number(key)))
      .map(key => {
        return {
          text: key,
          value: enumObj[key as keyof typeof enumObj]
        }
      });
  }
  
  public onSideBarCreated(args: any) {
    (this.sidebar as SidebarComponent).hide();
    (this.sidebar as SidebarComponent).position = "Right";
  }

  onFormSubmit(): void {
    this.sidebar?.hide();
  }
  
  // Add the new block
  onAddCloseSideBarClick(): void {
    this.sidebar?.hide();
    this.addOrUpdateBlock(this.clickedNodeRuleId);
    this.removeSetBlockValues();
  }
  // Update the existing block
  onUpdateCloseSideBarClick(): void {
    this.addOrUpdateBlock(this.clickedNodeRuleId)
    this.sidebar?.hide();
    this.removeSetBlockValues();
  }
  // Cancel the add or update 
  onCancelSideBarClick(): void {
    this.sidebar?.hide();
    this.removeSetBlockValues();
    if (this.isEdit) {
      this.isEdit = false;
      this.isEditButton = false;
    }
  }
  // Add and Save option
  addOrUpdateSaveOption(label: string, value: string, description: string | null, labelInput: HTMLInputElement, valueInput: HTMLInputElement, descriptionInput: HTMLInputElement | null): void {
    const option = { label: label.trim(), value: value.trim(), description };
    if(this.isEditButton){
      this.options[this.editIndex] = option;
      let addIndex = this.addOptions.findIndex(x => x.value == option.value);
      let editedIndex = this.editOptions.findIndex(x => x.value == option.value);
      if( addIndex > -1 ){
        this.addOptions[addIndex] = option;
      }
      else if(editedIndex > -1){
        this.editOptions[editedIndex] = option;
      }
      else{
        this.editOptions.push(option);
      }
    } 
    else {
      value = (this.nodeBlockType == ChatWorkflowBlockTypeEnum.BranchOnPickerInput) ? uuidv1() : value;
      this.options.push({ label, value, description });
      this.addOptions.push({ label, value, description });
    }
    this.cancelOption(labelInput, valueInput, descriptionInput);
  }
  
  // edit option value loading
  editOption(index: number): void {
    this.isEditButton = true;
    this.editIndex = index; 
    this.addOption = false;
    this.updatePending = true; 
  }
  // Load the existing value for option
  ngAfterViewChecked(): void {
    if (this.updatePending) {
        this.updatePending = false; // Reset flag to avoid multiple updates
        const button = this.options[this.editIndex];
        this.optionLabelRef.nativeElement.value = button.label || '';
        this.optionValueRef.nativeElement.value = button.value || '';
        this.optionDescriptionRef.nativeElement.value = button.description || '';
    }
  }
  // Check visibility for description show
  isVisible(nodeEditType: ChatWorkflowEditorTypeEnum): boolean {
    return nodeEditType === ChatWorkflowEditorTypeEnum.List;
  }
  isValueVisible(nodeBlockType: ChatWorkflowBlockTypeEnum) : boolean{
    return nodeBlockType === ChatWorkflowBlockTypeEnum.BranchOnPickerInput;
  }
  // cancel the option
  cancelOption(labelInput: HTMLInputElement, valueInput: HTMLInputElement, descriptionInput: HTMLInputElement | null) {
    labelInput.value = '';
    valueInput.value = '';
    if (descriptionInput) {
      descriptionInput.value = '';
    }
    this.isEditButton = false;
    this.editIndex = -1;
    this.addOption = false;
  }
  // on add option click
  onAddOption() {
    this.addOption = true;
    this.editIndex = -1;
  }

  public removeIndex!: number;
  // remove the option
  removeOption(index: number): void {
    if(this.nodeBlockType==10){
      this.ejDialog.show();
      this.removeIndex = index
    }
    else{
      this.options.splice(index, 1);
    }
  }
  // Hide the Dialog when click the footer button.
  public onDialogClose(buttonValue: boolean) {
    this.ejDialog!.hide();
    if(buttonValue){
      this.deleteOptions.push(this.options[this.removeIndex]);
      this.options.splice(this.removeIndex, 1);
    }
    this.removeIndex = null;
  }
  // Set the node(block) values
  setBlockValues(nodeInfo: NodeModel) {
    this.isEdit = true;
    let nodeDetails = nodeInfo.data as ChatWorkflowRulesData;
    this.clickedNodeRuleId = nodeDetails.id;
    this.nodeBlockType = nodeDetails.chatWorkflowBlockId;
    this.nodeEditType = nodeDetails.chatWorkflowEditorTypeId ?? 0;
    this.sideBarLabel = nodeDetails.fieldDetails?.label as string;
    this.sideBarDescription = nodeDetails.fieldDetails?.description as string;
    this.sideBarPlaceholder = nodeDetails.fieldDetails?.placeholder as string;
    this.options = nodeDetails?.fieldOptionDetails?.map(fieldOption => ({
      label: fieldOption.label,
      value: fieldOption.value,
      description: fieldOption.description ?? null
    })) || [];
    this.fieldOptionMinValue = Number(nodeDetails?.fieldDetails?.fieldValidation?.min);
    this.fieldOptionMaxValue = Number(nodeDetails?.fieldDetails?.fieldValidation?.max);
    this.fieldOptionRegexValue = nodeDetails?.fieldDetails?.fieldValidation?.regex ?? "";
  }
  // Remove the node(block) values
  removeSetBlockValues() {
    this.sideBarLabel = "";
    this.sideBarDescription = "";
    this.sideBarPlaceholder = "";
    this.options = [];
    this.addOptions = [];
    this.editOptions = [];
    this.deleteOptions = [];
    this.fieldOptionMinValue = 0;
    this.fieldOptionMaxValue = 0;
    this.fieldOptionRegexValue = "";
    this.addOption = false;
    this.editIndex = -1;
    this.checkedIsPrivate = false;
  }
  // Construct the add or update block details
  addOrUpdateBlock(clickedNodeRuleId: number) {
    switch (this.nodeBlockType) {
      case (this.chatWorkflowBlockTypeEnum.SendTextMessage): {
        let messageInfo: MessageDetails = {
          text: this.sideBarDescription,
          isPrivate: this.checkedIsPrivate,
          textFormat: this.ddlTextFormat.value as TextFormatEnum
        }
        this.newNodeInfo = this.createNodeInfo(null, this.nodeBlockType, this.selectedWorkFlowId, null, null, messageInfo, null, null);
        break;
      }
      case (this.chatWorkflowBlockTypeEnum.GetPickerInput): {
        switch (this.nodeEditType) {
          case (this.chatWorkflowEditorTypeEnum.Boolean): {
            let fieldInfo = this.createFieldInfo(null);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.Buttons): {
            let fieldOptionInfo = this.mapOptionsToFieldOptions(false);
            let fieldInfo = this.createFieldInfo(null);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, fieldOptionInfo, null, null, null);
            this.newNodeHeight += (this.options.length * 25);
            break;
          }
          case this.chatWorkflowEditorTypeEnum.DropDown: {
            let fieldOptionInfo = this.mapOptionsToFieldOptions(false);
            let fieldInfo = this.createFieldInfo(null);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, fieldOptionInfo, null, null, null);
            this.newNodeHeight += (this.options.length * 25);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.MultiSelect): {
            let fieldValidationInfo = this.createFieldValidationInfo(this.fieldOptionMinValue.toString(), this.fieldOptionMaxValue.toString(), "");
            let fieldOptionInfo = this.mapOptionsToFieldOptions(false);
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, fieldOptionInfo, null, null, null);
            this.newNodeHeight += (this.options.length * 25);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.List): {
            let fieldOptionInfo = this.mapOptionsToFieldOptions(false);
            let fieldInfo = this.createFieldInfo(null);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, fieldOptionInfo, null, null, null);
            this.newNodeHeight += (this.options.length * 25);
            break;
          }
        }
        break;
      }
      case (this.chatWorkflowBlockTypeEnum.GetTextInput): {
        switch (this.nodeEditType) {
          case (this.chatWorkflowEditorTypeEnum.Text): {
            let fieldValidationInfo = this.createFieldValidationInfo("", this.fieldOptionMaxValue.toString(), "");
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.TextArea): {
            let fieldValidationInfo = this.createFieldValidationInfo("", this.fieldOptionMaxValue.toString(), "");
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.Date): {
            const today = new Date();
            const minDate = today.toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
            today.getDate() + 30; // Calculate 30 days from today
            const maxDate = today.toISOString().split('T')[0]; // Max date in YYYY-MM-DD format

            let fieldValidationInfo = this.createFieldValidationInfo(minDate, maxDate, "");
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.DateTime): {
            const now = new Date();
            const minDateTime = now.toISOString(); // Current datetime in ISO format
            const maxDateTime = new Date(now.setDate(now.getDate() + 30)).toISOString(); // Max datetime, 30 days from now

            let fieldValidationInfo = this.createFieldValidationInfo(minDateTime, maxDateTime, "");
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.Number): {
            let fieldValidationInfo = this.createFieldValidationInfo(this.fieldOptionMinValue.toString(), this.fieldOptionMaxValue.toString(), "");
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.Decimal): {
            let fieldValidationInfo = this.createFieldValidationInfo(this.fieldOptionMinValue.toString(), this.fieldOptionMaxValue.toString(), "");
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.Regex): {
            let fieldValidationInfo = this.createFieldValidationInfo("", "", this.fieldOptionRegexValue);
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null, null, null);
            break;
          }
        }
        break;
      }
      case (this.chatWorkflowBlockTypeEnum.GetCustomerDetails): {
        let customerBlockFieldInfo : CustomerBlockFieldDetails = {
          isEmailEditorEnabled: this.getEmailInfo,
          isNameEditorEnabled: this.getNameInfo,
          isPhoneEditorEnabled: this.getPhoneNumberInfo,
        }
        this.newNodeInfo = this.createNodeInfo(null, this.nodeBlockType, this.selectedWorkFlowId, null, null, null, customerBlockFieldInfo, null);
        break;
      }
      case (this.chatWorkflowBlockTypeEnum.BranchOnPickerInput): {
        switch (this.nodeEditType) {
          case (this.chatWorkflowEditorTypeEnum.ButtonsBranch): {
            let fieldOptionInfo = this.mapOptionsToFieldOptions(true);
            let fieldInfo = this.createFieldInfo(null);
            let branchInfo = this.createBrandInfo();
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, fieldOptionInfo, null, null, branchInfo);
            this.newNodeHeight += (this.options.length * 25);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.DropdownBranch): {
            let fieldOptionInfo = this.mapOptionsToFieldOptions(true);
            let fieldInfo = this.createFieldInfo(null);
            let branchInfo = this.createBrandInfo();
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, fieldOptionInfo, null, null, branchInfo);
            this.newNodeHeight += (this.options.length * 25);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.ListBranch): {
            let fieldOptionInfo = this.mapOptionsToFieldOptions(true);
            let fieldInfo = this.createFieldInfo(null);
            let branchInfo = this.createBrandInfo();
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, fieldOptionInfo, null, null, branchInfo);
            this.newNodeHeight += (this.options.length * 25);
            break;
          }
        }
      }
    }
    if (this.isEdit) {
      this.onUpdateRule();
    }
    else {
      this.onAddRule();
    }
  }

  public onAddRule(): void {
    var addRuleRequest : ChatWorkflowCommonObject = {
      parentRuleId: this.clickedNodeRuleId,
      chatWorkflowId: this.selectedWorkFlowId,
      chatWorkflowBlockId: this.newNodeInfo.chatWorkflowBlockId,
      chatWorkflowEditorTypeId : this.newNodeInfo.chatWorkflowEditorTypeId,
      fieldDetails: this.newNodeInfo.fieldDetails,
      messageDetails: this.newNodeInfo.messageDetails,
      branchDetails: this.newNodeInfo.branchDetails,
      fieldOptionDetails : this.newNodeInfo.fieldOptionDetails
    };
    this.workflowService.addRule(addRuleRequest, this.optionValue).then((result) => {
      console.log(result.message);
      if (result) {
        this.ruleNodeChange.emit();
      }
    }).catch((e : HttpErrorResponse) => {
      if(e && e.error?.Message){
        console.log("Add failed");
      }
    });
  }

  public onUpdateRule(): void {
    var updateRuleRequest : ChatWorkflowRulesUpdateRequest = {
      chatWorkflowEditorTypeId : this.newNodeInfo.chatWorkflowEditorTypeId,
      fieldDetails: this.newNodeInfo.fieldDetails,
      addFieldOptionDetails: this.addOptions,
      updateFieldOptionDetails: this.editOptions,
      deleteFieldOptionDetails: this.deleteOptions
    };
    this.workflowService.updateRule(this.selectedWorkFlowId, this.clickedNodeRuleId, updateRuleRequest).then((result) => {
      console.log(result.message);
      this.ruleNodeChange.emit();
    }).catch((e : HttpErrorResponse) => {
      if(e && e.error?.Message){
        console.log("Update failed");
      }
    });
  }

  public createNodeInfo(editorTypeId: number | null, blockId: number, workflowId: number, fieldInfo: FieldDetails | null, fieldOptionInfo: FieldOptionDetail[] | null, messageInfo: MessageDetails | null, customerBlockFieldInfo: CustomerBlockFieldDetails | null, brandInfo: BranchDetail[] | null): ChatWorkflowRulesData {
    return {
      chatWorkflowId: workflowId,
      successWorkflowId: null,
      successRuleId: null,
      chatWorkflowBlockId: blockId,
      chatWorkflowEditorTypeId: editorTypeId,
      fieldDetails: fieldInfo,
      branchDetails: brandInfo,
      messageDetails: messageInfo,
      fieldOptionDetails: fieldOptionInfo,
      customerBlockFieldInfo: customerBlockFieldInfo
    };
  }

  public mapOptionsToFieldOptions(isBranch : boolean): FieldOptionDetail[] {
    return this.options.map(button => ({
      label: button.label,
      value: button.value,
      description: button.description ?? ""
    }));
  }

  public createFieldValidationInfo(minValue: string | "", maxValue: string | "", regexValue: string | ""): FieldValidation {
    return {
      min: minValue,
      max: maxValue,
      regex: regexValue
    }
  }

  public createFieldInfo(fieldValidationInfo: FieldValidation | null): FieldDetails {
    return {
      description: this.sideBarDescription,
      label: this.sideBarLabel,
      placeholder: this.sideBarPlaceholder,
      fieldValidation: fieldValidationInfo
    }
  }

  public createBrandInfo() : BranchDetail[]{
    return this.options.map(button => ({
      value: button.value,
      successWorkflowId: null,
      successRuleId: null
    }));
  }
}
