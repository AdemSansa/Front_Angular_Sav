import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-assign-technician-dialog',
  imports: [MatFormFieldModule,MatDialogModule,MatSelectModule,FormsModule],
  templateUrl: './assign-technician-dialog.component.html',
  styleUrl: './assign-technician-dialog.component.scss'
})
export class AssignTechnicianDialogComponent {

  selectedTechnician: string = '';

  constructor(
    public dialogRef: MatDialogRef<AssignTechnicianDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  assignTechnician() {
    if (this.selectedTechnician) {
      this.dialogRef.close(this.selectedTechnician);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

}
