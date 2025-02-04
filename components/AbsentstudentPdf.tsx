"use client";

import type React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 25,
  },
  title: {
    fontSize: 18,
    marginBottom: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "#000000",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    width: "100%",
    textAlign: "center",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#000000",
  },
  tableColDate: {
    width: "12%",
    textAlign: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  tableColStandard: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  tableColClass: {
    width: "15%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  tableColRollNo: {
    width: "10%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  tableColName: {
    width: "40%",
    textAlign: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  tableColReason: {
    textAlign: "center",
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderRightWidth: 1,
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    color: "#000000",
  },
  tableHeader: {
    margin: 5,
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
  },
});

interface AbsentStudentsPDFProps {
  absentStudents: any;
  startDate: string;
  endDate: string;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}-${month}-${year}`;
};

const TableHeader = () => (
  <View style={styles.tableRow}>
    <View style={styles.tableColDate}>
      <Text style={styles.tableHeader}>Date</Text>
    </View>
    <View style={styles.tableColStandard}>
      <Text style={styles.tableHeader}>Standard</Text>
    </View>
    <View style={styles.tableColClass}>
      <Text style={styles.tableHeader}>Class</Text>
    </View>
    <View style={styles.tableColRollNo}>
      <Text style={styles.tableHeader}>Roll No</Text>
    </View>
    <View style={styles.tableColName}>
      <Text style={styles.tableHeader}>Name</Text>
    </View>
    <View style={styles.tableColReason}>
      <Text style={styles.tableHeader}>Reason</Text>
    </View>
  </View>
);

// Helper function to chunk array into pages
const chunkArray = (array: any[], size: number) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

const AbsentStudentsPDFDocument: React.FC<AbsentStudentsPDFProps> = ({
  endDate,
  startDate,
  absentStudents,
}) => {
  // Split data into chunks of 20 items per page
  const itemsPerPage = 30;
  const chunkedData = chunkArray(absentStudents, itemsPerPage);

  return (
    <Document>
      {chunkedData.map((pageData, pageIndex) => (
        <Page size="A4" style={styles.page} key={pageIndex}>
          <Text style={styles.title}>
            Absent Students Report 
          </Text>
          <View style={styles.table}>
            <TableHeader />
            {pageData.map((student) => (
              <View
                style={styles.tableRow}
                key={`${student.id}-${student.date}`}
              >
                <View style={styles.tableColDate}>
                  <Text style={styles.tableCell}>
                    {formatDate(student.date)}
                  </Text>
                </View>
                <View style={styles.tableColStandard}>
                  <Text style={styles.tableCell}>{student.standard}</Text>
                </View>
                <View style={styles.tableColClass}>
                  <Text style={styles.tableCell}>{student.class}</Text>
                </View>
                <View style={styles.tableColRollNo}>
                  <Text style={styles.tableCell}>{student.rollNo}</Text>
                </View>
                <View style={styles.tableColName}>
                  <Text style={styles.tableCell}>{student.name}</Text>
                </View>
                <View style={styles.tableColReason}>
                  <Text style={styles.tableCell}>
                    {student.reason || "Not specified"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default AbsentStudentsPDFDocument;
