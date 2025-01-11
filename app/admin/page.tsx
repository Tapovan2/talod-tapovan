'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { standards } from "@/Data/index"

export default function AdminPage() {
  const [students, setStudents] = useState<any[]>([])
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [selectedStandard, setSelectedStandard] = useState<string>('')
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const STANDARDS = Object.keys(standards);
  const CLASSES = selectedStandard ? standards[selectedStandard as keyof typeof standards]?.classes || [] : [];

  const fetchStudents = async () => {
    if (selectedStandard && selectedClass) {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/students?standard=${selectedStandard}&class=${selectedClass}`)
        const data = await response.json()
        setStudents(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleStandardChange = (value: string) => {
    setSelectedStandard(value);
    setSelectedClass('');
    setStudents([]);
  }

  const handleClassChange = (value: string) => {
    setSelectedClass(value)
    
  }

  const handleEdit = (student: any) => {
    setEditingStudent(student)
  }

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this student?')) {
      setLoadingId(id)
      await fetch(`/api/students/${id}`, { method: 'DELETE' })
      fetchStudents()
      setLoadingId(null)
    }
  }

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    setLoadingId(editingStudent.id)
    await fetch(`/api/students/${editingStudent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    setEditingStudent(null)
    fetchStudents()
    setLoadingId(null)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchStudents();
  }

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    await fetch(`/api/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    setIsAddStudentOpen(false);
    fetchStudents();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Panel</h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
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
        <Select onValueChange={handleClassChange} disabled={!selectedStandard}>
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            'Fetch Students'
          )}
        </Button>
        <Button variant="outline" onClick={() => setIsAddStudentOpen(true)}>Add New Student</Button>
      </form>

      <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="rollNo">Roll No</Label>
              <Input id="rollNo" name="rollNo" required />
            </div>
            <div>
              <Label htmlFor="standard">Standard</Label>
              <Input id="standard" name="standard" value={selectedStandard} readOnly />
            </div>
            <div>
              <Label htmlFor="class">Class</Label>
              <Input id="class" name="class" value={selectedClass} readOnly />
            </div>
            <Button type="submit">Add Student</Button>
          </form>
        </DialogContent>
      </Dialog>

      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Students - Standard {selectedStandard}, Class {selectedClass}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll No</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>{student.rollNo}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" onClick={() => handleEdit(student)}>Edit</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Edit Student</DialogTitle>
                              </DialogHeader>
                              <form onSubmit={handleSave} className="space-y-4">
                                <div>
                                  <Label htmlFor="name">Name</Label>
                                  <Input id="name" name="name" defaultValue={editingStudent?.name} />
                                </div>
                                <div>
                                  <Label htmlFor="rollNo">Roll No</Label>
                                  <Input id="rollNo" name="rollNo" defaultValue={editingStudent?.rollNo} />
                                </div>
                                <div>
                                  <Label htmlFor="standard">Standard</Label>
                                  <Input id="standard" name="standard" defaultValue={selectedStandard} readOnly />
                                </div>
                                <div>
                                  <Label htmlFor="class">Class</Label>
                                  <Input id="class" name="class" defaultValue={selectedClass} readOnly />
                                </div>
                                <Button type="submit" disabled={loadingId === editingStudent?.id}>
                                  {loadingId === editingStudent?.id ? 'Saving...' : 'Save Changes'}
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(student.id)} disabled={loadingId === student.id}>
                            {loadingId === student.id ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

