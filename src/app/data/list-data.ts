export const LIST_DATA: { [key: string]: any }[] = [
  {
      'text': 'Action',
      'id': '01',
      'category': 'Block Type',
      'child': [{
            'text': 'Identity',
            'id': '1',
            'category': 'Action',
            'child': [{
                'text': 'Name',
                'id': '1001',
                'blockid': 3,
                'editId': 18,
                'category': 'Identity',
            },
            {
                'text': 'Email',
                'id': '1002',
                'blockid': 3,
                'editId': 19,
                'category': 'Identity',
            },
            {
                'text': 'Phone No',
                'id': '1003',
                'blockid': 3,
                'editId': 20,
                'category': 'Identity',
            },
            {
                'text': 'Requester Linking',
                'id': '1004',
                'blockid': 3,
                'editId': 21,
                'category': 'Identity',
            }]
        },
        {
            'text': 'Custom Message',
            'id': '2',
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
                'editId': 2,
                'category': 'Button Input',
            },
            {
                'text': 'Boolean',
                'id': '3002',
                'blockid': 4,
                'editId': 1,
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
                'editId': 9,
                'category': 'Input',
            },
            {
                'text': 'DateTime',
                'id': '4002',
                'blockid': 5,
                'editId': 10,
                'category': 'Input',
            },
            {
                'text': 'Number',
                'id': '4003',
                'blockid': 5,
                'editId': 11,
                'category': 'Input',
            },
            {
                'text': 'Decimal',
                'id': '4004',
                'blockid': 5,
                'editId': 12,
                'category': 'Input',
            },
            {
                'text': 'Regex',
                'id': '4005',
                'blockid': 5,
                'editId': 13,
                'category': 'Input',
            },
            {
                'text': 'Text',
                'id': '4006',
                'blockid': 5,
                'editId': 7,
                'category': 'Input',
            },
            {
                'text': 'Text Area',
                'id': '4007',
                'blockid': 5,
                'editId': 8,
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
                'editId': 3,
                'category': 'DropDowns',
            },
            {
                'text': 'Multi-Select',
                'id': '5002',
                'blockid': 4,
                'editId': 4,
                'category': 'DropDowns',
            }]
        },
        {
            'text': 'List',
            'id': '6',
            'blockid': 4,
            'editId': 5,
            'category': 'Action',
        },
        {
            'text': 'Card',
            'id': '7',
            'blockid': 4,
            'editId': 6,
            'category': 'Action',
        },
        {
            'text': 'Set Conversation Field',
            'id': '8',
            'blockid': 7,
            'editId': null,
            'category': 'Action',
        },
        {
            'text': 'Auto Assign',
            'id': '9',
            'blockid': 8,
            'editId': null,
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
                'text': 'Buttons',
                'id': '11001',
                'category': 'Selection',
            },
            {
                'text': 'List',
                'id': '11002',
                'category': 'Selection',
            },
            {
                'text': 'Card',
                'id': '11003',
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
