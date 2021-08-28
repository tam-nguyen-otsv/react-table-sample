/* eslint-disable react/jsx-key */
/* eslint-disable react/display-name */
import * as React from "react";
import {
  useTable,
  usePagination,
  useRowSelect,
  useExpanded,
  useBlockLayout,
} from "react-table";
import { useSticky } from "react-table-sticky";
import styles from "./style.module.scss";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

const defaultPropGetter = () => ({});

export function Table({
  columns,
  data,
  renderRowSubComponent,
  getHeaderProps = defaultPropGetter,
  getColumnProps = defaultPropGetter,
  getRowProps = defaultPropGetter,
  getCellProps = defaultPropGetter,
}) {
  console.log(JSON.stringify(columns));

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    selectedFlatRows,
    allColumns,
    visibleColumns,
    getToggleHideAllColumnsProps,
    state: { pageIndex, pageSize, selectedRowIds, expanded },
  } = useTable(
    {
      columns,
      data,
    },
    useExpanded,
    usePagination,
    useRowSelect,
    useBlockLayout,
    useSticky,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          sticky: "left",
          width: 50,
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  // Render the UI for your table
  return (
    <>
      <div>
        {allColumns.slice(2, 4).map((column) => (
          <div key={column.id}>
            <label>
              <input type="checkbox" {...column.getToggleHiddenProps()} />{" "}
              {column.id}
            </label>
          </div>
        ))}
        <br />
      </div>
      <table {...getTableProps()} className={styles.table}>
        <thead className={styles.tHead}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => {
                return (
                  <th
                    {...column.getHeaderProps([
                      {
                        className: column.className,
                        style: column.style,
                      },
                      getColumnProps(column),
                      getHeaderProps(column),
                    ])}
                    className={styles.thCell}
                  >
                    {column.render("Header")}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            const rowProps = row.getRowProps();
            return (
              <React.Fragment key={rowProps.key}>
                <tr {...rowProps}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps([
                          {
                            className: cell.column.className,
                            style: cell.column.style,
                          },
                          getColumnProps(cell.column),
                          getCellProps(cell),
                        ])}
                        className={styles.tbCell}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
                {row.isExpanded &&
                  renderRowSubComponent({ row, rowProps, visibleColumns })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        <pre>
          <code>
            {JSON.stringify(
              {
                selectedRowIds: selectedRowIds,
                "selectedFlatRows[].original": selectedFlatRows.map(
                  (d) => d.original
                ),
              },
              null,
              2
            )}
          </code>
        </pre>
      </div>
    </>
  );
}
