import { Component, ViewChild } from '@angular/core';
import { ComplexHierarchicalTree, ConnectionPointOrigin,  ConnectorConstraints, ConnectorModel, DecoratorModel, Diagram,  DiagramComponent, DiagramModule, IClickEventArgs, LayoutModel, LineDistribution, Node, NodeModel, SelectorConstraints, SelectorModel, TextModel, UserHandleEventsArgs, UserHandleModel, LineRouting } from '@syncfusion/ej2-angular-diagrams';
import { RuleData } from '../../models/appModel';
import { RULE_DATA } from '../../data/rule-data';
import { DialogComponent, DialogModule } from '@syncfusion/ej2-angular-popups';

Diagram.Inject(ComplexHierarchicalTree, LineDistribution, LineRouting);

@Component({
  selector: 'app-workflow-diagram',
  standalone: true,
  imports: [DiagramModule, DialogModule],
  templateUrl: './workflow-diagram.component.html',
  styleUrl: './workflow-diagram.component.scss'
})
export class WorkflowDiagramComponent {
  @ViewChild('diagram') diagram!: DiagramComponent;
  @ViewChild('dialog') dialog!: DialogComponent;

  public data: RuleData[] = RULE_DATA;

  public nodes: NodeModel[] = [];
  public connectors: ConnectorModel[] = [];
  public dialogPosition : object={ X: 'center', Y: 'center' };
  public clickedNode? : NodeModel;

  public handles: UserHandleModel[] = [
    {
      name: 'plusIcon',
      pathData:
        'M12 0C11.4477 0 11 0.447715 11 1V11H1C0.447715 11 0 11.4477 0 12C0 12.5523 0.447715 13 1 13H11V23C11 23.5523 11.4477 24 12 24C12.5523 24 13 23.5523 13 23V13H23C23.5523 13 24 12.5523 24 12C24 11.4477 23.5523 11 23 11H13V1C13 0.447715 12.5523 0 12 0Z',
      visible: false,
      offset: 0.5,
      side: 'Bottom',
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      backgroundColor: 'skyblue',
    },
    {
      name: 'xIcon',
      pathData:
        'M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM16.2426 7.75736C16.6332 7.36683 16.6332 6.73367 16.2426 6.34315C15.8521 5.95262 15.2189 5.95262 14.8284 6.34315L12 9.17157L9.17157 6.34315C8.78105 5.95262 8.14788 5.95262 7.75736 6.34315C7.36683 6.73367 7.36683 7.36683 7.75736 7.75736L10.5858 10.5858L7.75736 13.4142C7.36683 13.8047 7.36683 14.4379 7.75736 14.8284C8.14788 15.2189 8.78105 15.2189 9.17157 14.8284L12 12L14.8284 14.8284C15.2189 15.2189 15.8521 15.2189 16.2426 14.8284C16.6332 14.4379 16.6332 13.8047 16.2426 13.4142L13.4142 10.5858L16.2426 7.75736Z',
      visible: false,
      offset: 0.5,
      side: 'Bottom',
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
      backgroundColor: 'skyblue',
    }
  ];

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
      if (item['success_rule_id']) {
        this.connectors.push({
          id: `connector${item['id']}-s${item['success_rule_id']}`,
          sourceID: `node${item['id']}`,
          targetID: `node${item['success_rule_id']}`,
          annotations: [{ content: 'success', alignment: 'Center'}]
        });
      }

      // Create connectors from failure_rule_id
      if (item['failure_rule_id']) {
        this.connectors.push({
          id: `connector${item['id']}-f${item['failure_rule_id']}`,
          sourceID: `node${item['id']}`,
          targetID: `node${item['failure_rule_id']}`,
          annotations: [{ content: 'failure', alignment: 'Center'}]
        });
      }
    });
  }

  public onDiagramCreated(): void {
    (this.diagram as DiagramComponent).fitToPage();
  };

  public selectedItems: SelectorModel = {
    constraints: SelectorConstraints.UserHandle,
    userHandles: this.handles,
  };

  onDialogCreated(): void {
    this.dialog.hide();
  }

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
    obj.width = 70;
    obj.height = 70;
    obj.style = {
      fill: '#6BA5D7',
      strokeColor: 'none',
      strokeWidth: 2,
    };
    obj.borderColor = 'black';
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
    connector.constraints = ConnectorConstraints.Default & ~ConnectorConstraints.Select;
    connector.cornerRadius = 7;
    (
      (connector as ConnectorModel).targetDecorator as DecoratorModel
    ).height = 5;
    ((connector as ConnectorModel).targetDecorator as DecoratorModel).width = 5;
    connector.style = { strokeColor: '#6BA5D7', strokeWidth: 1 };
    return connector;
  }

  public onNodeClick(args: IClickEventArgs): void {
    if (args.actualObject instanceof Node) {
      // Directly handle the node that was clicked
      this.clickedNode = args.actualObject as NodeModel;

      // Select this node to reflect in the diagram's state
      this.diagram.select([this.clickedNode]);
      if(this.diagram.selectedItems.userHandles) {
        this.diagram.selectedItems.userHandles[0].visible = true;
      }
    } 
    this.diagram.dataBind();
  }

  public onUserHandleMouseDown(event: UserHandleEventsArgs) {
    if(event.element.name === 'plusIcon') {
      if (this.clickedNode && this.dialog)
      {
        if(this.diagram.selectedItems.userHandles) 
            this.diagram.selectedItems.userHandles[0].visible = false;
        if(this.diagram.selectedItems.userHandles) 
            this.diagram.selectedItems.userHandles[1].visible = true;
        const selectedNode = this.clickedNode;
        if (selectedNode && selectedNode.wrapper) {
          const nodeBounds = selectedNode.wrapper.bounds;
          // Convert dialog width from string to number
        const dialogWidthString = this.dialog.width as string;
        const dialogWidth = parseInt(dialogWidthString, 10); // Parse integer from string
          this.dialogPosition = {
            X: ((nodeBounds.x + nodeBounds.width) / 2 - dialogWidth / 2) + 'px',
            Y: (nodeBounds.y + nodeBounds.height + 10) + 'px'
          };
        }
      }
      this.dialog.visible = true;
    } else {
      this.onCloseDialog();
    }
    this.diagram.dataBind();
  }

  // Dialog option handlers
  handleEvent() {
    console.log('Event selected');
    // Add logic for event
  }

  handleAction() {
    console.log('Action selected');
    // Add logic for action
  }

  handleCondition() {
    console.log('Condition selected');
    // Add logic for condition
  }

  handleExit() {
    // Hide the dialog and remove the user handle
    console.log('Exit selected');
  }

  public onCloseDialog(): void {
    this.dialog.visible = false;
    if(this.diagram.selectedItems.userHandles) 
      this.diagram.selectedItems.userHandles[1].visible = false;
  }

  public onOpenDialog(args: any): void {
    //Preventing the default dialog focus
    args.preventFocus = true;
  }
}
