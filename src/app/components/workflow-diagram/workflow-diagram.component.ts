import { Component, ViewChild } from '@angular/core';
import { ComplexHierarchicalTree, ConnectionPointOrigin, ConnectorConstraints, ConnectorModel, DecoratorModel, Diagram,  DiagramComponent, DiagramModule, HtmlModel, IClickEventArgs, LayoutModel, LineDistribution, Node, NodeModel, SelectorConstraints, SelectorModel, SnapSettingsModel, TextModel, UserHandleEventsArgs, UserHandleModel } from '@syncfusion/ej2-angular-diagrams';
import { FieldDetails, FieldOptionDetail, FieldValidation, RuleData, RuleData2 } from '../../models/appModel';
import { RULE_DATA, RULE_DATA2, RULE_DATA3 } from '../../data/rule-data';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { BeforeOpenCloseMenuEventArgs, DropDownButtonComponent, DropDownButtonModule, ItemModel, OpenCloseMenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { CommonModule } from '@angular/common';
import { ListViewComponent, ListViewModule, SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { LIST_DATA } from '../../data/list-data';
import { SidebarComponent, SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { FormsModule } from '@angular/forms';
import workflowData from '../../data/workflow-data.json'; // Adjust the path as needed
import { DropDownList, DropDownListModule, MultiSelectModule } from '@syncfusion/ej2-angular-dropdowns';
import { NumericTextBoxModule, TextAreaModule, TextBoxModule } from '@syncfusion/ej2-angular-inputs';

Diagram.Inject(ComplexHierarchicalTree, LineDistribution);

@Component({
  selector: 'app-workflow-diagram',
  standalone: true,
  imports: [DiagramModule, DialogModule, DropDownButtonModule, CommonModule, ListViewModule, SidebarModule, FormsModule, DropDownListModule, MultiSelectModule, NumericTextBoxModule, TextBoxModule, TextAreaModule],
  templateUrl: './workflow-diagram.component.html',
  styleUrl: './workflow-diagram.component.scss'
})
export class WorkflowDiagramComponent {
  @ViewChild('diagram') diagram!: DiagramComponent;
  @ViewChild('dropdownbutton') dropdownbutton!: DropDownButtonComponent;
  @ViewChild('listview') listView!: ListViewComponent;
  @ViewChild('sidebar') sidebar?: SidebarComponent;

  // public data: RuleData[] = RULE_DATA;
  public data: RuleData2[] = RULE_DATA3;
  public nodes: NodeModel[] = [];
  public connectors: ConnectorModel[] = [];
  public closeOnDocumentClick: boolean = true;
  public sidebarInput: string = '';
  public newNodeWidth: number = 100;
  public newNodeHeight: number = 100;
  // public newNodeInfo: RuleData2 = {};
  public newNode : NodeModel = {}
  public ddlFields: Object = { text: 'label', value: 'value' };

  public handles: UserHandleModel[] = [
    {
      name: 'plusIcon',
      visible: false,
      offset: 0.4,
      side: 'Bottom',
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      backgroundColor: 'skyblue',
    }
  ];

  public listdata: { [key: string]: any }[] = LIST_DATA;
  public fields: {[key: string]: string} ={ tooltip: 'text'};
  public headertitle = 'Block';
  public animation: Object  = { duration: 0};
  public isParentListItem : boolean = false;
  public type: string = 'Push';
  public width: string ='280px';
  public sidebarHeader: string = '';
  public nodeType: string = '';
  private nodeIdCounter: number = 0;
  private connectorIdCounter: number = 0;
  public buttons: Array<{ label: string, value: string, description:string|null }> = [];
  public options: Array<{ label: string, value: string }> = [];
  public sideBarLabel: string = '';
  public sideBarDescription: string = '';
  public sideBarPlaceholder: string = '';
  public newNodeData: RuleData2[] = [];
  public fieldOptionMinValue: number = 1;
  public fieldOptionMaxValue: number = 1;
  public fieldOptionRegexValue: string = '';

  constructor() {
    // Initialize nodes and connectors based on the data
    this.initializeDiagramElements();
  }
  
  private initializeDiagramElements(): void {
    this.data.forEach(item => {
      // Create nodes based on the data
      this.nodes.push({
        id: `node${item.id}`,
        annotations: [{ content: `Node ${item['id']}` }],
        addInfo: { // Store the JSON data in addInfo
          workflowData: item
        }
      });

      // Create connectors from success_rule_id
      if (item['successRuleId']) {
        this.connectors.push({
          id: `connector${item['id']}-s${item['successRuleId']}`,
          sourceID: `node${item['id']}`,
          targetID: `node${item['successRuleId']}`,
          annotations: [{ content: 'success', alignment: 'Center'}]
        });
      }
      if (item.branchDetails) {
        item.branchDetails.forEach(branch => {
          if (branch.successRuleId) {
            this.connectors.push({
              id: `connector${item.id}-s${branch.successRuleId}`,
              sourceID: `node${item.id}`,
              targetID: `node${branch.successRuleId}`,
              annotations: [{ content: 'success', alignment: 'Center' }]
            });
          }
        });
      }
    });
  }

  public onDiagramCreated(): void {
    (this.diagram as DiagramComponent).fitToPage();
  };

  // Configure snapSettings to hide grid lines
  public snapSettings: SnapSettingsModel = {
    horizontalGridlines: { lineColor: 'transparent', lineIntervals: [] },
    verticalGridlines: { lineColor: 'transparent', lineIntervals: [] },
    constraints: 0 // Disable all snapping
  };

  public selectedItems: SelectorModel = {
    constraints: SelectorConstraints.UserHandle,
    userHandles: this.handles,
  };

  public layout: LayoutModel = {
    type: 'ComplexHierarchicalTree',
    connectionPointOrigin: ConnectionPointOrigin.DifferentPoint,
    horizontalSpacing: 40,
    verticalSpacing: 40,
    horizontalAlignment: 'Left',
    verticalAlignment: 'Top',
    margin: { left: 0, right: 0, top: 0, bottom: 0 },
    orientation: 'TopToBottom',
  };

  public getNodeDefaults(obj: NodeModel): NodeModel {
    obj.style = {
      fill: '#FFFFFF',
      strokeColor: '#0f2c60',
      strokeWidth: 5,
    };
    obj.borderWidth = 1;
    (obj.shape as TextModel).margin = {
      left: 5,
      right: 5,
      top: 5,
      bottom: 5,
    };
    return obj;
  }

  public getConnectorDefaults(connector: ConnectorModel): ConnectorModel {
    connector.type = 'Orthogonal';
    connector.cornerRadius = 7;
    connector.constraints = ConnectorConstraints.Default & ~ConnectorConstraints.Select;
    (
      (connector as ConnectorModel).targetDecorator as DecoratorModel
    ).height = 5;
    ((connector as ConnectorModel).targetDecorator as DecoratorModel).width = 5;
    connector.style = { strokeColor: '#6BA5D7', strokeWidth: 1 };
    return connector;
  }

  public onNodeClick(args: IClickEventArgs): void {
    if (args.actualObject instanceof Node) {
      if(this.diagram.selectedItems.userHandles) {
        this.diagram.selectedItems.userHandles[0].visible = true;
      }
      // const clickedNodeId = args.actualObject.id;
      // this.addNodeAndConnect(clickedNodeId); // Add and connect a new node
    }
  }

  // Method to add a new node and connect it
  addNodeAndConnect(sourceNodeId: string): void {
    let htmlContent = '';
    if (this.nodeType === 'Boolean') {
      let fieldsDetail: FieldDetails = {
        description : this.sideBarDescription ,
        label : this.sideBarLabel,
        placeholder : this.sideBarPlaceholder
      };

      let newNodeInfo: RuleData2 = {
        id : this.diagram.nodes.length + 1,
        chatWorkflowId : 1,
        successWorkflowId : null,
        successRuleId : null,
        isActive : true,
        chatWorkflowBlockId : 4,
        chatWorkflowEditorTypeId : 1,
        fieldDetails : fieldsDetail,
        branchDetails: null,
        messageDetails: null,
        fieldOptionDetails: null
      };

      this.newNodeHeight= 100; // Set a default height for the new node
      this.newNodeWidth = 150;
      this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, htmlContent, newNodeInfo);
    
    } else if (this.nodeType == 'Buttons') {
      
      let fieldInfo: FieldDetails = {
        description : this.sideBarDescription ,
        label : this.sideBarLabel,
        placeholder : this.sideBarPlaceholder
      };

      // Mapping buttons to fieldOptionInfo
      let fieldOptionInfo: FieldOptionDetail[] = this.buttons.map(button => {
        return {
          label: button.label,
          value: button.value
        };
      });

      let newNodeInfo: RuleData2 = {
        id : this.diagram.nodes.length + 1,
        chatWorkflowId : 1,
        successWorkflowId : null,
        successRuleId : null,
        isActive : true,
        chatWorkflowBlockId : 4,
        chatWorkflowEditorTypeId : 2,
        fieldDetails : fieldInfo,
        branchDetails: null,
        messageDetails: null,
        fieldOptionDetails: fieldOptionInfo
      };

      this.newNodeHeight= 100 + (this.buttons.length * 20); // Set a default height for the new node
      this.newNodeWidth = 200;
      this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, htmlContent, newNodeInfo);      
    } else if(this.nodeType == 'Single') {
        let fieldInfo: FieldDetails = {
          description : this.sideBarDescription ,
          label : this.sideBarLabel,
          placeholder : this.sideBarPlaceholder
        };
  
        // Mapping buttons to fieldOptionInfo
        let fieldOptionInfo: FieldOptionDetail[] = this.buttons.map(button => {
          return {
            label: button.label,
            value: button.value
          };
        });
  
        let newNodeInfo: RuleData2 = {
          id : this.diagram.nodes.length + 1,
          chatWorkflowId : 1,
          successWorkflowId : null,
          successRuleId : null,
          isActive : true,
          chatWorkflowBlockId : 4,
          chatWorkflowEditorTypeId : 3,
          fieldDetails : fieldInfo,
          branchDetails: null,
          messageDetails: null,
          fieldOptionDetails: fieldOptionInfo
        };
  
        this.newNodeHeight= 100; // Set a default height for the new node
        this.newNodeWidth = 200;
        this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, htmlContent, newNodeInfo);

    } else if(this.nodeType == 'Multi') {
        let fieldValidationInfo: FieldValidation = {
          min: this.fieldOptionMinValue.toString(),
          max: this.fieldOptionMaxValue.toString()
        };
        let fieldInfo: FieldDetails = {
          description : this.sideBarDescription ,
          label : this.sideBarLabel,
          placeholder : this.sideBarPlaceholder,
          fieldValidation: fieldValidationInfo
        };

        // Mapping buttons to fieldOptionInfo
        let fieldOptionInfo: FieldOptionDetail[] = this.buttons.map(button => {
          return {
            label: button.label,
            value: button.value
          };
        });

        let newNodeInfo: RuleData2 = {
          id : this.diagram.nodes.length + 1,
          chatWorkflowId : 1,
          successWorkflowId : null,
          successRuleId : null,
          isActive : true,
          chatWorkflowBlockId : 4,
          chatWorkflowEditorTypeId : 4,
          fieldDetails : fieldInfo,
          branchDetails: null,
          messageDetails: null,
          fieldOptionDetails: fieldOptionInfo
        };

        this.newNodeHeight= 100; // Set a default height for the new node
        this.newNodeWidth = 200;
        this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, htmlContent, newNodeInfo);
    } else if(this.nodeType == 'List') {
        let fieldInfo: FieldDetails = {
          description : this.sideBarDescription ,
          label : this.sideBarLabel,
          placeholder : this.sideBarPlaceholder,
        };

        // Mapping buttons to fieldOptionInfo
        let fieldOptionInfo: FieldOptionDetail[] = this.buttons.map(button => {
          return {
            label: button.label,
            value: button.value,
            description: button.description !== null ? button.description : null
          };
        });

        let newNodeInfo: RuleData2 = {
          id : this.diagram.nodes.length + 1,
          chatWorkflowId : 1,
          successWorkflowId : null,
          successRuleId : null,
          isActive : true,
          chatWorkflowBlockId : 4,
          chatWorkflowEditorTypeId : 5,
          fieldDetails : fieldInfo,
          branchDetails: null,
          messageDetails: null,
          fieldOptionDetails: fieldOptionInfo
        };

        this.newNodeHeight= 100 + (this.buttons.length * 25); // Set a default height for the new node
        this.newNodeWidth = 200;
        this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, htmlContent, newNodeInfo);
    } else if(this.nodeType == 'Number') {
        let fieldValidationInfo: FieldValidation = {
          min: this.fieldOptionMinValue.toString(),
          max: this.fieldOptionMaxValue.toString()
        };
        let fieldInfo: FieldDetails = {
          description : this.sideBarDescription ,
          label : this.sideBarLabel,
          placeholder : this.sideBarPlaceholder,
          fieldValidation: fieldValidationInfo
        };

        let newNodeInfo: RuleData2 = {
          id : this.diagram.nodes.length + 1,
          chatWorkflowId : 1,
          successWorkflowId : null,
          successRuleId : null,
          isActive : true,
          chatWorkflowBlockId : 5,
          chatWorkflowEditorTypeId : 11,
          fieldDetails : fieldInfo,
          branchDetails: null,
          messageDetails: null,
          fieldOptionDetails: null
        };

        this.newNodeHeight= 100; // Set a default height for the new node
        this.newNodeWidth = 200;
        this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, htmlContent, newNodeInfo);
    } else if(this.nodeType == 'Decimal') {
        let fieldValidationInfo: FieldValidation = {
          min: this.fieldOptionMinValue.toString(),
          max: this.fieldOptionMaxValue.toString()
        };
        let fieldInfo: FieldDetails = {
          description : this.sideBarDescription ,
          label : this.sideBarLabel,
          placeholder : this.sideBarPlaceholder,
          fieldValidation: fieldValidationInfo
        };

        let newNodeInfo: RuleData2 = {
          id : this.diagram.nodes.length + 1,
          chatWorkflowId : 1,
          successWorkflowId : null,
          successRuleId : null,
          isActive : true,
          chatWorkflowBlockId : 5,
          chatWorkflowEditorTypeId : 12,
          fieldDetails : fieldInfo,
          branchDetails: null,
          messageDetails: null,
          fieldOptionDetails: null
        };

        this.newNodeHeight= 100; // Set a default height for the new node
        this.newNodeWidth = 200;
        this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, htmlContent, newNodeInfo);
    } else if(this.nodeType == 'Text') {
        let fieldValidationInfo: FieldValidation = {
          max: this.fieldOptionMaxValue.toString()
        };
        let fieldInfo: FieldDetails = {
          description : this.sideBarDescription ,
          label : this.sideBarLabel,
          placeholder : this.sideBarPlaceholder,
          fieldValidation: fieldValidationInfo
        };

        let newNodeInfo: RuleData2 = {
          id : this.diagram.nodes.length + 1,
          chatWorkflowId : 1,
          successWorkflowId : null,
          successRuleId : null,
          isActive : true,
          chatWorkflowBlockId : 5,
          chatWorkflowEditorTypeId : 7,
          fieldDetails : fieldInfo,
          branchDetails: null,
          messageDetails: null,
          fieldOptionDetails: null
        };

        this.newNodeHeight= 100; // Set a default height for the new node
        this.newNodeWidth = 200;
        this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, htmlContent, newNodeInfo);
    } else if(this.nodeType == 'Text Area') {
        let fieldValidationInfo: FieldValidation = {
          max: this.fieldOptionMaxValue.toString()
        };
        let fieldInfo: FieldDetails = {
          description : this.sideBarDescription ,
          label : this.sideBarLabel,
          placeholder : this.sideBarPlaceholder,
          fieldValidation: fieldValidationInfo
        };

        let newNodeInfo: RuleData2 = {
          id : this.diagram.nodes.length + 1,
          chatWorkflowId : 1,
          successWorkflowId : null,
          successRuleId : null,
          isActive : true,
          chatWorkflowBlockId : 5,
          chatWorkflowEditorTypeId : 8,
          fieldDetails : fieldInfo,
          branchDetails: null,
          messageDetails: null,
          fieldOptionDetails: null
        };

        this.newNodeHeight= 100; // Set a default height for the new node
        this.newNodeWidth = 200;
        this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, htmlContent, newNodeInfo);
    } else if(this.nodeType == 'Regex') {
        let fieldValidationInfo: FieldValidation = {
          regex: this.fieldOptionRegexValue
        };
        let fieldInfo: FieldDetails = {
          description : this.sideBarDescription ,
          label : this.sideBarLabel,
          placeholder : this.sideBarPlaceholder,
          fieldValidation: fieldValidationInfo
        };

        let newNodeInfo: RuleData2 = {
          id : this.diagram.nodes.length + 1,
          chatWorkflowId : 1,
          successWorkflowId : null,
          successRuleId : null,
          isActive : true,
          chatWorkflowBlockId : 5,
          chatWorkflowEditorTypeId : 8,
          fieldDetails : fieldInfo,
          branchDetails: null,
          messageDetails: null,
          fieldOptionDetails: null
        };

        this.newNodeHeight= 100; // Set a default height for the new node
        this.newNodeWidth = 200;
        this.newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, htmlContent, newNodeInfo);
    } else {
        htmlContent = `<div><p>Default Content</p></div>`;
    }

    // const newNode = this.createNode(this.newNodeWidth, this.newNodeHeight, htmlContent, newNodeInfo); // Width and height as parameters

    // Add the new node to the diagram
    this.diagram.addNode(this.newNode);

    // Create a new connector to link the new node to the source node
    const newConnectorId = `connector${++this.connectorIdCounter}`;
    const newConnector: ConnectorModel = {
      id: newConnectorId,
      sourceID: sourceNodeId,
      targetID: this.newNode.id,
      type: 'Orthogonal',
      style: { strokeColor: '#6BA5D7', strokeWidth: 1 }
    };

    // Add the connector to the diagram
    this.diagram.addConnector(newConnector);
  }

  createNode(width: number, height: number, content: string, nodeInfo: RuleData2): NodeModel {
    return {
      id: `node${nodeInfo.id}`,
      annotations: [],
      offsetX: 100,
      offsetY: 70,
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

  public onUserHandleMouseDown(event: UserHandleEventsArgs) {
    if(event.element.name === 'plusIcon') {
      this.dropdownbutton.toggle();
    }
  }

  onOpenDropDownButton(args: OpenCloseMenuEventArgs) {
    let dropDownContainer = document.querySelector('.dropDown-container') as HTMLElement;
    args.element.parentElement!.style.top = dropDownContainer.getBoundingClientRect().top + dropDownContainer.offsetHeight +'px';

    let ulElement = document.querySelector('ul') as HTMLElement;
    args.element.parentElement!.style.left = dropDownContainer.getBoundingClientRect().left - (ulElement.getBoundingClientRect().width / 2)+ (dropDownContainer.getBoundingClientRect().width / 2)+'px' ;
  }

  onBeforeCloseDropDownButton(args: BeforeOpenCloseMenuEventArgs) {
    args.cancel = this.isParentListItem;
    if (!this.isParentListItem) {
      this.sidebar?.show();
    }
  }

  onSelectListView(args: SelectEventArgs) {
    this.isParentListItem = args.item.classList.contains("e-has-child");
    const selectedItem = args.item;
    const selectedItemId = selectedItem.getAttribute('data-uid');
    const selectedItemText = args.item ? args.item.textContent : null;
    // Perform actions with the selectedItemId
    console.log('Selected Item ID:', selectedItemId);
    if (selectedItemId && /^0[1-3]$/.test(selectedItemId)) { // Check if the ID is '01', '02', or '03'
      this.sidebarHeader = selectedItemText ? selectedItemText.trim() + ' Block' : '';
    }
    if(!this.isParentListItem) {
      this.nodeType = selectedItemText || '';
    }
  }

  onBeforeOpenDropDownButton() {
    // Reset ListView to its initial state before opening
    if (this.listView) {
      this.listView.dataSource = this.listdata; // Reset data
      this.listView.refresh();
    }
  }

  onCloseSideBarClick(): void {
    this.sidebar?.hide();
    this.addNodeAndConnect('node1');
    this.sidebarInput = ''; // Reset the question text
    this.buttons = [];
  }

  public onSideBarCreated(args: any) {
    (this.sidebar as SidebarComponent).element.style.visibility = '';
    (this.sidebar as SidebarComponent).position = "Right";
  }

  onFormSubmit(): void {
    // this.addNodeAndConnect('1');
    this.sidebar?.hide();
  }

  addButton(label: string, value: string, description: string | null, labelInput: HTMLInputElement, valueInput: HTMLInputElement, descriptionInput: HTMLInputElement | null): void {
     if (label.trim() && value.trim()) {
      this.buttons.push({ label, value, description });
      labelInput.value = '';
      valueInput.value = '';
      if (descriptionInput) {
        descriptionInput.value = '';
      }
    }
  }

  removeButton(index: number): void {
    this.buttons.splice(index, 1);
  }
}