import { Injectable } from '@angular/core';

// mga nadagdag
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class CrudServicesService {

  constructor(
    private afs: AngularFirestore,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastr: ToastController
  ) { }

  // for the toaster
  async toast(msg, status){
    const toast = await this.toastr.create({
      message: msg,
      position: 'top',
      color: status,
      duration: 2000
    });
  }
  
  // CRUD OPERATIONS HERE
  // CREATION
  async create(collectionName:string, objectSet, navigate:string=""){
    // loading spinner here
    const loading = await this.loadingCtrl.create({
      message: 'adding a task...',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();
    // loading spinner here

    // creation of a new i.d 
    const id = this.afs.createId(); 

    // database insertion
    this.afs.collection(collectionName).doc(id).set(objectSet)
    .then(()=>{
      loading.dismiss();
      this.toast('Task Successfully Added!','success');
      

      if (navigate != '') {
        // kung gusto mo siyang i redirect mag provide ka ng third parameter, else meron siyang default na empty string
        this.router.navigate(['/list']); 
      }

    })
    .catch((error)=>{
    loading.dismiss();
      this.toast(error.message, 'danger');
    });

  } // create method ending

  // READ, kulang pa tayo ng mga get_where, get(table, orderby) at multiple where

  // UPDATE
  async updateToDo(collectionName:string, id, objectSet, successMessage, navigate:string=""){
  const loading= await this.loadingCtrl.create({
    message: 'Updating Data...',
    spinner: 'crescent',
    showBackdrop: true
  });
  loading.present();

  this.afs.collection(collectionName).doc(id).set(objectSet,{merge:true})
    .then(()=>{
      loading.dismiss();
      this.toast(successMessage,'success');
      
      if (navigate != "") {
        this.router.navigate([navigate]);
      }
    })
    .catch((error)=>{
      loading.dismiss();
      this.toast(error.message,'danger');
    });
  } //End Of Update Function


  // DELETE
  async delete(collectionName, id, toastMessage){
  const loading = await this.loadingCtrl.create({
    message : 'deleting...',
    spinner : 'crescent',
    showBackdrop : true
  });

  loading.present();
  
  this.afs.collection(collectionName).doc(id).delete()
  .then(()=>{
    loading.dismiss();
    this.toast(toastMessage,'success')
  })
  .catch((error)=>{
    this.toast(error.message,'danger')
  });
  } //End of Delete Task


} // ending of class
