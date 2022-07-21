
import { PlasmicCanvasHost, registerComponent } from '@plasmicapp/host';
import Script from 'next/script';

import {
  PlasmicAntDesignTable,
  PlasmicAntDesignTableColumn,
  PlasmicAntDesignTableColumnValue,
} from "../components/PlasmicAntDesignTable";

// You can register any code components that you want to use here; see
// https://docs.plasmic.app/learn/code-components-ref/
// And configure your Plasmic project to use the host url pointing at
// the /plasmic-host page of your nextjs app (for example,
// http://localhost:3000/plasmic-host).  See
// https://docs.plasmic.app/learn/app-hosting/#set-a-plasmic-project-to-use-your-app-host

// PLASMIC.registerComponent(...);

function capitalizeFirstLetter(input: string) {
  return input.charAt(0).toUpperCase() + input.slice(1);
}

const DEFAULT_ITEMS = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

registerComponent(PlasmicAntDesignTable, {
  name: "PlasmicAntDesignTable",
  importPath: "./components/PlasmicAntDesignTable",
  props: {
    items: {
      type: "array",
      defaultValue: DEFAULT_ITEMS,
    },
    size:{
      type:"choice",
      options:["small","defult","large"],
    },
    bordered:{
      type: "boolean",
      description:"Whether to show all table borders",
      defaultValue: false,
    },
    showHeader:{
      type: "boolean",
      defaultValue: true,
    },
    pagination:{
      type: "object",
      defaultValue: {
        position: ["bottomRight"]
      }
    },
    scroll:{
      type: "object",
      defaultValueHint: {
        scrollToFirstRowOnChange:true,
        x:240,
        y:false
      },
    },
    columns: {
      type: "slot",
      allowedComponents: ["PlasmicAntDesignTableColumn"],
      defaultValue: Object.keys(DEFAULT_ITEMS[0]).map((columnName) => ({
        type: "component",
        name: "PlasmicAntDesignTableColumn",
        props: {
          title: capitalizeFirstLetter(columnName),
          dataIndex: columnName,
        },
      })),
    },
  },
});

registerComponent(PlasmicAntDesignTableColumn, {
  name: "PlasmicAntDesignTableColumn",
  importPath: "./components/PlasmicAntDesignTable",
  parentComponentName: "PlasmicAntDesignTable",
  providesData: true,
  props: {
    // The title text to show in the column headers
    title: {
      type: "string",
      defaultValue: "Name",
    },
    type:{
      type:"choice",
      options:["text","tag","actions"],
      defaultValue:"text",
    },
    align:{
      type: "choice",
      options: [
        "left",
        "center",
        "right",
      ],
      description: "Specify the column alignment",
      defaultValueHint: "left",
    },
    fixed:{
      type: "boolean",
      defaultValue: false,
    },
    width:{
      type: "number",
    },
    colSpan:{
      type: "number",
      defaultValue: 1,
    },
    filterDropdownVisible:{
      type: "boolean",
      defaultValue: false,
    },
    sorter:{
      type: "boolean",
      defaultValue: false,
    },

    // The path for the data field to get the value from
    // Display field of the data record, support nest path by string array
    dataIndex: {
      type: "string",
      defaultValue: "name",
    },

    // TODO: Debug why the ctx object is empty (expected to be ctx = {tableColumn})
    // dataIndex: {
    //   type: "dataSelector",
    //   data: (props, ctx) => {
    //     console.log(">>> M dataSelector", {props, ctx});
    //     return ctx?.tableColumns ?? {}}
    //     ,
    //   displayName: "Field",
    //   description: "Field to be displayed.",
    //   defaultValue: ["name"],
    // },

    // Plasmic - Custom column template
    columnTemplate: {
      type: "slot",
      defaultValue: {
        
            type: "component",
            name: "PlasmicAntDesignTableColumnValue",
      
        
      },
    },
  },
});

registerComponent(PlasmicAntDesignTableColumnValue, {
  name: "PlasmicAntDesignTableColumnValue",
  importPath: "./components/PlasmicAntDesignTable",
  parentComponentName: "PlasmicAntDesignTableColumn",
  props: {},
});
// registerComponent(Table,{
//   name: 'Table',
//   importPath: 'antd',
//   props:{
//     bordered: "boolean",
//     dataSource: {
//       type: "array",
//       defaultValue: [
//         {
//           key: '1',
//           name: 'John Brown',
//           age: 32,
//           address: 'New York No. 1 Lake Park',
//           tags: ['nice', 'developer'],
//         },
//         {
//           key: '2',
//           name: 'Jim Green',
//           age: 42,
//           address: 'London No. 1 Lake Park',
//           tags: ['loser'],
//         },
//         {
//           key: '3',
//           name: 'Joe Black',
//           age: 32,
//           address: 'Sidney No. 1 Lake Park',
//           tags: ['cool', 'teacher'],
//         },
//       ]
//     },
//     loading: "boolean",
//     scroll:{
//       type: "object",
//       defaultValue: {
//         scrollToFirstRowOnChange:false,
//         x: "",
//         y: ""
//       }
//     }
//   }
// }) 



export default function PlasmicHost() {
  return (
    <div>
      <Script
        src="https://static1.plasmic.app/preamble.js"
        strategy="beforeInteractive"
      />
      <PlasmicCanvasHost />
    </div>
  );
}
    