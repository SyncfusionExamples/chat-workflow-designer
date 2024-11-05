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
                'category': 'Identity',
            },
            {
                'text': 'Email',
                'id': '1002',
                'category': 'Identity',
            },
            {
                'text': 'Phone No',
                'id': '1003',
                'category': 'Identity',
            },
            {
                'text': 'Requester Linking',
                'id': '1004',
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
                'category': 'Button Input',
            },
            {
                'text': 'Boolean',
                'id': '3002',
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
                'category': 'Input',
            },
            {
                'text': 'DateTime',
                'id': '4002',
                'category': 'Input',
            },
            {
                'text': 'Number',
                'id': '4003',
                'category': 'Input',
            },
            {
                'text': 'Decimal',
                'id': '4004',
                'category': 'Input',
            },
            {
                'text': 'Regex',
                'id': '4005',
                'category': 'Input',
            },
            {
                'text': 'Text',
                'id': '4006',
                'category': 'Input',
            },
            {
                'text': 'Text Area',
                'id': '4007',
                'category': 'Input',
            }]
        },
        {
            'text': 'DropDowns',
            'id': '5',
            'category': 'Action',
            'child': [{
                'text': 'Single',
                'id': '5001',
                'category': 'DropDowns',
            },
            {
                'text': 'Multi',
                'id': '5002',
                'category': 'DropDowns',
            }]
        },
        {
            'text': 'List',
            'id': '6',
            'category': 'Action',
        },
        {
            'text': 'Card',
            'id': '7',
            'category': 'Action',
        },
        {
            'text': 'Set Conversation Field',
            'id': '8',
            'category': 'Action',
        },
        {
            'text': 'Auto Assign',
            'id': '9',
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
