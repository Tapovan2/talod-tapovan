import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Register fonts

const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 12,

    backgroundColor: "#ffffff",
  },
  header: {
    backgroundColor: "#1e40af",
    padding: 24,
    marginBottom: 24,
    borderRadius: 8,
  },
  schoolName: {
    color: "#ffffff",
    fontSize: 28,
    textAlign: "center",
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  reportTitle: {
    color: "#ffffff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 8,
    opacity: 0.9,
  },
  card: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 20,
    marginBottom: 24,
  },
  studentInfoRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "center",
  },
  label: {
    width: 120,
    color: "#64748b",
    fontSize: 12,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: "#0f172a",
    fontWeight: "bold",
  },
  attendanceGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 6,
  },
  attendanceItem: {
    alignItems: "center",
  },
  attendanceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 4,
  },
  attendanceLabel: {
    fontSize: 11,
    color: "#64748b",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 12,
    marginTop: 8,
  },
  table: {
    marginTop: 12,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    minHeight: 40,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#f1f5f9",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  tableHeaderText: {
    color: "#475569",
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    fontSize: 12,
    color: "#334155",
  },
  subjectCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
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
    marginTop: 30,
  },
  signatureSection: {
    width: 160,
    borderTopWidth: 1,
    borderTopColor: "#cbd5e1",
    paddingTop: 8,
    alignItems: "center",
  },
  signatureText: {
    fontSize: 11,
    color: "#64748b",
  },
});

interface StudentReportProps {
  student: {
    name: string;
    rollNo: string;
    currentStandard: number;
    currentClass: string;
  };
  attendance: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    absentDetails: Array<{
      date: string;
      reason: string;
    }>;
  };

  subjects: {
    name: string;
    examDetails: Array<{
      examName: string;
      date: string;
      score: string;
      maxMarks: number;
    }>;
  }[];
}

export function StudentReportPDF({
  student,
  attendance,
  subjects,
}: StudentReportProps) {
  const attendancePercentage = Math.round(
    (attendance.presentDays / attendance.totalDays) * 100
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.schoolName}>Tapovan Vidhyamandir Sankul</Text>
          <Text style={styles.reportTitle}>Progress Report</Text>
        </View>

        {/* Student Information Card */}
        <View style={styles.card}>
          <View style={styles.studentInfoRow}>
            <Text style={styles.label}>Student Name</Text>
            <Text style={styles.value}>{student.name}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.label}>Roll Number</Text>
            <Text style={styles.value}>{student.rollNo}</Text>
          </View>
          <View style={styles.studentInfoRow}>
            <Text style={styles.label}>Class</Text>
            <Text style={styles.value}>
              Standard {student.currentStandard} - {student.currentClass}
            </Text>
          </View>
        </View>

        {/* Attendance Card */}
        <View style={styles.card}>
          <Text style={[styles.label, { marginBottom: 8 }]}>
            ATTENDANCE OVERVIEW
          </Text>
          <View style={styles.attendanceGrid}>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendanceValue}>
                {attendancePercentage}%
              </Text>
              <Text style={styles.attendanceLabel}>Attendance Rate</Text>
            </View>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendanceValue}>
                {attendance.presentDays}/{attendance.totalDays}
              </Text>
              <Text style={styles.attendanceLabel}>Days Present</Text>
            </View>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendanceValue}>
                {attendance.absentDays}
              </Text>
              <Text style={styles.attendanceLabel}>Days Absent</Text>
            </View>
          </View>

          {attendance.absentDetails.length > 0 && (
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>
                  Date
                </Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>
                  Reason
                </Text>
              </View>
              {attendance.absentDetails.map((absent, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {new Date(absent.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.tableCell}>{absent.reason}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Subject Details */}
        {subjects.map((subject, index) => (
          <View key={index} style={styles.subjectCard} wrap={false}>
            <Text style={styles.sectionTitle}>{subject.name} Performance</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>
                  Test Name
                </Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>
                  Date
                </Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>
                  Score
                </Text>
                <Text style={[styles.tableCell, styles.tableHeaderText]}>
                  Max Marks
                </Text>
              </View>
              {subject.examDetails.map((exam, examIndex) => (
                <View key={examIndex} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{exam.examName}</Text>
                  <Text style={styles.tableCell}>
                    {new Date(exam.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.tableCell}>{exam.score}</Text>
                  <Text style={styles.tableCell}>{exam.maxMarks}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Footer with Signatures */}
        <View style={styles.footer}>
          <View style={styles.signatureRow}>
            <View style={styles.signatureSection}>
              <Text style={styles.signatureText}>Class Teacher</Text>
            </View>
            <View style={styles.signatureSection}>
              <Text style={styles.signatureText}>Principal</Text>
            </View>
            <View style={styles.signatureSection}>
              <Text style={styles.signatureText}>Parent/Guardian</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
