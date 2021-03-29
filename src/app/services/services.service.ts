import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private db:AngularFirestore) { }

  getBrands():Observable<any>{
    return this.db.collection('brands').doc('brandVechicles').get()
  }

  getModels(idModel:string):Observable<any>{
    return this.db.collection('brands').doc(idModel).get()
  }

  saveDataUser(dataToSave:any):void{
    this.db.collection('user').doc('restore').set(dataToSave)
  }

  getDataUser():Observable<any>{
    return this.db.collection('user').doc('restore').get()
  }
}
