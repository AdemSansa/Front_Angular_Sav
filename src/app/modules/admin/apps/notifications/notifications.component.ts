import { Component, inject, OnInit } from '@angular/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioGroup } from '@angular/material/radio';
import { MatRadioButton } from '@angular/material/radio';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatLabel } from '@angular/material/form-field';
import { MatCard, MatCardModule } from '@angular/material/card';
import {  FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'app/shared/services/user.service';
import { NotificationsService } from 'app/layout/common/notifications/notifications.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { Notification } from 'app/layout/common/notifications/notifications.types';
import { MatInput } from '@angular/material/input';
import { MatOptionSelectionChange } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { GroupService } from 'app/shared/services/group.service';
import { Group } from 'app/shared/models/group';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notifications',
  imports: [ MatFormFieldModule,ReactiveFormsModule, MatInputModule, FormsModule, MatIcon,MatIconModule, MatInput,MatButtonModule,MatListModule,ReactiveFormsModule, MatRadioGroup, MatRadioButton, MatCheckbox, MatCard,MatCardModule, MatLabel],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent implements OnInit {
  notificationForm: FormGroup;
  
  users: any[] = [];
  groups: Group[] = [];
  
  _notificationService = inject(NotificationsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  _groupService = inject(GroupService);
  
  currentSize = 10;
  currentPage = 1;
  filterType: string[] = [];
  filterStatus: string[] = [];
  filterSearch: string;

  private fb = inject(FormBuilder);
  
  constructor(private userService: UserService) {
    this.createForm();
  }

  get notificationControls() {
    return this.notificationForm.controls;
  }

  createForm(): void {
    this.notificationForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      icon: [''],
      link: [''],
      useRouter: [false],
      recipientType: ['users'],
      selectedUsers: [[]],
      selectedGroups: [[]]
    });

    // React to recipientType changes
    this.notificationForm.get('recipientType').valueChanges.subscribe(value => {
      if (value === 'users') {
        this.unselectAllGroups();
      } else {
        this.unselectAllUsers();
      }
    });
  }

  ngOnInit() {
    this.getUsers();
    this.getGroups();
  }

  submitNotification() {
    if (this.notificationForm.invalid) {
      return;
    }

    const formValues = this.notificationForm.value;
    
    const notification = {
      icon: formValues.icon,
      title: formValues.title,
      description: formValues.description,
      time: new Date().toISOString(),
      link: formValues.link,
      useRouter: formValues.useRouter,
      read: false,
      usersIds: formValues.selectedUsers,
      receiver: formValues.selectedGroups,
    };
    
    console.log(notification);
    
    this._notificationService.create(notification).subscribe({
      next: (response) => {
        console.log('Notification sent successfully:', response);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Notification sent successfully!',
          confirmButtonText: 'OK',
        });
        
        this.resetForm();
      },
      error: (error) => {
        console.error('Error sending notification:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to send notification.',
          confirmButtonText: 'OK',
        });
      }
    });
  }

  resetForm() {
    this.notificationForm.reset({
      title: '',
      description: '',
      icon: '',
      link: '',
      useRouter: false,
      recipientType: 'users',
      selectedUsers: [],
      selectedGroups: []
    });
  }

  getUsers() {
    this.userService.getUsers(
      this.currentSize.toString(),
      this.currentPage.toString(),
      this.filterSearch,
    ).subscribe((users) => {
      this.users = users.data;
      console.log(this.users);
    });
  }

  getGroups() {
    this._groupService.getList(
      this.currentSize.toString(),
      this.currentPage.toString(),
      this.filterSearch,
      this.filterType.toString(),
      this.filterStatus.toString(),
    ).subscribe({
      next: results => {
        this.groups = results.data;
        console.log(this.groups);
      },
    });
  }

  selectAllUsers(): void {
    if (this.notificationForm.get('recipientType').value !== 'groups') {
      const userIds = this.users.map(user => user._id);
      this.notificationForm.get('selectedUsers').setValue(userIds);
    }
  }

  unselectAllUsers(): void {
    this.notificationForm.get('selectedUsers').setValue([]);
  }

  unselectAllGroups(): void {
    this.notificationForm.get('selectedGroups').setValue([]);
  }
  
  selectAllGroups(): void {
    if (this.notificationForm.get('recipientType').value !== 'users') {
      const groupCodes = this.groups.map(group => group.code);
      this.notificationForm.get('selectedGroups').setValue(groupCodes);
    }
  }
}