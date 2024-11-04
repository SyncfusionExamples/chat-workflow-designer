import { Component, ViewChild } from '@angular/core';
import { ComplexHierarchicalTree, ConnectionPointOrigin, ConnectorConstraints, ConnectorModel, DecoratorModel, Diagram,  DiagramComponent, DiagramModule, IClickEventArgs, LayoutModel, LineDistribution, Node, NodeModel, SelectorConstraints, SelectorModel, SnapSettingsModel, TextModel, UserHandleEventsArgs, UserHandleModel } from '@syncfusion/ej2-angular-diagrams';
import { RuleData, RuleData2 } from '../../models/appModel';
import { RULE_DATA, RULE_DATA2, RULE_DATA3 } from '../../data/rule-data';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { BeforeOpenCloseMenuEventArgs, DropDownButtonComponent, DropDownButtonModule, ItemModel, OpenCloseMenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { CommonModule } from '@angular/common';
import { ListViewComponent, ListViewModule, SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { LIST_DATA } from '../../data/list-data';
import { SidebarComponent, SidebarModule } from '@syncfusion/ej2-angular-navigations';
import { FormsModule } from '@angular/forms';

Diagram.Inject(ComplexHierarchicalTree, LineDistribution);

@Component({
  selector: 'app-workflow-diagram',
  standalone: true,
  imports: [DiagramModule, DialogModule, DropDownButtonModule, CommonModule, ListViewModule, SidebarModule, FormsModule],
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
    obj.width = 100;
    obj.height = 100;
    // obj.annotations = [{ content: obj.id }];
    obj.style = {
      fill: '#6BA5D7',
      strokeColor: 'none',
      strokeWidth: 2,
    };
    obj.backgroundColor = '#6BA5D7';
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
    // Create a new node with a unique ID
    const newNodeId = `node${++this.nodeIdCounter + 1}`;
    const questionText = this.sidebarInput; // Use sidebar input or default
    let htmlContent = '';

    if (this.nodeType === 'Boolean') {
      htmlContent = `
      <div class="custom-node-container">
        <input type="text" value="${questionText}" placeholder="Enter question" class="custom-input">
        <div class="button-container">
          <button class="custom-button yes-button">Yes</button>
          <button class="custom-button no-button">No</button>
        </div>
      </div>
      `;
    } else {
      htmlContent = `<div><p>Default Content</p></div>`;
    }

    const newNode: NodeModel = {
      id: newNodeId,
      annotations: [],
      offsetX: 100,
      offsetY: 70,
      style: { fill: '#FFFFFF', strokeColor: '#0000FF' },
      height: 150,  // Adjust height as needed
      width: 180,   // Adjust width as needed
      shape: {
        type: 'HTML',
        content: htmlContent
      }
    };

    // Add the new node to the diagram
    this.diagram.addNode(newNode);

    // Create a new connector to link the new node to the source node
    const newConnectorId = `connector${++this.connectorIdCounter}`;
    const newConnector: ConnectorModel = {
      id: newConnectorId,
      sourceID: sourceNodeId,
      targetID: newNodeId,
      type: 'Orthogonal',
      style: { strokeColor: '#6BA5D7', strokeWidth: 1 }
    };

    // Add the connector to the diagram
    this.diagram.addConnector(newConnector);
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
      // console.log('Sidebar Header Updated:', this.sidebarHeader);
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
    this.addNodeAndConnect('1');
  }

  public onSideBarCreated(args: any) {
    (this.sidebar as SidebarComponent).element.style.visibility = '';
    (this.sidebar as SidebarComponent).position = "Right";
  }

  onFormSubmit(): void {
    // this.addNodeAndConnect('1');
    this.sidebar?.hide();
  }
}