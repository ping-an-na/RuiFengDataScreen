export const tabMap = {
  grid: {
    label: '网格',
    columnsMap: {
      grid: [
        {
          prop: 'name',
          label: '网格名称'
        },
        {
          prop: 'levelName',
          label: '网格层级'
        }
      ],
      district: [
        {
          prop: 'name',
          label: '小区/小组名称',
          width: 130
        },
        {
          prop: 'typeName',
          label: '类型'
        }
      ]
    },
    tabs: [{
      key: 'grid',
      name: '网格'
    },
    {
      key: 'district',
      name: '小区/小组'
    }],
    defaultActiveTab: 'grid'
  },
  popu: {
    label: '人',
    columns: [
      {
        prop: 'name',
        label: '姓名',
        width: 82
      },
      {
        prop: 'card',
        label: '身份证号'
      }
    ]
  },
  event: {
    label: '事',
    columns: [
      {
        prop: 'eventCode',
        label: '事件编码'
      },
      {
        prop: 'eventSourceName',
        label: '事件来源'
      }
    ]
  },
  parts: {
    label: '物',
    columns: [
      {
        prop: 'name',
        label: '部件名称'
      },
      {
        prop: 'typeName',
        label: '部件类型'
      }
    ]
  },
  feelings: {
    label: '情',
    columns: [
      {
        prop: 'name',
        label: '民情标题'
      },
      {
        prop: 'typeName',
        label: '民情类型'
      }
    ]
  },
  org: {
    label: '组织',
    columns: [
      {
        prop: 'name',
        label: '组织名称'
      },
      {
        prop: 'typeName',
        label: '组织类型',
        width: 130
      }
    ]
  },
  place: {
    label: '地',
    columns: [
      {
        prop: 'name',
        label: '名称'
      },
      {
        prop: 'typeName',
        label: '地要素类型',
        width: 130
      }
    ]
  }
}

export const gridLevelName = (grid) => {
  const level = Number(grid.level)
  let levelName = ''
  switch (level) {
    case 3:
      levelName = '市网格'
      break
    case 4:
      levelName = '区/县网格'
      break
    case 5:
      levelName = '街/镇网格'
      break
    case 6:
      levelName = '村/社网格'
      break
    case 7:
      levelName = '基础网格'
      break
  }
  return levelName
}

export const placeholderMap = {
  event: '请输入事件编号'
}
