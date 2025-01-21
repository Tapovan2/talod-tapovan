"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { standards } from "@/Data"
import { PDFDownloadLink } from "@react-pdf/renderer"
import { StudentReportPDF } from "@/components/StudentReportPdf"

export default function PerformanceReportPage() {
  const [selectedStandard, setSelectedStandard] = useState<string>("")
  const [selectedClass, setSelectedClass] = useState<string>("")
  const [reportData, setReportData] = useState<any>()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleStandardChange = (value: string) => {
    setSelectedStandard(value)
    setSelectedClass("")
  }

  const STANDARDS = Object.keys(standards)
  const CLASSES = selectedStandard ? standards[selectedStandard as keyof typeof standards]?.classes || [] : []

  const generateReport = async () => {
    if (!selectedStandard || !selectedClass) {
      toast({
        title: "Error",
        description: "Please select standard and class.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/performance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          standard: selectedStandard,
          classParam: selectedClass,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate report")
      }

      const data = await response.json()
      setReportData(data)
      toast({
        title: "Report Generated",
        description: "Complete performance report has been generated successfully.",
      })
    } catch (error) {
      console.error("Error generating report:", error)
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Student Performance Report</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <Select onValueChange={handleStandardChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Standard" />
          </SelectTrigger>
          <SelectContent>
            {STANDARDS.map((standard) => (
              <SelectItem key={standard} value={standard}>
                Standard {standard}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setSelectedClass(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {CLASSES.map((className) => (
              <SelectItem key={className} value={className}>
                Class {className}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={generateReport} disabled={loading}>
          {loading ?(
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Report'
          )}
        </Button>
      </div>
      {reportData && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                {reportData.students.map((student: any) => (
                  <AccordionItem key={student.rollNo} value={student.rollNo}>
                    <AccordionTrigger>
                      {student.rollNo} - {student.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        {Object.entries(student.subjects).map(([subject, details]: [string, any]) => (
                          <div key={subject}>
                            <h4 className="font-semibold mt-4">{subject} Test Details</h4>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Test Name</TableHead>
                                  <TableHead>Date</TableHead>
                                  <TableHead>Score</TableHead>
                                  <TableHead>Max Marks</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {details.examDetails.map((exam: any, index: number) => (
                                  <TableRow key={index}>
                                    <TableCell>{exam.examName}</TableCell>
                                    <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{exam.score}</TableCell>
                                    <TableCell>{exam.maxMarks}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        ))}
                        <div className="mt-4">
                          <PDFDownloadLink
                            document={
                              <StudentReportPDF
                                student={{
                                  name: student.name,
                                  rollNo: student.rollNo,
                                  currentStandard: Number.parseInt(selectedStandard),
                                  currentClass: selectedClass,
                                }}
                                academicYear={new Date().getFullYear()}
                                subjects={Object.entries(student.subjects).map(([name, details]: [string, any]) => ({
                                  name,
                                  examDetails: details.examDetails,
                                }))}
                              />
                            }
                            fileName={`${student.name}_Complete_Report.pdf`}
                          >
                            {/*@ts-ignore*/}
                            {({ loading }) => (
                              <Button disabled={loading}>
                                {loading ? "Generating PDF..." : "Download Complete Report Card"}
                              </Button>
                            )}
                          </PDFDownloadLink>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

