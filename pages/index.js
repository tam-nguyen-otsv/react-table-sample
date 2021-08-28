/* eslint-disable react/display-name */
import * as React from "react";
import { Table } from "../components/table";
import styles from "../styles/Home.module.css";

function SubRows({ row, rowProps, visibleColumns, data, loading }) {
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {data.map((x, i) => {
        return (
          <div key={i} className={styles.expander}>
            <pre>
              <code>{JSON.stringify(x, null, 2)}</code>
            </pre>
          </div>
        );
      })}
    </>
  );
}

function SubRowAsync({ row, rowProps, visibleColumns }) {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setData([
        {
          name: `Test name expanded`,
          email: `testexpanded@gmail.com`,
          address1: `address expanded`,
          address2: `address expanded`,
          gender: 30 % 2,
          phone: `phone expanded`,
          age: (30 % 60) + 18,
          age1: (30 % 60) + 18,
          age2: (30 % 60) + 18,
          age3: (30 % 60) + 18,
          age4: (30 % 60) + 18,
          age5: (30 % 60) + 18,
          age6: (30 % 60) + 18,
          age7: (30 % 60) + 18,
          age8: (30 % 60) + 18,
          age9: (30 % 60) + 18,
          action: "Delete",
        },
      ]);
      setLoading(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <SubRows
      row={row}
      rowProps={rowProps}
      visibleColumns={visibleColumns}
      data={data}
      loading={loading}
    />
  );
}

export default function Home() {
  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        sticky: "left",
        id: "expander",
        Cell: ({ row }) => {
          console.log(row);
          return (
            <span {...row.getToggleRowExpandedProps()}>
              {row.isExpanded ? "↓" : "→"} {row.values.expander}
            </span>
          );
        },
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Address 1",
        accessor: "address1",
      },
      {
        Header: "Address 2",
        accessor: "address2",
      },
      {
        Header: "Gender",
        accessor: "gender",
      },
      {
        Header: "Phone number",
        accessor: "phone",
      },
      {
        Header: "Age",
        accessor: "age",
      },
      {
        Header: "Age",
        accessor: "age1",
      },
      {
        Header: "Age",
        accessor: "age2",
      },
      {
        Header: "Age",
        accessor: "age3",
      },
      {
        Header: "Age",
        accessor: "age4",
      },
      {
        Header: "Age",
        accessor: "age5",
      },
      {
        Header: "Age",
        accessor: "age6",
      },
      {
        Header: "Age",
        accessor: "age7",
      },
      {
        Header: "Age",
        accessor: "age8",
      },
      {
        Header: "Age",
        accessor: "age9",
      },
      {
        Header: "Action",
        accessor: "action",
        sticky: "right",
      },
    ],
    []
  );

  const data = React.useMemo(
    () =>
      new Array(1000).fill(1).map((_, index) => ({
        name: `Test name ${index}`,
        email: `test${index}@gmail.com`,
        address1: `address ${index}`,
        address2: `address ${index}`,
        gender: index % 2,
        phone: `phone ${index}`,
        age: (index % 60) + 18,
        age1: (index % 60) + 18,
        age2: (index % 60) + 18,
        age3: (index % 60) + 18,
        age4: (index % 60) + 18,
        age5: (index % 60) + 18,
        age6: (index % 60) + 18,
        age7: (index % 60) + 18,
        age8: (index % 60) + 18,
        age9: (index % 60) + 18,
        action: "Delete",
      })),
    []
  );

  const renderRowSubComponent = React.useCallback(
    ({ row, rowProps, visibleColumns }) => (
      <SubRowAsync
        row={row}
        rowProps={rowProps}
        visibleColumns={visibleColumns}
      />
    ),
    []
  );

  return (
    <div className={styles.container}>
      <Table
        columns={columns}
        data={data}
        renderRowSubComponent={renderRowSubComponent}
      />
    </div>
  );
}
