import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ServicesService } from "./services/services.service";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
  brand:string,
  brandName: string,
  model: string,
  year: string,
  email: string,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  brands: any = {};
  models: any = {}
  temporalID: string = '';

  principalForm = new FormGroup({
    brand: new FormControl('', Validators.required),
    brandName: new FormControl(''),
    model: new FormControl('', Validators.required),
    year: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
  });

  constructor(private service: ServicesService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getBrand()
  }

  getBrand(){
    this.service.getBrands().subscribe(res => {
      this.brands = res.data()
    })
  }

  getModel(modelId: string) {
    this.temporalID = '';
    this.service.getModels(modelId).subscribe(res => {
      this.models = res.data()
      this.temporalID = modelId;
      this.brands['brands'].forEach((element:any) => {
        if(element['id'] === modelId) this.principalForm.controls['brandName'].setValue(element.brand)
      });
    })
  }

  getDataUser(){
    this.service.getDataUser().subscribe(res=>{
      var dataUser = res.data()
      this.getModel(dataUser.brand)
      for (const key in dataUser) {
        if (Object.prototype.hasOwnProperty.call(dataUser, key)) {
          const element = dataUser[key];
          if(key ==='brand')this.principalForm.controls[key].setValue(element)
          else this.principalForm.controls[key].setValue(element)
        }
      }
    })
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogDataComponent, {
      data: this.principalForm.value
    });

    dialogRef.afterClosed().subscribe(data=>{
      this.service.saveDataUser(data)
      this.principalForm.reset()
    })
  }
}

@Component({
  selector: 'dialog-data-component',
  templateUrl: './dialogs/dialog-data.html',
  styleUrls: ['./app.component.sass']
})
export class DialogDataComponent implements OnInit {
  constructor(private service:ServicesService, public dialogRef: MatDialogRef<DialogDataComponent>,@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close(this.data);
  }
}
