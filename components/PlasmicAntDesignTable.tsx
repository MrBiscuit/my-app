import * as React from "react";

import { DataProvider, repeatedElement, useSelector } from "@plasmicapp/host";

import { Table, Tag } from "antd";

import "antd/dist/antd.css";

type ColumnProps = {
  columnIndex: number;
  // The title text to show in the column headers
  title?: string;
  type?: "text" | "tag" | "action" ;
  // The path for the data field to get the value from
  // Display field of the data record, support nest path by string array
  dataIndex: string | string[];
  fixed: boolean;
  align : "left" | "center" | "right";
  wdith: number;
  colSpan:"number";
  filterDropdownVisible:boolean;
  sorter:boolean;
  // Plasmic - Custom column template
  columnTemplate: React.ReactNode;
};

// This is an empty virtual component used to allow users to define column
// properties in plasmic.
export function PlasmicAntDesignTableColumn() {
  return null;
}

export function PlasmicAntDesignTableColumnValue(props: { className: string }) {
  const column = useSelector("column");
  return (
    <div className={props.className}>
      {column?.value?.toString() ?? ""}
    </div>
  );
}

type TableProps = {
  className?: string;
  items: Array<any>;
  columns: React.ReactNode;
  size: "small" | "default" | "large";
  bordered: boolean;
  showHeader: boolean;
  pagination: object;
  scroll: { scrollToFirstRowOnChange:boolean, x: boolean, y: boolean };
};

export function PlasmicAntDesignTable(props: TableProps) {
  const { className, columns, items, size, bordered, showHeader, scroll,pagination } = props;
  // Plasmic Studio Canvas currently renders items in a slightly different way than the generated code:
  // - In the studio:
  //     - The `columns` prop value is an array of nested react <Column  /> nodes.
  // - In the generated code (preview mode):
  //     - The `columns` prop value is a React Node with a `children` property that contains
  //       an array of the nested react <Column /> components.
  const tableColumns = (columns as any)?.props?.children ?? (columns as any);

  // Convert the props.columns slot children to an array of column definitions
  const columnDefinitions = React.useMemo(() => {
    return React.Children.map(
      tableColumns,
      (column: { props: ColumnProps }, columnIndex) => {
        const { columnTemplate, title, dataIndex, fixed, align, width,type,colSpan,filterDropdownVisible,sorter  } = column.props;
       
        const columnDefinition = {
          columnIndex,
          title,
          dataIndex,
          fixed,
          align,
          width,
          colSpan,
          filterDropdownVisible,
          sorter,
          key: columnIndex,
          render: (value: any, record: any, rowIndex: any) => {
            return (
              <DataProvider name="column" data={{ value, record, rowIndex }}>
                {repeatedElement(rowIndex, columnTemplate)}
              </DataProvider>
            );
          },
        };

        if (type === "tag") 
          columnDefinition["render"]=(_, { tags }) => (
            <>
              {tags.map(tag => {
                let color = tag.length > 5 ? 'geekblue' : 'green';
                if (tag === 'loser') {
                  color = 'volcano';
                }
                return (
                  <Tag color={color} key={tag}>
                    {tag.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          );

        return columnDefinition;
      }
    );
    
  }, [tableColumns]);
  // console.log(JSON.stringify( columnDefinitions))
  return (
    // <DataProvider name="tableColumns" data={items[0] ?? {}} hidden={true}>
      <Table
        className={className}
        columns={columnDefinitions}
        size={size}
        scroll={scroll}
        pagination={pagination}
        dataSource={items}
        bordered={bordered}
        showHeader={showHeader}
      />
    // </DataProvider>
  );
}
