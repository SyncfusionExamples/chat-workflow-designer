import { Component, ViewChild } from '@angular/core';
import { ComplexHierarchicalTree, ConnectionPointOrigin, ConnectorConstraints, ConnectorModel, DecoratorModel, Diagram,  DiagramComponent, DiagramModule, IClickEventArgs, LayoutModel, LineDistribution, Node, NodeModel, SelectorConstraints, SelectorModel, SnapSettingsModel, TextModel, UserHandleEventsArgs, UserHandleModel } from '@syncfusion/ej2-angular-diagrams';
import { RuleData } from '../../models/appModel';
import { RULE_DATA } from '../../data/rule-data';
import { DialogModule } from '@syncfusion/ej2-angular-popups';
import { BeforeOpenCloseMenuEventArgs, DropDownButtonComponent, DropDownButtonModule, ItemModel, OpenCloseMenuEventArgs } from '@syncfusion/ej2-angular-splitbuttons';
import { CommonModule } from '@angular/common';
import { ListViewComponent, ListViewModule, SelectEventArgs } from '@syncfusion/ej2-angular-lists';
import { LIST_DATA } from '../../data/list-data';

Diagram.Inject(ComplexHierarchicalTree, LineDistribution);

@Component({
  selector: 'app-workflow-diagram',
  standalone: true,
  imports: [DiagramModule, DialogModule, DropDownButtonModule, CommonModule, ListViewModule],
  templateUrl: './workflow-diagram.component.html',
  styleUrl: './workflow-diagram.component.scss'
})
export class WorkflowDiagramComponent {
  @ViewChild('diagram') diagram!: DiagramComponent;
  @ViewChild('dropdownbutton') dropdownbutton!: DropDownButtonComponent;
  // @ViewChild('listview') listView!: ListViewComponent;

  public data: RuleData[] = RULE_DATA;

  public nodes: NodeModel[] = [];
  public connectors: ConnectorModel[] = [];

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

  // Initialize action items.
  public items: ItemModel[] = [
    {
        text: 'Action'
    },
    {
        text: 'Condition'
    },
    {
        text: 'Exit'
    }];

    
  public listdata: Object = LIST_DATA;
  public fields: {[key: string]: string} ={ tooltip: 'text'};
  public headertitle = 'Continent';
  public animation: Object  = { duration: 0};
  public isParentListItem : boolean = false;

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
    obj.width = 70;
    obj.height = 70;
    // obj.annotations = [{ content: obj.id }];
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
    } 
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
  }

  onSelectListView(args: SelectEventArgs) {
    this.isParentListItem = args.item.classList.contains("e-has-child");
  }
}