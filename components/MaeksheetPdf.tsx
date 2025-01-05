"use client";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register Gujarati font

Font.register({
  family: "Roboto",
  src: "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Me5Q.ttf",
});

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 12,
  },
  header: {
    backgroundColor: "#2B579A",
    padding: 10,
    marginBottom: 10,
  },
  schoolName: {
    color: "#FFD700",
    fontSize: 24,
    textAlign: "center",
  },
  subHeader: {
    color: "#FFD700",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  examInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#FFD700",
    marginTop: 10,
  },
  table: {
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: "#000",
  },
  srNo: {
    width: "10%",
    textAlign: "center",
  },
  rollNo: {
    width: "15%",
    textAlign: "center",
  },
  name: {
    width: "55%",
    textAlign: "center",
  },
  marks: {
    width: "20%",
    textAlign: "center",
  },
  absentText: {
    color: "red",
    textAlign: "center",
  },
});

interface MarkSheetProps {
  subject: string;
  standard: string;
  date: string;
  students: {
    srNo: number;
    rollNo: string;
    name: string;
    marks: string | number;
  }[];
}

export function MarkSheetPDF({
  subject,
  standard,
  date,
  students,
}: MarkSheetProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.schoolName}>Sapteshwar vidyalaya</Text>
          <Text style={styles.subHeader}>Tapovan Vidhyamandir Sankul</Text>
          <View style={styles.examInfo}>
            <Text>SUB - {subject}</Text>
            <Text>STD - {standard}</Text>
            <Text>DATE - {date}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCell, styles.srNo]}>
              <Text>SR NO</Text>
            </View>
            <View style={[styles.tableCell, styles.rollNo]}>
              <Text>ROLL NO</Text>
            </View>
            <View style={[styles.tableCell, styles.name]}>
              <Text>NAME</Text>
            </View>
            <View style={[styles.tableCell, styles.marks]}>
              <Text>MARKS (30)</Text>
            </View>
          </View>

          {students.map((student) => (
            <View key={student.srNo} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.srNo]}>
                <Text>{student.srNo}</Text>
              </View>
              <View style={[styles.tableCell, styles.rollNo]}>
                <Text>{student.rollNo}</Text>
              </View>
              <View style={[styles.tableCell, styles.name]}>
                <Text>{student.name}</Text>
              </View>
              <View style={[styles.tableCell, styles.marks]}>
                <Text
                  style={student.marks === "AB" ? styles.absentText : undefined}
                >
                  {student.marks}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
