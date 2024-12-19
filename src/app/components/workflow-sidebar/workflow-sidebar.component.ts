import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ClickEventArgs, SidebarComponent, SidebarModule, ToolbarModule } from '@syncfusion/ej2-angular-navigations';
import { TextFormatEnum, ChatWorkflowEditorTypeEnum, ChatWorkflowBlockTypeEnum } from '../../models/enum';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FieldDetails, FieldOptionDetail, FieldValidation, MessageDetails, RuleData2 } from '../../models/appModel';
import { NodeModel } from '@syncfusion/ej2-angular-diagrams';
import { DropDownListComponent } from '@syncfusion/ej2-angular-dropdowns';
import { DatePickerModule, DateTimePickerModule } from '@syncfusion/ej2-angular-calendars';
import { ButtonModule } from '@syncfusion/ej2-angular-buttons';
import { DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';


@Component({
  selector: 'app-workflow-sidebar',
  standalone: true,
  imports: [SidebarModule, FormsModule, CommonModule, DatePickerModule, DateTimePickerModule, ButtonModule, DialogModule],
  templateUrl: './workflow-sidebar.component.html',
  styleUrl: './workflow-sidebar.component.scss'
})
export class WorkflowSidebarComponent {
  // @ViewChild('sidebar') sidebar?: SidebarComponent;
  @ViewChild('ejDialog') dialog!: DialogComponent;
  @ViewChild('ddlTextFormat') ddlTextFormat!: DropDownListComponent;
  @ViewChild('optionLabel', { static: false }) optionLabelRef!: ElementRef;
  @ViewChild('optionValue', { static: false }) optionValueRef!: ElementRef;
  @ViewChild('optionDescription', { static: false }) optionDescriptionRef!: ElementRef;



  public chatWorkflowEditorTypeEnum = ChatWorkflowEditorTypeEnum;
  public chatWorkflowBlockTypeEnum = ChatWorkflowBlockTypeEnum;
  public options: Array<{ label: string, value: string, description: string | null }> = [];
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
  public customMessage: string = '';
  public newNodeWidth: number = 200;
  public newNodeHeight: number = 150;
  public newNode: NodeModel = {};

  public isEdit: boolean = false;
  public isEditButton: boolean = false;
  public editIndex: number = -1;
  public soureId: string = "";
  public addOption: boolean = false;
  public newNodeInfo: any;
  private updatePending = false;

  @Input() nodeEditType!: number;
  @Input() nodeBlockType!: number;
  @Input() sidebarHeader!: string;
  @Input() selectedBlockId!: string;
  @Input() selectedWorkFlowId!: number;
  @Output() addNodeAndConnect = new EventEmitter<[string, NodeModel]>();
  @Output() updateNode = new EventEmitter<[string, RuleData2]>();


  constructor() {
  }

  public onSideBarCreated(args: any) {
    this.dialog.hide();
    // (this.sidebar as SidebarComponent).hide();
    // (this.sidebar as SidebarComponent).position = "Right";
  }

  onFormSubmit(): void {
    // this.sidebar?.hide();
    this.dialog.hide();
  }
  
  // Add the new block
  onAddCloseSideBarClick(): void {
    // this.sidebar?.hide();
    this.dialog.hide();
    this.addOrUpdateBlock(this.selectedBlockId);
    this.removeSetBlockValues();
  }
  // Update the existing block
  onUpdateCloseSideBarClick(): void {
    this.addOrUpdateBlock(this.soureId)
    // this.sidebar?.hide();
    this.dialog.hide();
  }
  // Cancel the add or update 
  onCancelSideBarClick(): void {
    // this.sidebar?.hide();
    this.dialog.hide();
    this.removeSetBlockValues();
    if (this.isEdit) {
      this.isEdit = false;
      this.isEditButton = false;
    }
  }
  // Add and Save option
  addAndSaveOption(label: string, value: string, description: string | null, labelInput: HTMLInputElement, valueInput: HTMLInputElement, descriptionInput: HTMLInputElement | null): void {
    if (label.trim() && value.trim()) {
      this.options.push({ label, value, description });
      this.cancelOption(labelInput, valueInput, descriptionInput);
    }
  }
  // Edit and Save option
  editAndSaveOption(label: string, value: string, description: string | null, labelInput: HTMLInputElement, valueInput: HTMLInputElement, descriptionInput: HTMLInputElement | null) {
    this.options[this.editIndex].label = label.trim();
    this.options[this.editIndex].value = value.trim();
    this.options[this.editIndex].description = description;
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
  // remove the option
  removeOption(index: number): void {
    this.options.splice(index, 1);
  }
  // Set the node(block) values
  setBlockValues(nodeInfo: NodeModel) {
    this.isEdit = true;
    let nodeDetails = nodeInfo.addInfo as RuleData2;
    this.soureId = nodeInfo?.id ?? "";
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
    this.fieldOptionMinValue = 0;
    this.fieldOptionMaxValue = 0;
    this.fieldOptionRegexValue = "";
    this.addOption = false;
    this.editIndex = -1;
  }
  // Construct the add or update block details
  addOrUpdateBlock(sourceNodeId: string) {
    switch (this.nodeBlockType) {
      case (this.chatWorkflowBlockTypeEnum.SendTextMessage): {
        let messageInfo: MessageDetails = {
          text: this.customMessage,
          isPrivate: this.checkedIsPrivate,
          textFormat: this.ddlTextFormat.value as TextFormatEnum
        }
        this.newNodeInfo = this.createNodeInfo(null, this.nodeBlockType, this.selectedWorkFlowId, null, null, messageInfo);
        break;
      }
      case (this.chatWorkflowBlockTypeEnum.GetPickerInput): {
        switch (this.nodeEditType) {
          case (this.chatWorkflowEditorTypeEnum.Boolean): {
            let fieldInfo = this.createFieldInfo(null);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.Buttons): {
            let fieldOptionInfo = this.mapOptionsToFieldOptions();
            let fieldInfo = this.createFieldInfo(null);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, fieldOptionInfo, null);
            this.newNodeHeight += (this.options.length * 25);
            break;
          }
          case this.chatWorkflowEditorTypeEnum.DropDown: {
            let fieldOptionInfo = this.mapOptionsToFieldOptions();
            let fieldInfo = this.createFieldInfo(null);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, fieldOptionInfo, null);
            this.newNodeHeight += (this.options.length * 25);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.MultiSelect): {
            let fieldValidationInfo = this.createFieldValidationInfo(this.fieldOptionMinValue.toString(), this.fieldOptionMaxValue.toString(), null);
            let fieldOptionInfo = this.mapOptionsToFieldOptions();
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, fieldOptionInfo, null);
            this.newNodeHeight += (this.options.length * 25);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.List): {
            let fieldOptionInfo = this.mapOptionsToFieldOptions();
            let fieldInfo = this.createFieldInfo(null);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, fieldOptionInfo, null);
            this.newNodeHeight += (this.options.length * 25);
            break;
          }
        }
        break;
      }
      case (this.chatWorkflowBlockTypeEnum.GetTextInput): {
        switch (this.nodeEditType) {
          case (this.chatWorkflowEditorTypeEnum.Text): {
            let fieldValidationInfo = this.createFieldValidationInfo(null, this.fieldOptionMaxValue.toString(), null);
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.TextArea): {
            let fieldValidationInfo = this.createFieldValidationInfo(null, this.fieldOptionMaxValue.toString(), null);
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.Date): {
            const today = new Date();
            const minDate = today.toISOString().split('T')[0]; // Format today's date as YYYY-MM-DD
            today.getDate() + 30; // Calculate 30 days from today
            const maxDate = today.toISOString().split('T')[0]; // Max date in YYYY-MM-DD format

            let fieldValidationInfo = this.createFieldValidationInfo(minDate, maxDate, null);
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.DateTime): {
            const now = new Date();
            const minDateTime = now.toISOString(); // Current datetime in ISO format
            const maxDateTime = new Date(now.setDate(now.getDate() + 30)).toISOString(); // Max datetime, 30 days from now

            let fieldValidationInfo = this.createFieldValidationInfo(minDateTime, maxDateTime, null);
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.Number): {
            let fieldValidationInfo = this.createFieldValidationInfo(this.fieldOptionMinValue.toString(), this.fieldOptionMaxValue.toString(), null);
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.Decimal): {
            let fieldValidationInfo = this.createFieldValidationInfo(this.fieldOptionMinValue.toString(), this.fieldOptionMaxValue.toString(), null);
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null);
            break;
          }
          case (this.chatWorkflowEditorTypeEnum.Regex): {
            let fieldValidationInfo = this.createFieldValidationInfo(null, null, this.fieldOptionRegexValue);
            let fieldInfo = this.createFieldInfo(fieldValidationInfo);
            this.newNodeInfo = this.createNodeInfo(this.nodeEditType, this.nodeBlockType, this.selectedWorkFlowId, fieldInfo, null, null);
            break;
          }
        }
        break;
      }
    }
    if (this.isEdit) {
      this.updateNode.emit([sourceNodeId, this.newNodeInfo]);
    }
    else {
      this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, this.newNodeInfo);
      this.addNodeAndConnect.emit([sourceNodeId, this.newNode]);
    }
  }

  public createNodeInfo(editorTypeId: number | null, blockId: number, workflowId: number, fieldInfo: FieldDetails | null, fieldOptionInfo: FieldOptionDetail[] | null, messageInfo: MessageDetails | null): RuleData2 {
    let ruleDataId = this.isEdit ? 0 : WorkflowSidebarComponent.nodeLength++; // Need to set value dynamically from db
    return {
      id: ruleDataId,
      chatWorkflowId: workflowId,
      successWorkflowId: null,
      successRuleId: null,
      isActive: true,
      chatWorkflowBlockId: blockId,
      chatWorkflowEditorTypeId: editorTypeId,
      fieldDetails: fieldInfo,
      branchDetails: null,
      messageDetails: messageInfo,
      fieldOptionDetails: fieldOptionInfo
    };
  }

  public mapOptionsToFieldOptions(): FieldOptionDetail[] {
    return this.options.map(button => ({
      label: button.label,
      value: button.value,
      description: button.description ?? null
    }));
  }

  public createFieldValidationInfo(minValue: string | null, maxValue: string | null, regexValue: string | null): FieldValidation {
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

  public createNode(width: number, height: number, nodeInfo: RuleData2): NodeModel {
    return {
      id: `node${nodeInfo.id}`,
      style: { fill: '#FFFFFF', strokeColor: '#0f2c60', strokeWidth: 5 },
      height: height,
      width: width,
      borderColor: '#0f2c60',
      borderWidth: 3,
      shape: {
        type: 'HTML',
      },
      addInfo: nodeInfo
    };
  }

}
