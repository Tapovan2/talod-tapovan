import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer"


// Register fonts for better styling
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4QIFqPfE.ttf" },
    {
      src: "https://fonts.gstatic.com/s/helveticaneue/v70/1Ptsg8zYS_SKggPNyCg4TYFqPfE.ttf",
      fontWeight: "bold",
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#1a237e",
    padding: 20,
    marginBottom: 20,
  },
  schoolName: {
    color: "#ffffff",
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
  reportTitle: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 5,
  },
  studentInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 5,
  },
  studentInfoRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontWeight: "bold",
  },
  value: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#e3f2fd",
    padding: 5,
  },
  table: {
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    minHeight: 25,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#e8eaf6",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 5,
    flex: 1,
  },
  tableCellNarrow: {
    padding: 5,
    width: 60,
  },
  performanceSummary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
  },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  signatureSection: {
    width: 200,
    borderTopWidth: 1,
    borderTopColor: "#000",
    paddingTop: 5,
    textAlign: "center",
  },
  chart: {
    height: 150,
    marginVertical: 10,
  },
  attendance: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#e8eaf6",
  },
  attendanceItem: {
    alignItems: "center",
  },
  attendanceValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a237e",
  },
  attendanceLabel: {
    fontSize: 10,
    color: "#666",
  },
})

interface StudentReportProps {
  student: {
    name: string
    rollNo: string
    currentStandard: number
    currentClass: string
  }
  academicYear: number
  subjects: {
    name: string
    examDetails: Array<{
      examName: string
      date: string
      score: string
      maxMarks: number
    }>
  }[]
}

export function StudentReportPDF({ student, academicYear, subjects }: StudentReportProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>Tapovan Vidhyamandir Sankul</Text>
          <Text style={styles.reportTitle}> Progress Report</Text>
        </View>

        {/* Student Information */}
        <View style={styles.studentInfo}>
          <View style={styles.studentInfoRow}>
            <Text style={styles.label}>Student Name:</Text>
            <Text style={styles.value}>{student.name}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.label}>Roll Number:</Text>
            <Text style={styles.value}>{student.rollNo}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.label}>Class:</Text>
            <Text style={styles.value}>
              Standard {student.currentStandard} - {student.currentClass}
            </Text>
          </View>
         
        </View>

        {/* Exam Details */}
        {subjects.map((subject, index) => (
          <View key={index} wrap={false}>
            <Text style={styles.sectionTitle}>{subject.name} - Test Details</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={styles.tableCell}>Test Name</Text>
                <Text style={styles.tableCell}>Date</Text>
                <Text style={styles.tableCell}>Score</Text>
                <Text style={styles.tableCell}>Max Marks</Text>
              </View>
              {subject.examDetails.map((exam, examIndex) => (
                <View key={examIndex} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{exam.examName}</Text>
                  <Text style={styles.tableCell}>{new Date(exam.date).toLocaleDateString()}</Text>
                  <Text style={styles.tableCell}>{exam.score}</Text>
                  <Text style={styles.tableCell}>{exam.maxMarks}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
         <View style={styles.footer}>
          <View style={styles.signatureRow}>
            <View style={styles.signatureSection}>
              <Text>Class Teacher</Text>
            </View>
            <View style={styles.signatureSection}>
              <Text>Principal</Text>
            </View>
            <View style={styles.signatureSection}>
              <Text>Parent/Guardian</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  )
}

