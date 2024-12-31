export const LIST_DATA: { [key: string]: any }[] = [
  {
      'text': 'Action',
      'id': '01',
      'category': 'Block Type',
      'child': [
        {
            'text': 'Customer Block',
            'id': '1',
            'blockid': 3,
            'editerTypeId': null,
            'category': 'Action',
        },
        {
            'text': 'Custom Message',
            'id': '2',
            'blockid': 6,
            'editerTypeId': null,
            'category': 'Action',
        },
        {
            'text': 'Button Input',
            'id': '3',
            'category': 'Action',
            'child': [{
                'text': 'Buttons',
                'id': '3001',
                'blockid': 4,
                'editerTypeId': 2,
                'category': 'Button Input',
            },
            {
                'text': 'Boolean',
                'id': '3002',
                'blockid': 4,
                'editerTypeId': 1,
                'category': 'Button Input',
            }]
        },
        {
            'text': 'Input',
            'id': '4',
            'category': 'Action',
            'child': [{
                'text': 'Date',
                'id': '4001',
                'blockid': 5,
                'editerTypeId': 9,
                'category': 'Input',
            },
            {
                'text': 'DateTime',
                'id': '4002',
                'blockid': 5,
                'editerTypeId': 10,
                'category': 'Input',
            },
            {
                'text': 'Number',
                'id': '4003',
                'blockid': 5,
                'editerTypeId': 11,
                'category': 'Input',
            },
            {
                'text': 'Decimal',
                'id': '4004',
                'blockid': 5,
                'editerTypeId': 12,
                'category': 'Input',
            },
            {
                'text': 'Regex',
                'id': '4005',
                'blockid': 5,
                'editerTypeId': 13,
                'category': 'Input',
            },
            {
                'text': 'Text',
                'id': '4006',
                'blockid': 5,
                'editerTypeId': 7,
                'category': 'Input',
            },
            {
                'text': 'Text Area',
                'id': '4007',
                'blockid': 5,
                'editerTypeId': 8,
                'category': 'Input',
            }]
        },
        {
            'text': 'DropDowns',
            'id': '5',
            'category': 'Action',
            'child': [{
                'text': 'DropDown',
                'id': '5001',
                'blockid': 4,
                'editerTypeId': 3,
                'category': 'DropDowns',
            },
            {
                'text': 'Multi-Select',
                'id': '5002',
                'blockid': 4,
                'editerTypeId': 4,
                'category': 'DropDowns',
            }]
        },
        {
            'text': 'List',
            'id': '6',
            'blockid': 4,
            'editerTypeId': 5,
            'category': 'Action',
        },
        {
            'text': 'Card',
            'id': '7',
            'blockid': 4,
            'editerTypeId': 6,
            'category': 'Action',
        },
        {
            'text': 'Set Conversation Field',
            'id': '8',
            'blockid': 7,
            'editerTypeId': null,
            'category': 'Action',
        },
        {
            'text': 'Auto Assign',
            'id': '9',
            'blockid': 8,
            'editerTypeId': null,
            'category': 'Action',
        }]
  },
  {
      'text': 'Branching',
      'id': '02',
      'category': 'Block Type',
      'child': [{
          'text': 'QB',
          'id': '10',
          'category': 'Branching',
      },
      {
          'text': 'Selection',
          'id': '11',
          'category': 'Branching',
          'child': [{
                'text': 'ButtonsBranch',
                'id': '11001',
                'blockid': 10,
                'editerTypeId': 14,
                'category': 'Selection',
            },
            {
                'text': 'DropdownBranch',
                'id': '11002',
                'blockid': 10,
                'editerTypeId': 15,
                'category': 'Selection',
            },
            {
                'text': 'ListBranch',
                'id': '11003',
                'blockid': 10,
                'editerTypeId': 16,
                'category': 'Selection',
            },
            {
                'text': 'CardBranch',
                'id': '11003',
                'blockid': 10,
                'editerTypeId': 17,
                'category': 'Selection',
            }]
      }]
  },

  {
      'text': 'Exit',
      'id': '03',
      'category': 'Block Type',
      'child': [{
          'text': 'Call Workflow',
          'id': '3001',
          'category': 'Exit',
      }, {
          'text': 'End',
          'id': '3002',
          'category': 'Exit',
      }]
  }
];
